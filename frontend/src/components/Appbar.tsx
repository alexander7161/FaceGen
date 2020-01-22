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

const MenuButton = styled(IconButton)`
  margin-right: 16px;
`;

const Title = styled(Typography)`
  flex-grow: 1;
`;

const Appbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <MenuButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </MenuButton>
        <Title variant="h6">FaceGen</Title>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
