import { Button } from "@chakra-ui/react";
import { useState } from "react";
import styled from "styled-components";
import { PASSWORD } from "../consts";
import { usePersistedStore } from "../store";
import { FlexColumn, StyledInput } from "../styles";
import { Text } from "./Text";
export function Password() {
  const [value, setValue] = useState("");
  const { setPassword } = usePersistedStore((it) => ({
    setPassword: it.setPassword,
  }));

  const onSumit = () => {
    if(!value) {
      alert('Please enter password')
    }
    else if (value === PASSWORD) {
      setPassword(value);
    }
    else{
      alert('Wrong password')
    }
  };
  return (
    <Container>
      <Title>Enter password</Title>
      <StyledInput value={value} onChange={(e) => setValue(e.target.value)} />
      <SubmitButton onClick={onSumit}>Submit</SubmitButton>
    </Container>
  );
}

const SubmitButton = styled(Button)`
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  width: 100%;
`;

const Title = styled(Text)``;

const Container = styled(FlexColumn)`
  width: 100%;
  gap: 15px;
  align-items: flex-start;
  max-width: 500px;
  margin: 0 auto;
`;
