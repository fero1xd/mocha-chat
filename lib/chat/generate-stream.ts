import { useModel } from "@/stores/model";
import { useCurrentGeneration } from "@/stores/use-current-generation";
import { Message, processDataStream } from "ai";

type Args = {
    messages: Message[];
    messageId: string;
    threadId: string;
}

export async function generateStream({ messages, messageId, threadId }: Args) {
    try {
        let index: number;
        useCurrentGeneration.setState(prev => {
            index = prev.messages.length;
            return {
                messages: [
                    ...prev.messages,
                    {
                        id: messageId,
                        text: "",
                    }
                ]
            }

        })

        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                ContentType: "application/json"
            },
            body: JSON.stringify({
                messages,
                messageId,
                threadId,
                model: useModel.getState().model
            })
        });

        if (!res.ok) {
            return;
        }

        let text = "";
        let reasoning = "";

        processDataStream({
            stream: res.body!,
            onTextPart: (part) => {
                text += part;
                useCurrentGeneration.setState(prev => {
                    prev.messages[index].text = text;
                    return {
                        messages: [...prev.messages]
                    }
                })
            },
            onReasoningPart: (part) => {
                reasoning += part;
                useCurrentGeneration.setState(prev => {
                    prev.messages[index].reasoning = reasoning;
                    return {
                        messages: [...prev.messages]
                    }
                })
            },
        })

    } catch (e) {
        console.log(e);
    }
}