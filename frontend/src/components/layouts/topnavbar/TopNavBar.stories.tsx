import React from "react";
import type { Story, Meta } from "@storybook/react";

import TopNavBar from "./TopNavBar";

export default {
  title: "NavBar/TopNavBar",
  component: TopNavBar,
} as Meta;

const Template: Story = () => <TopNavBar />;

export const Default = Template.bind({});
