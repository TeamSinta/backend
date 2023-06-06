import { type Meta, StoryObj } from "@storybook/react";
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
} from "@/components/common/svgIcons/Icons";
import { iconLW } from "@/components/common/svgIcons/iconType";
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

const meta = {
  title: "common/buttons/IconButtonLP",
  component: IconBtnLP,
  argTypes: {
    icon: {
      control: {
        type: "select",
      },
      options: Object.keys(icons),
      mapping: icons,
      description: "Icon components",
    },
    disable: {
      control: {
        type: "boolean",
      },
      description: "Disable or able",
    },
  },
} as Meta<typeof IconBtnLP>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: <EditIcon {...iconLW} />,
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    icon: <EditIcon {...iconLW} />,
    disable: true,
  },
};
