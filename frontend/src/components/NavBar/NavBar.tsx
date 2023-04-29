import NavBarButton from "./buttons/navButton";
import React, { useState } from "react";
import {
  BottomButtonWrapper,
  SideNavBarWrapper,
  LogoWrapper,
  LogoImage,
  ButtonWrapper,
} from "./sideNavBar";

export interface NavBarProps {
  logo: string;
  buttonData: Array<{
    id: number;
    text: string;
    onClick: () => void;
    active: boolean;
    icon: JSX.Element;
  }>;
}

const NavBar = ({ logo, buttonData }: NavBarProps): JSX.Element => {
  const [activeButtonId, setActiveButtonId] = useState<number>(
    buttonData[0].id
  );

  const handleButtonClick = (buttonId: number): void => {
    setActiveButtonId(buttonId);
  };

  // separate the last button from the buttonData array
  const lastButton = buttonData.slice(-1)[0];
  const otherButtons = buttonData.slice(0, -1);

  return (
    <SideNavBarWrapper>
      <LogoWrapper>
        <LogoImage src={logo} alt="Sinta Logo" />
      </LogoWrapper>
      <ButtonWrapper>
        {otherButtons.map((button) => (
          <NavBarButton
            key={button.id}
            onClick={() => handleButtonClick(button.id)}
            active={button.id === activeButtonId}
            icon={button.icon}
            label={button.text}
          />
        ))}
      </ButtonWrapper>
      <BottomButtonWrapper>
        <NavBarButton
          key={lastButton.id}
          onClick={() => handleButtonClick(lastButton.id)}
          active={lastButton.id === activeButtonId}
          icon={lastButton.icon}
          label={lastButton.text}
        />
      </BottomButtonWrapper>
    </SideNavBarWrapper>
  );
};

export default NavBar;
