import styled from "styled-components";
import { ReactNode, useState } from "react";
import {
  NumericInput,
  Balance,
  USD,
  Logo,
  NumericInputProps,
  Text,
  TokenModal,
  SwapSubmitButton,
  SwapDetails,
} from "../components";
import { FlexColumn, FlexRow } from "../styles";
import {
  useFromTokenPanelArgs,
  useOnPercentClickCallback,
  useToTokenPanelArgs,
} from "../hooks";
import { useSwapStore } from "../store";
import { ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { TokenPanelProps } from "../type";

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
  return <StyledCard className={className}>{children}</StyledCard>;
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

const StyledPercentButtons = styled(FlexRow)`
  gap: 20px;
  margin-left: auto;
  button {
    background: rgba(255, 255, 255, 0.1);
    padding: 2px 10px;

    border: unset;
    color: ${({ theme }) => theme.colors.textMain};
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const PercentButtons = () => {
  const onClick = useOnPercentClickCallback()

  return (
    <StyledPercentButtons>
      <button onClick={() => onClick(0.25)}>25%</button>
      <button onClick={() => onClick(0.5)}>50%</button>
      <button onClick={() => onClick(0.75)}>75%</button>
      <button onClick={() => onClick(1)}>Max</button>
    </StyledPercentButtons>
  );
};

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

const StyledSubmitButton = styled(SwapSubmitButton)`
  min-height: 48px;
  border-radius: 2px;
  font-weight: 600;
  margin-top: 20px;
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

export const Thena = () => {
  return (
    <Container>
      <Card>
        <Card.Content>
          <FlexColumn style={{ gap: 20, width: "100%" }}>
            <FromTokenPanel />
            <ChangeTokens />
            <ToTokenPanel />
            <StyledSwapDetails />
          </FlexColumn>
          <StyledSubmitButton />
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
  label = "",
  onInputChange,
  inputValue,
  isSrc,
}: TokenPanelProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledTokenPanel>
        <TokenPanelHeader label={label} element={isSrc && <PercentButtons />} />
        <Card>
          <CardContent background="rgb(9 3 51)">
            <FlexRow style={{ width: "100%" }}>
              <TokenInput
                onChange={onInputChange}
                disabled={!isSrc}
                value={inputValue}
              />
              <TokenSelect
                symbol={token?.symbol}
                logoUrl={token?.logoUrl}
                onClick={() => setOpen(true)}
              />
            </FlexRow>

            <Bottom
              usd={<USD value={usd} />}
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

const TokenPanelHeader = ({
  label,
  element,
}: {
  label: string;
  element: ReactNode;
}) => {
  return (
    <StyledTokenPanelHeader>
      <StyledTokenPanelLabel>{label}</StyledTokenPanelLabel>
      {element}
    </StyledTokenPanelHeader>
  );
};

const StyledTokenPanelHeader = styled(FlexRow)`
  width: 100%;
`;

const FromTokenPanel = () => {
  const { token, usd, balance, onInputChange, onSelectToken, inputValue } =
    useFromTokenPanelArgs();

  return (
    <TokenPanel
      token={token}
      usd={usd}
      balance={balance}
      onSelectToken={onSelectToken}
      inputValue={inputValue}
      onInputChange={onInputChange}
      label="From"
      isSrc={true}
    />
  );
};

const ToTokenPanel = () => {
  const { token, usd, balance, inputValue, onSelectToken } =
    useToTokenPanelArgs();
  return (
    <TokenPanel
      token={token}
      usd={usd}
      balance={balance}
      onSelectToken={onSelectToken}
      inputValue={inputValue}
      label="To"
    />
  );
};



const StyledSwapDetails = styled(SwapDetails)`
  background: rgb(9 3 51);
  border-radius: 10px;
  padding: 16px;
  display: flex;
  width: 100%;
  gap: 4px;
  border: 1px solid rgb(9 3 51 / 1);
  border-radius: 3px;
  border: 1px solid #bd00ed;
`;