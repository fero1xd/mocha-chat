import { api } from '@/convex/_generated/api';
import { auth } from '@/lib/auth';
import { generateTitle } from '@/lib/chat/generate-title';
import { systemPrompt } from '@/lib/chat/system-prompt';
import { MODELS_CONFIG } from '@/lib/model-config';
import { convex } from '@/lib/server-convex';
import { CoreMessage, createDataStreamResponse, Message, smoothStream, streamText, tool, UIMessage } from 'ai';
import { headers as getHeaders, cookies as getCookies } from 'next/headers';
import { NextResponse } from 'next/server';


// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, model, threadId } = await req.json() as {
            messages: CoreMessage[] | Omit<Message, "id">[];
            model: string;
            threadId: string;
        }
        const headers = await getHeaders()
        const session = await auth.api.getSession({
            headers
        })
        const cookies = await getCookies();
        const jwt = cookies.get('jwt');

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
                await convex.mutation(api.threads.updateThreadStreaming, {
                    threadId,
                    isStreaming: false
                });
            },
            experimental_transform: [smoothStream({ chunking: 'word' })],
            onFinish: async (e) => {
                await convex.mutation(api.threads.updateThreadStreaming, {
                    threadId,
                    isStreaming: false
                });

                // const content = e.text;
                // const assistantMessages = e.response.messages.filter(m => m.role === 'assistant');

                // Transform response messages to what useChat() hook expects.
                const uiMessage: Message & {
                    parts: NonNullable<Message['parts']>;
                } = {
                    id: e.response.id,
                    content: e.text,
                    role: "assistant",
                    parts: []
                }

                e.response.messages.forEach(m => {
                    console.dir(m, { depth: null });

                    // not handling tools
                    if (m.role === 'tool') {
                        return;
                    }

                    if (Array.isArray(m.content)) {
                        for (const c of m.content) {
                            switch (c.type) {
                                case "text":
                                    uiMessage.parts.push({ type: "text", text: c.text });
                                    break;
                                case "reasoning":
                                    uiMessage.parts.push({
                                        type: "reasoning",
                                        reasoning: c.text,
                                        details: [{
                                            type: "text",
                                            text: c.text,
                                            signature: c.signature
                                        }]
                                    })
                                    break;
                                case "redacted-reasoning":
                                    // find latest reasoning without redacted reasoning
                                    const reasoningPart = uiMessage.parts.find(part => part.type === 'reasoning' &&
                                        !part.details.find(detail => detail.type === 'redacted'))
                                    if (reasoningPart?.type === 'reasoning') {
                                        reasoningPart.details.push({ type: "redacted", data: c.data });
                                    }
                                    break;
                                case "file":
                                    const b = Buffer.from("abc");
                                    b.buffer
                                    uiMessage.parts.push({
                                        type: "file",
                                        data: Buffer.isBuffer(c.data) ? c.data.toString('base64') :
                                            ((c.data instanceof ArrayBuffer) || (c.data instanceof Uint8Array)) ? binaryToString(c.data) :
                                                c.data.toString(),
                                        mimeType: c.mimeType,
                                    })
                                    break;
                                default:
                                    console.log(`ignoring ${c.type}`);
                                    break;
                            }
                        }
                    } else {
                        // This is just a text part
                        uiMessage.parts.push({
                            type: "text",
                            text: m.content
                        })
                    }
                })

                const { id: _, ...rest } = uiMessage;
                // Store message in db                
                await convex.mutation(api.messages.addMessageToThread, {
                    ...rest,
                    threadId
                })

                console.dir(uiMessage, { depth: null });
            },
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
                if (error == null) {
                    return 'unknown error';
                }

                if (typeof error === 'string') {
                    return error;
                }

                if (error instanceof Error) {
                    return error.message;
                }
                console.dir(error, { depth: null });
                return "An unknown error occured";
            },
        });
    } catch (e) {
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

function binaryToString(binary: ArrayBuffer | Uint8Array) {
    const decoder = new TextDecoder('utf8');
    return btoa(decoder.decode(binary));
}