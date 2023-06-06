import React from "react";
import { type Meta, type StoryObj } from "@storybook/react";
import TextIconBtn from "./TextIconBtn";
import {
  PlusIcon,
  GoogleIcon,
  RightBracketIcon,
  AsteriskIcon,
  ArrowDownIcon,
} from "@/components/common/svgIcons/Icons";
import { iconSW } from "@/components/common/svgIcons/iconType";

const icons = {
  Plus: <PlusIcon {...iconSW} />,
  Google: <GoogleIcon {...iconSW} />,
  RightBalcket: <RightBracketIcon {...iconSW} />,
  Asterisk: <AsteriskIcon {...iconSW} />,
  ArrowDown: <ArrowDownIcon {...iconSW} />,
};

const meta = {
  title: "common/buttons/TextIconButton",
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
} as Meta<typeof TextIconBtn>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Create",
    icon: <PlusIcon {...iconSW} />,
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    label: "Create",
    icon: <PlusIcon {...iconSW} />,
    disable: true,
  },
};
