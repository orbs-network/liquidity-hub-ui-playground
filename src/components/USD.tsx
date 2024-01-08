import styled, { CSSProperties } from "styled-components";
import { useFormatNumber } from "../hooks";
import { Text } from "./Text";
interface Props {
  className?: string;
  value?: number | string;
  prefix?: string;
  css?: CSSProperties;
}

export function USD({ className, value, prefix = "≈ $ ", css = {} }: Props) {
  const usd = useFormatNumber({ value });
  return (
    <Container className={className} style={css}>
      <Text>{`${prefix}${usd || '0'}`}</Text>
    </Container>
  );
}

const Container = styled.div`
  font-size: 14px;
`;
