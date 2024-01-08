import { useSubmitButton } from "../hooks";
import styled from "styled-components";
import { Spinner } from "@chakra-ui/react";
export const SwapSubmitButton = ({ className = '' }: { className?: string }) => {
  const { disabled, text, onClick, isLoading } = useSubmitButton();

  return (
    <StyledSubmitButton
      className={className}
      $disabled={disabled}
      onClick={onClick ? () => onClick() : () => {}}
    >
      <p style={{ opacity: isLoading ? 0 : 1 }}>{text}</p>
      {isLoading ? (
        <SpinnerContainer>
          <Spinner width={7} height={7} speed="0.65s" />
        </SpinnerContainer>
      ) : null}
    </StyledSubmitButton>
  );
};

const SpinnerContainer = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`


const StyledSubmitButton = styled.button<{ $disabled?: boolean }>`
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "unset")};
  font-size: 16px;
  width: 100%;
  border: unset;
  font-weight: 600;
  margin-top: 20px;
  cursor: ${({ $disabled }) => ($disabled ? "unset" : "pointer")};
  position: relative;
  background: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.buttonDisabled : theme.colors.button};
  color: ${({ $disabled, theme }) =>
    $disabled ? theme.colors.buttonDisabledText : theme.colors.buttonText};
`;