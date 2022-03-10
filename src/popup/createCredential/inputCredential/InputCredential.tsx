import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import { ReferenceInput1 } from "@/shared/convertCredentials/converter";
import { Store } from "@/store/storeContext";
import { Reference } from "@/types";

import { InputCredentialView } from "./InputCredential.view";
import inputCredentialAsyncProcess from "./inputCredentialAsyncProcess";

export const InputCredential: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const [reference, setReference] = useState<Reference>();
  const { currentAccount } = state;
  const navigate = useNavigate();

  const onSubmit = async (value: Reference) => {
    const account = await inputCredentialAsyncProcess.save(state, value);
    dispatch({
      type: "updateAccount",
      payload: account,
    });
    navigate("/protected/input-credential-complete");
  };
  useEffect(() => {
    if (currentAccount) {
      setReference(currentAccount.reference);
    }
  }, [currentAccount]);
  const onBack = () => {
    navigate(-1);
  };
  const input1Candidates = [{ value: "", text: "" }, ...ReferenceInput1];

  return (
    <InputCredentialView
      onSubmit={onSubmit}
      input1Candidates={input1Candidates}
      onBack={onBack}
      reference={reference}
    />
  );
};
