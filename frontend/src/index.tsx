import GlobalFont from "@/styles/GlobalFont";
import GlobalStyle from "@/styles/GlobalStyle";
import { DefaultTheme } from "@/styles/StyleType";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={DefaultTheme}>
      <GlobalStyle />
      <GlobalFont />
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
