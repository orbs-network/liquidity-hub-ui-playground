
export enum QUERY_KEYS {
  TOKEN_BALANCE = "TOKEN_BALANCE",
  GET_TOKENS = "GET_TOKENS",
  GAS_PRICE = "GAS_PRICE",
  USD_PRICE = "USD_PRICE",
  TOKEN_BALANCES = "TOKEN_BALANCES",
}


export const ROUTES = {
  main: '/',
  quickswap: 'quickswap',
  thena: 'thena',
}

export const DEFAULT_PARTNER = ROUTES.quickswap;
export const DEFAULT_SLIPPAGE = 0.3
export const DEFAULT_QUOTE_INTERVAL = 10_000
export const DEFAULT_API_URL = "https://hub.orbs.network";

export const PASSWORD = 'orbs2024'