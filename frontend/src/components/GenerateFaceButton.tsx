import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateFace } from "../store/generator";
import styled from "styled-components";
import Add from "@material-ui/icons/Add";
import { Fab, CircularProgress } from "@material-ui/core";
import { selectGenerateLoading } from "../store/generator/selectors";
import AbsoluteFab from "./AbsoluteFab";

const AddIcon = styled(Add)`
  margin-right: 4px;
`;

const GenerateFaceButton = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectGenerateLoading);

  const generateFaceFunction = () => dispatch(generateFace());
  return (
    <AbsoluteFab
      onClick={generateFaceFunction}
      variant="extended"
      color="primary"
      disabled={loading}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <AddIcon />
          Generate
        </>
      )}
    </AbsoluteFab>
  );
};

export default GenerateFaceButton;
