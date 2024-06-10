/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useAccount } from "wagmi";

import {
  DEFAULT_API_URL,
  DEFAULT_QUOTE_INTERVAL,
  DEFAULT_SLIPPAGE,
} from "./consts";
import { useParams } from "react-router-dom";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";
import { partners } from "./partners-config";
import _ from "lodash";
import Web3 from "web3";
export const useProvider = () => {
  const { connector, address , isConnected} = useAccount();

  const [provider, setProvider] = useState<any>(undefined);

  const setProviderFromConnector = useCallback(async () => {
    try {
      const res = await connector?.getProvider();
      setProvider(res);
    } catch (error) {}
  }, [setProvider, connector,isConnected]);

  useEffect(() => {
    setProviderFromConnector();
  }, [address, setProviderFromConnector]);

  return provider;
};

export const useWeb3 = () => {
  const provider = useProvider();
  return useMemo(() => {
    if (provider) return new Web3(provider);
  }, [provider]);
};

export const useChainId = () => {
  const provider = useProvider();

  return provider?.chainId && Web3.utils.hexToNumber(provider.chainId);
};

export const useDex = () => {
  const partner = useParams<{ partner?: string }>().partner;

  return useMemo(() => {
    if (!partner) return undefined;
    const config = partners[partner];
    if (!config) return undefined;
    return config
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
  const dex = useDex();

  const [query, setQuery] = useQueryParams(
    {
      apiUrl: StringParam,
      slippage: NumberParam,
      quoteInterval: NumberParam,
    },
    { updateType: "pushIn" }
  );

  return {
    apiUrl:
      (query.apiUrl as string | undefined) || dex?.apiUrl || DEFAULT_API_URL,
    slippage: (query.slippage as number | undefined) || DEFAULT_SLIPPAGE,
    quoteInterval:
      (query.quoteInterval as number | undefined) || DEFAULT_QUOTE_INTERVAL,
    setSettings: setQuery,
  };
};
