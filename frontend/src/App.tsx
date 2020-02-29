import React from "react";
import store, { history } from "./store";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";

import Appbar from "./components/Appbar";
import Pages from "./pages/Pages";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <ConnectedRouter history={history}>
        <Appbar />
        <Pages />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
