import { Input, InputProps } from "@chakra-ui/react";
import styled from "styled-components";


export function TextInput(props: InputProps) {
  return <StyledInput {...props} />;
}

const StyledInput = styled(Input)``;