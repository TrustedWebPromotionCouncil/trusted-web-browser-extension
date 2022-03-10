import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Button } from "./Button";
// import { Button } from "@/shared/components/button/Button";

export default {
  title: "TrustedWeb/Components/Button",
  component: Button,
} as Meta;

const Template: Story<ComponentProps<typeof Button>> = (args) => (
  <Button {...args}>ログイン</Button>
);

export const DefaultButtonStory = Template.bind({});
DefaultButtonStory.args = {};

export const OutlinedButtonStory = Template.bind({});
OutlinedButtonStory.args = { buttonType: "outlined" };

export const TextButtonStory = Template.bind({});
TextButtonStory.args = { buttonType: "text" };

export const IsLoading = Template.bind({});
IsLoading.args = {
  loading: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
};

export const ButtonOutlinedDisabled = Template.bind({});
ButtonOutlinedDisabled.args = {
  buttonType: "outlined",
  disabled: true,
};
