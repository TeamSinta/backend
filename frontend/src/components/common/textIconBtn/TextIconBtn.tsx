import React from "react";
import { ButtonShadow } from "../button/StyledBtn";
import { TextIconBtnIcon, TextIconBtnWrap } from "./StyledTextIconBtn";


interface ITextIconBtnProps {
  label?: string;
  icon: JSX.Element;
  disable: boolean;
  onClick?: () => void;
}

const TextIconBtn = (props: ITextIconBtnProps): JSX.Element => {
  const { label, icon, disable, onClick } = props;

  return (
    <>
      <TextIconBtnWrap disable={disable} onClick={onClick}>
        <div></div>
        {label}
        <TextIconBtnIcon>{icon}</TextIconBtnIcon>
        <ButtonShadow />
      </TextIconBtnWrap>
    </>
  );
};

export default TextIconBtn;
