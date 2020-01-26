import React from "react";
import { Button, Container } from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { goToGeneratePage } from "../store/generator";

const FlexBox = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const HomePage = () => {
  const dispatch = useDispatch();
  return (
    <Container maxWidth="md">
      <FlexBox>
        <Button
          onClick={() => dispatch(goToGeneratePage())}
          variant="contained"
          color="primary"
        >
          Generate a face
        </Button>
      </FlexBox>
    </Container>
  );
};

export default HomePage;
