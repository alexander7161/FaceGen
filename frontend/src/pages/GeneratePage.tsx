import React from "react";
import Faces from "../components/FacesList";
import GenerateFaceButton from "../components/GenerateFaceButton";
import { Container } from "@material-ui/core";

const GeneratePage = () => {
  return (
    <Container maxWidth="md">
      <Faces />
      <GenerateFaceButton />
    </Container>
  );
};

export default GeneratePage;
