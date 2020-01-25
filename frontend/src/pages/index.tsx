import React from "react";
import HomePage from "./HomePage";
import { Route, Switch } from "react-router-dom"; // react-router v4/v5
import GeneratePage from "./GeneratePage";
import AccountPage from "./AccountPage";

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/generate" component={GeneratePage} />
      <Route exact path="/account" component={AccountPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
};

export default Pages;
