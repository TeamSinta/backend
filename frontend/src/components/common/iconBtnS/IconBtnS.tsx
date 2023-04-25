import React from "react";
import { IconBtnSIcon, IconBtnSWrap } from "./StyledIconBtnS";

interface IIconBtnLWProps {
  icon: JSX.Element;
  disable: boolean;
}

const IconBtnS = (props: IIconBtnLWProps): JSX.Element => {
  const { icon, disable } = props;

  return (
    <>
      <IconBtnSWrap disable={disable}>
        <IconBtnSIcon>{icon}</IconBtnSIcon>
      </IconBtnSWrap>
    </>
  );
};

export default IconBtnS;
