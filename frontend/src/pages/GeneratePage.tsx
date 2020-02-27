import React from "react";
import Faces from "../components/FacesList";
import GenerateFaceButton from "../components/GenerateFaceButton";
import { Container } from "@material-ui/core";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  margin-bottom: 64px;
`;

const GeneratePage = () => {
  return (
    <StyledContainer maxWidth="md">
      <Faces />
      <GenerateFaceButton />
    </StyledContainer>
  );
};

export default GeneratePage;
