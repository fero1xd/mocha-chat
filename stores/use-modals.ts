import { create } from "zustand";
import { combine } from "zustand/middleware";


export const useModals = create(
    combine(
        {
            auth: false
        },
        (set) => ({
            setAuth: (auth: boolean) => set({ auth })
        })
    )
)