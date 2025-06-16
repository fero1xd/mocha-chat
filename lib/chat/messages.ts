import { UIMessage } from "ai";
import { nanoid } from 'nanoid'

export function createUserMessage(prompt: string): UIMessage {
    const id = nanoid();
    return {
        id,
        content: prompt,
        role: "user",
        parts: [{
            type: "text",
            text: prompt
        }],
        createdAt: new Date(),
    }
}