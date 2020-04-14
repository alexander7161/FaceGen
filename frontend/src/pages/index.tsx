import React from "react";
import { Route, Switch } from "react-router-dom";
import styled from "styled-components";

const PredictionPage = React.lazy(() => import("./PredictionPage"));
const GeneratePage = React.lazy(() => import("./GeneratePage"));

const PagesContainer = styled.div`
  margin-top: 16px;
`;
/**
 * Router for all pages.
 * Lazy loads pages when required for improved performance.
 */
const Pages = () => {
  return (
    <PagesContainer>
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
    </PagesContainer>
  );
};

export default Pages;
