import React from "react";
import {
  NavBarButtonIcon,
  NavButtonWrap,
  NavButtonWrapActive,
  NavBarButtonLabel,
} from "./navButtonStyle";

interface INavBarButtonProps {
  label?: string;
  icon: JSX.Element;
  onClick?: () => void;
  active: boolean;
}

const NavBarButton = (props: INavBarButtonProps): JSX.Element => {
  const { label, icon, onClick, active } = props;

  const NavButtonWrapComponent = active ? NavButtonWrapActive : NavButtonWrap;

  const handleClick = (): void => {
    onClick?.();
  };

  return (
    <NavButtonWrapComponent onClick={handleClick}>
      <NavBarButtonIcon>{icon}</NavBarButtonIcon>
      <NavBarButtonLabel>{label}</NavBarButtonLabel>
    </NavButtonWrapComponent>
  );
};

export default NavBarButton;
