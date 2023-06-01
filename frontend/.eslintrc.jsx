module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:react/recommended",
    "standard-with-typescript",
    "prettier",
    "plugin:storybook/recommended",
  ],
  parser: "@typescript-eslint/parser",
  overrides: [],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "@typescript-eslint/consistent-type-assertions": 0,
  },
  settings: {
    react: {
      version: "17.02",
    },
  },
  ignorePatterns: ["**/NavBar.tsx"],
};
