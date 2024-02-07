/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useConfig, useNetwork } from "wagmi";
import {
  estimateGasPrice,
} from "@defi.org/web3-candies";
import {
  DEFAULT_API_URL,
  DEFAULT_QUOTE_INTERVAL,
  DEFAULT_SLIPPAGE,
  QUERY_KEYS,
} from "./consts";
import { useParams } from "react-router-dom";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";
import Web3 from "web3";
import { partners } from "./partners-config";
import _ from "lodash";


export const useProvider = () => {
  const { data } = useConfig();

  return useMemo(() => {
    return (data as any)?.provider;
  }, [data]);
};


export const useDex = () => {
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



export const useIsWrongNetwork = () => {
  const chainId = useNetwork().chain?.id;
  const partner = useDex();
  return useMemo(() => {
    if (!partner) return false;
    return partner.chainId !== chainId;
  }, [chainId, partner]);
}