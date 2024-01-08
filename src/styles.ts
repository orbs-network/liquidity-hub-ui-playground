import { ModalBody, ModalCloseButton, ModalContent, ModalHeader } from "@chakra-ui/react";
import styled from "styled-components";

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;



export const StyledModalContent = styled(ModalContent)`
  background-color: ${({ theme }) => theme.colors.modalBackground}!important;
  border: unset;
`;

export const StyledModalHeader = styled(ModalHeader)`
  background-color: ${({ theme }) => theme.colors.modalBackground}!important;
  color: ${({ theme }) => theme.colors.textMain};
`;

export const StyledModalBody = styled(ModalBody)`
  background-color: ${({ theme }) => theme.colors.modalBackground}!important;
  border: unset;
`;


export const StyledModalCloseButton = styled(ModalCloseButton)`
    color: ${({ theme }) => theme.colors.textMain};
`