import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle, signOut } from "../store/user";
import { userSelector } from "../store/user/selectors";

const MenuButton = styled(IconButton)`
  margin-right: 16px;
`;

const Title = styled(Typography)`
  flex-grow: 1;
`;

const Appbar = () => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const login = () => dispatch(signInWithGoogle());
  const logout = () => dispatch(signOut());
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </MenuButton>
        <Title variant="h6">FaceGen</Title>
        {user?.isAnonymous === false ? (
          <Button onClick={logout} color="inherit">
            Sign Out
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
