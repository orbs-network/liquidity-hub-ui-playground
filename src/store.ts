import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DappConfig } from "./type";

export interface MainStore {
  dappConfig?: DappConfig;
  updateStore: (value: Partial<MainStore>) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  dappConfig: undefined,
  updateStore: (value) => set({ ...value }),
}));



interface PersistedStore {
  password?: string;
  setPassword: (password: string) => void;
}

export const usePersistedStore = create(
  persist<PersistedStore>(
    (set) => ({
      password: undefined,
      setPassword: (password) => set({ password }),
    }),
    {
      name: `password-store`,
    }
  )
);
