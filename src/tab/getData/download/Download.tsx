import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";

import { Store } from "@/store/storeContext";
import { ErrorMessage } from "@/types";

import downloadAsyncProcess from "./downloadAsyncProcess";

import { DownloadView, Credentials } from "./Download.view";

export const Download: FunctionComponent = () => {
  const [credentials, setCredentials] = useState<Credentials[]>([]);
  const [error, setError] = useState<ErrorMessage | undefined>();
  const [isReference, setIsReference] = useState<boolean>(false);
  const { state, dispatch } = useContext(Store);
  const { vcKeys, currentAccount, companies } = state;

  useEffect(() => {
    if (!currentAccount || !companies || !vcKeys) {
      return;
    }

    dispatch({ type: "setProcessing", payload: { processing: true } });
    (async () => {
      try {
        console.log({ vcKeys });
        if (vcKeys) {
          const refKey = vcKeys.find(
            (vcKey) => vcKey.name === "referenceCredential"
          );
          setIsReference(refKey !== undefined);
          const result = await downloadAsyncProcess.getData(
            currentAccount,
            vcKeys,
            companies
          );
          if (result.type === "success") {
            const { data } = result;
            setCredentials(
              data.map((d) => {
                return {
                  verified: true,
                  dataSet: d,
                };
              })
            );
          } else {
            const { message } = result;
            setError({ title: message });
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          setError({ title: error.message });
        }
      } finally {
        dispatch({ type: "setProcessing", payload: { processing: false } });
      }
    })();
  }, [dispatch, vcKeys, currentAccount, companies]);

  return (
    <DownloadView
      viewTitle={isReference ? "レファレンス回答情報" : "応募情報"}
      credentials={credentials}
      error={error}
    />
  );
};
