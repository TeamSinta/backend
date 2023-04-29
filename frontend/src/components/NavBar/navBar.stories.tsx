import React from "react";
import { storiesOf } from "@storybook/react";
import NavBar from "./NavBar";
import { buttonData } from "./buttonData/buttonData";

import imageFile from "./SintaLogo.png";

const activeButtonId = buttonData[0].id;

storiesOf("NavBar", module).add("NavBar Selection", (): JSX.Element => {
  return (
    <NavBar
      logo={imageFile}
      buttonData={buttonData.map((button) => ({
        ...button,
        active: button.id === activeButtonId,
      }))}
    />
  );
});
