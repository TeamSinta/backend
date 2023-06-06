import { type Meta, type StoryObj } from "@storybook/react";
import Icons from "./Icons";

const meta = {
  title: "StyleGuid/Icons",
  component: Icons,
  argTypes: {
    icons: {
      description:
        "Icon List : When using an icon component, width, height, stroke, or fill must be provided as required elements.",
    },
    args: {
      description: "```iconSB```, ```iconMB```, ```iconLB```",
    },
  },
} as Meta<typeof Icons>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
