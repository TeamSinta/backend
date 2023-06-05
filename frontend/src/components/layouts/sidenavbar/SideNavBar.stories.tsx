import React from "react";
import type { Story, Meta } from "@storybook/react";

import SideNavBar from "./SideNavBar";

export default {
  title: "NavBar/SideNavBar",
  component: SideNavBar,
} as Meta;

const Template: Story = () => <SideNavBar />;

export const Default = Template.bind({});
