import { DEFAULT_MODEL } from "@/lib/models";
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";

const KEY = "selected_model";

export const useModel = create(
  persist(
    combine(
      {
        model: DEFAULT_MODEL,
      },
      (set) => ({
        setModel: (model: string) => set({ model }),
      })
    ),
    {
      name: KEY,
    }
  )
);
