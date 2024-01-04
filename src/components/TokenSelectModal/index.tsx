/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CSSProperties,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from "react";
import styled, { useTheme } from "styled-components";
import { useBalances, useFormatNumber, useTokens } from "../../hooks";
import {
  PerstistdStoreToken,
  usePersistedStore,
  useSwapStore,
} from "../../store";
import { Logo } from "../Logo";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Token } from "../../type";
import { FlexRow } from "../../styles";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  IconButton,
  Fade,
  Skeleton,
} from "@chakra-ui/react";
import { StyledListToken } from "./styles";
import { useNetwork } from "wagmi";
import { eqIgnoreCase } from "@defi.org/web3-candies";
import { TokenSearchInput } from "./SearchInput";
import { AddToken } from "./AddToken";
import { ManageAddedTokens } from "./ManageTokens";
import { ArrowBackIcon, EditIcon, PlusSquareIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { Text } from "../Text";

enum TokenListView {
  DEFAULT,
  ADD_TOKEN,
  MANAGE_TOKENS,
}

const filterTokens = (list: Token[], filterValue: string) => {
  if (!filterValue) return list;

  return list.filter((it) => {
    return (
      it.modifiedToken.symbol
        .toLowerCase()
        .indexOf(filterValue.toLowerCase()) >= 0 ||
      it.modifiedToken.address
        .toLowerCase()
        .indexOf(filterValue.toLowerCase()) >= 0
    );
  });
};

const Row = (props: any) => {
  const { index, style, data } = props;
  const token: Token = data.tokens[index];
  const { balance } = useBalances(token);
  const _balance = useFormatNumber({ value: balance, decimalScale: 4 });
  const { fromToken, toToken } = useSwapStore((store) => {
    return {
      fromToken: store.fromToken,
      toToken: store.toToken,
    };
  });

  const onSelect = useCallback(() => {
    data.onTokenSelect(token);
    data.onClose();
  }, [data, token]);

  if (!token) return null;

  const disabled =
    eqIgnoreCase(
      token.modifiedToken.address,
      fromToken?.modifiedToken?.address || ""
    ) ||
    eqIgnoreCase(
      token.modifiedToken.address,
      toToken?.modifiedToken.address || ""
    );
  return (
    <div style={style}>
      <StyledListToken onClick={onSelect} $disabled={disabled}>
        <FlexRow
          style={{
            width: "unset",
            flex: 1,
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <Logo
            src={token.modifiedToken.logoUrl}
            alt={token.modifiedToken.symbol}
            imgStyle={{
              width: 30,
              height: 30,
            }}
          />
          {token.modifiedToken.symbol}
        </FlexRow>
        {_balance ? (
          <StyledBalance>{_balance}</StyledBalance>
        ) : (
          <Skeleton
            variant="text"
            startColor="rgba(255,255,255,0.2)"
            endColor="rgba(255,255,255,0.1)"
            width={"50px"}
            height={"15px"}
          />
        )}
      </StyledListToken>
    </div>
  );
};

const StyledBalance = styled(Text)`
  font-size: 14px;
`

export function TokenModal({
  open,
  onClose,
  onTokenSelect,
}: {
  open: boolean;
  onClose: () => void;
  onTokenSelect: (token: any) => void;
}) {
  const { data: tokens } = useTokens();
  const [filterValue, setFilterValue] = useState("");
  const [view, setView] = useState(TokenListView.DEFAULT);
  const addToken = usePersistedStore((store) => store.addToken);
  const chainId = useNetwork().chain?.id;
  const theme = useTheme();
  const onAddToken = (token: PerstistdStoreToken) => {
    setView(TokenListView.DEFAULT);
    addToken(chainId!, token);
  };

  const filteredTokens = useMemo(
    () => filterTokens(tokens, filterValue),
    [filterValue, tokens]
  );

  const itemData = useMemo(() => {
    return { tokens: filteredTokens, onClose, onTokenSelect };
  }, [filteredTokens, onClose, onTokenSelect]);

  const modalBG = theme?.colors.modalBackground;

  return (
    <Modal onClose={onClose} isOpen={open}>
      <ModalOverlay />
      <ModalContent background={modalBG}>
        <ModalHeader background={modalBG} color="white">
          Select a token
        </ModalHeader>
        <ModalBody background={modalBG} padding="0px">
          <StyledContent>
            {view === TokenListView.DEFAULT && (
              <StyledTop>
                <TokenSearchInput
                  setValue={setFilterValue}
                  value={filterValue}
                />
                <FlexRow style={{ gap: 10 }}>
                  <Tooltip label="Add custom token">
                    <IconButton
                      _hover={{ background: "transparent" }}
                      background="transparent"
                      aria-label=""
                      onClick={() => setView(TokenListView.ADD_TOKEN)}
                      icon={<PlusSquareIcon fontSize="20px" color="white" />}
                    />
                  </Tooltip>
                  <Tooltip label="Manage custom tokens">
                    <IconButton
                      _hover={{ background: "transparent" }}
                      background="transparent"
                      aria-label=""
                      onClick={() => setView(TokenListView.MANAGE_TOKENS)}
                      icon={<EditIcon color="white" fontSize="20px" />}
                    />
                  </Tooltip>
                </FlexRow>
              </StyledTop>
            )}

            {view !== TokenListView.DEFAULT && (
              <StyledListBackBtn
                onClick={() => setView(TokenListView.DEFAULT)}
                aria-label=""
                icon={<ArrowBackIcon />}
              />
            )}
            <ModalCloseButton color="white" />

            {view === TokenListView.ADD_TOKEN && (
              <FadeContainer>
                <AddToken onAddToken={onAddToken} />
              </FadeContainer>
            )}
            {view === TokenListView.MANAGE_TOKENS && (
              <FadeContainer>
                <ManageAddedTokens />
              </FadeContainer>
            )}
            {view === TokenListView.DEFAULT && (
              <FadeContainer style={{ paddingTop: 10 }}>
                <AutoSizer>
                  {({ height, width }: any) => (
                    <List
                      overscanCount={5}
                      className="List"
                      itemData={itemData}
                      height={height || 0}
                      itemCount={filteredTokens?.length}
                      itemSize={50}
                      width={width || 0}
                    >
                      {Row}
                    </List>
                  )}
                </AutoSizer>
              </FadeContainer>
            )}
          </StyledContent>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const StyledTop = styled(FlexRow)`
  padding: 0px 10px;
`;

const StyledListBackBtn = styled(IconButton)`
  margin-right: auto;
`;

export const StyledContent = styled.div({
  display: "flex",
  flexDirection: "column",
  maxHeight: "90vh",
  height: "700px",
  padding: 0,
  width: "100%",
  margin: 0,
  overflow: "hidden",
  color: "white",
});

const FadeContainer = ({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <Fade
      in
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        ...style,
        overflow: "auto",
      }}
    >
      {children}
    </Fade>
  );
};

export const StyledTokensList = styled.div`
  flex: 1;
  display: flex;
  overflow: auto;
  width: 100%;
  padding-top: 10px;
`;
