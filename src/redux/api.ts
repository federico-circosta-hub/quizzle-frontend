import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { loginPayload, signupPayload } from "../types/apiPayload";

export const quizzleApi = createApi({
  reducerPath: "quizzleApi",
  baseQuery: fetchBaseQuery({
    //baseUrl: "https://wordle-my-backend.vercel.app",
    baseUrl: "http://127.0.0.1:4001",
  }),
  tagTypes: ["challengers", "challenger", "questions"],
  endpoints: (builder) => ({
    //AUTHENTICATION
    signup: builder.mutation({
      query: (payload: signupPayload) => ({
        url: "auth/signup",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }),
    }),
    login: builder.mutation({
      query: (payload: loginPayload) => ({
        url: "/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }),
    }),
    verifyPassphrase: builder.mutation({
      query: (payload) => ({
        url: "/auth/verify-passphrase",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }),
    }),

    //DASHBOARD
    dashboard: builder.query({
      query: (adminUsername: string) => ({
        url: `/dashboard?adminUsername=${adminUsername}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    //QUESTION
    questions: builder.query({
      query: (adminUsername: string) => ({
        url: `/question/questions?adminUsername=${adminUsername}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["questions"],
    }),
    addQuestion: builder.mutation({
      query: (data) => ({
        url: `/question/add-question`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.jwt,
        },
        body: data,
      }),
      invalidatesTags: ["questions"],
    }),
    answerQuestion: builder.mutation({
      query: (data) => ({
        url: `/question/answer-question`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["challenger"],
    }),

    //CHALLENGER
    challengers: builder.query({
      query: (jwt: string) => ({
        url: `/challenger`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: jwt,
        },
      }),
      providesTags: ["challengers"],
    }),
    challenger: builder.query({
      query: (id: string) => ({
        url: `/challenger/by-name?id=${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
      providesTags: ["challenger"],
    }),
    createChallenger: builder.mutation({
      query: (data) => ({
        url: `/challenger/create`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: data.jwt,
        },
        body: data,
      }),
      invalidatesTags: ["challengers"],
    }),
    challengerExists: builder.query({
      query: ({ name, id }) => ({
        url: `/challenger/challenger-exists?name=${name}&id=${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useVerifyPassphraseMutation,
  useDashboardQuery,
  useQuestionsQuery,
  useAddQuestionMutation,
  useChallengersQuery,
  useChallengerQuery,
  useCreateChallengerMutation,
  useAnswerQuestionMutation,
  useChallengerExistsQuery,
} = quizzleApi;
