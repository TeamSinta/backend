import { type Meta, type StoryObj } from "@storybook/react";
import { DropdownLayoutType } from "./StyledDropdown";
import Dropdown from "./Dropdown";

const meta = {
  title: "common/form/Dropdown",
  component: Dropdown,
  argTypes: {
    label: {
      control: {
        type: "text",
      },
      description: "Label for select",
    },
    dropdownName: {
      control: {
        type: "text",
      },
      description: "The name attribute of a select element.",
    },
    layoutType: {
      options: [DropdownLayoutType.BLOCK, DropdownLayoutType.FLEX],
      control: { type: "radio" },
      description: "Option for positioning label",
    },
    dropdownIconVisible: {
      options: [true, false],
      control: { type: "radio" },
      description: "Option to include inline icon or not",
    },
  },
} as Meta<typeof Dropdown>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FlexLayout: Story = {
  args: {
    label: "stage",
    layoutType: DropdownLayoutType.FLEX,
    optionArr: [
      { name: "BANANA", value: "banana" },
      { name: "APPLE", value: "apple" },
      { name: "ORANGE", value: "orange" },
    ],
    dropdownName: "fruit",
    dropdownIconVisible: true,
  },
};

export const BlockLayout: Story = {
  args: {
    label: "stage",
    layoutType: DropdownLayoutType.BLOCK,
    optionArr: [
      { name: "BANANA", value: "banana" },
      { name: "APPLE", value: "apple" },
      { name: "ORANGE", value: "orange" },
    ],
    dropdownName: "fruit",
    dropdownIconVisible: true,
  },
};
