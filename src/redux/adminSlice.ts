import { createSlice } from "@reduxjs/toolkit";

export type stateType = {
  id: string;
  username: string;
  passphrase: string;
  jwt: string;
  ian: string;
  exp: number;
};

const initialState: stateType = {
  id: "",
  username: "",
  passphrase: "",
  jwt: "",
  ian: "",
  exp: 0,
};

const adminSlice = createSlice({
  name: "adminStuff",
  initialState,
  reducers: {
    setAdminStuff: (state, payload) => {
      console.log("payload", payload);
      state.id = payload.payload.id;
      state.username = payload.payload.username;
      state.passphrase = payload.payload.passphrase;
      state.jwt = payload.payload.jwt;
      state.ian = payload.payload.ian;
      state.exp = payload.payload.exp;
    },

    resetAdminStuff: (state) => {
      state.id = "";
      state.jwt = "";
      state.passphrase = "";
      state.username = "";
      state.exp = 0;
    },
  },
});

export const { setAdminStuff, resetAdminStuff } = adminSlice.actions;
export default adminSlice.reducer;
