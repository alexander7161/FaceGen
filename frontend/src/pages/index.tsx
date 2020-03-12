import React from "react";
import { Route, Switch } from "react-router-dom";
import GeneratePage from "./GeneratePage";
import PredictionPage from "./PredictionPage";

const Pages = () => {
  return (
    <div style={{ marginTop: 16 }}>
      <Switch>
        <Route path="/predict" component={PredictionPage} />
        <Route path="/" component={GeneratePage} />
      </Switch>
    </div>
  );
};

export default Pages;
