import React from "react";
import Link from "../components/Link";
import { Button, Container } from "@material-ui/core";
import styled from "styled-components";

const FlexBox = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const HomePage = () => {
  return (
    <Container maxWidth="md">
      <FlexBox>
        <Link to="/generate">
          <Button variant="contained" color="primary">
            Generate a face
          </Button>
        </Link>
      </FlexBox>
    </Container>
  );
};

export default HomePage;
