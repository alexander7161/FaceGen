import React from "react";
import store, { history } from "./store/index";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";

import Appbar from "./components/Appbar/index";
import Pages from "./pages/index";

/**
 * App root.
 */
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <CssBaseline />
        <Appbar />
        <Pages />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
