import { closeModal, selectModal } from "@/features/modal/modalSlice";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../svgIcons/Icons";
import { H2Bold } from "../typeScale/StyledTypeScale";
import Modal from "./Modal";
import { CloseDiv, ModalHeaderWrap } from "./StyledModal";

import CreateInterviews from "@/components/common/modal/modalContents/CreateInterviews";
import CreateDepartment from "./modalContents/CreateDepartment";
import SelectValue from "./modalContents/SelectValues";
import ModalL from "./ModalL";
import SelectTemplate from "./modalContents/SelectTemplate";

export enum MODAL_TYPE {
  CREATE_DEP = "CREATE_DEP",
  CREATE_INT = "CREATE_INT",
  SELECT_VAL = "SELECT_VAL",
  SELECT_TEM = "SELECT_TEM",
  // ModalL = "ModalL",
}

interface IModalHeader {
  title: string;
}

interface IModalPortal {
  children: React.ReactElement;
}

export const ModalHeader = ({ title }: IModalHeader) => {
  const dispatch = useDispatch();

  return (
    <ModalHeaderWrap>
      <H2Bold>{title}</H2Bold>
      <CloseDiv
        onClick={() => {
          dispatch(closeModal());
        }}
      >
        <CloseIcon />
      </CloseDiv>
    </ModalHeaderWrap>
  );
};

const ModalPortal = ({ children }: IModalPortal) => {
  const el = document.getElementById("modal")!;
  return ReactDOM.createPortal(children, el);
};

const GlobalModal = (): JSX.Element => {
  const { modalType, isOpen } = useSelector(selectModal);

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.CREATE_DEP:
        return (
          <Modal title="Create New Departments">
            <CreateDepartment />
          </Modal>
        );
      case MODAL_TYPE.CREATE_INT:
        return (
          <Modal title="Create New Interview">
            <CreateInterviews />
          </Modal>
        );
      case MODAL_TYPE.SELECT_VAL:
        return (
          <Modal title="Select your values">
            <SelectValue />
          </Modal>
        );
      case MODAL_TYPE.SELECT_TEM:
        return (
          <ModalL title="Select your values">
            <SelectTemplate />
          </ModalL>
        );
    }
  };

  if (!isOpen) return <></>;

  return (
    <ModalPortal>{isOpen ? <div>{renderModal()}</div> : <></>}</ModalPortal>
  );
};

export default GlobalModal;
