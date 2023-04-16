import { useGoogleLogin } from "@react-oauth/google";
import { useCookies } from 'react-cookie';

import HttpService from "utils/axiosService/httpService";


type GoogleLoginReturnType = {
  signIn?: () => void;
};

const GoogleLogin = (): GoogleLoginReturnType => {

  const [, setCookies] = useCookies(['access_token', 'refresh_token']);
  const instance = HttpService();


  const signIn   = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const response = await instance.get(`http://localhost:3000/auth?code=${codeResponse.code}`);
      console.log(response);
      // Extract the access token and refresh token from the response
      const { access_token, refresh_token } = response.data;
      // Store the access token and refresh token in cookies or local storage
      setCookies('access_token', access_token);
      setCookies('refresh_token', refresh_token);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return { signIn };
};


export default GoogleLogin;
