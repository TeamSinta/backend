import React, { useState } from "react";
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

  const [isActive, setIsActive] = useState(active);

  const NavButtonWrapComponent = isActive ? NavButtonWrapActive : NavButtonWrap;

  const handleClick = (): void => {
    setIsActive(true);
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
