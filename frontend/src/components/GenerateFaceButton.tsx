import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateFace } from "../store/generator";
import styled from "styled-components";
import Add from "@material-ui/icons/Add";
import { CircularProgress } from "@material-ui/core";
import { selectGenerateLoading } from "../store/generator/selectors";
import FixedFab from "./FixedFab";

const AddIcon = styled(Add)`
  margin-right: 4px;
`;

/**
 * Button to generate a new face.
 * Is displayed fixed at bottom right of screen.
 * While generate is loading a spinner is shown.
 */
const GenerateFaceButton = () => {
  const dispatch = useDispatch();
  const loading = useSelector(selectGenerateLoading);

  const generateFaceFunction = () => dispatch(generateFace());

  return (
    <FixedFab
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
    </FixedFab>
  );
};

export default GenerateFaceButton;
