import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { ConsentView } from "./Consent.view";

export default {
  title: "TrustedWeb/Views/Tab/ProvideData/Consent",
  component: ConsentView,
} as Meta;

const Template: Story<ComponentProps<typeof ConsentView>> = (args) => (
  <ConsentView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  dataDestination: "株式会社XXX",
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
          ],
        },
      ],
    },
    {
      type: "set",
      name: "本人確認情報",
      values: [
        {
          type: "set",
          name: "氏名",
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
      ],
    },
  ],
};

export const Error = Template.bind({});
Error.args = { error: { title: "データ提供リクエストの検証に失敗しました" } };
