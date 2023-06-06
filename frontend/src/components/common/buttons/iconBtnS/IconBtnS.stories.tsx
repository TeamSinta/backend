import { type Meta, type StoryObj } from "@storybook/react";
import { iconSB } from "@/components/common/svgIcons/iconType";
import IconBtnS from "@/components/common/buttons/iconBtnS/IconBtnS";
import {
  AsteriskIcon,
  BinIcon,
  CalendarIcon,
  CardIcon,
  ChatIcon,
  CheckIcon,
  DocumentIcon,
  GoogleIcon,
  HambergerIcon,
  PaperIcon,
  PlusIcon,
  RightBracketIcon,
} from "@/components/common/svgIcons/Icons";

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

const meta = {
  title: "common/buttons/IconButtonS",
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
} as Meta<typeof IconBtnS>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: <BinIcon {...iconSB} />,
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    icon: <BinIcon {...iconSB} />,
    disable: true,
  },
};
