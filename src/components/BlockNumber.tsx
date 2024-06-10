import { useBlockNumber } from "wagmi";
import styled from "styled-components";
import { Text } from "./Text";
import { useChainId } from "../hooks";
export function BlockNumber() {
  const chainId = useChainId()
  
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
