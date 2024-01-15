import axios from "axios";
import BN from "bignumber.js";
import { parsebn } from "@defi.org/web3-candies";
import { isNativeAddress, erc20abi } from "@defi.org/web3-candies";
import Web3 from "web3";
import { Token } from "./type";

export async function fetchPriceParaswap(
  chainId: number,
  inToken: string,
  inTokenDecimals: number
) {
  const url = `https://apiv5.paraswap.io/prices/?srcToken=${inToken}&destToken=0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c&amount=${BN(
    `1e${inTokenDecimals}`
  ).toString()}&srcDecimals=${inTokenDecimals}&destDecimals=18&side=SELL&network=${chainId}`;
  try {
    const res = await axios.get(url);

    return res.data.priceRoute.srcUSD;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function fetchPrice(
  tokenAddress: string,
  chainId: number
): Promise<number> {
  try {
    const { data } = await axios.get(
      `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}/`
    );

    if (!data.pairs[0]) {
      const paraPrice = await fetchPriceParaswap(
        chainId,
        tokenAddress,
        data.decimals
      );
      return paraPrice.price;
    }
    return parseFloat(data.pairs[0].priceUsd);
  } catch (e) {
    throw new Error(`fetchPrice: ${tokenAddress} failed`);
  }
}

export const amountBN = (decimals?: number, amount?: string) =>
  parsebn(amount || "").times(new BN(10).pow(decimals || 0));

export const amountUi = (decimals?: number, amount?: BN) => {
  if (!decimals || !amount) return "";
  const percision = new BN(10).pow(decimals || 0);
  return amount.times(percision).idiv(percision).div(percision).toString();
};

export const getTokenBalance = async (
  web3: Web3,
  account: string,
  token: Token
) => {
  let res;
  if (!web3) return "0";
  if (isNativeAddress(token!.modifiedToken.address)) {
    res = await web3?.eth.getBalance(account);
  } else {
    const tokenContract = new web3.eth.Contract(
      erc20abi,
      token!.modifiedToken.address
    );
    res = await tokenContract!.methods.balanceOf(account).call();
  }

  if (!res) return "0";
  return amountUi(token!.modifiedToken.decimals, new BN(res));
};

export const tokensListWithBalances = async (
  web3: Web3,
  account: string,
  tokens: Token[]
) => {
  return Promise.all(
    [...tokens].map(async (token) => {
      const balance = async () => {
        try {
          return await getTokenBalance(web3!, account, token);
        } catch (error) {
          return undefined;
        }
      };
      return {
        ...token,
        balance: await balance(),
      };
    })
  );
};
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const updateBalancesLoop = async (
  web3: Web3,
  address: string,
  fromToken: Token,
  toToken: Token
): Promise<{
  updatedFromToken: Token;
  updatedToToken: Token;
}> => {
  const [updatedFromToken, updatedToToken] = await tokensListWithBalances(
    web3,
    address,
    [fromToken, toToken]
  );
  if (
    updatedFromToken.balance === fromToken.balance &&
    updatedToToken.balance === toToken.balance
  ) {
    // Balances haven't changed, retry after a delay
    await delay(3000); // Add a delay to avoid excessive recursive calls
    return updateBalancesLoop(web3, address, fromToken, toToken);
  } else {
    // Balances have changed, return the updated tokens
    return {
      updatedFromToken,
      updatedToToken,
    };
  }
};
