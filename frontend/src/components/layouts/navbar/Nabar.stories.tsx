import React, { useState } from "react";
import NavBar from "./Navbar";
import { buttonData } from "./buttonData/ButtonData";

import imageFile from "./SintaLogo.png";

export default {
  title: "NavBar",
};

export const NavBarSelection = (): JSX.Element => {
  const [activeButtonId, setActiveButtonId] = useState(buttonData[0].id);

  const handleButtonClick = (buttonId: number): void => {
    setActiveButtonId(buttonId);
  };

  return (
    <NavBar
      logo={imageFile}
      buttonData={buttonData.map((button) => ({
        ...button,
        active: button.id === activeButtonId,
        onClick: () => {
          handleButtonClick(button.id);
        },
      }))}
    />
  );
};

NavBarSelection.story = {
  name: "NavBar Selection",
};
