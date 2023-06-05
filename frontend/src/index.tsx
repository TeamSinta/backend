import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import GlobalFont from "styles/GlobalFont";
import GlobalStyle from "styles/GlobalStyle";
import { DefaultTheme } from "styles/StyleType";
import App from "./App";
import { store } from "./assets/app/store";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultTheme}>
      <GlobalStyle />
      <GlobalFont />
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
