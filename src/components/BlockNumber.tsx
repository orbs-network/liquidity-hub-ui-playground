import { useBlockNumber, useNetwork } from "wagmi";
import styled from "styled-components";
import { Text } from "./Text";
export function BlockNumber() {
  const chainId = useNetwork().chain?.id;
  
  const { data: block } = useBlockNumber({ chainId, watch: true });
  return (
    <Container>
      <Text>{block?.toString()}</Text>
    </Container>
  );
}

const Container = styled.div`
  color: ${({ theme }) => theme.colors.text};
  position: fixed;
  bottom: 10px;
  right: 10px;
  p {
    font-size: 12px;
    font-weight: 500;
  }
`;
