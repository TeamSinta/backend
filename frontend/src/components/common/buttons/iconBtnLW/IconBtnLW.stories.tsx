import { StoryObj, Meta } from "@storybook/react";
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
import { iconLB } from "@/components/common/svgIcons/iconType";
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

const meta = {
  title: "common/buttons/IconButtonLW",
  component: IconBtnLW,
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
} as Meta<typeof IconBtnLW>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    icon: <EditIcon {...iconLB} />,
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    icon: <EditIcon {...iconLB} />,
    disable: true,
  },
};
