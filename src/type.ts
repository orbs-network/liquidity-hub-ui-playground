
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
  tokenListUrl: string;
  tokenListModifier?: (tokens: any) => Token[];
  baseAssets: any;
  logo: string;
  Component: FC;
}


export interface ModifiedToken {
  address: string;
  symbol: string;
  decimals: number;
  logoUrl?: string;
}

export type Token = { modifiedToken: ModifiedToken; rawToken: any };


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
  };
  fonts: {
    main: string;
  };
}