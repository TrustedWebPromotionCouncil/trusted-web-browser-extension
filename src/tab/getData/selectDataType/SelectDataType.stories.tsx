import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { SelectDataTypeView } from "./SelectDataType.view";

export default {
  title: "TrustedWeb/Views/Tab/GetData/SelectDataType",
  component: SelectDataTypeView,
} as Meta;

const Template: Story<ComponentProps<typeof SelectDataTypeView>> = (args) => (
  <SelectDataTypeView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  items: ["在籍証明情報", "本人確認情報", "応募情報"],
};
