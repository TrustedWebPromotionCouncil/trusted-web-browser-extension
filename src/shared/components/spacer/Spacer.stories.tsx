import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { Spacer } from "./Spacer";

export default {
  title: "TrustedWeb/Components/Spacer",
  component: Spacer,
} as Meta;

const Template: Story<ComponentProps<typeof Spacer>> = (args) => (
  <>
    <div>this is an above element</div>
    <Spacer {...args} />
    <div>this is a below element</div>
  </>
);

export const Times4 = Template.bind({});
Times4.args = { space: 4 };

export const Times8 = Template.bind({});
Times8.args = { space: 8 };

export const Times12 = Template.bind({});
Times12.args = { space: 12 };

export const Times16 = Template.bind({});
Times16.args = { space: 16 };

export const Times24 = Template.bind({});
Times24.args = { space: 24 };

export const Times32 = Template.bind({});
Times32.args = { space: 32 };
