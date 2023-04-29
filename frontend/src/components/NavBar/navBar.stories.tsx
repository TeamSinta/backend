import React, { useState } from "react";
import { storiesOf } from "@storybook/react";
import NavBar from "./NavBar";
import { buttonData } from "./buttonData/buttonData";

import imageFile from "./SintaLogo.png";

storiesOf("NavBar", module).add("NavBar Selection", (): JSX.Element => {
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
});
