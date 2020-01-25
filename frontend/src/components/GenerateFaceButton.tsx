import React from "react";
import { useDispatch } from "react-redux";
import { generateFace } from "../store/generator";
import styled from "styled-components";
import Add from "@material-ui/icons/Add";
import { Fab } from "@material-ui/core";

const AddIcon = styled(Add)`
  margin-right: 4px;
`;

const AbsoluteFab = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 16px;
`;

const GenerateFaceButton = () => {
  const dispatch = useDispatch();

  const generateFaceFunction = () => dispatch(generateFace());
  return (
    <AbsoluteFab
      onClick={generateFaceFunction}
      variant="extended"
      color="primary"
    >
      <AddIcon />
      Generate
    </AbsoluteFab>
  );
};

export default GenerateFaceButton;
