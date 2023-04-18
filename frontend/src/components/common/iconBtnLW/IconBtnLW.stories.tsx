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
} from "../svgIcons/Icons";
import { iconLB } from "../svgIcons/iconType";
import IconBtnLW from "./IconBtnLW";

const icons = {
    ArrowDown: <ArrowDownIcon {...iconLB} />,
    Calendar: <CalendarIcon {...iconLB} />,
    Candidate: <CandidateIcon {...iconLB} />,
    Close: <CloseIcon {...iconLB} />,
    Dashboard: <DashboardIcon {...iconLB} />,
    Door: <DoorIcon {...iconLB} />,
    Edit: <EditIcon {...iconLB} />,
    Plus: <PlusIcon {...iconLB} />,
    Role: <RoleIcon {...iconLB} />,
    Setting: <SettingIcon {...iconLB} />,
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "common/IconButtonLW",
  component: IconBtnLW,
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
} as ComponentMeta<typeof IconBtnLW>;

const Template: ComponentStory<typeof IconBtnLW> = (arg) => {
  let icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon as unknown as keyof typeof icons];
  }

  if (icon === undefined) {
    return <IconBtnLW {...arg} />;
  } else {
    const current = {
      ...arg,
      icon,
    };
    return <IconBtnLW {...current} />;
  }
};

export const Primary = Template.bind({});

Primary.args = {
  icon: <EditIcon {...iconLB} />,
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  icon: <EditIcon {...iconLB} />,
  disable: true,
};
