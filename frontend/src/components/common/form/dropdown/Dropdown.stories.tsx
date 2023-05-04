import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import { DropdownLayoutType } from "./StyledDropdown";
import Dropdown from "./Dropdown";

export default {
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
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (arg): JSX.Element => {
  return <Dropdown {...arg}></Dropdown>;
};

export const flexLayout = Template.bind({});

flexLayout.args = {
  label: "stage",
  layoutType: DropdownLayoutType.FLEX,
  optionArr: [
    { name: "BANANA", value: "banana" },
    { name: "APPLE", value: "apple" },
    { name: "ORANGE", value: "orange" },
  ],
  dropdownName: "fruit",
  dropdownIconVisible: true,
};

export const blockLayout = Template.bind({});

blockLayout.args = {
  label: "stage",
  layoutType: DropdownLayoutType.BLOCK,
  optionArr: [
    { name: "BANANA", value: "banana" },
    { name: "APPLE", value: "apple" },
    { name: "ORANGE", value: "orange" },
  ],
  dropdownName: "fruit",
  dropdownIconVisible: true,
};
