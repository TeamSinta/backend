import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IMember, IMockMembers } from "../roles/rolesInterface";
import { ISection } from "./inverviewDetailInterface";
import { RootState } from "@/app/store";
import { getInterviewDetail } from "./interviewDetailAPI";
import { Loading } from "../utils/utilEnum";

export const initialState = {
  interviewer: [] as IMockMembers[],
  section: [] as ISection[],
  selectedSection: {} as ISection,
  status: Loading.UNSEND,
};

export const getInterviewDetailAsync = createAsyncThunk(
  "interviews/interviewDetail",
  async () => {
    const response = await getInterviewDetail();
    return response;
  }
);

export const interviewDetailSlice = createSlice({
  name: "interviewDetail",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getInterviewDetailAsync.fulfilled, (state, action) => {
      const { interviewer, section } = action.payload.data;
      state.interviewer = interviewer;
      state.section = section;
      state.status = Loading.FULFILLED;
      state.selectedSection = state.section[0];
    });
  },
  reducers: {
    setSelectedSection: (state) => {
      state.selectedSection = state.section[0];
    },
  },
});

export const { setSelectedSection } = interviewDetailSlice.actions;
export const selectInterviewDetail = (state: RootState) =>
  state.interviewDetail;
export default interviewDetailSlice.reducer;
