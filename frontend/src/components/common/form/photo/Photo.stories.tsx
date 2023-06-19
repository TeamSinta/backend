import { Meta, StoryObj } from "@storybook/react";
import Photo from "./Photo";
import { action } from "@storybook/addon-actions";
const photoStoryMeta = {
  title: "common/form/Photo",
  component: Photo,
  argTypes: {
    selected: {
      description:
        "Selection status, the default value is false for unselected." +
        " If it is selected, it will be updated to true and a checkmark will be displayed.",
      defaultValue: false,
      table: { defaultValue: { summary: false } },
    },
    onSelect: {
      description:
        "When clicked using the onClick event, if the selected value is `true`, it will be changed to `false`, " +
        "and if it is `false`, it will be changed to `true`.",
    },
    member_idx: {
      description:
        "A unique value to identify which member is selected. " +
        "By passing the idx to the Redux store through onSelect, " +
        "the store searches for the member with the same idx value and changes the selection status.",
    },
    member_name: {
      description:
        "Member name, used to display the profile screen with the initial of the name if there is no member's photo URL.",
    },
    member_url: {
      description: "Member's profile image URL.",
    },
  },
} as Meta<typeof Photo>;
export default photoStoryMeta;

type Story = StoryObj<typeof photoStoryMeta>;

export const Primary: Story = {
  args: {
    selected: false,
    onSelect: action("Click Handler"),
    member_idx: 1,
    member_name: "Mohamed Shegow",
    member_url: "",
  },
};

export const SelectedMember: Story = {
  args: {
    selected: true,
    onSelect: action("Click Handler"),
    member_idx: 1,
    member_name: "Mohamed Shegow",
    member_url: "",
  },
};

export const PrimaryWithImg: Story = {
  args: {
    selected: false,
    onSelect: action("Click Handler"),
    member_idx: 1,
    member_name: "Mohamed Shegow",
    member_url:
      "https://ca.slack-edge.com/T04C82XCPRU-U04D4BRG8CQ-c4ccf8605ed3-512",
  },
};

export const SelectedMemberWithImg: Story = {
  args: {
    selected: true,
    onSelect: action("Click Handler"),
    member_idx: 1,
    member_name: "Mohamed Shegow",
    member_url:
      "https://ca.slack-edge.com/T04C82XCPRU-U04D4BRG8CQ-c4ccf8605ed3-512",
  },
};
