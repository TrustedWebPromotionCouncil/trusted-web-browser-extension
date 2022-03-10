import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { SelectSchemaView } from "./SelectSchema.view";

export default {
  title: "TrustedWeb/Views/Popup/CreateCredential/SelectSchema",
  component: SelectSchemaView,
} as Meta;

const Template: Story<ComponentProps<typeof SelectSchemaView>> = (args) => (
  <SelectSchemaView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {};
