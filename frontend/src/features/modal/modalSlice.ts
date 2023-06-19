import { RootState } from "@/app/store";
import { createSlice } from "@reduxjs/toolkit";

export interface ModalState {
  modalType: string;
  isOpen: boolean;
}

const initialState: ModalState = {
  modalType: "",
  isOpen: false,
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
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const selectModal = (state: RootState) => state.modal;

export default modalSlice.reducer;
