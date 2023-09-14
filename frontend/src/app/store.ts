import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import modalReducer from "@/features/modal/modalSlice";
import roleReducer from "@/features/roles/rolesSlice";
import inviteMemberReducer from "@/features/inviteMember/inviteMemberSlice";
import interviewsReducer from "@/features/interviews/interviewsSlice";
import interviewDetailReducer from "@/features/interviewDetail/interviewDetailSlice";
import userReducer from "@/features/authentication/authenticationSlice";
import { authAPI } from "@/features/authentication/authenticationAPI";
import videoCallReducer from "@/features/videoCall/videoCallSlice";

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    user: userReducer,
    videoCall: videoCallReducer,
    counter: counterReducer,
    modal: modalReducer,
    role: roleReducer,
    inviteMember: inviteMemberReducer,
    interviews: interviewsReducer,
    interviewDetail: interviewDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
