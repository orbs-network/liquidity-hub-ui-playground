import { useMemo } from "react";
import { useGasPriceQuery } from "../hooks";
import styled from "styled-components";
import { FlexRow } from "../styles";
import { Text } from "./Text";
import { GasIcon } from "../assets/svg/gas";
import { useAccount } from "wagmi";
import { useFormatNumber } from "@orbs-network/liquidity-hub-ui-sdk";

const useGasPriceUi = () => {
  const { data } = useGasPriceQuery();

  const price = useMemo(() => {
    if (!data) return undefined;
    const value = data.med.max.dividedBy(1e9);
    return value.toString();
  }, [data]);

  return useFormatNumber({ value: price});
};

export function GasPrice() {
  const gasPrice = useGasPriceUi();
  const { address } = useAccount();
  if (!address) return null;
  return (
    <Container>
      <GasIcon />
      <Text>{gasPrice}</Text>
    </Container>
  );
}

const Container = styled(FlexRow)`
  gap: 6px;
  p {
    font-size: 14px;
    font-weight: 500;
  }
  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`;
