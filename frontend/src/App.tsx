import React from "react";
import logo from "./logo.svg";
import "./App.css";
import store, { history } from "./store";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import Button from "@material-ui/core/Button";

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className="App">
          <Button variant="contained" color="primary">
            Primary
          </Button>

          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.tsx</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
        </div>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
