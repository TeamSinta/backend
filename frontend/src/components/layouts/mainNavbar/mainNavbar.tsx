import React from "react";
import { NavWrapper } from "./StyledMainNavbar";
import { buttonData } from "components/layouts/navbar/buttonData/ButtonData";
import NavBar from "components/layouts/navbar/Navbar";
import TopNavBar from "components/layouts/topNavbar/TopNavBar";
import imageFile from "../navbar/SintaLogo.png";

const MainNavBar = (): JSX.Element => {
  return (
    <NavWrapper>
      <TopNavBar />
      <NavBar logo={imageFile} buttonData={buttonData} />
    </NavWrapper>
  );
};

export default MainNavBar;
