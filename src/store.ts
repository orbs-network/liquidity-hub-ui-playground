import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Token, DappConfig } from "./type";
export interface MainStore {
  dappConfig?: DappConfig;
  updateStore: (value: Partial<MainStore>) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  dappConfig: undefined,
  updateStore: (value) => set({ ...value }),
}));

interface Store {
  fromToken?: Token;
  toToken?: Token;
  fromAmount?: string;
  updateStore: (value: Partial<Store>) => void;
  onFromAmountChange: (value: string) => void;
  onFromTokenChange: (value: Token) => void;
  onToTokenChange: (value: Token) => void;
  onSwitchTokens: () => void;
  reset: () => void;
}

const initialState: Partial<Store> = {
  fromToken: undefined,
  toToken: undefined,
  fromAmount: undefined,
};

export const useSwapStore = create<Store>((set) => ({
  ...initialState,
  updateStore: (value) => set({ ...value }),
  onFromAmountChange: (value) => set({ fromAmount: value }),
  onFromTokenChange: (value) => set({ fromToken: value }),
  onToTokenChange: (value) => set({ toToken: value }),
  onSwitchTokens: () =>
    set((state) => ({
      fromToken: state.toToken,
      toToken: state.fromToken,
    })),
  reset: () => set({ ...initialState }),
}));



export interface PerstistdStoreToken {
  address: string;
  decimals: number;
  symbol: string;
  logoUrl?: string;
}

interface PersistedStore {
  tokens: {
    [key: number]: PerstistdStoreToken[];
  };
  addToken: (chainId: number, token: PerstistdStoreToken) => void;
  removeToken: (chainId: number, token: PerstistdStoreToken) => void;
}

export const usePersistedStore = create(
  persist<PersistedStore>(
    (set) => ({
      tokens: {},
      removeToken: (chainId, token) =>
        set((state) => ({
          tokens: {
            ...state.tokens,
            [chainId]: state.tokens[chainId].filter(
              (t) => t.address !== token.address
            ),
          },
        })),

      addToken: (chainId, token) =>
        set((state) => ({
          tokens: {
            ...state.tokens,
            [chainId]: [token, ...(state.tokens[chainId] || [])],
          },
        })),
    }),
    {
      name: `persisted-store`,
    }
  )
);

