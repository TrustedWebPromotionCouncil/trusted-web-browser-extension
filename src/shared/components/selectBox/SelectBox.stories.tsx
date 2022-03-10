import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { SelectBox } from "./SelectBox";

export default {
  title: "TrustedWeb/Components/SelectBox",
  component: SelectBox,
} as Meta;

const selectItems = [
  {
    value: 1,
    text: "aaaa@datasign.team",
  },
  {
    value: 2,
    text: "bbbb@datasign.team",
  },
  {
    value: 3,
    text: "cccc@datasign.team",
  },
];

const Template: Story<ComponentProps<typeof SelectBox>> = (args) => (
  <SelectBox {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  items: selectItems,
};
