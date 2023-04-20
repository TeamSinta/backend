import type { ComponentStory } from "@storybook/react";
import TextBtnL from "./TextBtnL";
import React from "react";

export default {
  title: "common/button/TextBtnL",
  component: TextBtnL,
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
} as const;

const Template: ComponentStory<typeof TextBtnL> = (args) => (
  <TextBtnL {...args} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

Primary.args = {
  label: "Invite",
  disable: false,
};

export const Disable = Template.bind({});

Disable.args = {
  label: "Invite",
  disable: true,
};
