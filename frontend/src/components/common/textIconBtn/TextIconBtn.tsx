import React from "react";
import { ButtonShadow } from "../button/StyledBtn";
import { TextIconBtnIcon, TextIconBtnWrap } from "./StyledTextIconBtn";

interface ITextIconBtnProps {
  label?: string;
  icon: JSX.Element;
  disable: boolean;
}

const TextIconBtn = (props: ITextIconBtnProps): JSX.Element => {
  const { label, icon, disable } = props;

  return (
    <>
      <TextIconBtnWrap disable={disable}>
        <div></div>
        {label}
        <TextIconBtnIcon>{icon}</TextIconBtnIcon>
        <ButtonShadow />
      </TextIconBtnWrap>
    </>
  );
};

export default TextIconBtn;
