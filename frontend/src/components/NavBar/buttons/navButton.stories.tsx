/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import {
  RoleIcon,
  CandidateIcon,
  CalendarIcon,
  SettingIcon,
  DashboardIcon,
} from "components/common/svgIcons/Icons";
import { iconLB } from "components/common/svgIcons/iconType";
import NavBarButton from "./navButton";

const icons = {
  Role: <RoleIcon {...iconLB} />,
  Candidate: <CandidateIcon {...iconLB} />,
  Calender: <CalendarIcon {...iconLB} />,
  Setting: <SettingIcon {...iconLB} />,
  Dashboard: <DashboardIcon {...iconLB} />,
};

export default {
  title: "NavBar/button/TextIconButton",
  component: NavBarButton,
  argTypes: {
    icon: {
      control: {
        type: "select",
        options: Object.keys(icons),
        mapping: {
          icons,
        },
      },
      description: "Icon components",
    },
    label: {
      control: {
        type: "text",
      },
      description: "Text for button",
    },
    active: {
      control: {
        type: "boolean",
      },
      description: "Active or not",
    },
  },
} as ComponentMeta<typeof NavBarButton>;

const Template: ComponentStory<typeof NavBarButton> = (arg) => {
  let icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon as unknown as keyof typeof icons];
  }

  if (icon === undefined) {
    return <NavBarButton {...arg} />;
  } else {
    const current = {
      ...arg,
      icon,
    };
    return <NavBarButton {...current} />;
  }
};

export const Inactive = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

export const Active = Template.bind({});

Active.args = {
  label: "Dashboard",
  icon: <DashboardIcon {...iconLB} />,
  active: true,
};

Inactive.args = {
  label: "Dashboard",
  icon: <DashboardIcon {...iconLB} />,
  active: false,
};
