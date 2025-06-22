import * as Sentry from "@sentry/node";
import { HandledError } from "@/lib/backend/analytics/errors";
import { captureGeneration } from "@/lib/backend/analytics/ph";
import "@/lib/backend/analytics/sentry";
import { generateTitle } from "@/lib/backend/chat/generate-title";
import { rateLimitGeneration } from "@/lib/backend/chat/rate-limit";
import { setThreadStreaming } from "@/lib/backend/chat/set-thread-streaming";
import { updateMessage } from "@/lib/backend/chat/update-msg";
import { getFirstChatMessage } from "@/lib/backend/chat/utils";
import { getJwtFromRequest } from "@/lib/backend/check-auth";
import { convex } from "@/lib/backend/server-convex";
import { systemPrompt } from "@/lib/chat/system-prompt";
import { MODELS_CONFIG } from "@/lib/backend/model-config";
import { CoreMessage, Message, smoothStream, streamText } from "ai";
import { after, NextResponse } from "next/server";

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
    const { jwt, session } = await getJwtFromRequest();
    const { id: userId } = session.user;
    console.log(`Auth check took ${performance.now() - start} ms.`);

    captureGeneration({
      id: userId,
      threadId,
      model,
    });

    convex.clearAuth();
    convex.setAuth(jwt.value);

    await rateLimitGeneration(userId);

    const modelConfig = MODELS_CONFIG[model];
    if (!modelConfig) {
      return new Response(null, { status: 400 });
    }

    let hasSeenChunk = false;
    const result = streamText({
      model: modelConfig.provider,
      system: systemPrompt,
      messages,
      onError: async (error) => {
        console.log("error", error);
        await Promise.allSettled([
          setThreadStreaming(threadId, false),
          updateMessage({
            threadId,
            content: ERROR_MSG,
            messageId,
            status: "error",
          }),
        ]);
        Sentry.captureException(error);
      },
      experimental_transform: [smoothStream({ chunking: "word" })],
      onFinish: async (e) => {
        console.dir(e.providerMetadata, { depth: null });
        console.dir(e.usage, { depth: null });

        await Promise.allSettled([
          setThreadStreaming(threadId, false),
          updateMessage({
            threadId,
            content: e.text,
            reasoning: e.reasoning,
            messageId,
            status: "done",
          }),
        ]);
      },
      maxRetries: 0,

      providerOptions: {
        openai: {
          reasoningSummary: "auto",
        },
      },
      onChunk: () => {
        if (hasSeenChunk) return;
        hasSeenChunk = true;
        updateMessage({
          messageId,
          threadId,
          status: "streaming",
        });
      },
    });

    req.signal.onabort = async () => {
      await result.consumeStream();
    };

    const titlePrompt = getFirstChatMessage(messages);
    if (titlePrompt) generateTitle({ threadId, prompt: titlePrompt });
    setThreadStreaming(threadId, true);

    return result.toDataStreamResponse({
      sendReasoning: true,
      getErrorMessage(e) {
        console.log(e);
        return ERROR_MSG;
      },
    });
  } catch (e) {
    console.log(e);
    const emsg = e instanceof HandledError ? e.message : ERROR_MSG;

    if (messageId && threadId) {
      after(async () => {
        updateMessage({
          threadId,
          content: emsg,
          messageId,
          status: "error",
        });
        Sentry.captureException(e);
      });
    }
    return new NextResponse(
      JSON.stringify({
        error: emsg,
      }),
      {
        status: e instanceof HandledError ? e.status : 500,
      }
    );
  }
}
