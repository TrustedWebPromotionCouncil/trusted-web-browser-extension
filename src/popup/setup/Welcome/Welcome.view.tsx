import React, { FunctionComponent } from "react";

import { Button, Header, Spacer, Title } from "@/shared/components";
import { ErrorMessage } from "@/types";
import "./welcome.scss";

export interface WelcomeViewProps {
  error?: ErrorMessage;
  goToInputPassword: () => void;
  goToRecoverWallet: () => void;
}

export const WelcomeView: FunctionComponent<WelcomeViewProps> = (props) => {
  const { goToInputPassword, goToRecoverWallet } = props;
  return (
    <>
      <Header />
      <div className="container">
        <Title
          headline="ようこそ!"
          subtitle="ウォレットの作り方を選んでください"
        />
        <Spacer space={32}></Spacer>
        <div className="buttons">
          <Button onClick={goToRecoverWallet}>ウォレットの復元</Button>
          <Button onClick={goToInputPassword}>新しく作る</Button>
        </div>
      </div>
    </>
  );
};
