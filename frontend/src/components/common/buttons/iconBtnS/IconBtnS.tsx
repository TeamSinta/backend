import React from "react";
import { IconBtnSIcon, IconBtnSWrap } from "./StyledIconBtnS";

interface IIconBtnSProps {
  icon: JSX.Element;
  disable: boolean;
}

const IconBtnS = (props: IIconBtnSProps): JSX.Element => {
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
