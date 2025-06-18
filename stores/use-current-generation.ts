import { create } from "zustand";
import { combine } from "zustand/middleware";

type Status = "streaming" | "error" | "ready"

type Messages = {
    id: string;
    text: string;
    reasoning?: string;
}[];

export const useCurrentGeneration = create(
    combine(
        {
            messages: [] as Messages
        },
        (set) => ({
        })
    )
)

export const useLatestGeneration = () => useCurrentGeneration(s => s.messages[s.messages.length - 1]);