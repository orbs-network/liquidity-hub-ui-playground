/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useMemo, useState } from "react";

import styled from "styled-components";
import { useFromTokenUSDPrice, useToTokenUSDPrice, useFormatNumber, useTxEstimateGasPrice } from "../../hooks";
import { useSwapStore } from "../../store";
import { FlexRow } from "../../styles";
import { Text } from "../Text";


export const PriceCompare = ({ onClick, isOpen }: { onClick: () => void; isOpen: boolean }) => {
  const [invert, setInvert] = useState(false);
  const { fromToken, toToken } = useSwapStore((s) => ({
    fromToken: s.fromToken,
    toToken: s.toToken,
  }));
  const { data: fromTokenUsd } = useFromTokenUSDPrice();
  const { data: toTokenUsd } = useToTokenUSDPrice();

  const leftToken = invert ? toToken : fromToken;
  const rightToken = invert ? fromToken : toToken;

  const leftSideTokenUsd = invert ? toTokenUsd : fromTokenUsd;
  const rightSideTokenUsd = invert ? fromTokenUsd : toTokenUsd;

  const toAmount = useMemo(() => {
    if (!leftSideTokenUsd || !rightSideTokenUsd) return 0;
    return leftSideTokenUsd / rightSideTokenUsd;
  }, [leftSideTokenUsd, rightSideTokenUsd]);

  const rightTokenUsdAmount = useMemo(() => {
    if (!rightSideTokenUsd) return 0;
    return rightSideTokenUsd * toAmount;
  }, [rightSideTokenUsd, toAmount]);

  const _toAmount = useFormatNumber({ value: toAmount });
  const _rightTokenUsdAmount = useFormatNumber({ value: rightTokenUsdAmount });

  const onInvert = (e: any) => {
    e.stopPropagation();
    setInvert(!invert);
  };

  const txGasPrice = useTxEstimateGasPrice();

  const _txGasPrice = useFormatNumber({ value: txGasPrice });

  return (
    <StyledPriceCompare onClick={onClick}>
      <StyledPriceCompareBtn onClick={onInvert}>
        <Text>
          1 {leftToken?.modifiedToken.symbol} = {_toAmount}{" "}
          {rightToken?.modifiedToken.symbol}{" "}
          <span> {`($${_rightTokenUsdAmount})`}</span>
        </Text>
      </StyledPriceCompareBtn>
      <GasPrice>
        {!isOpen && <Text>${_txGasPrice}</Text>}{" "}
        <StyledIcon $transform={isOpen} width={5} height={5} />
      </GasPrice>
    </StyledPriceCompare>
  );
};

const StyledIcon = styled(ChevronDownIcon)<{ $transform: boolean }>`
  transition: 0.2s all;
  transform: ${(props) => (props.$transform ? "rotate(180deg)" : "rotate(0)")};
  color: ${({ theme }) => theme.colors.textMain}!important;
`;

const GasPrice = styled(FlexRow)`
    p {
      font-size: 12px;
    }
`

const StyledPriceCompareBtn = styled.button`
background: transparent;
  p {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    span {
      font-size: 12px;
      opacity: 0.5;
    }
  }
`;
const StyledPriceCompare = styled(FlexRow)`
cursor: pointer;
width: 100%;
justify-content: space-between;
`;
