import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { ProvideCredentialView } from "./ProvideCredential.view";

export default {
  title: "TrustedWeb/Views/Popup/ProvideCredential/Provide",
  component: ProvideCredentialView,
} as Meta;

const Template: Story<ComponentProps<typeof ProvideCredentialView>> = (
  args
) => <ProvideCredentialView {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = {
  checkItems: [
    { label: "在籍証明", value: "jobCredential" },
    { label: "レファレンス回答", value: "referenceCredential" },
  ],
};

export const ErrorStory = Template.bind({});
ErrorStory.args = {
  checkItems: [
    { label: "在籍証明", value: "jobCredential" },
    { label: "レファレンス回答", value: "referenceCredential" },
  ],
  error: { title: "something is wrong" },
};
