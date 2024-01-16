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
  tokenToRawToken: (token?: Token) => any;
  wToken: Token;
  nativeToken: Token;
}

export interface ModifiedToken {
  address: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  name?: string;
}


export type Token = {
  address: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
  name?: string;
  balance?: string;
};

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
