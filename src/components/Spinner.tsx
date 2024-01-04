import styled from 'styled-components';
const StyledSpinner = styled.div`
    width: 38px;
    height: 38px;
    border: 4px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
`;

const Container = styled.div`
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Spinner = ({ className = '' }: { className?: string }) => {
  return (
    <Container className={className}>
      <StyledSpinner />
    </Container>
  );
};
