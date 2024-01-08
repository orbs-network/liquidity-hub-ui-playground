import { useState } from "react";
import {
  useFormatNumber,
  useFromTokenBalance,
  useOnPercentClickCallback,
  useToAmount,
  useToTokenBalance,
} from "../hooks";
import { useSwapStore } from "../store";
import { TokenPanelProps } from "../type";
import { ArrowDownIcon } from "@chakra-ui/icons";

import styled from "styled-components";
import { FlexColumn, FlexRow } from "../styles";
import {
  Balance,
  Logo,
  NumericInput,
  SwapSubmitButton,
  Text,
  TokenModal,
  USD,
} from "../components";
import { IconButton } from "@chakra-ui/react";

const StyledChangeTokens = styled(FlexRow)`
  height: 8px;
  width: 100%;
  justify-content: center;

  button {
    cursor: pointer;
    position: relative;
    background: transparent;
    border: unset;
    border-radius: 50%;
    border: 8px solid rgb(40, 45, 61);
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(105, 108, 128);
  }
  svg {
    color: #282d3d;
    width: 14px;
  }
`;

const StyledPercentButtons = styled(FlexRow)`
  gap: 20px;
  button {
    background: transparent;

    border: unset;
    color: ${({ theme }) => theme.colors.primary};
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
  }
`;

const PercentButtons = () => {
  const onClick = useOnPercentClickCallback();

  return (
    <StyledPercentButtons>
      <button onClick={() => onClick(0.5)}>50%</button>
      <button onClick={() => onClick(1)}>Max</button>
    </StyledPercentButtons>
  );
};

const StyledTokenSelect = styled(FlexRow)<{ $selected: boolean }>`
  width: fit-content;
  padding: 8px 13px 8px 8px;
  border-radius: 38px;
  height: 40px;
  gap: 10px;
  cursor: pointer;
  background: ${({ $selected }) =>
    $selected
      ? "rgb(64, 69, 87)"
      : "linear-gradient(105deg, rgb(68, 138, 255) 3%, rgb(0, 76, 230))"};

  p {
    color: white;
  }
`;

const TokenSelect = ({
  symbol,
  logoUrl,
  onClick,
}: {
  symbol?: string;
  logoUrl?: string;
  onClick: () => void;
}) => {
  return (
    <StyledTokenSelect $selected={!!symbol} onClick={onClick}>
      {logoUrl && <Logo src={logoUrl} />}
      <Text>{symbol || "Select token"}</Text>
    </StyledTokenSelect>
  );
};

const StyledInput = styled(NumericInput)`
  width: 100%;

  input {
    font-size: 24px;
    text-align: right;
    color: white;
  }
`;

const StyledContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
  background-color: #1b1e29;
  padding: 24px;
  border-radius: 20px;
`;

const StyledSubmitButton = styled(SwapSubmitButton)`
  min-height: 52px;
  border-radius: 10px;
  font-size: 16px;
  border: unset;
  position: relative;
`;

export function Quickswap() {
  console.log("quick");

  return (
    <StyledContainer>
      <FromTokenPanel />
      <ChangeTokens />
      <ToTokenPanel />
      <StyledSubmitButton />
    </StyledContainer>
  );
}

const ChangeTokens = () => {
  const onSwitchTokens = useSwapStore((store) => store.onSwitchTokens);
  return (
    <StyledChangeTokens>
      <IconButton
        onClick={onSwitchTokens}
        aria-label=""
        icon={<ArrowDownIcon />}
      />
    </StyledChangeTokens>
  );
};

const FromTokenPanel = () => {
  const { onFromAmountChange, onFromTokenChange, fromAmount, fromToken } =
    useSwapStore();
  const { data: balance } = useFromTokenBalance();

  return (
    <TokenPanel
      token={fromToken}
      usd=""
      balance={balance}
      onSelectToken={onFromTokenChange}
      inputValue={fromAmount}
      onInputChange={onFromAmountChange}
      label="From"
      isSrc={true}
    />
  );
};

const ToTokenPanel = () => {
  const { onToTokenChange, toToken } = useSwapStore();
  const { data } = useToTokenBalance();
  const balance = useFormatNumber({ value: data });

  const toAmount = useToAmount();
  return (
    <TokenPanel
      token={toToken}
      usd=""
      balance={balance || "0"}
      onSelectToken={onToTokenChange}
      inputValue={toAmount}
      label="To"
    />
  );
};

const StyledTop = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
`;

const StyledTokenPanel = styled(FlexColumn)`
  background-color: #232734;
  border-radius: 10px;
  padding: 16px;
  gap: 16px;
`;

const TokenPanel = ({
  usd,
  balance,
  onSelectToken,
  inputValue,
  onInputChange,
  token,
  label,
  isSrc,
}: TokenPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTokenPanel>
        <StyledTop>
          <Text>{label}</Text>
          {isSrc && <PercentButtons />}
        </StyledTop>
        <FlexRow style={{ width: "100%", gap: 12 }}>
          <TokenSelect
            symbol={token?.modifiedToken?.symbol}
            logoUrl={token?.modifiedToken?.logoUrl}
            onClick={() => setOpen(true)}
          />
          <StyledInput
            onChange={onInputChange}
            disabled={!isSrc}
            value={inputValue}
            placeholder="0.00"
          />
        </FlexRow>
        <FlexRow
          style={{
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Balance value={balance} />
          <USD value={usd} />
        </FlexRow>
      </StyledTokenPanel>
      <TokenModal
        onTokenSelect={onSelectToken}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};
