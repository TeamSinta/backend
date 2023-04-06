import { ComponentMeta, ComponentStory } from "@storybook/react";
import Icons from "./Icons";

export default {
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
} as ComponentMeta<typeof Icons>;

export const Primary: ComponentStory<typeof Icons> = () => <Icons />;
