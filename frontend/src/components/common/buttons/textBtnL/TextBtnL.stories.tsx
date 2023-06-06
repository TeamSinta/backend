import type { Meta, StoryObj } from "@storybook/react";
import TextBtnL from "./TextBtnL";

const meta = {
  title: "common/buttons/TextBtnL",
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
} as Meta<typeof TextBtnL>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Invite",
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    label: "Invite",
    disable: false,
  },
};
