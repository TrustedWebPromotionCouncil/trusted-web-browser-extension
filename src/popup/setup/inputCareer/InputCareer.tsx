import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Company } from "@/types";
import { Store } from "@/store/storeContext";
import { registerCompany } from "@/shared/account/accountManager";

import { InputCareerView } from "./InputCareer.view";

export const InputCareer: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const submitHandler = async (company: Company) => {
    const account = await registerCompany(state.currentAccount?.did!, company);
    dispatch({
      type: "updateAccount",
      payload: account,
    });
    navigate("/setup/done");
  };
  return <InputCareerView onSubmit={submitHandler} />;
};
