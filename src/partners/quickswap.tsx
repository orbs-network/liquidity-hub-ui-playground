import { useState } from "react";
import {
  useFormatNumber,
  useFromTokenBalance,
  useOnPercentClickCallback,
  useSubmitButton,
  useToAmount,
  useToTokenBalance,
} from "../hooks";
import { useSwapStore } from "../store";
import { Token, TokenPanelProps } from "../type";
import { ArrowDownIcon } from "@chakra-ui/icons";

import styled from "styled-components";
import { FlexColumn, FlexRow } from "../styles";
import {
  Balance,
  Logo,
  NumericInput,
  Spinner,
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

const PercentButtons = ({ onClick }: { onClick: (value: number) => void }) => {
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
`;

export const TokenSelect = ({
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

const StyledSubmitButton = styled.button<{ $disabled?: boolean }>`
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "unset")};
  background: ${({ $disabled, theme }) =>
    $disabled
      ? "linear-gradient(180deg, #252833, #1d212c)"
      : theme.colors.button};
  min-height: 52px;
  border-radius: 10px;
  font-size: 16px;
  border: unset;
  color: ${({ $disabled }) => ($disabled ? "#696c80" : "white")};
  font-weight: 600;
  margin-top: 20px;
  cursor: ${({ $disabled }) => ($disabled ? "unset" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  position: relative;
`;

export function Quickswap() {
  return (
    <StyledContainer>
      <FromTokenPanel />
      <ChangeTokens />
      <ToTokenPanel />
      <SubmitButton />
    </StyledContainer>
  );
}
const SubmitButton = () => {
  const { disabled, text, onClick, isLoading } = useSubmitButton();

  return (
    <StyledSubmitButton
      $disabled={disabled}
      onClick={onClick ? () => onClick() : () => {}}
    >
      <p style={{ opacity: isLoading ? 0 : 1 }}>{text}</p>
      {isLoading ? <Spinner /> : null}
    </StyledSubmitButton>
  );
};

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
  const onPercentClick = useOnPercentClickCallback();

  return (
    <TokenPanel
      token={fromToken}
      usd=""
      balance={balance}
      onSelectToken={onFromTokenChange}
      onPercentClick={onPercentClick}
      inputValue={fromAmount}
      onInputChange={onFromAmountChange}
      label="From"
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
      inputDisabled={true}
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
  onPercentClick,
  inputValue,
  onInputChange,
  token,
  inputDisabled,
  label,
}: TokenPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTokenPanel>
        <StyledTop>
          <Text>{label}</Text>
          {onPercentClick && <PercentButtons onClick={onPercentClick} />}
        </StyledTop>
        <FlexRow style={{ width: "100%" }}>
          <TokenSelect
            symbol={token?.modifiedToken?.symbol}
            logoUrl={token?.modifiedToken?.logoUrl}
            onClick={() => setOpen(true)}
          />
          <StyledInput
            onChange={onInputChange}
            disabled={inputDisabled}
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
      <Modal
        onTokenSelect={onSelectToken}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

const Modal = ({
  open,
  onClose,
  onTokenSelect,
}: {
  open: boolean;
  onClose: () => void;
  onTokenSelect: (token: Token) => void;
}) => {
  return (
    <TokenModal onTokenSelect={onTokenSelect} open={open} onClose={onClose} />
  );
};
