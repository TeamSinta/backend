import React, { type ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  StyledStack,
  DropWrapper,
  NavButton,
  LogoImage,
  StyledSideNavBarTitle,
  StyledSideNavLinksWrap,
} from "./StyledSideNavBar";
import Dropdown from "@/components/common/form/dropdown/Dropdown";
import { DropdownLayoutType } from "@/components/common/form/dropdown/StyledDropdown";
import {
  DashboardIcon,
  RoleIcon,
  CandidateIcon,
  CalendarIcon,
  SettingIcon,
  DoorIcon,
} from "@/components/common/svgIcons/Icons";
import { iconMB } from "@/components/common/svgIcons/iconType";
import image from "@/assets/images/SintaLogo.png";

export interface INavButtonLink {
  to: string;
  icon: JSX.Element;
  text: string;
}

const args = {
  label: "",
  layoutType: DropdownLayoutType.BLOCK,
  optionArr: [
    { name: "Sinta ", value: "Sinta" },
    { name: "Google", value: "Google" },
    { name: "Facebook", value: "Facebook" },
  ],
  dropdownName: "Workspace",
  dropdownIconVisible: true,
};

const navButtonLinks: INavButtonLink[] = [
  {
    text: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon {...iconMB} />,
  },
  {
    text: "Roles",
    to: "/roles",
    icon: <RoleIcon {...iconMB} />,
  },
  {
    text: "Candidates",
    to: "/candidates",
    icon: <CandidateIcon {...iconMB} />,
  },
  {
    text: "Calendar",
    to: "/calendar",
    icon: <CalendarIcon {...iconMB} />,
  },
];

const navConfigLinks: INavButtonLink[] = [
  {
    text: "Logout",
    to: "/logout",
    icon: <DoorIcon {...iconMB} />,
  },
  {
    text: "Settings",
    to: "/settings",
    icon: <SettingIcon {...iconMB} />,
  },
];

const SideNavBar = (): ReactElement => {
  let location = useLocation();

  return (
    <StyledStack
      className="p-top-3"
      direction="column"
      alignItems="center"
      spacing={8}
    >
      <div>
        <LogoImage className="m-top-3 m-bottom" src={image} alt="Sinta Logo" />
      </div>

      <StyledSideNavLinksWrap>
        <StyledSideNavBarTitle>Workspace</StyledSideNavBarTitle>
        <DropWrapper>
          <Dropdown {...args} />
        </DropWrapper>
      </StyledSideNavLinksWrap>

      <StyledSideNavLinksWrap>
        <StyledSideNavBarTitle>Pages</StyledSideNavBarTitle>
        {navButtonLinks.map((navButtonLink: INavButtonLink, index: number) => (
          <NavButton
            direction="row"
            key={index}
            className={location.pathname === navButtonLink.to ? "active" : ""}
          >
            <Link to={navButtonLink.to} className="link">
              {navButtonLink.icon}
              {navButtonLink.text}
            </Link>
          </NavButton>
        ))}
      </StyledSideNavLinksWrap>

      <StyledSideNavLinksWrap>
        <StyledSideNavBarTitle>Config</StyledSideNavBarTitle>
        {navConfigLinks.map((navConfigLink: INavButtonLink, index: number) => (
          <NavButton direction="row" key={index}>
            <Link to={navConfigLink.to} className="link">
              {navConfigLink.icon}
              {navConfigLink.text}
            </Link>
          </NavButton>
        ))}
      </StyledSideNavLinksWrap>
    </StyledStack>
  );
};

export default SideNavBar;
