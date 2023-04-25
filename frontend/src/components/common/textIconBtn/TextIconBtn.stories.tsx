/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import {
  ArrowDownIcon,
  AsteriskIcon,
  GoogleIcon,
  PlusIcon,
  RightBracketIcon,
} from "../svgIcons/Icons";
import { iconSW } from "../svgIcons/iconType";
import TextIconBtn from "./TextIconBtn";

const icons = {
  Plus: <PlusIcon {...iconSW} />,
  Google: <GoogleIcon {...iconSW} />,
  RightBalcket: <RightBracketIcon {...iconSW} />,
  Asterisk: <AsteriskIcon {...iconSW} />,
  ArrowDown: <ArrowDownIcon {...iconSW} />,
};

export default {
  title: "common/button/TextIconButton",
  component: TextIconBtn,
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
} as ComponentMeta<typeof TextIconBtn>;

const Template: ComponentStory<typeof TextIconBtn> = (arg) => {
  let icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon as unknown as keyof typeof icons];
  }

  if (icon === undefined) {
    return <TextIconBtn {...arg} />;
  } else {
    const current = {
      ...arg,
      icon,
    };
    return <TextIconBtn {...current} />;
  }
};

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Primary.args = {
  label: "Create",
  icon: <PlusIcon {...iconSW} />,
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  label: "Create",
  icon: <PlusIcon {...iconSW} />,
  disable: true,
};
