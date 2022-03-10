import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { SwitchAccountView } from "./SwitchAccount.view";

export default {
  title: "TrustedWeb/Views/Popup/AccountSetting/SwitchAccountView",
  component: SwitchAccountView,
} as Meta;

const Template: Story<ComponentProps<typeof SwitchAccountView>> = (args) => (
  <SwitchAccountView {...args} />
);

const did1 =
  "did:ion:EiBMPBjvsDqUqjvV8sgOhZEj4tExUECGlnPJ3kMrhvX5tQ" +
  ":eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI2Q0dHQVB4LXFOTzVXc1NQSlMwcTN4enA3bldhTjdBSzhYdEoyOXZ1MGVFIiwieSI6InNCOURicXRmdTlGajRHbmhCUzNTREs5OGUxVEM2dkxsUm56eTVCMTJHSkEifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iLCJrZXlBZ3JlZW1lbnQiXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQlN5Q2x0RkNETUZVTGZ3aG9RdGpmOFQzS0lGSXo4eG5DQ2o3YUU3VWVUSXcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNiaHBfb21KMnNmMDJKUVNTeEZZSjFFbVRkc3RpMV9MNGx1MmtkUkViTGtBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCOXJlUW9vNjlwWFllZEo5dy1BanhxeDlVNlVZLUpBLWxzWGFTYW00dlhDUSJ9fQ";

const did2 =
  "did:ion:EiBMPBjvsDqUqjvV8sgOhZEj4tExUECGlnPJ3kMrhvX5tZ" +
  ":eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJrZXktMSIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI2Q0dHQVB4LXFOTzVXc1NQSlMwcTN4enA3bldhTjdBSzhYdEoyOXZ1MGVFIiwieSI6InNCOURicXRmdTlGajRHbmhCUzNTREs5OGUxVEM2dkxsUm56eTVCMTJHSkEifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iLCJrZXlBZ3JlZW1lbnQiXSwidHlwZSI6IkVjZHNhU2VjcDI1NmsxVmVyaWZpY2F0aW9uS2V5MjAxOSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQlN5Q2x0RkNETUZVTGZ3aG9RdGpmOFQzS0lGSXo4eG5DQ2o3YUU3VWVUSXcifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUNiaHBfb21KMnNmMDJKUVNTeEZZSjFFbVRkc3RpMV9MNGx1MmtkUkViTGtBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCOXJlUW9vNjlwWFllZEo5dy1BanhxeDlVNlVZLUpBLWxzWGFTYW00dlhDUSJ9fQ";

export const FirstStory = Template.bind({});
FirstStory.args = {
  accounts: [{ did: did1, name: { firstname: "太郎", lastname: "山田" } }],
  currentAccount: did1,
};

export const SecondStory = Template.bind({});
SecondStory.args = {
  accounts: [
    { did: did1, name: { firstname: "太郎", lastname: "山田" } },
    { did: did2, name: { firstname: "一郎", lastname: "鈴木" } },
  ],
  currentAccount: did1,
};
