import styled from "styled-components";
import { ReactNode, useState } from "react";
import {
  NumericInput,
  Balance,
  USD,
  Logo,
  NumericInputProps,
  Spinner,
  Text,
  TokenModal,
} from "../components";
import { FlexColumn, FlexRow } from "../styles";
import { TokenPanelProps } from "../type";
import {
  useFromTokenBalance,
  useOnPercentClickCallback,
  useSubmitButton,
  useToAmount,
  useToTokenBalance,
} from "../hooks";
import { useSwapStore } from "../store";
import { ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";

const StyledChangeTokens = styled(FlexRow)`
  width: 100%;
  justify-content: center;

  button {
    cursor: pointer;
    position: relative;
    background: transparent;
    border: unset;
    width: 50px;
    height: 50px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(255 255 255 / 0.08);
  }
  svg {
    color: ${({ theme }) => theme.colors.textMain};
  }
`;

const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <StyledCard className={className}>
      {children}
    </StyledCard>
  );
};

const CardContent = ({
  children,
  className,
  background = "transparent linear-gradient(90deg, #1d023b, #17023e) 0 0 no-repeat padding-box",
}: {
  children: ReactNode;
  className?: string;
  background?: string;
}) => {
  return (
    <StyledCardContent $background={background} className={className}>
      {children}
    </StyledCardContent>
  );
};


Card.Content = CardContent;

const ChangeTokens = () => {
  const onClick = useSwapStore((store) => store.onSwitchTokens);
  return (
    <StyledChangeTokens>
      <button onClick={onClick}>
        <ArrowDownIcon fontSize={26} />
      </button>
    </StyledChangeTokens>
  );
};

const StyledTokenSelect = styled(FlexRow)<{ $selected: boolean }>`
  gap: 0px;
  cursor: pointer;
  color: white;
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
      {logoUrl && <StyledLogo src={logoUrl} />}
      <StyledTokenSelectSymbol>
        {symbol || "Select token"}
      </StyledTokenSelectSymbol>
      <ChevronDownIcon fontSize={22} />
    </StyledTokenSelect>
  );
};

const StyledTokenSelectSymbol = styled(Text)`
  font-size: 14px;
  font-weight: 500;
  margin-left: 6px;
`;

const StyledLogo = styled(Logo)`
  width: 30px;
  height: 30px;
`;

const StyledInput = styled(NumericInput)`
  width: 100%;

  input {
    font-size: 20px;
    text-align: left;
    color: white;
  }
`;

const TokenInput = (props: NumericInputProps) => {
  return <StyledInput {...props} placeholder="0.00" />;
};

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const Container = ({ children }: { children: ReactNode }) => {
  return <StyledContainer>{children}</StyledContainer>;
};
const StyledTokenPanelLabel = styled(Text)``;

const StyledBottom = styled(FlexRow)`
  width: 100%;
  justify-content: space-between;
`;

const Bottom = ({ usd, balance }: { usd: ReactNode; balance: ReactNode }) => {
  return (
    <StyledBottom>
      {usd}
      {balance}
    </StyledBottom>
  );
};

const StyledSubmitButton = styled.button<{ $disabled?: boolean }>`
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "unset")};
  background: ${({ $disabled, theme }) =>
    $disabled ? "#65547E" : theme.colors.button};
  min-height: 48px;
  border-radius: 2px;
  font-size: 16px;
  width: 100%;
  border: unset;
  color: ${({ $disabled }) => ($disabled ? "rgb(9 3 51)" : "white")};
  font-weight: 600;
  margin-top: 20px;
  cursor: ${({ $disabled }) => ($disabled ? "unset" : "pointer")};
  position: relative;
`;

const StyledCard = styled.div`
  background: transparent linear-gradient(128deg, #ed00c9, #bd00ed) 0 0
    no-repeat padding-box;
  border-radius: 10px;
  padding: 1px;
  border-radius: 3px;
  width: 100%;
`;

const StyledCardContent = styled(FlexColumn)<{ $background: string }>`
  background: ${({ $background }) => $background};
  border-radius: 10px;
  padding: 16px;
  display: flex;
  width: 100%;
  gap: 4px;
  border: 1px solid rgb(9 3 51 / 1);
  border-radius: 3px;
`;

const StyledTokenPanel = styled(FlexColumn)`
  width: 100%;
  align-items: flex-start;
  gap: 10px;
`;

const SubmitButton = () => {
  const { disabled, text, onClick, isLoading } = useSubmitButton();

  return (
    <StyledSubmitButton
      $disabled={disabled}
      onClick={onClick ? () => onClick() : () => {}}
    >
      <p style={{ opacity: isLoading ? 0 : 1 }}>{text}</p>
      {isLoading ? <Spinner  /> : null}
    </StyledSubmitButton>
  );
};

export const Thena = () => {
  return (
    <Container>
      <Card>
        <Card.Content>
          <FlexColumn style={{ gap: 20, width: "100%" }}>
            <FromTokenPanel />
            <ChangeTokens />
            <ToTokenPanel />
          </FlexColumn>
          <SubmitButton />
        </Card.Content>
      </Card>
    </Container>
  );
};

const TokenPanel = ({
  token,
  onSelectToken,
  usd,
  balance,
  label,
  onInputChange,
  inputDisabled,
  inputValue,
}: TokenPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTokenPanel>
        <StyledTokenPanelLabel>{label}</StyledTokenPanelLabel>
        <Card>
          <CardContent background="rgb(9 3 51)">
            <FlexRow style={{ width: "100%" }}>
              <TokenInput
                onChange={onInputChange}
                disabled={inputDisabled}
                value={inputValue}
              />
              <TokenSelect
                symbol={token?.modifiedToken?.symbol}
                logoUrl={token?.modifiedToken?.logoUrl}
                onClick={() => setOpen(true)}
              />
            </FlexRow>

            <Bottom
              usd={<USD value={usd || ""} />}
              balance={<Balance value={balance} />}
            />
          </CardContent>
        </Card>
      </StyledTokenPanel>
      <TokenModal
        onTokenSelect={onSelectToken}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
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
  const { data: balance } = useToTokenBalance();

  const toAmount = useToAmount();
  return (
    <TokenPanel
      token={toToken}
      usd=""
      balance={balance}
      onSelectToken={onToTokenChange}
      inputValue={toAmount}
      inputDisabled={true}
      label="To"
    />
  );
};
