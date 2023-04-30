/* eslint-disable @typescript-eslint/explicit-function-return-type */

import React from "react";
// import { Counter } from "features/counter/Counter";
// import styled from "styled-components";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import GoogleLoginButton from "components/common/googleLoginBtn/GoogleLoginButton";
import { buttonData } from "components/layouts/navbar/buttonData/ButtonData";
import NavBar from "components/layouts/navbar/Navbar";
import imageFile from "./components/layouts/navbar/SintaLogo.png";
import TopNavBar from "components/layouts/topNavbar/TopNavBar";

// const AccentPurpleBox = styled.div`
//   width: 200px;
//   height: 200px;
//   background: ${(props) => props.theme.colors.accentPurple};
//   color: ${(props) => props.theme.colors.white};
// `;

// I leave counter temporarily for reference for redux-toolkit.
// I left google login button temporarily for reference & testing.

function App() {
  return (
    <div className="App">
      <div>
        <TopNavBar />
      </div>
      <div>
        <NavBar logo={imageFile} buttonData={buttonData} />
      </div>
      <div>
        <GoogleOAuthProvider
          clientId={`${
            process.env.REACT_APP_GOOGLE_CLIENT_ID ?? "defaultClientId"
          }`}
        >
          {/* <GoogleLoginButton /> */}
          {/* <Counter /> */}
          {/* <AccentPurpleBox>Accent purple box</AccentPurpleBox>; */}
        </GoogleOAuthProvider>
      </div>
    </div>
  );
}

export default App;
