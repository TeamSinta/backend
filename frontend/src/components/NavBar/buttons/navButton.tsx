import React from "react";
import { ButtonShadow } from "components/common/button/StyledBtn";
import { NavBarButtonIcon, NavBarButtonWrap } from "./navButtonStyle";

interface INavBarButtonProps {
  label?: string;
  icon: JSX.Element;
  disable: boolean;
  onClick?: () => void;
}

const NavBarButton = (props: INavBarButtonProps): JSX.Element => {
  const { label, icon, disable, onClick } = props;

  return (
    <>
      <NavBarButtonWrap disable={disable} onClick={onClick}>
        <div></div>
        <NavBarButtonIcon>{icon}</NavBarButtonIcon>
        {label}
        <ButtonShadow />
      </NavBarButtonWrap>
    </>
  );
};

export default NavBarButton;
