import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
import modalReducer from "@/features/modal/modalSlice";
import roleReducer from "@/features/roles/rolesSlice";
import inviteMemberReducer from "@/features/inviteMember/inviteMemberSlice";
import interviewsReducer from "@/features/interviews/interviewsSlice";
import interviewDetailReducer from "@/features/interviewDetail/interviewDetailSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    modal: modalReducer,
    role: roleReducer,
    inviteMember: inviteMemberReducer,
    interviews: interviewsReducer,
    interviewDetail: interviewDetailReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
