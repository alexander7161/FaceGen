import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import Link from "../Link";
import { stopWebcamPrediction } from "../../store/classifier";

const TitleContainer = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const SubTitleLink = styled(Link)`
  margin-left: 20px;
`;
/**
 * Title text for appbar.
 */
const Title = () => {
  const dispatch = useDispatch();
  return (
    <TitleContainer>
      <Link to="/" onClick={() => dispatch(stopWebcamPrediction())}>
        <Typography variant="h6">FaceGen</Typography>
      </Link>
      <SubTitleLink to="/predict">
        <Typography variant="subtitle1">Webcam</Typography>
      </SubTitleLink>
    </TitleContainer>
  );
};

export default Title;
