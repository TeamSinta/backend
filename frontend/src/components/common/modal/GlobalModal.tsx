import { closeModal, selectModal } from "@/features/modal/modalSlice";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../svgIcons/Icons";
import { H2Bold } from "../typeScale/StyledTypeScale";
import Modal from "./Modal";
import { CloseDiv, ModalHeaderWrap } from "./StyledModal";
import CreateDepartment from "@/components/pages/roles/CreateDepartment";

export enum MODAL_TYPE {
  CREATE_DEP = "CREATE_DEP",
  TEST = "TEST",
  // ModalL = "ModalL",
}

interface IGlobalModal {
  title: string;
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

const GlobalModal = (props: IGlobalModal): JSX.Element => {
  const { modalType, isOpen } = useSelector(selectModal);
  const { title } = props;

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.CREATE_DEP:
        return (
          <Modal title={title}>
            <CreateDepartment />
          </Modal>
        );
      case MODAL_TYPE.TEST:
        return (
          <Modal title={"test"}>
            <H2Bold>Test</H2Bold>
          </Modal>
        );
    }
  };

  if (!isOpen) return <></>;

  return (
    <ModalPortal>{isOpen ? <div>{renderModal()}</div> : <></>}</ModalPortal>
  );
};

export default GlobalModal;
