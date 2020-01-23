import React from "react";
import store, { history } from "./store";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";

import Appbar from "./components/Appbar";
import Faces from "./components/Faces";
import GenerateFaceButton from "./components/GenerateFaceButton";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Appbar />
        <Faces />
        <GenerateFaceButton />
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
