import React, { ComponentProps } from "react";
import { Story, Meta } from "@storybook/react";

import { MnemonicPhraseView } from "./MnemonicPhrase.view";

export default {
  title: "TrustedWeb/Views/Setup/MnemonicPhrase",
  component: MnemonicPhraseView,
} as Meta;

const Template: Story<ComponentProps<typeof MnemonicPhraseView>> = (args) => (
  <MnemonicPhraseView {...args} />
);

export const FirstStory = Template.bind({});
FirstStory.args = {
  mnemonics:
    "eye feel spoil raven marine fever liberty surround any analyst valid simple".split(
      " "
    ),
};
