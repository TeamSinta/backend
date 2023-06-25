import GlobalFont from "@/styles/GlobalFont";
import GlobalStyle from "@/styles/GlobalStyle";
import { DefaultTheme } from "@/styles/StyleType";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <ThemeProvider theme={DefaultTheme}>
          <GlobalStyle />
          <GlobalFont />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
