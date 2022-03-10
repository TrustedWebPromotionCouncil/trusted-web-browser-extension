import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { DownloadView } from "./Download.view";

export default {
  title: "TrustedWeb/Views/Tab/GetData/Download",
  component: DownloadView,
} as Meta;

const Template: Story<ComponentProps<typeof DownloadView>> = (args) => (
  <DownloadView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  viewTitle: "応募者情報",
  credentials: [
    {
      verified: true,
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
      ],
    },
    {
      verified: true,
      dataSet: [
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
      ],
    },
    {
      verified: false,
      dataSet: [
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
    },
    {
      verified: false,
      dataSet: [
        {
          type: "set",
          name: "レファレンス回答",
          values: [
            {
              type: "leaf",
              name: "回答者",
              value:
                "did:ion:EiDS1uonEtvzBgHM7XNsTQYtgrQaB3BajhxCv5_nY1HVqA:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJoTDBWWm9tTGZvOWNlVFEzWlJWcVFLUTZHQUlQOXB3VVFxdTZ0dEVYVVZrIiwieSI6Im1Bb1dVYTEtUzNIOTNab1FTdDZBZzBMMkg2R09iZ0RGN2hGajFoaThNeU0ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iLCJrZXlBZ3JlZW1lbnQiXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQ1hqbnFkZURFVVlNU3JOM1g1RmR2YXZ1dkJOUmtLTkRDMld2MDZTel9QMGcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJkSGtoWDFBZ0lUcGcxU1dheTBGZGxqRzlHZHh0X1lmcFlLeF9fcG9rSHRnIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlDUS1BVXZseUI4bXpGQ2lHU2RvT0lmS0dNWENWbS0zc3UySElnVm9EOUFyQSJ9fQ",
            },
          ],
        },
      ],
    },
  ],
};
