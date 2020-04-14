import React from "react";
import { AppBar, Toolbar, Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { signInWithGoogle, deleteUser } from "../../store/user";
import { userSelector } from "../../store/user/selectors";
import Title from "./Title";

/**
 * Appbar to be displayed at top of page.
 * Uses https://material-ui.com/components/app-bar/
 */
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
