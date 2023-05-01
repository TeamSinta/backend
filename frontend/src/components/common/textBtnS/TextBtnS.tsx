import React from "react";
import { TextBtnSWrap } from "./StyledTextBtnS";

interface ITextBtnSProps {
  label?: string;
  disable: boolean;
}

const TextBtnS = (props: ITextBtnSProps): JSX.Element => {
  const { label, disable } = props;

  return (
    <>
      <TextBtnSWrap disable={disable}>{label}</TextBtnSWrap>
    </>
  );
};

export default TextBtnS;
