import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { LinkText } from "./LinkText";

export default {
  title: "TrustedWeb/Components/LinkText",
  component: LinkText,
} as Meta;

const Template: Story<ComponentProps<typeof LinkText>> = (args) => (
  <LinkText {...args}>リンクテキスト</LinkText>
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
