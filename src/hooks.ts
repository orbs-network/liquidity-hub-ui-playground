/* eslint-disable @typescript-eslint/no-explicit-any */
import { amountUi } from "@orbs-network/liquidity-hub-lib";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { usePersistedStore, useSwapStore } from "./store";
import BN from "bignumber.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Token } from "./type";
import { useNumericFormat } from "react-number-format";

import {
  useAccount,
  useConfig,
  useSwitchNetwork,
  useNetwork,
} from "wagmi";
import {
  zeroAddress,
  isNativeAddress,
  contract,
  erc20abi,
  web3,
} from "@defi.org/web3-candies";
import _ from "lodash";
import {useLHSwap} from "@orbs-network/liquidity-hub-lib";
import { QUERY_KEYS } from "./consts";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useParams } from "react-router-dom";
import { partners } from "./config";


export const useToAmount = () => {
  const { quote } = useLHSwapWithArgs();
  const { toToken } = useSwapStore();
  const value = useMemo(() => {
    return !toToken
      ? ""
      : amountUi(toToken.modifiedToken, new BN(quote?.outAmount || ""));
  }, [toToken, quote?.outAmount]);

  return useFormatNumber({ value });
};

export const useTokens = () => {
  const partner = usePartner();

  return useQuery({
    queryFn: async () => {
      if (!partner) return null;
      let tokens = await (await axios.get(partner?.tokenListUrl)).data;
      const candiesAddresses = [
        zeroAddress,
        ..._.map(partner.baseAssets, (t) => t().address),
      ];
      tokens = _.sortBy(tokens, (t: any) => {
        const index = candiesAddresses.indexOf(t.address);
        return index >= 0 ? index : Number.MAX_SAFE_INTEGER;
      });

      

      return partner?.tokenListModifier
        ? partner.tokenListModifier(tokens)
        : tokens;
    },
  queryKey: [QUERY_KEYS.GET_TOKENS, partner?.tokenListUrl],
  });
};

const useUSDPrice = (address?: string) => {
  return useQuery({
    queryFn: async () => {
      return "0";
    },
    queryKey: ["useUSDPrice", address],
    enabled: !!address,
  });
};

export const useFromTokenUSDPrice = () => {
  const { fromToken } = useSwapStore();

  return useUSDPrice(fromToken?.modifiedToken.address);
};

export const useToTokenUSDPrice = () => {
  const { toToken } = useSwapStore();
  return useUSDPrice(toToken?.modifiedToken.address);
};

export const useTokenContract = (token?: Token) => {
  const provider = useProvider();

  return useMemo(() => {
    if (!token || !provider) return undefined;
    return contract(erc20abi, token.modifiedToken.address);
  }, [provider, token]);
};

export const useTokenBalance = (token?: Token) => {
  
  const tokenContract = useTokenContract(token);
  const { address } = useAccount();
  const isCorrentNetwork =  useIsCorrentNetwork()
  
  return useQuery({
    queryFn: async () => {
      if (!token || !address || !tokenContract || !isCorrentNetwork) return "0";
      let res;
      if (isNativeAddress(token.modifiedToken.address)) {
        res = await web3().eth.getBalance(address);
      } else {
        res = await tokenContract.methods.balanceOf(address).call();
      }

      if (!res) return "0";
      return amountUi(token.modifiedToken, new BN(res));
    },
    queryKey: [QUERY_KEYS.TOKEN_BALANCE, token?.modifiedToken?.address, address],
    refetchInterval: 10_000,
  });
};

export const useFromTokenBalance = () => {
  const { fromToken } = useSwapStore();
  return useTokenBalance(fromToken);
};

export const useToTokenBalance = () => {
  const { toToken } = useSwapStore();
  return useTokenBalance(toToken);
};

export const useSubmitButton = () => {
  const { fromAmount, fromToken, toToken } = useSwapStore();
  const { data: fromTokenBalance } = useFromTokenBalance();
  const { swapCallback, swapLoading, quote, quoteLoading, quoteError } =
    useLHSwapWithArgs();

    
  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { switchNetwork, isLoading: switchChainLoading } = useSwitchNetwork();
  const { chain } = useNetwork();
  const partner = usePartner();
  const outAmount = quote?.outAmount;

   if (quoteLoading) {
     return {
       disabled: false,
       text: "",
       isLoading: true,
     };
   }

   if (!address) {
     return {
       disabled: false,
       text: "Connect Wallet",
       onClick: openConnectModal,
     };
   }

   if (chain?.id !== partner?.chainId) {
     return {
       disabled: false,
       text: `Switch to ${partner?.chainName}`,
       onClick: () => switchNetwork?.(partner?.chainId),
       isLoading: switchChainLoading,
     };
   }
   if (!fromToken || !toToken) {
     return {
       disabled: true,
       text: "Select tokens",
     };
   }
   if (!fromAmount) {
     return {
       disabled: true,
       text: "Enter an amount",
     };
   }
   const fromAmountBN = new BN(fromAmount || "0");
   const fromTokenBalanceBN = new BN(fromTokenBalance || "0");
   if (fromAmountBN.gt(fromTokenBalanceBN)) {
     return {
       disabled: true,
       text: "Insufficient balance",
     };
   }

   if (quoteError || BN(outAmount || "0").isZero()) {
     return {
       disabled: true,
       text: "No liquidity",
     };
   }
   if (isNativeAddress(fromToken.modifiedToken.address)) {
     return {
       disabled: false,
       text: "Wrap",
     };
   }
   return {
     disabled: false,
     text: "Swap",
     onClick: swapCallback,
     isLoading: swapLoading,
   };
};



export const useLHSwapWithArgs = () => {
  const { fromAmount, fromToken, toToken } = useSwapStore();
  const resetBalances = useResetBalancesCallback();
    
  return useLHSwap({
    fromToken: fromToken?.rawToken,
    toToken: toToken?.rawToken,
    fromAmount,
    dexAmountOut: "",
    onSwapSuccess: resetBalances,
  });

};


export const useProvider = () => {
  const { data } = useConfig();

  return useMemo(() => {
    return (data as any)?.provider;
  }, [data]);
};

export const useOnPercentClickCallback = () => {
  const { data: balance } = useFromTokenBalance();
  const updateStore = useSwapStore((store) => store.updateStore);
  return useCallback(
    (percent: number) => {
      if (!balance || BN(balance).isZero()) return;
      updateStore({
        fromAmount: new BN(balance || "0").multipliedBy(percent).toString(),
      });
    },
    [balance, updateStore]
  );
};

export const useBalances = (token: Token ) => {
  const { data: balance } = useTokenBalance(token);
  return { balance };
};

export const useResetBalancesCallback = () => {
  const client = useQueryClient();
  const { fromToken, toToken } = useSwapStore();
  const { address } = useAccount();

  return useCallback(() => {
    client.invalidateQueries({
      queryKey: [QUERY_KEYS.TOKEN_BALANCE, fromToken?.modifiedToken?.address, address],
    });
    client.invalidateQueries({
      queryKey: [QUERY_KEYS.TOKEN_BALANCE, toToken?.modifiedToken?.address, address],
    });
  }, [client, address, fromToken, toToken]);
};

export const usePartner = () => {
  const partner = useParams<{ partner?: string }>().partner;

  return useMemo(() => {
    if (!partner) return undefined;
    const config = partners[partner];
    if (!config) return undefined;
    return {
      ...config,
      id: partner,
    };
  }, [partner]);
};

export const useFormatNumber = ({
  value,
  decimalScale = 3,
  prefix,
  suffix,
}: {
  value?: string | number;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ",",
    displayType: "text",
    value: value || "",
    decimalScale,
    prefix,
    suffix,
  });

  return result.value?.toString();
};

export const useWindowResize = () => {
  const [size, setSize] = useState([0, 0]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    window.addEventListener("resize", updateSize);
    updateSize();

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return {
    width: size[0],
    height: size[1],
  };
};

export function useDebounce(value: string, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export const useAddedTokens = (chainId?: number) => {
  const { tokens: persistedTokens } = usePersistedStore();

  return useMemo(
    () => persistedTokens[chainId!] || [],
    [chainId, persistedTokens]
  );
};

export const useIsCorrentNetwork = () => {
  const id = useNetwork().chain?.id;
  const partner = usePartner();

  return partner?.chainId === id;
};
