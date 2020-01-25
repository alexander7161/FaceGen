import React from "react";
import Homepage from "./Homepage";
import { Route, Switch } from "react-router-dom"; // react-router v4/v5

const Pages = () => {
  return (
    <Switch>
      <Route path="/" render={() => <Homepage />} />
      <Route render={() => <div>Miss</div>} />
    </Switch>
  );
};

export default Pages;
