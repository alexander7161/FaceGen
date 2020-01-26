import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { generateFace } from "../store/generator";
import styled from "styled-components";
import Add from "@material-ui/icons/Add";
import { Fab, CircularProgress } from "@material-ui/core";
import { selectGenerateLoading } from "../store/generator/selectors";

const AddIcon = styled(Add)`
  margin-right: 4px;
`;

const AbsoluteFab = styled(Fab)`
  position: fixed;
  bottom: 24px;
  right: 16px;
  min-width: 100px;
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
