import React, { FunctionComponent } from "react";

import { CopyButton, Header, Spacer, Title } from "@/shared/components";
import "../styles.scss";

export interface MnemonicPhraseViewProps {
  mnemonics: string[];
  did: string;
  onBack: () => void;
}

export const MnemonicPhraseView: FunctionComponent<MnemonicPhraseViewProps> = ({
  mnemonics,
  did,
  onBack,
}: MnemonicPhraseViewProps) => {
  const phrase = mnemonics.join(" ");
  return (
    <>
      <Header onBack={onBack} />
      <div className="container">
        <Title headline="復元用フレーズ" />
        <Spacer space={8}></Spacer>
        <div className="mnemonic-phrase-container">
          <ol className="list-group list-group-numbered">
            {mnemonics?.map((word: string, index: number) => (
              <li
                key={index}
                className="list-group-item text-styles-body1"
                style={{ display: "inline", float: "left" }}
              >
                {word}
              </li>
            ))}
          </ol>
        </div>
        <Spacer space={8} />
        <div className="warning p-2">
          <div className="lh-base text-styles-caption">
            このフレーズはあなた以外の人に見せないようにしてください。
            このフレーズがあれば誰でもあなたになりすますことができます。
          </div>
        </div>
        <Spacer space={8} />
        <div className={"button-on-anywhere"}>
          <CopyButton value={phrase}>復元用フレーズコピー</CopyButton>
        </div>
        <Spacer space={8} />
        <div className="warning p-2">
          <div className="lh-base text-styles-caption">
            DIDも保管してください。アカウント復元の際に必要です。
          </div>
        </div>
        <Spacer space={8} />
        <div className={"button-on-anywhere"}>
          <CopyButton value={did}>DIDコピー</CopyButton>
        </div>
        <Spacer space={32} />
      </div>
    </>
  );
};
