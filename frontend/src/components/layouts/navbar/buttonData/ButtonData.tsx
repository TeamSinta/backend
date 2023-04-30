import React from "react";

import {
  RoleIcon,
  CandidateIcon,
  CalendarIcon,
  SettingIcon,
  DashboardIcon,
  DoorIcon,
} from "components/common/svgIcons/Icons";
import { iconLB } from "components/common/svgIcons/iconType";

export const buttonData = [
  {
    id: 1,
    text: "Dashboard",
    onClick: () => {},
    active: true,
    icon: <DashboardIcon {...iconLB} />,
  },
  {
    id: 2,
    text: "Roles",
    onClick: () => {},
    active: false,
    icon: <RoleIcon {...iconLB} />,
  },
  {
    id: 3,
    text: "Candidates",
    onClick: () => {},
    active: false,
    icon: <CandidateIcon {...iconLB} />,
  },
  {
    id: 4,
    text: "Calendar",
    onClick: () => {},
    active: false,
    icon: <CalendarIcon {...iconLB} />,
  },
  {
    id: 5,
    text: "Settings",
    onClick: () => {},
    active: false,
    icon: <SettingIcon {...iconLB} />,
  },
  {
    id: 6,
    text: "Logout",
    onClick: () => {},
    active: false,
    icon: <DoorIcon {...iconLB} />,
  },
];
