/* eslint-disable @typescript-eslint/no-explicit-any */
import { DappConfig, Token } from "./type";
import { erc20s } from "@defi.org/web3-candies";

const quickswapTokensListModifier = (tokens: unknown[]): Token[] => {
  return tokens.map((token: any) => {
    return {
      rawToken: {
        ...token,
        tokenInfo: token,
      },
      modifiedToken: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        logoUrl: token.logoURI?.replace("/logo_24.png", "/logo_48.png"),
      },
    };
  });
};

const thenaTokenListModifier = (tokens: unknown[]): Token[] => {
    console.log({ tokens });
    
  const filteredTokens = tokens.filter((it: any) => it.chainId === 56);
  return filteredTokens.map((it: any) => {
    return {
      rawToken: it,
      modifiedToken: {
        address: it.address,
        symbol: it.symbol,
        decimals: it.decimals,
        logoUrl: it.logoURI?.replace("_1", ""),
      },
    };
  });
};

export const partners: { [key: string]: DappConfig } = {
  quickswap: {
    name: "Quickswap",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png",
    chainId: 137,
    chainName: "Polygon",
    tokenListUrl:
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json",
    tokenListModifier: quickswapTokensListModifier,
    baseAssets: erc20s.poly,
  },
  thena: {
    name: "Thena",
    logo: "https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F2770290301-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fp4Ew3qUZPqMSVg5hJI12%252Ficon%252FIfdx379foqQ3kMzwzmSx%252FTHE.png%3Falt%3Dmedia%26token%3D67208295-11aa-4faa-9c85-117b381682f3",
    chainId: 56,
    chainName: "Binance Smart Chain",
    tokenListUrl:
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/bsc.json",
    baseAssets: erc20s.bsc,
    tokenListModifier: thenaTokenListModifier,
  },
};
