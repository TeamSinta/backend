import type { ReactElement } from "react";
import React from "react";
import { TextBtnLWrap } from "./StyledTextBtnL";

interface TextBtnWrapProps {
  disable: boolean;
  label?: string;
  onClick?: (
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | unknown
  ) => void;
}

const TextBtnL = (props: TextBtnWrapProps): ReactElement => {
  const { disable, label, onClick } = props;

  return (
    // added in this as a comment in case you want to see how the button will look on a smaller div
    // <div style={{ width: "40px" }}>
    <>
      <TextBtnLWrap disable={disable} onClick={onClick}>
        {label}
      </TextBtnLWrap>
    </>
    // </div>
  );
};

export default TextBtnL;
