import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { ProvideCredentialCompleteView } from "./ProvideCredentialComplete.view";

export default {
  title: "TrustedWeb/Views/Popup/ProvideCredential/ProvideComplete",
  component: ProvideCredentialCompleteView,
} as Meta;

const Template: Story<ComponentProps<typeof ProvideCredentialCompleteView>> = (
  args
) => <ProvideCredentialCompleteView {...args} />;

export const FirstStory = Template.bind({});
FirstStory.args = { url: "http://localhost:3000/test" };
