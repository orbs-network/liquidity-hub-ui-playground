import { useAddedTokens } from "../../hooks";
import { PerstistdStoreToken, usePersistedStore } from "../../store";
import styled from "styled-components";
import { StyledListToken } from "./styles";
import { FlexColumn, FlexRow } from "../../styles";
import { Logo } from "../Logo";

const StyledManageTokens = styled(FlexColumn)({
  flex: 1,
  overflowY: "auto",
});

export const ManageAddedTokens = ({ chainId }: { chainId?: number }) => {
  const addedTokens = useAddedTokens(chainId);
  const { removeToken } = usePersistedStore();

  return (
    <StyledManageTokens>
      {!addedTokens || !addedTokens.length ? (
        <p style={{ textAlign: "center", width: "100%" }}>No tokens</p>
      ) : (
        addedTokens.map((t: PerstistdStoreToken) => {
          return (
            <StyledListToken key={t.address}>
              <FlexRow style={{ justifyContent: "space-between" }}>
                <FlexRow
                  style={{
                    width: "unset",
                    flex: 1,
                    justifyContent: "flex-start",
                  }}
                >
                  <Logo
                    src={t.logoUrl}
                    alt={t.symbol}
                    imgStyle={{
                      width: 30,
                      height: 30,
                    }}
                  />
                  {t.symbol}
                </FlexRow>
                <button onClick={() => removeToken(chainId!, t)}>click</button>
              </FlexRow>
            </StyledListToken>
          );
        })
      )}
    </StyledManageTokens>
  );
};
