import { ComponentMeta, ComponentStory } from "@storybook/react";
import TextBtnL from "./TextBtnL";


export default {
  title: "common/TextIconButton",
  component: TextIconBtn,
  argTypes: {
    icon: {
      control: {
        type: "select",
        options: Object.keys(icons),
        mapping: {
          icons,
        },
      },
      description: "Icon components",
    },
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
} as ComponentMeta<typeof TextIconBtn>;
