/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  erc20s,
  networks,
  zeroAddress,
} from "@defi.org/web3-candies";
import axios from "axios";
import _ from "lodash";
import { Quickswap } from "../partners";
import { DappConfig } from "../type";

const getTokens = async () => {
  const res = await (
    await axios.get(
      "https://unpkg.com/quickswap-default-token-list@1.3.16/build/quickswap-default.tokenlist.json"
    )
  ).data;
  const tokens = res.tokens.filter((it: any) => it.chainId === 137);

  const candiesAddresses = [
    zeroAddress,
    ..._.map(erc20s.poly, (t) => t().address),
  ];
  const sorted = _.sortBy(tokens, (t: any) => {
    const index = candiesAddresses.indexOf(t.address);
    return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
  });

  return [networks.poly.native, ...sorted].map((token: any) => {
    return {
      rawToken: {
        ...token,
        tokenInfo: token,
      },
      modifiedToken: {
        address: token.address,
        symbol: token.symbol,
        decimals: token.decimals,
        logoUrl:
          token.logoUrl ||
          token.logoURI?.replace("/logo_24.png", "/logo_48.png"),
        name: token.name,
      },
    };
  });
};

export const quickswap: DappConfig = {
  name: "Quickswap",
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/8206.png",
  chainId: 137,
  chainName: "Polygon",
  getTokens,
  Component: Quickswap,
  wToken: networks.poly.wToken,
  nativeToken: networks.poly.native,
  defaultFromToken: "USDC.e",
  defaultToToken: "WBTC",
};
