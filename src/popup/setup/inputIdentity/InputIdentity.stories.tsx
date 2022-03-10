import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputIdentityView } from "./InputIdentity.view";

export default {
  title: "TrustedWeb/Views/Setup/InputIdentity",
  component: InputIdentityView,
} as Meta;

const Template: Story<ComponentProps<typeof InputIdentityView>> = (args) => (
  <InputIdentityView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const BadRequest = Template.bind({});
BadRequest.args = {
  error: { title: "存在しないメールアドレスです" },
};
