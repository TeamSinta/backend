import { useGoogleLogin } from "@react-oauth/google";
import httpService from '../utils/httpService'

type GoogleLoginReturnType = {
  signIn?: () => void;
};

const GoogleLogin = (): GoogleLoginReturnType => {
  const signIn   = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);

      const tokens = await httpService.post("http://localhost:3000/auth/google", {
        code: codeResponse.code,
      });
      console.log(tokens);

      // Extract the access token and refresh token from the response
      const { access_token, refresh_token } = tokens.data;

      // Store the access token and refresh token in cookies or local storage
      document.cookie = `access_token=${access_token}`;
      document.cookie = `refresh_token=${refresh_token}`;
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return { signIn };
};


export default GoogleLogin;
