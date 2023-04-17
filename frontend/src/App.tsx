/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from "react";
import { Counter } from "features/counter/Counter";
import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import { GoogleLogin } from "@react-oauth/google";
import GoogleLoginButton from "components/common/googleLoginBtn/GoogleLoginButton";

const AccentPurpleBox = styled.div`
  width: 200px;
  height: 200px;
  background: ${(props) => props.theme.colors.accentPurple};
  color: ${(props) => props.theme.colors.white};
`;

// I leave counter temporarily for reference for redux-toolkit.
// I left google login button temporarily for reference & testing.

function App() {
  return (
    <div className="App">
      <GoogleOAuthProvider clientId="202041052767-e7lmm09oascjre869gfjqp8gd1bmksbr.apps.googleusercontent.com">
        <GoogleLoginButton />
        <Counter />
        <AccentPurpleBox>Accent purple box</AccentPurpleBox>;
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
