import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { RecoverWalletView } from "./RecoverWallet.view";

export default {
  title: "TrustedWeb/Views/Setup/RecoverWalletView",
  component: RecoverWalletView,
} as Meta;

const Template: Story<ComponentProps<typeof RecoverWalletView>> = (args) => (
  <RecoverWalletView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};

export const BadRequest = Template.bind({});
BadRequest.args = {
  error: { title: "存在しないメールアドレスです" },
};
