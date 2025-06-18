import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useThreadsSearch = create(
  combine(
    {
      search: "",
    },
    (set) => ({
      setSearch: (q: string) => set({ search: q }),
    })
  )
);
