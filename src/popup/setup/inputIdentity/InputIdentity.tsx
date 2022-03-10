import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Store } from "@/store/storeContext";
import { Name } from "@/types";
import { registerName } from "@/shared/account/accountManager";

import { InputIdentityView } from "./InputIdentity.view";

export const InputIdentity: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();
  const submitHandler = async (name: Name) => {
    const account = await registerName(state.currentAccount?.did!, name);
    dispatch({
      type: "updateAccount",
      payload: account,
    });
    navigate("/setup/3");
  };
  return <InputIdentityView onSubmit={submitHandler} />;
};
