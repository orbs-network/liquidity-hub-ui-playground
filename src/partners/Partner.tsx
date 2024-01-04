import { usePartner } from "../hooks";
import { Quickswap } from "./quickswap";
import { Navigate } from "react-router-dom";
import styled from "styled-components";
import { Thena } from "./thena";

function Content() {
  const partner = usePartner();

  if (partner?.id === "quickswap") {
    return <Quickswap />;
  }

  if (partner?.id === "thena") {
    return <Thena />;
  }

  return <Navigate to={"/quickswap"} />;
}

export const Partner = () => {
  return (
    <Container>
      <Content />
    </Container>
  );
};

const Container = styled.div`
   margin-top: 50px;
`;
