import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { useEffect, useState } from "react";
import CheckBox, { ICheckBoxProps } from "./CheckBox";

const CheckBoxStoryComponent = (props: ICheckBoxProps) => {
  const { label, inputName, checked, disabled } = props;

  const [check, setCheck] = useState(checked);

  useEffect(() => {
    setCheck(checked);
  }, [checked, disabled]);

  return (
    <CheckBox
      onChange={
        disabled
          ? () => {}
          : (e) => {
              action("change")(e);
              setCheck(e.target.checked);
            }
      }
      label={label}
      inputName={inputName}
      checked={check}
      disabled={disabled}
    />
  );
};

const meta = {
  title: "common/form/CheckBox",
  component: CheckBoxStoryComponent,
  argTypes: {
    label: {
      description: "Label name next to the checkbox",
    },
    inputName: {
      description: "Checkbox input name",
    },
    checked: {
      description: "Checkbox checked status",
    },
    disabled: {
      description: "Checkbox disabled status",
    },
    onChange: {
      description: "Event triggered when the checkbox is clicked",
    },
  },
} as Meta<typeof CheckBoxStoryComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Check Box",
    inputName: "Check Box",
    checked: false,
    disabled: false,
    onChange: () => {},
  },
};

export const Checked: Story = {
  args: {
    label: "Check Box",
    inputName: "Check Box",
    checked: true,
    disabled: false,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: "Check Box",
    inputName: "Check Box",
    checked: false,
    disabled: true,
    onChange: () => {},
  },
};
