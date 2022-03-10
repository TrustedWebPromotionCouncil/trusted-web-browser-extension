import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { LockView } from "./Lock.view";

export default {
  title: "TrustedWeb/Views/Tab/Lock",
  component: LockView,
} as Meta;

const Template: Story<ComponentProps<typeof LockView>> = (args) => (
  <LockView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const Error = Template.bind({});
Error.args = { error: { title: "パスワードが違います" } };
