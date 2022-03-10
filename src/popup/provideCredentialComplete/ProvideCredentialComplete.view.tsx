import React, { FunctionComponent } from "react";

import { Button, CopyIcon, Header, Title, Spacer } from "@/shared/components";

import "./provideCredentialComplete.scss";

export interface ProvideCredentialCompleteViewProps {
  url: string;
  onClick: () => void;
}

export const ProvideCredentialCompleteView: FunctionComponent<ProvideCredentialCompleteViewProps> =
  (props) => {
    const { url, onClick } = props;
    return (
      <>
        <Header />
        <div className="container">
          <Title
            headline="提供完了"
            subtitle="提供したデータは以下のURLから提供先企業のみが参照できます"
          />
          <Spacer space={32} />
          <div className="result">
            <div className="copy-enable-content">
              <div className="card">
                <div className="card-header">
                  <span className="text-styles-caption">提供データ参照URL</span>
                </div>
                <div className="card-body">
                  {url}
                  <CopyIcon value={url} />
                </div>
              </div>
            </div>
          </div>
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
