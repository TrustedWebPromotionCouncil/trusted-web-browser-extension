import React, { FunctionComponent } from "react";
import { Spinner } from "react-bootstrap";

import { CopyIcon, Header, Title, Spacer } from "@/shared/components";

import "./accessLogList.scss";

import { AccessLog } from "@/types";

export interface AccessLogViewModel extends Omit<AccessLog, "cvType"> {
  operatorName: string;
  cvTypeLabel: string;
}

export interface AccessLogViewProps {
  accessLogs: AccessLogViewModel[];
  onBack: () => void;
  loading?: boolean;
}

export const AccessLogListView: FunctionComponent<AccessLogViewProps> = (
  props
) => {
  const { accessLogs, onBack, loading } = props;
  return (
    <>
      <Header onBack={onBack} />
      <div className="container">
        <Title headline="アクセス履歴" />
        <Spacer space={32} />
        <div className="list-group overflow-auto log-container">
          {loading && (
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
          {accessLogs.map((accessLog) => {
            return (
              <div className="list-group-item">
                <div className="log">
                  <div className="log-caption">アクセス日時</div>
                  <div className="log-value">
                    {/* Convert accessLog.createdAt to user's timezone
                        by appending UTC timezone specifier ('Z') and using toLocaleString(). 
                        It is stored as a time string of UTC timezone without timezone specifiers.
                        Example: "2022-02-17 01:33:54"
                        So this simple technique works.
                      */}
                    {new Date(accessLog.createdAt + "Z").toLocaleString()}
                  </div>
                </div>
                <div className="log">
                  <div className="log-caption">データ種別</div>
                  <div className="log-value">{accessLog.cvTypeLabel}</div>
                </div>
                <div className="log">
                  <div className="log-caption">企業名</div>
                  <div className="log-value">{accessLog.operatorName}</div>
                </div>
                <div className="log">
                  <div className="log-caption">企業DID</div>
                  <div className="log-value">
                    <span className="did d-inline-block text-truncate">
                      {accessLog.operator}
                    </span>
                    <CopyIcon value={accessLog.operator} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
