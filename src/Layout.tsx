import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Outlet } from "react-router-dom";
import { usePartner, useProvider, useWindowResize } from "./hooks";
import styled from "styled-components";
import { LiquidityHubProvider } from "@orbs-network/liquidity-hub-lib";
import { useEffect, useMemo } from "react";
import { useAccount, useChainId } from "wagmi";
import { createGlobalStyle } from "styled-components";
import { setWeb3Instance } from "@defi.org/web3-candies";
import Web3 from "web3";
import { ThemeProvider } from "styled-components";
import { getTheme } from "./theme";
import { BlockNumber } from "./components/BlockNumber";
import { PartnerSelect } from "./components";
import { FlexRow } from "./styles";


const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${({ theme }) => theme.fonts.main}!important;
  }
`;

export function Layout() {
  const partner = usePartner();
  const { height } = useWindowResize();
  const { address } = useAccount();
  const provider = useProvider();
  const chainId = useChainId();

  useEffect(() => {
    setWeb3Instance(new Web3(provider));
  }, [provider]);
  const theme = useMemo(() => getTheme(partner?.id), [partner]);

  if (!partner) return null
    return (
      <ThemeProvider theme={theme}>
        <Container $minHeight={height}>
          <GlobalStyle />
          <Grid>
            <StyledHeader>
              <PartnerSelect />
              <ConnectButton />
            </StyledHeader>
            <LiquidityHubProvider
              settings={{
                ui: {
                  buttonColor: theme.colors.button,
                },
              }}
              provider={provider}
              account={address}
              partner={partner.id}
              chainId={chainId}
            >
              <Outlet />
            </LiquidityHubProvider>
          </Grid>
          <BlockNumber />
        </Container>
      </ThemeProvider>
    );
}

const StyledHeader = styled(FlexRow)`
    justify-content: space-between;
    width: 100%;
`

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
