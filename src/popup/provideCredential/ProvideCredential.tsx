import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { ProvideCredentialView } from "./ProvideCredential.view";
import provideCredentialAsyncProcess, {
  DataTypes,
} from "./provideCredentialAsyncProcess";
import { Store } from "@/store/storeContext";
import { ErrorMessage } from "@/types";
import companyHelper, {
  getCompany,
  CompanyMetaInfo,
} from "@/shared/company/companyHelper";

export const ProvideCredential: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const [error, setError] = useState<ErrorMessage | undefined>();
  const navigate = useNavigate();
  const [companyArray, setCompanyArray] = useState<CompanyMetaInfo[]>([]);

  useEffect(() => {
    (async () => {
      const companiesDid = await companyHelper.getCompanies();
      const companyInfoArray = companiesDid.map((c) => {
        const did = c.initialState.shortForm;
        return getCompany(did);
      });
      setCompanyArray(companyInfoArray);
    })();
  });

  const onSubmit = async (args: {
    dataTypes: DataTypes[];
    destDid: string;
  }) => {
    const { dataTypes, destDid } = args;
    // start loading
    dispatch({
      type: "setProcessing",
      payload: { processing: true },
    });
    try {
      const result = await provideCredentialAsyncProcess.provide(
        state,
        dataTypes,
        destDid
      );
      if (result.type === "success") {
        const { data } = result;
        console.log({ data });
        const search = data.map((d) => `${d.name}=${d.key}`).join("&");
        navigate(`/protected/provide-credential-complete?${search}`);
      } else {
        const { message } = result;
        console.error(message);
        setError({ title: message });
      }
    } catch (error) {
      if (error instanceof Error) {
        setError({ title: error.message });
      }
    } finally {
      // stop loading
      dispatch({
        type: "setProcessing",
        payload: { processing: false },
      });
    }
  };
  const onCancel = () => {
    navigate("/protected");
  };
  return (
    <ProvideCredentialView
      checkItems={[
        { label: "在籍証明", value: "jobCredential" },
        { label: "レファレンス回答", value: "referenceCredential" },
      ]}
      companyArray={companyArray}
      onSubmit={onSubmit}
      onCancel={onCancel}
      error={error}
    />
  );
};
