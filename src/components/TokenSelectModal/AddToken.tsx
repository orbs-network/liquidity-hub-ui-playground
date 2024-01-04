/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import styled from "styled-components";
import { Button } from "@chakra-ui/react";
import { FlexColumn } from "../../styles";
import { TextInput } from "../TextInput";
import { PerstistdStoreToken } from "../../store";
export const AddToken = ({
  onAddToken,
}: {
  onAddToken: (token: PerstistdStoreToken) => void;
}) => {
  const [data, setData] = useState({
    address: "",
    symbol: "",
    decimals: 18,
    logoUrl: "",
  } as PerstistdStoreToken);

  const onChange = (e: any) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const _onSubmit = () => {
    if (!data.address || !data.symbol || !data.decimals) {
      alert("Please fill all fields");
      return;
    }
    onAddToken(data);
  };

  return (
    <StyledAddToken>
      <StyledAddTokenInput
        placeholder="Address"
        name="address"
        value={data["address"]}
        onChange={onChange}
      />
      <StyledAddTokenInput
        placeholder="Symbol"
        name="symbol"
        value={data["symbol"]}
        onChange={onChange}
      />
      <StyledAddTokenInput
        placeholder="Decimals"
        name="decimals"
        type="number"
        value={data["decimals"]}
        onChange={onChange}
      />
      <StyledAddTokenInput
        placeholder="Logo"
        name="logoUrl"
        value={data["logoUrl"]}
        onChange={onChange}
      />
      <StyledSubmitBtn onClick={_onSubmit}>Submit</StyledSubmitBtn>
    </StyledAddToken>
  );
};

const StyledSubmitBtn = styled(Button)({
  marginLeft: "auto",
  marginRight: "auto",
});

const StyledAddToken = styled(FlexColumn)({
  padding: 10,
  gap: 20,
});

const StyledAddTokenInput = styled(TextInput)({
  width: "100%",
});
