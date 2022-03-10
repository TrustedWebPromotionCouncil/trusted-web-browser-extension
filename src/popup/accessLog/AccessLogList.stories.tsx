import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { AccessLogListView } from "./AccessLogList.view";

export default {
  title: "TrustedWeb/Views/Popup/AccessLog",
  component: AccessLogListView,
} as Meta;

const Template: Story<ComponentProps<typeof AccessLogListView>> = (args) => (
  <AccessLogListView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  accessLogs: [
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "応募情報",
      createdAt: new Date(),
      targetKey: "1",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "本人確認情報",
      createdAt: new Date(),
      targetKey: "2",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "在籍証明情報",
      createdAt: new Date(),
      targetKey: "3",
    },
  ],
};

export const SecondStory = Template.bind({});
SecondStory.args = {
  accessLogs: [
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "応募情報",
      createdAt: new Date(),
      targetKey: "1",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "本人確認情報",
      createdAt: new Date(),
      targetKey: "2",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "在籍証明情報",
      createdAt: new Date(),
      targetKey: "3",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "在籍証明情報",
      createdAt: new Date(),
      targetKey: "3",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "在籍証明情報",
      createdAt: new Date(),
      targetKey: "3",
    },
    {
      operator: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
      operatorName: "株式会社A(応募先企業)",
      cvTypeLabel: "在籍証明情報",
      createdAt: new Date(),
      targetKey: "3",
    },
  ],
};

export const ThirdStory = Template.bind({});
ThirdStory.args = {
  loading: true,
  accessLogs: [],
};
