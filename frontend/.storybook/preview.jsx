import { initializeWorker } from "msw-storybook-addon";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { store } from "../src/app/store";
import GlobalFont from "../src/styles/GlobalFont";
import GlobalStyle from "../src/styles/GlobalStyle";
import { DefaultTheme } from "../src/styles/StyleType";
import { handlers } from "../src/mocks/handlers";
import { initialize, mswDecorator } from "msw-storybook-addon";

// MSW initialize
if (typeof window !== "undefined") {
  initialize({ onUnhandledRequest: "bypass" });
}

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  //global msw handlers
  msw: {
    handlers: [...handlers],
  },
};

export const decorators = [
  (Story) => (
    <Provider store={store}>
      <ThemeProvider theme={DefaultTheme}>
        <GlobalStyle />
        <GlobalFont />
        <Router>
          <Story />
        </Router>
      </ThemeProvider>
    </Provider>
  ),
  mswDecorator,
];
