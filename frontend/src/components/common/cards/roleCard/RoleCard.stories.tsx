import { Meta, StoryObj } from "@storybook/react";
import RoleCard from "./RoleCard";

const members = [
  {
    member_idx: 1,
    member_name: "Mohamed Shegow",
    member_url:
      "https://ca.slack-edge.com/T04C82XCPRU-U04D4BRG8CQ-c4ccf8605ed3-192",
  },
  {
    member_idx: 2,
    member_name: "Suwon Baek",
    member_url:
      "https://ca.slack-edge.com/T04C82XCPRU-U04KS4AQG0N-5dc6b4356f80-512",
  },
  {
    member_idx: 3,
    member_name: "Mattias Welamsson",
    member_url:
      "https://ca.slack-edge.com/T04C82XCPRU-U04L1685M5J-81974d1311f3-512",
  },
  {
    member_idx: 4,
    member_name: "Sammy Kavanagh",
    member_url: "",
  },
];

const meta = {
  title: "common/cards/RoleCard",
  component: RoleCard,
  argTypes: {
    title: {
      description: "Card title",
    },
    disable: {
      description:
        "Availability is determined by conditions, making it unclickable when not available.",
    },
  },
} as Meta<typeof RoleCard>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "FontEnd Problem Solving",
    location: "Remote",
    members: members,
    disable: false,
  },
};

export const Disable: Story = {
  args: {
    title: "FontEnd Problem Solving",
    location: "Remote",
    members: members,
    disable: true,
  },
};

export const MoreThan4: Story = {
  args: {
    title: "FontEnd Problem Solving",
    location: "Remote",
    members: [...members, ...members],
    disable: false,
  },
};
