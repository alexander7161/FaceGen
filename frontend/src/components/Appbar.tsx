import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle, deleteUser } from "../store/user";
import { userSelector } from "../store/user/selectors";
import Link from "./Link";
import { stopWebcamPrediction } from "../store/classifier";

const TitleContainer = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: row;
  align-items: baseline;
`;

const SubTitleLink = styled(Link)`
  margin-left: 20px;
`;

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

const Appbar = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const login = () => dispatch(signInWithGoogle());
  const deleteUserFunc = () => {
    if (
      window.confirm(
        "Do you really want to delete? This will delete all generated faces."
      )
    ) {
      dispatch(deleteUser());
    }
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Title />
        {user?.isAnonymous === false ? (
          <Button onClick={deleteUserFunc} color="inherit">
            Delete Account
          </Button>
        ) : (
          <Button onClick={login} color="inherit">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
