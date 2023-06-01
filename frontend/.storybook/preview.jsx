import GlobalStyle from "../src/styles/GlobalStyle";
import { ThemeProvider } from "styled-components";
import GlobalFont from "../src/styles/GlobalFont";
import { DefaultTheme } from "../src/styles/StyleType";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={DefaultTheme}>
      <GlobalStyle />
      <GlobalFont />
      <Story />
    </ThemeProvider>
  ),
];
