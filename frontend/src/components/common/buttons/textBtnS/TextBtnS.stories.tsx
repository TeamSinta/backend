import React from "react";
import { type ComponentMeta, type ComponentStory } from "@storybook/react";
import TextBtnS from "./TextBtnS";

// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
export default {
  title: "common/TextButtonS",
  component: TextBtnS,
  argTypes: {
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
} as ComponentMeta<typeof TextBtnS>;

const Template: ComponentStory<typeof TextBtnS> = (arg) => {
  return <TextBtnS {...arg} />;
};

export const Primary = Template.bind({});

Primary.args = {
  label: "No, leave candidate",
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  label: "No, leave candidate",
  disable: true,
};
