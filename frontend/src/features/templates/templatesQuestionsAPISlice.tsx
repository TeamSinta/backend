import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const templateQuestionsAPI = createApi({
  reducerPath: "templateQuestionsAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api/templates/",
  }),
  tagTypes: ["TQuestions"],
  endpoints: (builder) => ({
    getTemplateQuestions: builder.query<object, void>({
      query: () => "template_questions/",
      providesTags: ["TQuestions"],
    }),
    addTemplateQuestion: builder.mutation({
      query: (template) => ({
        url: `template_questions/`,
        method: "POST",
        body: template,
      }),
      invalidatesTags: ["TQuestions"],
    }),
    updateTemplateQuestion: builder.mutation({
      query: (question) => ({
        url: `template_questions/${question.id}/`,
        method: "PATCH",
        body: question,
      }),
      invalidatesTags: ["TQuestions"],
    }),
    deleteTemplateQuestion: builder.mutation({
      query: (id) => ({
        url: `template_questions/${id}/`,
        method: "DELETE",
        body: id,
      }),
      invalidatesTags: ["TQuestions"],
    }),
  }),
});

export const {
  useGetTemplateQuestionsQuery,
  useAddTemplateQuestionMutation,
  useUpdateTemplateQuestionMutation,
  useDeleteTemplateQuestionMutation,
} = templateQuestionsAPI;
