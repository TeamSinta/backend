/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from "react";
// import styled from "styled-components";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLoginButton from "components/common/googleLoginBtn/GoogleLoginButton";

// import GoogleLoginButton from "components/common/googleLoginBtn/GoogleLoginButton";
// const AccentPurpleBox = styled.div`
//   width: 200px;
//   height: 200px;
//   background: ${(props) => props.theme.colors.accentPurple};
//   color: ${(props) => props.theme.colors.white};
// `;
import MainNavBar from "@/components/layouts/mainavbar/MainNavbar";
// I leave counter temporarily for reference for redux-toolkit.
// I left google login button temporarily for reference & testing.

function App() {
  return (
    <div className="App">
      <div></div>
      <MainNavBar />
      <div>
        {/* <GoogleOAuthProvider
          clientId={`${
            import.meta.env.VITE_GOOGLE_CLIENT_ID ?? "defaultClientId"
          }`}
        > */}
        {/* <Counter /> */}
        {/* <AccentPurpleBox>Accent purple box</AccentPurpleBox>; */}
        {/* <GoogleLoginButton />
        </GoogleOAuthProvider> */}
      </div>
    </div>
  );
}

export default App;
