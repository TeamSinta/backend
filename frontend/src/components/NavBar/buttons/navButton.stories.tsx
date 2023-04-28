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
import { iconSW } from "components/common/svgIcons/iconType";
import NavBarButton from "./navButton";

const icons = {
  Role: <RoleIcon {...iconSW} />,
  Candidate: <CandidateIcon {...iconSW} />,
  Calender: <CalendarIcon {...iconSW} />,
  Setting: <SettingIcon {...iconSW} />,
  Dashboard: <DashboardIcon {...iconSW} />,
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
    disable: {
      control: {
        type: "boolean",
      },
      description: "Disable or able",
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

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Primary.args = {
  label: "Create",
  icon: <DashboardIcon {...iconSW} />,
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  label: "Create",
  icon: <DashboardIcon {...iconSW} />,
  disable: true,
};
