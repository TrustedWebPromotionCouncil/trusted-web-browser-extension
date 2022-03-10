import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { DataSetView } from "./DataSetView";

export default {
  title: "TrustedWeb/Components/DataSetView",
  component: DataSetView,
} as Meta;

const Template: Story<ComponentProps<typeof DataSetView>> = (args) => (
  <DataSetView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  dataSet: [
    {
      type: "set",
      name: "所属企業の在籍証明",
      values: [
        {
          type: "set",
          name: "会社情報",
          values: [
            {
              type: "leaf",
              name: "会社名",
              value: "株式会社DataSign",
            },
            {
              type: "leaf",
              name: "組織",
              value: "システム開発部",
            },
            {
              type: "leaf",
              name: "役職",
              value: "一般",
            },
          ],
        },
      ],
    },
    {
      type: "set",
      name: "本人確認情報",
      values: [
        {
          type: "leaf",
          name: "氏",
          value: "テスト",
        },
        {
          type: "leaf",
          name: "名",
          value: "太郎",
        },
      ],
    },
    {
      type: "set",
      name: "連絡先",
      values: [
        {
          type: "leaf",
          name: "メールアドレス",
          value: "test@example.com",
        },
      ],
    },
  ],
};
