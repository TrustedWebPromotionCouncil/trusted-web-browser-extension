import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputCareerView } from "./InputCareer.view";

export default {
  title: "TrustedWeb/Views/Setup/InputCareerView",
  component: InputCareerView,
} as Meta;

const Template: Story<ComponentProps<typeof InputCareerView>> = (args) => (
  <InputCareerView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const BadRequest = Template.bind({});
BadRequest.args = {
  error: { title: "存在しないメールアドレスです" },
};
