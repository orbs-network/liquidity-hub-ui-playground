/* eslint-disable @typescript-eslint/no-explicit-any */

import { FC } from "react";

export interface TokenPanelProps {
  usd?: string | number;
  balance?: string;
  onSelectToken: (token: Token) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  token?: Token;
  label?: string;
  isSrc?: boolean;
}

export interface DappConfig {
  name: string;
  chainId: number;
  chainName: string;
  getTokens: () => Promise<Token[]>;
  logo: string;
  Component: FC;
  defaultFromToken: string;
  defaultToToken: string;
  wToken: {
    address: string;
    symbol: string;
    decimals: number;
    logoUrl: string;
  };
  nativeToken: {
    address: string;
    symbol: string;
    decimals: number;
    logoUrl: string;
  };
}

export interface ModifiedToken {
  address: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  name?: string;
}

export type Token = { modifiedToken: ModifiedToken; rawToken: any, balance?: string };

export interface DappTheme {
  colors: {
    primary: string;
    pageBackground?: string;
    modalBackground?: string;
    textMain?: string;
    button?: string;
    buttonDisabled?: string;
    buttonText?: string;
    buttonDisabledText?: string;
    card?: string;
    borderMain?: string;
    textSecondary?: string;
  };
  fonts: {
    main: string;
  };
}
