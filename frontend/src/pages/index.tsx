import React from "react";
import { Route, Switch } from "react-router-dom";

const PredictionPage = React.lazy(() => import("./PredictionPage"));
const GeneratePage = React.lazy(() => import("./GeneratePage"));

const Pages = () => {
  return (
    <div style={{ marginTop: 16 }}>
      <Switch>
        <Route path="/predict">
          <React.Suspense fallback={<div>Loading...</div>}>
            <PredictionPage />
          </React.Suspense>
        </Route>
        <Route path="/">
          <React.Suspense fallback={<div>Loading...</div>}>
            <GeneratePage />
          </React.Suspense>
        </Route>
      </Switch>
    </div>
  );
};

export default Pages;
