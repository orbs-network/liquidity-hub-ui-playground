/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { ReactNode, useEffect, useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";
import { createGlobalStyle } from "styled-components";
import { setWeb3Instance } from "@defi.org/web3-candies";
import Web3 from "web3";
import { ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import {
  useDex,
  useProvider,
  useSettingsParams,
  useWindowResize,
} from "./hooks";
import { GasPrice, PartnerSelect, Password, Settings } from "./components";
import { DEFAULT_PARTNER, PASSWORD } from "./consts";
import { FlexRow } from "./styles";
import { getTheme } from "./theme";
import { BlockNumber } from "./components/BlockNumber";
import { usePersistedStore } from "./store";
import { Widget } from "@orbs-network/liquidity-hub-widget";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fonts.main}!important;
  }
`;

function Wrapped() {
  const dex = useDex();
  const { height } = useWindowResize();
  const { address } = useAccount();
  const provider = useProvider();
  const { openConnectModal } = useConnectModal();
  const { apiUrl, quoteInterval } = useSettingsParams();
  const theme = useMemo(() => getTheme(dex?.id), [dex]);
  const chainId = useNetwork().chain?.id;
  const widgetConfig = useMemo(() => dex?.widgetConfig?.(), [dex]);

  useEffect(() => {
    setWeb3Instance(new Web3(provider));
  }, [provider]);

  if (!dex) {
    return <Navigate to={`/${DEFAULT_PARTNER}`} />;
  }


  return (
    <ThemeProvider theme={theme}>
      <Container $minHeight={height}>
        <GlobalStyle />
        <Grid>
          <StyledHeader>
            <PartnerSelect />
            <Settings />
            <ConnectButton />
            <GasPrice />
          </StyledHeader>
          <SwapContainer>
            <ProtectedContent>
              <Widget
                chainId={chainId}
                provider={provider}
                account={address}
                apiUrl={apiUrl}
                partner={dex.name}
                quoteInterval={quoteInterval}
                partnerChainId={dex.chainId}
                connectWallet={openConnectModal}
                config={widgetConfig}
              />
            </ProtectedContent>
          </SwapContainer>
        </Grid>
        <BlockNumber />
      </Container>
    </ThemeProvider>
  );
}

const ProtectedContent = ({ children }: { children: ReactNode }) => {
  const { password } = usePersistedStore((it) => ({
    password: it.password,
  }));

  if (password !== PASSWORD) {
    return <Password />;
  }

  return <>{children}</>;
};

const SwapContainer = styled.div`
  margin-top: 50px;
  width: 100%;
`;

export const App = () => {
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <Wrapped />
    </QueryParamProvider>
  );
};

const StyledHeader = styled(FlexRow)`
  justify-content: space-between;
  width: 100%;
  gap: 20px;
`;

const Container = styled.div<{ $background?: string; $minHeight: number }>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.pageBackground};
  min-height: ${({ $minHeight }) => $minHeight}px;
  height: 100vh;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 20px;
  align-items: center;
`;
