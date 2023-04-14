import React from "react";
import useGoogleLogin from "./useGoogleLogin";

const GoogleLoginButton = () => {
  const { signIn } = useGoogleLogin();

  return <button onClick={signIn}>Sign in with Google</button>;
};

export default GoogleLoginButton;
