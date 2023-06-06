import { type Meta, type StoryObj } from "@storybook/react";
import TextBtnS from "./TextBtnS";

const meta = {
  title: "common/buttons/TextButtonS",
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
} as Meta<typeof TextBtnS>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "No, leave candidate",
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    label: "No, leave candidate",
    disable: true,
  },
};
