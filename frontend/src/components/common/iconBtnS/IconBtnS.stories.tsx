import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import {
  AsteriskIcon,
  BinIcon,
  CalendarIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  DocumentIcon,
  HambergerIcon,
  GoogleIcon,
  PaperIcon,
  PlusIcon,
  RightBracketIcon,
} from "../svgIcons/Icons";
import { iconSB } from "../svgIcons/iconType";
import IconBtnS from "./IconBtnS";

const icons = {
  Asterisk: <AsteriskIcon {...iconSB} />,
  Bin: <BinIcon {...iconSB} />,
  Calendar: <CalendarIcon {...iconSB} />,
  Card: <CardIcon {...iconSB} />,
  Chat: <ChatIcon {...iconSB} />,
  Check: <CheckIcon {...iconSB} />,
  Document: <DocumentIcon {...iconSB} />,
  Hamburger: <HambergerIcon {...iconSB} />,
  Goggle: <GoogleIcon {...iconSB} />,
  Paper: <PaperIcon {...iconSB} />,
  Plus: <PlusIcon {...iconSB} />,
  RightBracket: <RightBracketIcon {...iconSB} />,
};

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "common/IconButtonS",
  component: IconBtnS,
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
} as ComponentMeta<typeof IconBtnS>;

const Template: ComponentStory<typeof IconBtnS> = (arg) => {
  let icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon as unknown as keyof typeof icons];
  }

  if (icon === undefined) {
    return <IconBtnS {...arg} />;
  } else {
    const current = {
      ...arg,
      icon,
    };
    return <IconBtnS {...current} />;
  }
};

export const Primary = Template.bind({});

Primary.args = {
  icon: <BinIcon {...iconSB} />,
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  icon: <BinIcon {...iconSB} />,
  disable: true,
};
