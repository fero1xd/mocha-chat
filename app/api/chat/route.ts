import { api } from '@/convex/_generated/api';
import { auth } from '@/lib/auth';
import { generateTitle } from '@/lib/chat/generate-title';
import { systemPrompt } from '@/lib/chat/system-prompt';
import { MODELS_CONFIG } from '@/lib/model-config';
import { convex } from '@/lib/server-convex';
import { CoreMessage, Message, smoothStream, streamText } from 'ai';
import { cookies as getCookies, headers as getHeaders } from 'next/headers';
import { NextResponse } from 'next/server';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const ERROR_MSG = "An error occured while generating a response";

export async function POST(req: Request) {
    try {
        const { messages, messageId, threadId, model } = await req.json() as {
            messages: Array<CoreMessage> | Array<Omit<Message, 'id'>>;
            messageId: string;
            threadId: string;
            model: string;
        }
        const start = performance.now();
        const headers = await getHeaders()
        const session = await auth.api.getSession({
            headers
        })
        const cookies = await getCookies();
        const jwt = cookies.get('jwt');

        console.log(`Auth check took ${performance.now() - start} ms.`);

        if (!session || !jwt) {
            return new NextResponse("no auth", { status: 403 });
        }

        convex.clearAuth();
        convex.setAuth(jwt.value);

        const modelConfig = MODELS_CONFIG[model];
        if (!modelConfig) {
            return new Response(null, { status: 400 });
        }

        // Set streaming to true
        convex.mutation(api.threads.updateThreadStreaming, {
            threadId,
            isStreaming: true
        });

        const result = streamText({
            model: modelConfig.provider,
            system: systemPrompt,
            messages,
            onError: async (error) => {
                console.log('error', error);
                await convex.mutation(api.messages.updateMessageContent, {
                    threadId,
                    content: "An error occured while generating a response",
                    messageId
                })
                await convex.mutation(api.threads.updateThreadStreaming, {
                    threadId,
                    isStreaming: false
                });
            },
            experimental_transform: [smoothStream({ chunking: 'word' })],
            onFinish: async (e) => {
                console.log('onFinish', { text: e.text });
                await convex.mutation(api.threads.updateThreadStreaming, {
                    threadId,
                    isStreaming: false
                });

                await convex.mutation(api.messages.updateMessageContent, {
                    threadId,
                    content: e.text,
                    reasoning: e.reasoning,
                    messageId
                })
            },
            maxRetries: 0
        });


        req.signal.onabort = async () => {
            await result.consumeStream();
        }

        // Generate title
        (async () => {
            console.log('generating title');
            if (messages.length === 1 && messages[0].role === 'user') {
                if (typeof messages[0].content === 'string') {
                    const title = await generateTitle(messages[0].content)
                    console.log({ title });
                    if (title)
                        await convex.mutation(api.threads.updateThreadTitle, {
                            threadId,
                            title
                        })
                }
            }
        })()

        return result.toDataStreamResponse({
            sendReasoning: true,
            getErrorMessage(error) {
                return ERROR_MSG;
            },
        });
    } catch {
        return new NextResponse(
            JSON.stringify({
                error: "internal server error"
            }),
            {
                status: 500
            }
        )
    }

}