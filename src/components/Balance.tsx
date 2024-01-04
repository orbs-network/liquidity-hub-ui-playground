import styled, { CSSProperties } from 'styled-components'
import { useFormatNumber } from '../hooks';
import { SkeletonLoader } from './SkeletonLoader';
import { Text } from './Text';

interface Props{
    value?: string;
    className?: string;
    css?: CSSProperties;
}


export function Balance({ value, className = '', css = {} }: Props) {
    const balance = useFormatNumber({ value });

  return (
    <Container className={className} style={css}>
      {!balance ? <SkeletonLoader borderRadius={7} width={20} height='18px' />  : <Text> {`Balance: ${balance}`}</Text>}
    </Container>
  );
}



const Container = styled.div`
  font-size: 14px;
`;