import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Title } from "./Title";

export default {
  title: "TrustedWeb/Components/Title",
  component: Title,
} as Meta;

const Template: Story<ComponentProps<typeof Title>> = (args) => (
  <Title {...args} />
);

export const Title1 = Template.bind({});
Title1.args = { headline: "タイトル" };

export const Title2 = Template.bind({});
Title2.args = { headline: "タイトル", subtitle: "サブタイトル" };
