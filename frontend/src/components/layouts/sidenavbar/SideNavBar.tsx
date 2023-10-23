import image from "@/assets/images/SintaLogo.png";
import {
  CandidateIcon,
  DashboardIcon,
  DoorIcon,
  RoleIcon,
  SettingIcon,
  InfoIcon,
} from "@/components/common/svgIcons/Icons";
import { BodyMMedium } from "@/components/common/typeScale/StyledTypeScale";
import { useEffect, type ReactElement } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";
import SideNavBarDropdown from "./SideNavBarDropdown";
import {
  DropWrapper,
  LogoImage,
  NavButton,
  StyledSideNavBarTitle,
  StyledSideNavLinksWrap,
  StyledStack,
} from "./StyledSideNavBar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/store";
import { resetUserState } from "@/features/authentication/authenticationSlice";
import {
  setCurrentWorkspace,
  resetCurrentWorkspace,
} from "@/features/workspace/userWorkspaceSlice";

export interface INavButtonLink {
  to: string;
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}

const navButtonLinks: INavButtonLink[] = [
  {
    text: "Dashboard",
    to: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    text: "Templates",
    to: "/templates",
    icon: <RoleIcon />,
  },
  {
    text: "Interviews",
    to: "/interviews",
    icon: <CandidateIcon />,
  },
  {
    text: "Notifications",
    to: "/Notifications",
    icon: <InfoIcon />,
  },
];

const navConfigLinks: INavButtonLink[] = [
  {
    text: "Settings",
    to: "/settings",
    icon: <SettingIcon />,
  },
  {
    text: "Logout",
    to: "#",
    icon: <DoorIcon />,
  },
];

const SideNavBar = (): ReactElement => {
  const { user } = useSelector((state: RootState) => state.user);
  let location = useLocation();
  const dispatch: AppDispatch = useDispatch();
  const [, , removeCookie] = useCookies(["refresh_token", "access_token"]);

  const args = {
    optionArr: user.companies.map((company) => ({
      id: company.id,
      name: company.name,
      value: company.name,
    })),
    dropdownName: "Workspace",
    dropdownIconVisible: true,
  };

  const handleNavConfigClick = (text: string) => {
    if (text === "Logout") {
      localStorage.removeItem("AuthStatus");
      removeCookie("access_token");
      removeCookie("refresh_token");
      dispatch(resetUserState());
      dispatch(resetCurrentWorkspace());
    }
  };

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
        <StyledSideNavBarTitle style={{ opacity: "0.5" }}>
          Workspace
        </StyledSideNavBarTitle>
        <DropWrapper>
          <SideNavBarDropdown {...args} />
        </DropWrapper>
      </StyledSideNavLinksWrap>

      <StyledSideNavLinksWrap>
        <StyledSideNavBarTitle style={{ opacity: "0.5" }}>
          Pages
        </StyledSideNavBarTitle>
        {navButtonLinks.map((navButtonLink: INavButtonLink, index: number) => (
          <NavButton
            direction="row"
            key={index}
            className={
              location.pathname.startsWith(navButtonLink.to) ? "active" : ""
            }
          >
            <Link to={navButtonLink.to} className="link">
              {navButtonLink.icon}
              <BodyMMedium>{navButtonLink.text}</BodyMMedium>
            </Link>
          </NavButton>
        ))}
      </StyledSideNavLinksWrap>

      <StyledSideNavLinksWrap>
        <StyledSideNavBarTitle style={{ opacity: "0.5" }}>
          Config
        </StyledSideNavBarTitle>
        {navConfigLinks.map((navConfigLink: INavButtonLink, index: number) => (
          <NavButton
            direction="row"
            key={index}
            className={location.pathname === navConfigLink.to ? "active" : ""}
          >
            <Link
              to={navConfigLink.to}
              onClick={() => handleNavConfigClick(navConfigLink.text)}
              className="link"
            >
              {navConfigLink.icon}
              <BodyMMedium>{navConfigLink.text}</BodyMMedium>
            </Link>
          </NavButton>
        ))}
      </StyledSideNavLinksWrap>
    </StyledStack>
  );
};

export default SideNavBar;
