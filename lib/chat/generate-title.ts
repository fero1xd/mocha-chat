
import "server-only"

import { generateText } from "ai"
import { MODELS_CONFIG } from "../model-config"

export async function generateTitle(prompt: string) {
    try {
        const { text } = await generateText({
            model: MODELS_CONFIG['Gemini 2.5 Flash'].provider,
            system: `\n
      - you will generate a short title based on the first message a user begins a conversation with
      - ensure it is not more than 80 characters long
      - the title should be a summary of the user's message
      - you should NOT answer the user's message, you should only generate a summary/title
      - do not use quotes or colons`,
            prompt,
        })
        return text;
    } catch (err) {
        console.log(err);
    }
}