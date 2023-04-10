import { ComponentMeta, ComponentStory } from "@storybook/react";
import { argv } from "process";
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
  title: "common/TextIconButton",
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
    },
  },
} as ComponentMeta<typeof TextIconBtn>;

const Template: ComponentStory<typeof TextIconBtn> = (arg) => {
  var icon = arg.icon;
  if (icon !== undefined) {
    icon = icons[arg.icon.toString() as keyof typeof icons];
  }

  if (icon === undefined) {
    return <TextIconBtn {...arg} />;
  } else {
    var current = {
      ...arg,
      icon: icon,
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
