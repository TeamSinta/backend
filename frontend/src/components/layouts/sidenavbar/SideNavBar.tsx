import React, { type ReactElement } from "react";
import { Link as RouterLink, MemoryRouter } from "react-router-dom";
import Link from "@mui/material/Link";
import { StaticRouter } from "react-router-dom/server";

import {
  StyledStack,
  DropWrapper,
  NavButton,
  LogoImage,
} from "./StyledSideNavBar";
import Dropdown from "../../common/form/dropdown/Dropdown";
import { DropdownLayoutType } from "../../common/form/dropdown/StyledDropdown";

import {
  DashboardIcon,
  RoleIcon,
  CalendarIcon,
  SettingIcon,
  DoorIcon,
  CandidateIcon,
} from "components/common/svgIcons/Icons";
import { iconMB } from "components/common/svgIcons/iconType";
import image from "../../../assets/svg/images/SintaLogo.png";

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

export interface NavButtonLinkProps {
  to: string;
  icon: JSX.Element;
  text: string;
}

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
}

const args = {
  label: "",
  layoutType: DropdownLayoutType.FLEX,
  optionArr: [
    { name: "Sinta ", value: "Sinta" },
    { name: "Google", value: "Google" },
    { name: "Facebook", value: "Facebook" },
  ],
  dropdownName: "Workspace",
  dropdownIconVisible: true,
};

function Router(props: { children?: React.ReactNode }): any {
  const { children } = props;
  if (typeof window === "undefined") {
    return <StaticRouter location="/">{children}</StaticRouter>;
  }

  return <MemoryRouter>{children}</MemoryRouter>;
}

const NavLink = ({ to, children }: NavLinkProps): ReactElement => (
  <Link style={{ textDecoration: "none" }} component={RouterLink} to={to}>
    {children}
  </Link>
);

const NavButtonLink = ({
  to,
  icon,
  text,
}: NavButtonLinkProps): ReactElement => (
  <NavLink to={to}>
    <NavButton direction="row">
      {icon}
      {text}
    </NavButton>
  </NavLink>
);

const SideNavBar = (): ReactElement => {
  return (
    <Router>
      <StyledStack
        className="p-top-3"
        direction="column"
        alignItems="center"
        spacing={8}
      >
        <div>
          <LogoImage
            className="m-top-3 m-bottom"
            src={image}
            alt="Sinta Logo"
          />
        </div>

        <div>
          <p style={{ color: "#7B7B7E" }} className="m-bottom-4">
            Workspace
          </p>
          <DropWrapper>
            <Dropdown {...args} />
          </DropWrapper>
        </div>

        <div>
          <p className="m-bottom-4" style={{ color: "#7B7B7E" }}>
            Pages
          </p>
          <NavButtonLink
            to="/"
            icon={<DashboardIcon {...iconMB} />}
            text="Dashboard"
          />
          <NavButtonLink to="/" icon={<RoleIcon {...iconMB} />} text="Roles" />
          <NavButtonLink
            to="/"
            icon={<CandidateIcon {...iconMB} />}
            text="Candidates"
          />
          <NavButtonLink
            to="/"
            icon={<CalendarIcon {...iconMB} />}
            text="Calendar"
          />
        </div>

        <div>
          <p className="m-bottom-4" style={{ color: "#7B7B7E" }}>
            Config
          </p>
          <NavButtonLink
            to="/"
            icon={<SettingIcon {...iconMB} />}
            text="Settings"
          />
          <NavButtonLink to="/" icon={<DoorIcon {...iconMB} />} text="Logout" />
        </div>
      </StyledStack>
    </Router>
  );
};

export default SideNavBar;
