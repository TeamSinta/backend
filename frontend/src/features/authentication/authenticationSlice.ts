import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AuthState } from "./authenticationInterface";
import { authAPI } from "./authenticationAPI";

const initialState: AuthState = {
  status: "IDLE",
  isAuthenticated: false,
  user: {
    username: null,
    first_name: null,
    last_name: null,
    email: null,
    profile_picture: null,
    company: null,
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setStatus: (
      state,
      action: PayloadAction<"IDLE" | "LOADING" | "AUTHENTICATED" | "FAILED">
    ) => {
      state.status = action.payload;
    },
    resetUserState: () => initialState,
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authAPI.endpoints.googleLogin.matchPending, (state) => {
        state.status = "LOADING";
      })
      .addMatcher(authAPI.endpoints.googleLogin.matchFulfilled, (state) => {
        state.isAuthenticated = true;
        state.status = "AUTHENTICATED";
      })
      .addMatcher(authAPI.endpoints.googleLogin.matchRejected, (state) => {
        state.status = "FAILED";
      })
      .addMatcher(authAPI.endpoints.getUser.matchPending, (state) => {
        state.status = "LOADING";
      })
      .addMatcher(authAPI.endpoints.getUser.matchFulfilled, (state, action) => {
        state.user.username = action.payload.username;
        state.user.email = action.payload.email;
        state.user.first_name = action.payload.first_name;
        state.user.last_name = action.payload.last_name;
        state.user.profile_picture = action.payload.profile_picture;
        state.user.company = action.payload.company?.toString();
        state.status = "AUTHENTICATED";
      })
      .addMatcher(authAPI.endpoints.getUser.matchRejected, (state) => {
        state.status = "FAILED";
      });
  },
});

export const { setStatus, resetUserState, setIsAuthenticated } =
  userSlice.actions;
export default userSlice.reducer;
