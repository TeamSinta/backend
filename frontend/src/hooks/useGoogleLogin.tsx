import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";

import HttpService from "utils/axiosService/httpService";

interface GoogleLoginReturnType {
  signIn?: () => any | Promise<any>;
}

const GoogleLogin = (): GoogleLoginReturnType => {
  const [, setCookies] = useCookies(["access_token", "refresh_token"]);
  const instance = HttpService();

  const signIn = useGoogleLogin({
    flow: "auth-code",
    /* eslint-disable */
    onSuccess: async (codeResponse) => {
      const response = await instance.get(
        `http://localhost:3000/auth?code=${codeResponse.code}`
      );
      // Extract the access token and refresh token from the response
      const { accessToken, refreshToken } = response.data;
      // Store the access token and refresh token in cookies or local storage
      setCookies("access_token", accessToken);
      setCookies("refresh_token", refreshToken);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  return { signIn };
};

export default GoogleLogin;
