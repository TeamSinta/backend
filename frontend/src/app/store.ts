import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import modalReducer from "@/features/modal/modalSlice";
import roleReducer from "@/features/roles/rolesSlice";
import inviteMemberReducer from "@/features/inviteMember/inviteMemberSlice";
import questionBanksReducer from "@/features/interviews/interviewsSlice";
import interviewDetailReducer from "@/features/interviewDetail/interviewDetailSlice";
import userReducer from "@/features/authentication/authenticationSlice";
import memberReducer from "@/features/members/memberSlice";
import { authAPI } from "@/features/authentication/authenticationAPI";
import videoCallReducer from "@/features/videoCall/videoCallSlice";
import { userAPI } from "@/features/settingsDetail/userSettingsAPI";

export const store = configureStore({
  reducer: {
    [authAPI.reducerPath]: authAPI.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    user: userReducer,
    member: memberReducer,
    videoCall: videoCallReducer,
    counter: counterReducer,
    modal: modalReducer,
    role: roleReducer,
    inviteMember: inviteMemberReducer,
    questionBanks: questionBanksReducer,
    interviewDetail: interviewDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authAPI.middleware, userAPI.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
