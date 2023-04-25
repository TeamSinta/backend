import { ComponentMeta, ComponentStory } from "@storybook/react";
import TextInput from "./TextInput";

export default {
  title: "common/input/TextInput",
  component: TextInput,
  argTypes: {
    label: {
      control: {
        type: "text",
      },
      description: "Input label",
    },
    disable: {
      control: {
        type: "boolean",
      },
      description: "Disable or able",
    },
    error: {
      control: {
        type: "boolean",
      },
      description: "Error occur",
    },
    placeholder: {
      control: {
        type: "text",
      },
      description: "Input placeholder",
    },
  },
} as ComponentMeta<typeof TextInput>;

const Template: ComponentStory<typeof TextInput> = (arg) => {
  return <TextInput {...arg}></TextInput>;
};

export const Primary = Template.bind({});

Primary.args = {
  label: "label",
  disable: false,
  placeholder: "placeholder",
  error: false,
};

export const Disable = Template.bind({});

Disable.args = {
  label: "label",
  disable: true,
  placeholder: "placeholder",
  error: false,
};

export const Error = Template.bind({});

Error.args = {
  label: "label",
  disable: false,
  placeholder: "placeholder",
  error: true,
};
