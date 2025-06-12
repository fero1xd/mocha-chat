import { MODELS_CONFIG } from '@/lib/model-config';
import { CoreMessage, Message, smoothStream, streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, model } = await req.json() as {
        messages: CoreMessage[] | Omit<Message, "id">[];
        model: string;
    }

    const modelConfig = MODELS_CONFIG[model];
    if (!modelConfig) {
        return new Response(null, { status: 400 });
    }

    const result = streamText({
        model: modelConfig.provider,
        messages,
        onError: (error) => {
            console.log('error', error);
        },
        experimental_transform: [smoothStream({ chunking: 'word' })],
        abortSignal: req.signal,
    });


    return result.toDataStreamResponse({
        sendReasoning: true
    });
}