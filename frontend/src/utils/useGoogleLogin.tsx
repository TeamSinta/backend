import { useGoogleLogin } from "@react-oauth/google";
import axios  from "axios";

type GoogleLoginReturnType = {
  signIn?: () => void;
};

const GoogleLogin = (): GoogleLoginReturnType => {
  const signIn: any   = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const tokens =
      {
        access_token: "xxxxxxxxx",
        refresh_token: "xxxxxxxxx",
        scope: "email profile openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
        token_type: "JWT",
        id_token: "xxxxxx",
        expiry_date: 10/24

      }
      // const tokens = await axios.post("http://localhost:3000/auth/google", {
      //   code: codeResponse.code,
      // });
      console.log(tokens);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return { signIn };
};


export default GoogleLogin;
