import React from "react";
import HomePage from "./HomePage";
import { Route, Switch } from "react-router-dom"; // react-router v4/v5
import GeneratePage from "./GeneratePage";

const Pages = () => {
  return (
    <Switch>
      <Route exact path="/generate" component={GeneratePage} />
      <Route path="/" component={HomePage} />
    </Switch>
  );
};

export default Pages;
