import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import {
  ArrowDownIcon,
  CalendarIcon,
  CandidateIcon,
  CloseIcon,
  DashboardIcon,
  DoorIcon,
  EditIcon,
  PlusIcon,
  RoleIcon,
  SettingIcon,
} from "../../svgIcons/Icons";
import { iconLW } from "../../svgIcons/iconType";
import IconBtnLP from "./IconBtnLP";

const icons = {
  ArrowDown: <ArrowDownIcon {...iconLW} />,
  Calendar: <CalendarIcon {...iconLW} />,
  Candidate: <CandidateIcon {...iconLW} />,
  Close: <CloseIcon {...iconLW} />,
  Dashboard: <DashboardIcon {...iconLW} />,
  Door: <DoorIcon {...iconLW} />,
  Edit: <EditIcon {...iconLW} />,
  Plus: <PlusIcon {...iconLW} />,
  Role: <RoleIcon {...iconLW} />,
  Setting: <SettingIcon {...iconLW} />,
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "common/IconButtonLP",
  component: IconBtnLP,
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
    disable: {
      control: {
        type: "boolean",
      },
      description: "Disable or able",
    },
  },
} as ComponentMeta<typeof IconBtnLP>;

const Template: ComponentStory<typeof IconBtnLP> = (arg) => {
  let icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon as unknown as keyof typeof icons];
  }

  if (icon === undefined) {
    return <IconBtnLP {...arg} />;
  } else {
    const current = {
      ...arg,
      icon,
    };
    return <IconBtnLP {...current} />;
  }
};

export const Primary = Template.bind({});

Primary.args = {
  icon: <EditIcon {...iconLW} />,
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  icon: <EditIcon {...iconLW} />,
  disable: true,
};
