/* eslint-disable @typescript-eslint/no-explicit-any */
import { erc20s, networks, isNativeAddress } from "@defi.org/web3-candies";
import axios from "axios";
import _ from "lodash";
import { zeroAddress } from "viem";
import { Thena } from "../partners";
import { DappConfig, Token } from "../type";

const getTokens = async (): Promise<Token[]> => {
  let tokens = await (
    await axios.get(
      "https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/bsc.json"
    )
  ).data;
  const candiesAddresses = [
    zeroAddress,
    ..._.map(erc20s.bsc, (t) => t().address),
  ];
  tokens = _.sortBy(tokens, (t: any) => {
    const index = candiesAddresses.indexOf(t.address);
    return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
  });

  const filteredTokens = tokens.filter((it: any) => it.chainId === 56);
  return filteredTokens.map((it: any) => {
    return {
      address: it.address,
      symbol: it.symbol,
      decimals: it.decimals,
      logoUrl: it.logoURI?.replace("_1", ""),
    };
  });
};


export const tokenToRawToken = (token?: Token) => {  
  if (!token) return
    return {
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      chainId: 56,
      address: isNativeAddress(token.address) ? 'BNB' : token.address,
      logoURI: token.logoUrl,
    };
};


export const thena: DappConfig = {
  name: "Thena",
  logo: "https://www.gitbook.com/cdn-cgi/image/width=40,dpr=2,height=40,fit=contain,format=auto/https%3A%2F%2F2770290301-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252Fp4Ew3qUZPqMSVg5hJI12%252Ficon%252FIfdx379foqQ3kMzwzmSx%252FTHE.png%3Falt%3Dmedia%26token%3D67208295-11aa-4faa-9c85-117b381682f3",
  chainId: 56,
  chainName: "Binance Smart Chain",
  getTokens,
  Component: Thena,
  wToken: networks.bsc.wToken,
  nativeToken: networks.bsc.native,
  tokenToRawToken,
};
