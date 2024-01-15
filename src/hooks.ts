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
import { Token } from "./type";
import { useNumericFormat } from "react-number-format";
import { useAccount, useConfig, useSwitchNetwork, useNetwork } from "wagmi";
import {
  zeroAddress,
  isNativeAddress,
  erc20abi,
  estimateGasPrice,
  eqIgnoreCase,
} from "@defi.org/web3-candies";
import { useLiquidityHub } from "@orbs-network/liquidity-hub-lib";
import {
  DEFAULT_API_URL,
  DEFAULT_QUOTE_INTERVAL,
  DEFAULT_SLIPPAGE,
  QUERY_KEYS,
} from "./consts";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useParams } from "react-router-dom";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";
import {
  amountUi,
  fetchPrice,
  tokensListWithBalances,
  updateBalancesLoop,
} from "./util";
import Web3 from "web3";
import { partners } from "./partners-config";
import _ from "lodash";

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
  const { updateStore, fromToken, toToken } = useSwapStore();
  const { address } = useAccount();
  const web3 = useWeb3();
  const correctNetwork = useIsCorrentNetwork();

  return useQuery({
    queryFn: async () => {
      if (address && !web3) return [];
      let tokens = await partner!.getTokens();

      if (address && web3) {
        tokens = await tokensListWithBalances(web3, address, tokens);
      }

      const sorted = _.orderBy(
        tokens,
        (t) => {
          return new BN(t.balance || "0");
        },
        ["desc"]
      );

      if (!fromToken) {
        updateStore({ fromToken: sorted[0] });
      }

      if (!toToken) {
        updateStore({ toToken: sorted[1] });
      }

      return sorted;
    },
    queryKey: [QUERY_KEYS.GET_TOKENS, partner?.id, address, web3?.version],
    enabled: !!partner && correctNetwork,
    refetchInterval: 60_000,
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
    queryKey: [QUERY_KEYS.USD_PRICE, chainId, address, wTokenAddress],
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
  const web3 = useWeb3();
  return useMemo(() => {
    if (!token || !web3) return undefined;
    return new web3.eth.Contract(erc20abi, token.modifiedToken.address);
  }, [web3, token]);
};

export const useSubmitButton = () => {
  const { fromAmount, fromToken, toToken, updateStore } = useSwapStore();
  const { swapCallback, swapLoading, quote, quoteLoading, quoteError } =
    useLHSwapWithArgs();

  const refetchBalances = useRefetchBalancesCallback();

  const swap = useCallback(async () => {
    swapCallback({
      dexSwap: () => {},
      onSwapSuccess: () => {
        refetchBalances(),
          updateStore({
            fromAmount: "",
          });
      },
    });
  }, [swapCallback, refetchBalances, updateStore]);

  const { openConnectModal } = useConnectModal();
  const { address } = useAccount();
  const { switchNetwork, isLoading: switchChainLoading } = useSwitchNetwork();
  const { chain } = useNetwork();
  const partner = usePartner();
  const outAmount = quote?.outAmount;
  const fromTokenBalance = useTokenFromTokenList(fromToken)?.balance;

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
    onClick: swap,
    isLoading: swapLoading,
  };
};

export const useLHSwapWithArgs = () => {
  const { fromAmount, fromToken, toToken } = useSwapStore();
  const { slippage } = useSettingsParams();
  const fromTokenUsd = useFromTokenUSDPrice().data;
  const toTokenUsd = useToTokenUSDPrice().data;

  return useLiquidityHub({
    fromToken: fromToken?.rawToken,
    toToken: toToken?.rawToken,
    fromAmountUI: fromAmount,
    dexAmountOut: "",
    slippage,
    toTokenUsd,
    fromTokenUsd,
  });
};

export const useProvider = () => {
  const { data } = useConfig();

  return useMemo(() => {
    return (data as any)?.provider;
  }, [data]);
};

export const useRefetchBalancesCallback = () => {
  const client = useQueryClient();
  const partner = usePartner();
  const web3 = useWeb3();
  const { fromToken, toToken, updateStore } = useSwapStore((s) => ({
    fromToken: s.fromToken,
    toToken: s.toToken,
    updateStore: s.updateStore,
  }));
  const { address } = useAccount();

  return useCallback(async () => {
    if (!address || !fromToken || !toToken || !web3) return;
    updateStore({
      fetchingBalancesAfterTx: true,
    });
    const { updatedFromToken, updatedToToken } = await updateBalancesLoop(
      web3,
      address,
      fromToken,
      toToken
    );

    client.setQueryData(
      [QUERY_KEYS.GET_TOKENS, partner?.id, address, web3?.version],
      (old?: Token[]) => {
        if (!old) return old;
        return old.map((t: Token) => {
          if (
            eqIgnoreCase(
              t.modifiedToken.address,
              updatedFromToken.modifiedToken.address
            )
          ) {
            return updatedFromToken;
          }
          if (
            eqIgnoreCase(
              t.modifiedToken.address,
              updatedToToken.modifiedToken.address
            )
          ) {
            return updatedToToken;
          }
          return t;
        });
      }
    );
    updateStore({
      fetchingBalancesAfterTx: false,
    });
  }, [address, fromToken, toToken, web3, updateStore, client, partner?.id]);
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
      quoteInterval: NumberParam,
    },
    { updateType: "pushIn" }
  );

  return {
    apiUrl: (query.apiUrl as string | undefined) || DEFAULT_API_URL,
    slippage: (query.slippage as number | undefined) || DEFAULT_SLIPPAGE,
    quoteInterval:
      (query.quoteInterval as number | undefined) || DEFAULT_QUOTE_INTERVAL,
    setSettings: setQuery,
  };
};

export const useFromTokenPanelArgs = () => {
  const { onFromAmountChange, onFromTokenChange, fromAmount, fromToken } =
    useSwapStore();
  const usd = useFromTokenInputUsd();
  const balance = useTokenFromTokenList(fromToken)?.balance;

  return {
    onSelectToken: onFromTokenChange,
    usd,
    token: fromToken,
    inputValue: fromAmount || "",
    onInputChange: onFromAmountChange,
    balance,
  };
};

export const useToTokenPanelArgs = () => {
  const { onToTokenChange, toToken } = useSwapStore();
  const usd = useToTokenInputUsd();
  const toAmount = useToAmount();
  const inputValue = useFormatNumber({ value: toAmount?.uiAmount });
  const balance = useTokenFromTokenList(toToken)?.balance;
  return {
    onSelectToken: onToTokenChange,
    usd,
    token: toToken,
    inputValue: inputValue || "",
    balance,
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

  const price = gasPrice?.med.max;

  return useMemo(() => {
    if (!price || !nativeTokenPrice) return "0";
    const value = amountUi(nativeTokenDecimals, price.multipliedBy(750_000));
    return nativeTokenPrice * Number(value);
  }, [price, nativeTokenDecimals, nativeTokenPrice]);
};

export const useTokenFromTokenList = (token?: Token) => {
  const { data: tokens, dataUpdatedAt } = useTokens();
  return useMemo(() => {
    if (!token || !tokens) return undefined;
    return tokens.find((t) =>
      eqIgnoreCase(t.modifiedToken.address, token.modifiedToken.address)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, dataUpdatedAt]);
};
