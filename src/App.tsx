import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { LiquidityHubProvider } from "@orbs-network/liquidity-hub-lib";
import { useEffect, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { createGlobalStyle } from "styled-components";
import { setWeb3Instance } from "@defi.org/web3-candies";
import Web3 from "web3";
import { ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";
import {
  usePartner,
  useProvider,
  useSettingsParams,
  useWindowResize,
} from "./hooks";
import { PartnerSelect, Settings } from "./components";
import { DEFAULT_PARTNER } from "./consts";
import { FlexRow } from "./styles";
import { getTheme } from "./theme";
import { BlockNumber } from "./components/BlockNumber";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fonts.main}!important;
  }
`;

function Wrapped() {
  const partner = usePartner();
  const { height } = useWindowResize();
  const { address } = useAccount();
  const provider = useProvider();
  const chainId = useChainId();

  const { apiUrl, slippage } = useSettingsParams();
  const theme = useMemo(() => getTheme(partner?.id), [partner]);

  useEffect(() => {
    setWeb3Instance(new Web3(provider));
  }, [provider]);
  if (!partner) {
    return <Navigate to={`/${DEFAULT_PARTNER}`} />;
  }
  const { Component } = partner;
  return (
    <ThemeProvider theme={theme}>
      <Container $minHeight={height}>
        <GlobalStyle />
        <Grid>
          <StyledHeader>
            <PartnerSelect />
            <Settings />
            <ConnectButton />
          </StyledHeader>
          <LiquidityHubProvider
            uiSettings={{
              buttonColor: theme.colors.button,
            }}
            provider={provider}
            account={address}
            partner={partner.id}
            chainId={chainId}
            apiUrl={apiUrl}
            slippage={slippage}
          >
            <SwapContainer>
              <Component />
            </SwapContainer>
          </LiquidityHubProvider>
        </Grid>
        <BlockNumber />
      </Container>
    </ThemeProvider>
  );
}

const SwapContainer = styled.div`
  margin-top:50px;
`

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
`;
