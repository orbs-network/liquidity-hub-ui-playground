import styled, { CSSProperties } from 'styled-components';
import { Text } from './Text';
interface Props {
  className?: string;
  value?: string;
  prefix?: string;
  css?: CSSProperties;
}

export function USD({ className, value, prefix = '≈ $ ', css = {} }: Props) {
  return (
    <Container className={className} style={css}>
      <Text>{`${prefix}${value}`}</Text>
    </Container>
  );
}

const Container = styled.div`
  font-size: 14px;
`;
