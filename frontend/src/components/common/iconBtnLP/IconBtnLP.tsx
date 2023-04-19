import React from "react";
import { ButtonShadow } from "../button/StyledBtn";
import { IconBtnLPIcon, IconBtnLPWrap } from "./StyledIconBtnLP";

interface IIconBtnLPProps {
  icon: JSX.Element;
  disable: boolean;
}

const IconBtnLP = (props: IIconBtnLPProps): JSX.Element => {
  const { icon, disable } = props;

  return (
    <>
      <IconBtnLPWrap disable={disable}>
        <IconBtnLPIcon>{icon}</IconBtnLPIcon>
        <ButtonShadow />
      </IconBtnLPWrap>
    </>
  );
};

export default IconBtnLP;
