import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { WelcomeView } from "./Welcome.view";

export default {
  title: "TrustedWeb/Views/Setup/Welcome",
  component: WelcomeView,
} as Meta;

const Template: Story<ComponentProps<typeof WelcomeView>> = (args) => (
  <WelcomeView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const BadRequest = Template.bind({});
BadRequest.args = {
  error: { title: "存在しないメールアドレスです" },
};
