import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const KEY = 'selected_model';
const DEFAULT_MODEL = 'Gemini 2.5 Flash';

export const useModel = create(
    persist(
        combine(
            {
                model: DEFAULT_MODEL,
            },
            (set) => ({
                setModel: (model: string) => set({ model })
            })
        ),
        {
            name: KEY
        }
    )
)