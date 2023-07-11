import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from "react-cookie";

import HttpService from "@/utils/axiosService/httpService";

interface GoogleLoginReturnType {
  signIn: () => void;
}

const GoogleLogin = (): GoogleLoginReturnType => {
  console.log("test!");
  const [, setCookies] = useCookies(["access_token", "refresh_token"]);
  const instance = HttpService();

  const signIn = useGoogleLogin({
    flow: "auth-code",
    /* eslint-disable */
    onSuccess: async (codeResponse) => {
      const response = await instance.post(
        import.meta.env.VITE_GOOGLE_OAUTH_CALLBACK_URL,
        {
          code: codeResponse.code,
        }
      );
      // Extract the access token and refresh token from the response
      const { access, refresh } = response.data;
      // Store the access token and refresh token in cookies or local storage
      setCookies("access_token", access);
      setCookies("refresh_token", refresh);

      // Remove this when we dont need it anymore
      console.log("access_token:", response.data.access);
      console.log("refresh_token:", response.data.refresh);
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  return { signIn };
};

export default GoogleLogin;
