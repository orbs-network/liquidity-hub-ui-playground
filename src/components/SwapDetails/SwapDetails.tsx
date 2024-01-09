import { PriceCompare } from "./PriceCompare";
import styled from "styled-components";
import { Text } from "../Text";
import { FlexColumn, FlexRow } from "../../styles";
import {
  useFormatNumber,
  usePartner,
  useSettingsParams,
  useToAmount,
  useTxEstimateGasPrice,
} from "../../hooks";
import { Logo } from "../Logo";
import { useSwapStore } from "../../store";
import { useMemo, useState } from "react";
import AnimateHeight from "react-animate-height";
import BN from "bignumber.js";

const DetailLabel = styled(Text)`
  font-size: 13px;
`;
const DetailsValueText = styled(Text)`
  font-size: 13px;
`;

const TxGasCost = () => {
  const txGasPrice = useTxEstimateGasPrice();
  const logoUrl = usePartner()?.nativeToken.logoUrl;
  const _txGasPrice = useFormatNumber({ value: txGasPrice });
  return (
    <StyledDetail>
      <DetailLabel>Network cost</DetailLabel>
      <FlexRow style={{ gap: 5 }}>
        <StyledLogo src={logoUrl} />
        <DetailsValueText>{`<$${_txGasPrice}`}</DetailsValueText>
      </FlexRow>
    </StyledDetail>
  );
};

const MinAmountOut = () => {
  const toAmount = useToAmount()?.uiAmount;
  const slippage = useSettingsParams().slippage;
  const symbol = useSwapStore((s) => s.toToken)?.modifiedToken.symbol;
  const minAmountOut = useMemo(() => {
    if (!toAmount || !slippage) return "0";
    return new BN(toAmount)
      .times(100 - slippage)
      .div(100)
      .toString();
  }, [slippage, toAmount]);

  const _minAmountOut = useFormatNumber({ value: minAmountOut });

  return (
    <StyledDetail>
      <DetailLabel>Minimum amout out</DetailLabel>
      <FlexRow style={{ gap: 5 }}>
        <DetailsValueText>{`${_minAmountOut} ${symbol}`}</DetailsValueText>
      </FlexRow>
    </StyledDetail>
  );
};

const StyledLogo = styled(Logo)`
  width: 20px;
  height: 20px;
`;

const StyledDetail = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
`;

const Details = () => {
  return (
    <StyledDetails>
      <TxGasCost />
      <MinAmountOut />
    </StyledDetails>
  );
};

const StyledDetails = styled(FlexColumn)`
  padding-top: 15px;
  border-top: 1px solid ${({ theme }) => theme.colors.borderMain};
  margin-top: 15px;
  gap: 10px;
`;

export function SwapDetails({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const { fromToken, toToken, fromAmount } = useSwapStore((s) => ({
    fromToken: s.fromToken,
    toToken: s.toToken,
    fromAmount: s.fromAmount,
  }));

  if (!fromToken || !toToken || !fromAmount) return null;
  return (
    <StyledSwapDetails className={className}>
      <PriceCompare isOpen={open} onClick={() => setOpen(!open)} />
      <AnimateHeight
        duration={200}
        height={open ? "auto" : 0}
        style={{ width: "100%" }}
      >
        <Details />
      </AnimateHeight>
    </StyledSwapDetails>
  );
}

const StyledSwapDetails = styled(FlexColumn)`
  width: 100%;
`;
