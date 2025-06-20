import "./sentry";
import * as Sentry from "@sentry/node";
import { api } from "@/convex/_generated/api";
import { auth } from "@/lib/auth";
import { generateTitle } from "@/lib/chat/generate-title";
import { systemPrompt } from "@/lib/chat/system-prompt";
import { MODELS_CONFIG } from "@/lib/model-config";
import { convex } from "@/lib/server-convex";
import { CoreMessage, Message, smoothStream, streamText } from "ai";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { after, NextResponse } from "next/server";
import { phNode } from "./ph";
import { ratelimit } from "@/lib/redis";
import { RatelimitError } from "./errors";
import { openai } from "@ai-sdk/openai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const ERROR_MSG = "An error occured while generating a response";

export async function POST(req: Request) {
  const { messages, messageId, threadId, model } = (await req.json()) as {
    messages: Array<CoreMessage> | Array<Omit<Message, "id">>;
    messageId: string;
    threadId: string;
    model: string;
  };
  try {
    const start = performance.now();
    const headers = await getHeaders();
    const session = await auth.api.getSession({
      headers,
    });
    const cookies = await getCookies();
    const jwt = cookies.get("jwt");

    console.log(`Auth check took ${performance.now() - start} ms.`);

    if (!session || !jwt) {
      return new NextResponse("no auth", { status: 403 });
    }

    phNode.capture({
      distinctId: session.user.id,
      event: "chat-generate",
      properties: {
        threadId,
        prompt: messages[messages.length - 1],
        model,
      },
    });

    convex.clearAuth();
    convex.setAuth(jwt.value);

    if (process.env.NODE_ENV === "production") {
      const { success } = await ratelimit.limit(session.user.id);
      if (!success) {
        throw new RatelimitError();
      }
    }

    const modelConfig = MODELS_CONFIG[model];
    if (!modelConfig) {
      return new Response(null, { status: 400 });
    }

    // Set streaming to true
    convex.mutation(api.threads.updateThreadStreaming, {
      threadId,
      isStreaming: true,
    });

    const result = streamText({
      model: modelConfig.provider,
      system: systemPrompt,
      messages,
      onError: async (error) => {
        console.log("error", error);
        await convex.mutation(api.messages.updateMessageContent, {
          threadId,
          content: "An error occured while generating a response",
          messageId,
        });
        await convex.mutation(api.threads.updateThreadStreaming, {
          threadId,
          isStreaming: false,
        });

        await Sentry.captureException(error);
      },
      experimental_transform: [smoothStream({ chunking: "word" })],
      onFinish: async (e) => {
        await convex.mutation(api.threads.updateThreadStreaming, {
          threadId,
          isStreaming: false,
        });

        await convex.mutation(api.messages.updateMessageContent, {
          threadId,
          content: e.text,
          reasoning: e.reasoning,
          messageId,
        });
      },
      maxRetries: 0,
      //   tools: {
      //     web_search_preview: openai.tools.webSearchPreview(),
      //   },
      //   toolChoice: {
      //     type: "tool",
      //     toolName: "web_search_preview",
      //   },
    });

    req.signal.onabort = async () => {
      await result.consumeStream();
    };

    // Generate title
    (async () => {
      console.log("generating title");
      if (messages.length === 1 && messages[0].role === "user") {
        if (typeof messages[0].content === "string") {
          const title = await generateTitle(messages[0].content);
          console.log({ title });
          if (title)
            await convex.mutation(api.threads.updateThreadTitle, {
              threadId,
              title,
            });
        }
      }
    })();

    return result.toDataStreamResponse({
      sendReasoning: true,
      getErrorMessage() {
        return ERROR_MSG;
      },
    });
  } catch (e) {
    const emsg =
      e instanceof RatelimitError ? "You are being rate limited" : ERROR_MSG;
    if (messageId && threadId) {
      after(() =>
        convex.mutation(api.messages.updateMessageContent, {
          threadId,
          content: emsg,
          messageId,
        })
      );
    }
    await Sentry.captureException(e);
    return new NextResponse(
      JSON.stringify({
        error: emsg,
      }),
      {
        status: e instanceof RatelimitError ? 429 : 500,
      }
    );
  }
}
