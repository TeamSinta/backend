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
        import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URL,
        {
          params: {
            code: codeResponse.code,
          },
        }
      );
      // Extract the access token and refresh token from the response
      const { accessToken, refreshToken } = response.data;
      // Store the access token and refresh token in cookies or local storage
      setCookies("access_token", accessToken);
      setCookies("refresh_token", refreshToken);

      // Log user info
      console.log("access_token:", response.data.accessToken);
      console.log("refresh_token:", response.data.refreshToken);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  return { signIn };
};

export default GoogleLogin;