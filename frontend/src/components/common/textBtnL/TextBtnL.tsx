import { TextBtnLWrap } from "./StyledTextBtnL";
import { ButtonShadow } from "../button/StyledBtn";
import type { ReactElement } from "react";
import React from "react";

interface TextBtnWrapProps {
  disable: boolean;
  label?: string;
  onClick?: () => void;
}

const TextBtnL = (props: TextBtnWrapProps): ReactElement => {
  const { disable, label, onClick } = props;

  return (
    // added in this as a comment in case you want to see how the button will look on a smaller div
    // <div style={{ width: "40px" }}>
    <>
      <TextBtnLWrap disable={disable} onClick={onClick}>
        {label}
        <ButtonShadow />
      </TextBtnLWrap>
    </>
    // </div>
  );
};

export default TextBtnL;
