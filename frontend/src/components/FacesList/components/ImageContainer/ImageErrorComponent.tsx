import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";

const ErrorContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Component to show when there has been a face generation error.
 */
const ImageErrorComponent = () => (
  <ErrorContainer>
    <Typography variant="h3">Error</Typography>
  </ErrorContainer>
);

export default ImageErrorComponent;
