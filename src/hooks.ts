/* eslint-disable @typescript-eslint/no-explicit-any */
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

import { useAccount, useConfig, useSwitchNetwork, useNetwork } from "wagmi";
import {
  zeroAddress,
  isNativeAddress,
  contract,
  erc20abi,
  web3,
  estimateGasPrice,
} from "@defi.org/web3-candies";
import _ from "lodash";
import { useLHSwap } from "@orbs-network/liquidity-hub-lib";
import { DEFAULT_API_URL, DEFAULT_SLIPPAGE, QUERY_KEYS } from "./consts";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useParams } from "react-router-dom";
import { partners } from "./config";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";
import { amountUi, fetchPrice } from "./util";
import Web3 from "web3";

export const useToAmount = () => {
  const { quote } = useLHSwapWithArgs();
  const { toToken } = useSwapStore();
  return useMemo(() => {
    return !toToken
      ? undefined
      : {
          rawAmount: quote?.outAmount,
          uiAmount: amountUi(
            toToken.modifiedToken.decimals,
            new BN(quote?.outAmount || "")
          ),
        };
  }, [toToken, quote?.outAmount]);
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

export const useUSDPrice = (address?: string) => {
  const chainId = useNetwork().chain?.id;
  const wTokenAddress = usePartner()?.wToken.address;
  return useQuery({
    queryFn: async () => {
      if (!chainId || !address || !wTokenAddress) return 0;

      return fetchPrice(
        isNativeAddress(address) ? wTokenAddress : address,
        chainId
      );
    },
    queryKey: ["useUSDPrice", chainId, address, wTokenAddress],
    refetchInterval: 10_000,
  });
};

export const useFromTokenInputUsd = () => {
  const { data: usd } = useFromTokenUSDPrice();
  const amount = useSwapStore((s) => s.fromAmount);

  return useMemo(() => {
    if (!amount) return "";
    return BN(amount)
      .multipliedBy(usd || 0)
      .toString();
  }, [usd, amount]);
};

export const useToTokenInputUsd = () => {
  const { data: usd } = useToTokenUSDPrice();
  const amount = useToAmount()?.rawAmount;
  const decimals = useSwapStore((s) => s.toToken)?.modifiedToken.decimals;

  return useMemo(() => {
    if (!amount) {
      return "";
    }
    const res = BN(amount || "1").multipliedBy(usd || 0);

    return amountUi(decimals, res);
  }, [usd, amount, decimals]);
};

export const useFromTokenUSDPrice = () => {
  const fromToken = useSwapStore((s) => s.fromToken);

  return useUSDPrice(fromToken?.modifiedToken.address);
};

export const useToTokenUSDPrice = () => {
  const toToken = useSwapStore((s) => s.toToken);
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
  const isCorrentNetwork = useIsCorrentNetwork();

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
      return amountUi(token.modifiedToken.decimals, new BN(res));
    },
    queryKey: [
      QUERY_KEYS.TOKEN_BALANCE,
      token?.modifiedToken?.address,
      address,
    ],
    refetchInterval: 15_000,
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

export const useBalances = (token: Token) => {
  const { data: balance } = useTokenBalance(token);
  return { balance };
};

export const useResetBalancesCallback = () => {
  const client = useQueryClient();
  const { fromToken, toToken } = useSwapStore((s) => ({
    fromToken: s.fromToken,
    toToken: s.toToken,
  }));
  const { address } = useAccount();

  return useCallback(() => {
    const fromKey = [
      QUERY_KEYS.TOKEN_BALANCE,
      fromToken?.modifiedToken?.address,
      address,
    ];
    const toKey = [
      QUERY_KEYS.TOKEN_BALANCE,
      toToken?.modifiedToken?.address,
      address,
    ];
    client.setQueryData(fromKey, "");
    client.setQueryData(toKey, "");
    client.invalidateQueries({
      queryKey: fromKey,
      type: "all",
    });
    client.invalidateQueries({
      queryKey: toKey,
      type: "all",
    });
  }, [
    address,
    client,
    fromToken?.modifiedToken?.address,
    toToken?.modifiedToken?.address,
  ]);
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
  const decimals = useMemo(() => {
    if (!value) return 0;
    const [, decimal] = value.toString().split(".");
    if (!decimal) return 0;
    const arr = decimal.split("");
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === "0") {
        count++;
      } else {
        break;
      }
    }

    return !count ? decimalScale : count + decimalScale;
  }, [value, decimalScale]);

  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ",",
    displayType: "text",
    value: value || "",
    decimalScale: decimals,
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

export const useSettingsParams = () => {
  const [query, setQuery] = useQueryParams(
    {
      apiUrl: StringParam,
      slippage: NumberParam,
    },
    { updateType: "pushIn" }
  );

  return {
    apiUrl: (query.apiUrl as string | undefined) || DEFAULT_API_URL,
    slippage: (query.slippage as number | undefined) || DEFAULT_SLIPPAGE,
    setSettings: setQuery,
  };
};

export const useFromTokenPanelArgs = () => {
  const { onFromAmountChange, onFromTokenChange, fromAmount, fromToken } =
    useSwapStore();
  const { data: balance } = useFromTokenBalance();
  const usd = useFromTokenInputUsd();

  return {
    onSelectToken: onFromTokenChange,
    usd,
    balance,
    token: fromToken,
    inputValue: fromAmount || "",
    onInputChange: onFromAmountChange,
  };
};

export const useToTokenPanelArgs = () => {
  const { onToTokenChange, toToken } = useSwapStore();
  const { data: balance } = useToTokenBalance();
  const usd = useToTokenInputUsd();
  const toAmount = useToAmount();
  const inputValue = useFormatNumber({ value: toAmount?.uiAmount });

  return {
    onSelectToken: onToTokenChange,
    usd,
    balance,
    token: toToken,
    inputValue: inputValue || "",
  };
};

const useWeb3 = () => {
  const provider = useProvider();
  return useMemo(() => {
    if (provider) return new Web3(provider);
  }, [provider]);
};

export const useGasPriceQuery = () => {
  const chainId = useNetwork().chain?.id;
  const web3 = useWeb3();
  return useQuery({
    queryKey: [QUERY_KEYS.GAS_PRICE, chainId],
    queryFn: () => {
      return estimateGasPrice(undefined, undefined, web3);
    },
    refetchInterval: 15_000,
    enabled: !!web3,
  });
};

export const useTxEstimateGasPrice = () => {
  const { data: gasPrice } = useGasPriceQuery();
  const nativeTokenPrice = useUSDPrice(zeroAddress).data;
  const nativeTokenDecimals = useNetwork().chain?.nativeCurrency.decimals;

  const price = gasPrice?.fast.max;

  return useMemo(() => {
    if (!price || !nativeTokenPrice) return "0";
    const value = amountUi(nativeTokenDecimals, price.multipliedBy(750_000));
    return nativeTokenPrice * Number(value);
  }, [price, nativeTokenDecimals, nativeTokenPrice]);
};
