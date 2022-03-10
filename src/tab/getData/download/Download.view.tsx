import React, { FunctionComponent, useContext } from "react";
import { FaRegCheckCircle } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

import {
  DataSetView,
  DataSet,
  Header,
  Spacer,
  Title,
} from "@/shared/components";
import { ErrorMessage } from "@/types";

import "./download.scss";
import { Store } from "@/store/storeContext";

export interface Credentials {
  verified: boolean;
  dataSet: DataSet[];
}

export interface DownloadViewProps {
  viewTitle: string;
  credentials: Credentials[];
  error?: ErrorMessage;
}

const PassInfo: FunctionComponent<{ verified: boolean }> = (props) => {
  const { verified } = props;
  return (
    <div className={verified ? "pass-text" : "not-pass-text"}>
      {verified && <FaRegCheckCircle />}
      {verified && <span>この情報は検証済み</span>}
      {!verified && <span>この情報は検証できませんでした</span>}
    </div>
  );
};
export const DownloadView: FunctionComponent<DownloadViewProps> = (props) => {
  const { error, viewTitle, credentials } = props;
  const { state } = useContext(Store);
  const { processing } = state;
  return (
    <>
      <Header />
      <div className="container tab-container">
        <Title headline={viewTitle} />
        {(error && (
          <div>
            <div className="page-error-text">{error?.title}</div>
            <div className="page-error-text">{error?.subTitle}</div>
          </div>
        )) || <Spacer space={38} />}
        <Spacer space={32} />
        {processing && (
          <div className="d-flex justify-content-center">
            <Spinner
              as={"span"}
              animation={"border"}
              variant={"primary"}
              role={"status"}
              aria-hidden={"true"}
            />
          </div>
        )}
        <div className="dataset-container">
          {credentials.map((credential, index) => (
            <>
              <PassInfo
                key={`pass-info-${index}`}
                verified={credential.verified}
              />
              <DataSetView
                key={`dataset-view-${index}`}
                dataSet={credential.dataSet}
              />
            </>
          ))}
        </div>
      </div>
    </>
  );
};
