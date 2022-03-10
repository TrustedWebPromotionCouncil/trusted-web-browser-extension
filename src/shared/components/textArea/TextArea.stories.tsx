import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { TextArea } from "./TextArea";

export default {
  title: "TrustedWeb/Components/TextArea",
  component: TextArea,
} as Meta;

const Template: Story<ComponentProps<typeof TextArea>> = (args) => (
  <TextArea {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = { label: "test", value: "test" };

export const ErrorStory = Template.bind({});
ErrorStory.args = { label: "test", value: "test", error: "test" };
