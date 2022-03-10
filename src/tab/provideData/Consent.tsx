import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";

import { ErrorMessage, ProcessResultFailure } from "@/types";
import { Store } from "@/store/storeContext";
import { receiveRequest } from "@/shared/did/siop";

import asyncProcess from "./consentAsyncProcess";
import { ConsentView, DataSet } from "./Consent.view";
import companyHelper from "@/shared/company/companyHelper";

export const Consent: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const [dataDestination, setDataDestination] = useState("");
  const [error, setError] = useState<ErrorMessage | undefined>();

  const { currentAccount } = state;
  const { name, company } = currentAccount!;

  const dataSet: DataSet[] = [
    {
      type: "set",
      name: "本人確認情報",
      values: [
        { type: "leaf", name: "氏", value: name?.lastname! },
        { type: "leaf", name: "名", value: name?.firstname! },
      ],
    },
    {
      type: "set",
      name: "所属企業の在職証明",
      values: [
        {
          type: "leaf",
          name: "会社名",
          value: companyHelper.getCompany(company?.companyId!).name,
        },
        {
          type: "leaf",
          name: "組織・事業部",
          value: company?.organization!,
        },
        { type: "leaf", name: "役職など", value: company?.jobTitle! },
      ],
    },
  ];

  useEffect(() => {
    const f = async () => {
      const query = window.location.search;
      try {
        const { provider, requestObject } = await receiveRequest(query);
        const name = companyHelper.getCompany(requestObject.iss).name;
        setDataDestination(name);
        dispatch({
          type: "setSIOP",
          payload: { provider: provider, requestObject },
        });
      } catch (err) {
        setError({ title: "データ提供リクエストの検証に失敗しました" });
      }
    };
    f();
  }, [dispatch]);

  const handleError = (result: ProcessResultFailure) => {
    const { message } = result;
    setError({ title: message });

    // stop loading
    dispatch({
      type: "setProcessing",
      payload: { processing: false },
    });
  };

  const submitHandler = async (email: string) => {
    let location;
    dispatch({
      type: "setProcessing",
      payload: { processing: true },
    });
    try {
      const createVcResult = await asyncProcess.createVc(state, email);
      if (createVcResult.type === "failure") {
        handleError(createVcResult);
        return;
      }
      const { vcSet } = createVcResult;

      const uploadResult = await asyncProcess.uploadVcSet(state, vcSet);
      if (uploadResult.type === "failure") {
        handleError(uploadResult);
        return;
      }
      const { vcKeySet } = uploadResult;

      const generateResponseResult = await asyncProcess.generateResponse(
        state,
        vcKeySet
      );
      if (generateResponseResult.type === "failure") {
        handleError(generateResponseResult);
        return;
      }
      location = generateResponseResult.location;
    } catch (error) {
      if (error instanceof Error) {
        setError({ title: error.message });
      }
      return;
    } finally {
      if (location) {
        console.debug("redirect to RP site");
        window.location.href = location;
      } else {
        // stop loading
        setError({ title: "Something happened." });
        dispatch({
          type: "setProcessing",
          payload: { processing: false },
        });
      }
    }
  };

  const onCancel = async () => {
    console.debug("redirect to RP site");
    const location = asyncProcess.generateCancelResponse(state);
    window.location.href = location;
  };

  return (
    <ConsentView
      dataSet={dataSet}
      dataDestination={dataDestination}
      onSubmit={submitHandler}
      onCancel={onCancel}
      error={error}
    />
  );
};
