import { ComponentMeta, ComponentStory } from "@storybook/react";
import TypeScale from "./TypsScale";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "StyleGuid/TypeScale",
  component: TypeScale,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  //   argTypes: {
  //     label: "label",
  //   },
} as ComponentMeta<typeof TypeScale>;

const Template: ComponentStory<typeof TypeScale> = (arg) => (
  <TypeScale {...arg} />
);

export const Primary = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: "Type Scale",
};
