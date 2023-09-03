import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";
import { redirect } from "react-router-dom";

export interface ModalState {
  modalType: string;
  isOpen: boolean;
  history: string;
}

const initialState: ModalState = {
  modalType: "",
  isOpen: false,
  history: "",
};

export const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, actions) => {
      const { modalType } = actions.payload;
      state.modalType = modalType;
      state.isOpen = true;
    },
    closeModal: (state) => {
      redirect(state.history);
      state.isOpen = false;
    },
    setHistory: (state, actions) => {
      const { history } = actions.payload;
      state.history = history;
    },
  },
});

export const { openModal, closeModal, setHistory } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
