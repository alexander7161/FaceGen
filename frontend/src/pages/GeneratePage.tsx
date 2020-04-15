import React from "react";
import Faces from "../components/FacesList/index";
import GenerateFaceButton from "../components/GenerateFaceButton";
import { Container } from "@material-ui/core";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  margin-bottom: 64px;
`;

/**
 * Generate page for generating new faces.
 * Faces diplays the faces in a grid.
 * Generate Face Button generates a new face on click.
 */
const GeneratePage = () => {
  return (
    <StyledContainer maxWidth="md">
      <Faces />
      <GenerateFaceButton />
    </StyledContainer>
  );
};

export default GeneratePage;
