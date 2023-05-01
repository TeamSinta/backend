import React from "react";
import type { ComponentMeta, ComponentStory } from "@storybook/react";
import SearchInput from "./SearchInput";

export default {
  title: "common/form/SearchInput",
  component: SearchInput,
  argTypes: {
    disable: {
      control: {
        type: "boolean",
      },
      description: "Disable or able",
    },
    placeholder: {
      control: {
        type: "text",
      },
      description: "Input placeholder",
    },
  },
} as ComponentMeta<typeof SearchInput>;

const Template: ComponentStory<typeof SearchInput> = (arg): JSX.Element => {
  return <SearchInput {...arg} {...arg}></SearchInput>;
};

export const Primary = Template.bind({});

Primary.args = {
  disable: false,
  placeholder: "Search for a role or candidate",
};

export const Disable = Template.bind({});

Disable.args = {
  disable: true,
  placeholder: "Search for a role or candidate",
};
