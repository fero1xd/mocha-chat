import { create } from 'zustand'
import { combine, persist } from 'zustand/middleware'

export const useChatbox = create(
    persist(

        combine(
            {
                // inputRef: createRef<HTMLTextAreaElement>()
                prompt: ""
            },
            (set) => ({
                setPrompt: (prompt: string) => set({ prompt })
            })
        ),
        {
            name: "user-prompt-storage",
        }
    )
)