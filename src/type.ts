
/* eslint-disable @typescript-eslint/no-explicit-any */


export interface TokenPanelProps {
  usd?: string;
  balance?: string;
  onSelectToken: (token: Token) => void;
  onPercentClick?: (value: number) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  token?: Token;
  inputDisabled?: boolean;
  label?: string;
}


export interface DappConfig {
  name: string;
  chainId: number;
  chainName: string;
  tokenListUrl: string;
  tokenListModifier?: (tokens: any) => Token[];
  baseAssets: any;
  logo: string;
}


interface ModifiedToken {
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
  };
  fonts: {
    main: string;
  };
}