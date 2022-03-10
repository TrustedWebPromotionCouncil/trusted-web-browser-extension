import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { MenuView } from "./Menu.view";

export default {
  title: "TrustedWeb/Views/Popup/Menu",
  component: MenuView,
} as Meta;

const Template: Story<ComponentProps<typeof MenuView>> = (args) => (
  <MenuView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  onClick: (menu: string) => console.log(menu),
};
