import React from "react";
import { Route, Switch } from "react-router-dom"; // react-router v4/v5
import GeneratePage from "./GeneratePage";

const Pages = () => {
  return (
    <div style={{ marginTop: 16 }}>
      <Switch>
        <Route path="/" component={GeneratePage} />
      </Switch>
    </div>
  );
};

export default Pages;
