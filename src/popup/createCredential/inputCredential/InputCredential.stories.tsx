import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { InputCredentialView } from "./InputCredential.view";

export default {
  title: "TrustedWeb/Views/Popup/CreateCredential/InputCredential",
  component: InputCredentialView,
} as Meta;

const Template: Story<ComponentProps<typeof InputCredentialView>> = (args) => (
  <InputCredentialView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  input1Candidates: [
    { text: "", value: "" },
    { text: "上司", value: "boss" },
    { text: "部下", value: "staff" },
    { text: "同僚", value: "co_worker" },
    { text: "取引先", value: "client" },
  ],
};
