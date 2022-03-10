import React, { FunctionComponent } from "react";

import { Button, Header, Spacer, Title } from "@/shared/components";

export interface SetupDoneViewProps {
  onClick: () => void;
}

export const SetupDoneView: FunctionComponent<SetupDoneViewProps> = (props) => {
  const { onClick } = props;
  return (
    <>
      <Header />
      <div className="container">
        <Title headline="セットアップ完了" />
        <Spacer space={32} />
        <div className="buttons">
          <Button type="submit" data-testid="done" onClick={onClick}>
            メニューへ
          </Button>
        </div>
      </div>
    </>
  );
};
