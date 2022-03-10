import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { Store } from "@/store/storeContext";

import * as accessLogAsyncProcess from "./accessLogListAsyncProcess";
import { AccessLogListView, AccessLogViewModel } from "./AccessLogList.view";

interface AccessLogProps {}

export const AccessLogList: FunctionComponent<AccessLogProps> = () => {
  const [accessLogs, setAccessLogs] = useState<AccessLogViewModel[]>([]);
  const { state, dispatch } = useContext(Store);
  const { currentAccount, vault } = state;
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentAccount || !vault) {
      return;
    }

    dispatch({ type: "setProcessing", payload: { processing: true } });
    const f = async () => {
      try {
        const accessLogs = await accessLogAsyncProcess.getAccessLog(
          currentAccount,
          vault
        );
        setAccessLogs(accessLogs);
      } finally {
        dispatch({ type: "setProcessing", payload: { processing: false } });
      }
    };
    f();
  }, [dispatch, currentAccount, vault]);

  const onBack = () => {
    navigate(-1);
  };
  return (
    <AccessLogListView
      accessLogs={accessLogs}
      onBack={onBack}
      loading={state.processing}
    />
  );
};
