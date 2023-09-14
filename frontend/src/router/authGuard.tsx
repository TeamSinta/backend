import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

import {
  setIsAuthenticated,
  resetUserState,
} from "@/features/authentication/authenticationSlice";
import { RootState, AppDispatch } from "@/app/store";
import {
  useGetAccessTokenMutation,
  useGetUserMutation,
  useValidateTokenMutation,
} from "@/features/authentication/authenticationAPI";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, status, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch: AppDispatch = useDispatch();

  const [cookies, setCookies, removeCookies] = useCookies([
    "refresh_token",
    "access_token",
  ]);
  const accessToken: string | undefined = cookies.access_token;
  const refreshToken: string | undefined = cookies.refresh_token;

  const [validateToken] = useValidateTokenMutation();
  const [getUser] = useGetUserMutation();
  const [getAccessToken] = useGetAccessTokenMutation();

  const authenticateUser = async (accessToken: string) => {
    try {
      const result = await validateToken({ access: accessToken });
      if ("data" in result) {
        dispatch(setIsAuthenticated(true));
        await getUser({ access: accessToken });
      } else {
        handleTokenRefresh();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        failedAuthentication();
      } else {
        failedAuthentication();
      }
    }
  };

  const handleTokenRefresh = async () => {
    if (refreshToken) {
      const newAccessToken = await getAccessToken({ refresh: refreshToken });

      if ("data" in newAccessToken && newAccessToken.data?.access) {
        const { access } = newAccessToken.data;
        setCookies("access_token", access);
        dispatch(setIsAuthenticated(true));
        await getUser({ access: access });
      } else {
        failedAuthentication();
      }
    } else {
      failedAuthentication();
    }
  };

  const failedAuthentication = () => {
    dispatch(resetUserState());
    removeCookies("access_token");
    removeCookies("refresh_token");
    navigate("/login");
  };

  useEffect(() => {
    const initAuth = async () => {
      switch (status) {
        case "IDLE":
          if (!isAuthenticated) {
            if (accessToken) {
              await authenticateUser(accessToken);
            } else {
              await handleTokenRefresh();
            }
          }
          break;

        case "AUTHENTICATED":
          if (!user.email) {
            await getUser({ access: accessToken });
          }
          break;

        case "LOADING":
          console.log("CASE LOADING");
          break;

        case "FAILED":
          console.log("CASE FAILED");
          failedAuthentication();
          break;
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
};

// I think the logic works. Check the logs to make sure it doesn't like overly init the useEffect. I dont want it to reload unecessarily.
// The page initializes with isAuthenticated false + IDLE, so it still renders without the navbars first, which is annoying and looks ugly AF.. I want it to either show loading
// or nothing.
