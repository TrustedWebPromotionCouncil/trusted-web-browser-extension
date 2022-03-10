import React, { FunctionComponent, useState } from "react";

import { ErrorMessage } from "@/types";
import { Button, CopyIcon, Header, Title, Spacer } from "@/shared/components";

import { Name } from "@/types";

import "./switchAccount.scss";
import { Identicon } from "@/shared/components/Identicon/Identicon";

export interface SwitchAccountViewProps {
  error?: ErrorMessage;
  accounts: { did: string; name: Name }[];
  currentAccount: string;
  onSubmit: (did: string) => void;
  addAccount: () => void;
  onBack: () => void;
}

export const SwitchAccountView: FunctionComponent<SwitchAccountViewProps> = (
  props
) => {
  const { accounts, addAccount, currentAccount, onSubmit, onBack } = props;
  const [did, setDid] = useState(currentAccount);
  const onClick = (did: string) => {
    setDid(did);
    onSubmit(did);
  };
  return (
    <>
      <Header onBack={onBack} />
      <div className="container">
        <Title
          headline="アカウント切り替え"
          subtitle="アカウントを選択してください"
        />
        <Spacer space={32} />
        <div>
          {accounts.map((a) => {
            const isCurrent = a.did === did;
            return (
              <div className="card mt-1">
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                    }}
                  >
                    <Identicon did={a.did} diameter={30} />
                    <div className="card-title" style={{ padding: "3px 10px" }}>
                      {a.name.lastname}
                      {a.name.firstname}
                    </div>
                  </div>
                  <div className="card-text did-container">
                    <div className="text-truncate">{a.did}</div>
                    <CopyIcon value={a.did} />
                  </div>
                  {!isCurrent && (
                    <div>
                      <Button
                        buttonType={"contained"}
                        className="mt-1"
                        onClick={() => onClick(a.did)}
                      >
                        このアカウントに切り替える
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <Spacer space={32} />
        <div className="button-on-anywhere">
          <Button buttonType={"outlined"} onClick={addAccount}>
            アカウント追加
          </Button>
        </div>
        <Spacer space={32} />
      </div>
    </>
  );
};
