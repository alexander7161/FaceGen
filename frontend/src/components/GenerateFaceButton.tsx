import React from "react";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { generateFace } from "../store/generator";

const GenerateFaceButton = () => {
  const dispatch = useDispatch();

  const generateFaceFunction = () => dispatch(generateFace());
  return (
    <Button onClick={generateFaceFunction} variant="contained" color="primary">
      Generate
    </Button>
  );
};

export default GenerateFaceButton;
