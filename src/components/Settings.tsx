import { SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { createContext, useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { DEFAULT_API_URL, DEFAULT_QUOTE_INTERVAL, DEFAULT_SLIPPAGE } from "../consts";
import { useSettingsParams } from "../hooks";
import {
  FlexColumn,
  StyledInput,
  StyledModalBody,
  StyledModalCloseButton,
  StyledModalContent,
  StyledModalHeader,
} from "../styles";
import { Text } from "./Text";



interface ContextArgs {
  data: {
    apiUrl: string;
    slippage: number;
    quoteInterval: number;
  };
  updateInput: (name: string, value: string) => void;
}

export const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const params = useSettingsParams();
  const [data, setData] = useState({
    apiUrl: params.apiUrl || DEFAULT_API_URL,
    slippage: params.slippage || DEFAULT_SLIPPAGE,
    quoteInterval: params.quoteInterval || DEFAULT_QUOTE_INTERVAL,
  });

  const updateInput = useCallback(
    (name: string, value: string | number) => {
      setData((prev) => ({ ...prev, [name]: value }));
    },
    [setData]
  );

  const _onClose = useCallback(() => {
    onClose();
    setData({
      apiUrl: params.apiUrl,
      slippage: params.slippage,
      quoteInterval: params.quoteInterval,
    });
  }, [params, onClose]);

  const onSave = useCallback(() => {
    const _data = {
      apiUrl: data.apiUrl || DEFAULT_API_URL,
      slippage: data.slippage || DEFAULT_SLIPPAGE,
      quoteInterval: data.quoteInterval || DEFAULT_QUOTE_INTERVAL,

    };
    params.setSettings(_data);
    setData(_data);

    onClose();
  }, [data, params, onClose]);

  return (
    <Context.Provider value={{ data, updateInput }}>
      <StyledButton aria-label="" onClick={onOpen}>
        <SettingsIcon />
      </StyledButton>
      <Modal isOpen={isOpen} onClose={_onClose}>
        <ModalOverlay />
        <StyledModalContent>
          <StyledModalCloseButton />
          <StyledModalHeader>Settings</StyledModalHeader>
          <StyledModalBody>
            <StyledInputs>
              <ApiInput />
              <Slippage />
              <QuoteRefetchInterval />
            </StyledInputs>
            <StyledSubmit onClick={onSave}>Save</StyledSubmit>
          </StyledModalBody>
        </StyledModalContent>
      </Modal>
    </Context.Provider>
  );
};

const StyledInputs = styled(FlexColumn)`
  width: 100%;
  gap: 20px;
`;

const StyledSubmit = styled(Button)`
  width: 100%;
  margin-top: 20px;
`;

const useSettingsContext = () => useContext(Context);

const Context = createContext({} as ContextArgs);

const ApiInput = () => {
  const { data, updateInput } = useSettingsContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInput("apiUrl", e.target.value);
  };

  return (
    <InputContainer>
      <InputLabel>Api URL</InputLabel>
      <StyledInput
        placeholder="API URL"
        type="text"
        value={data.apiUrl || ""}
        onChange={onChange}
      />
    </InputContainer>
  );
};

const Slippage = () => {
  const { data, updateInput } = useSettingsContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInput("slippage", e.target.value);
  };

  return (
    <InputContainer>
      <InputLabel>Slippage</InputLabel>
      <StyledInput
        placeholder="Slippage"
        type="number"
        value={data.slippage || ""}
        onChange={onChange}
        max={100}
      />
    </InputContainer>
  );
};


const QuoteRefetchInterval = () => {
  const { data, updateInput } = useSettingsContext();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateInput("quoteInterval", e.target.value);
  };

  return (
    <InputContainer>
      <InputLabel>Quote refetch interfval {`(milliseconds)`}</InputLabel>
      <StyledInput
        placeholder="Quote Refetch Interval"
        type="number"
        value={data.quoteInterval || ""}
        onChange={onChange}
        max={100}
      />
    </InputContainer>
  );
};


const InputContainer = styled(FlexColumn)`
  align-items: flex-start;
  gap: 5px;
  width: 100%;
`;

const InputLabel = styled(Text)`
  font-size: 14px;
  font-weight: 500;
`;


const StyledButton = styled.button`
  color: ${({ theme }) => theme.colors.textMain};
  margin-right: auto;
  svg {
    width: 25px;
    height: 25px;
  }
`;
