import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Loading } from "../utils/utilEnum";
import { RootState } from "@/app/store";
import { getTemplates } from "./interviewsAPI";
import { IQuestion } from "./interviewsInterface";

export const initialState = {
  round: {
    title: "",
    description: "",
    members: [
      {
        member_idx: 0,
        member_name: "",
        member_url: "",
        member_type: "",
        selected: false,
      },
    ],
  },
  values: [],
  selectedValue: [],
  templates: [],
  questions: [] as IQuestion[],
  selectedTemplate: {
    id: 0,
    title: "",
  },
  selectedQuestion: [] as IQuestion[],
  status: Loading.UNSEND,
};

export const getTemplatesAsync = createAsyncThunk(
  "interviews/templates",
  async () => {
    const response = await getTemplates();
    return response;
  }
);

export const interviewsSlice = createSlice({
  name: "interviews",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getTemplatesAsync.fulfilled, (state, action) => {
      state.templates = action.payload;
    });
  },
  reducers: {
    setSelectedTemplates: (state, actions) => {
      const data = actions.payload;
      state.selectedTemplate = data;
    },
    selectTemplate: (state, actions) => {
      const { questions, template } = actions.payload;
      state.selectedTemplate = template;
      state.questions = questions;
    },
    setSelectedQuestion: (state, actions) => {
      const { selectedQuestion } = actions.payload;
      let temp: IQuestion[] = [];
      const exit = state.selectedQuestion.find(
        (question) => question.id === selectedQuestion.id
      );
      if (!exit) {
        state.selectedQuestion.push(selectedQuestion);
      } else {
        temp = state.selectedQuestion.filter(
          (question) => question.id !== selectedQuestion.id
        );
        state.selectedQuestion = temp;
      }
    },
    resetInterview: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedTemplates,
  selectTemplate,
  setSelectedQuestion,
  resetInterview,
} = interviewsSlice.actions;

export const selectInterview = (state: RootState) => state.interviews;
export default interviewsSlice.reducer;
