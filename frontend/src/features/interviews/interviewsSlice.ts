import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Loading } from "../utils/utilEnum";
import { RootState } from "@/app/store";
import { getQuestionsBank } from "./interviewsAPI";
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
  question_banks: [],
  questionBanks: [],
  questions: [] as IQuestion[],
  selectedQuestionBank: {
    id: 0,
    title: "",
  },
  selectedQuestion: [] as IQuestion[],
  status: Loading.UNSEND,
};

export const getQuestionsBanksAsync = createAsyncThunk(
  "interviews/templates",
  async () => {
    const response = await getQuestionsBank();
    return response;
  }
);

export const interviewsSlice = createSlice({
  name: "questionBanks",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getQuestionsBanksAsync.fulfilled, (state, action) => {
      state.questionBanks = action.payload;
      state.status = Loading.FULFILLED;
    });
  },
  reducers: {
    setSelectedQuestionBanks: (state, actions) => {
      const data = actions.payload;
      state.selectedQuestionBank = data;
    },
    selectQuestionBank: (state, actions) => {
      const { questions, questionBank } = actions.payload;
      state.selectedQuestionBank = questionBank;
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
    resetQuestionBank: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedQuestionBanks,
  selectQuestionBank,
  setSelectedQuestion,
  resetQuestionBank,
} = interviewsSlice.actions;

export const selectInterview = (state: RootState) => state.questionBanks;
export default interviewsSlice.reducer;
