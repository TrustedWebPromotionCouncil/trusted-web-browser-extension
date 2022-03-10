import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputCredentialCompleteView } from "./InputCredentialComplete.view";

export default {
  title: "TrustedWeb/Views/Popup/CreateCredential/InputCredentialComplete",
  component: InputCredentialCompleteView,
} as Meta;

const Template: Story<ComponentProps<typeof InputCredentialCompleteView>> = (
  args
) => <InputCredentialCompleteView {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {};
