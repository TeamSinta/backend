import TextIconBtn from "@/components/common/buttons/textIconBtn/TextIconBtn";
import { GoogleIcon } from "@/components/common/svgIcons/Icons";
import { iconSW } from "@/components/common/svgIcons/iconType";
import useGoogleLogin from "@/hooks/useGoogleLogin";
import React from "react";

const GoogleLoginButton = (): JSX.Element => {
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
