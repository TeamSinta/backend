import React from "react";
import { ButtonShadow } from "../button/StyledBtn";
import { IconBtnLWIcon, IconBtnLWWrap } from "./StyledIconBtnLW";

interface IIconBtnLWProps {
  icon: JSX.Element;
  disable: boolean;
}

const IconBtnLW = (props: IIconBtnLWProps): JSX.Element => {
  const { icon, disable } = props;

  return (
    <>
      <IconBtnLWWrap disable={disable}>
        <IconBtnLWIcon>{icon}</IconBtnLWIcon>
        <ButtonShadow />
      </IconBtnLWWrap>
    </>
  );
};

export default IconBtnLW;
