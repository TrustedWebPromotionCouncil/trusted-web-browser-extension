import React, { FunctionComponent } from "react";

import { Button, Header, Title, Spacer } from "@/shared/components";

import "./inputCredentialComplete.scss";

export interface InputCredentialCompleteViewProps {
  onClick: () => void;
}

export const InputCredentialCompleteView: FunctionComponent<InputCredentialCompleteViewProps> =
  (props) => {
    const { onClick } = props;
    return (
      <>
        <Header />
        <div className="container">
          <Title headline="クレデンシャル入力完了" />
          <Spacer space={32} />
          <div className="buttons">
            <Button buttonType="outlined" onClick={onClick}>
              メニューへ戻る
            </Button>
          </div>
        </div>
      </>
    );
  };
