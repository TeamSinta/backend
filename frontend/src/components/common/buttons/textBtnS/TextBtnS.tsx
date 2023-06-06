import React from "react";
import { TextBtnSWrap } from "./StyledTextBtnS";
import { BodyMMedium } from "@/components/common/typeScale/StyledTypeScale";

interface ITextBtnSProps {
  label?: string;
  disable: boolean;
}

const TextBtnS = (props: ITextBtnSProps): JSX.Element => {
  const { label, disable } = props;

  return (
    <>
      <TextBtnSWrap disable={disable}>
        <BodyMMedium>{label}</BodyMMedium>
      </TextBtnSWrap>
    </>
  );
};

export default TextBtnS;
