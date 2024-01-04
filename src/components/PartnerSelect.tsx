import {
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
} from "@chakra-ui/react";
import { usePartner } from "../hooks";
import { FlexColumn, FlexRow } from "../styles";
import styled from "styled-components";
import { DappConfig } from "../type";
import { Text } from "./Text";
import { partners } from "../config";
import { Logo } from "./Logo";
import { useNavigate } from "react-router-dom";
import { useSwapStore } from "../store";
export function PartnerSelect() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <StyledMenuButton onClick={onOpen}>
        <Selected />
      </StyledMenuButton>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <StyleDrawerContent>
            <StyledPartnersList>
              {Object.keys(partners).map((key) => {
                return (
                  <Partner
                    onClose={onClose}
                    id={key}
                    key={key}
                    partner={partners[key]}
                  />
                );
              })}
            </StyledPartnersList>
          </StyleDrawerContent>
        </DrawerContent>
      </Drawer>
    </>
  );
}


const StyledMenuButton = styled.button`
  background: ${({ theme }) => theme.colors.button};
  padding: 8px 20px;
  width: fit-content;
  color: white;
  border-radius: 10px;
`;

const StyledPartnersList = styled(FlexColumn)`
  padding-top: 20px;
  gap: 0px;
  align-items: flex-start;
`;

const Partner = ({
  partner,
  id,
  onClose,
}: {
  partner: DappConfig;
  id: string;
  onClose: () => void;
}) => {
  const navigate = useNavigate();
  const reset = useSwapStore(store => store.reset)

  const onClick = () => {
    onClose();
    navigate(`/${id}`);
    reset();
  };
  return (
    <StyledPartner onClick={onClick}>
      <StyledLogo src={partner.logo} />
      <StyledPartnerName>{partner.name}</StyledPartnerName>
    </StyledPartner>
  );
};

const StyledPartnerName = styled(Text)`
  font-size: 17px;
  font-weight: 500;
`;

const StyledLogo = styled(Logo)`
  width: 30px;
  height: 30px;
`;
const StyledPartner = styled(FlexRow)`
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 15px 0px;
 
`;

const StyleDrawerContent = styled(DrawerBody)`
  background: ${({ theme }) => theme.colors.modalBackground};
  color: ${({ theme }) => theme.colors.textMain};
`;

const Selected = () => {
  const partner = usePartner();

  return (
    <StyledSelected>
      <StyledSelectedLogo src={partner?.logo} />
      <Text>{partner?.name}</Text>
    </StyledSelected>
  );
};


const StyledSelectedLogo = styled(Logo)`
    width: 30px;
    height: 30px;
`

const StyledSelected = styled(FlexRow)`
    gap: 10px;
   p {
    font-size: 17px;
    font-weight: 600;
    color: white;
   }
`