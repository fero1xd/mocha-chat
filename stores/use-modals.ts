import { create } from "zustand";
import { combine } from "zustand/middleware";

export const useModals = create(
  combine(
    {
      auth: false,
      newVersion: false,
    },
    (set) => ({
      setAuth: (open: boolean) => set({ auth: open }),
      setNewVersionModal: (open: boolean) => set({ newVersion: open }),
    })
  )
);
