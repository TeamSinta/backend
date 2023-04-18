import type { ReactElement } from "react";
import useGoogleLogin from "../../../hooks/useGoogleLogin";
import TextIconBtn from "components/common/textIconBtn/TextIconBtn";
import { GoogleIcon } from "components/common/svgIcons/Icons";
import { iconSW } from "components/common/svgIcons/iconType";
import React from "react";

const GoogleLoginButton = (): ReactElement => {
  const { signIn } = useGoogleLogin();


  return (
    <TextIconBtn
      icon={<GoogleIcon {...iconSW} />}
      label="Sign in with Google"
      disable={false}
      onClick={signIn}
    />
  );
};

export default GoogleLoginButton;
