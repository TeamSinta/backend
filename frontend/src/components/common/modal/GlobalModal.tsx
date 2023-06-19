import { closeModal, selectModal } from "@/features/modal/modalSlice";
import ReactDOM from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { CloseIcon } from "../svgIcons/Icons";
import { iconLB } from "../svgIcons/iconType";
import { H2Bold } from "../typeScale/StyledTypeScale";
import Modal from "./Modal";
import { CloseDiv, ModalHeaderWrap } from "./StyledModal";

enum MODAL_TYPE {
  Modal = "Modal",
  // ModalL = "ModalL",
}

interface IGlobalModal {
  children: JSX.Element | JSX.Element[];
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
        <CloseIcon {...iconLB} />
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
  const { children, title } = props;

  const renderModal = () => {
    switch (modalType) {
      case MODAL_TYPE.Modal:
        return <Modal title={title}>{children}</Modal>;
    }
  };

  if (!isOpen) return <></>;

  return (
    <ModalPortal>{isOpen ? <div>{renderModal()}</div> : <></>}</ModalPortal>
  );
};

export default GlobalModal;
