import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { IntegralAccount } from "@/types";
import * as didManager from "@/shared/account/accountManager";
import { Store } from "@/store/storeContext";

import { SwitchAccountView } from "./SwitchAccount.view";

export const SwitchAccount: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const { accounts, currentAccount } = state;
  const navigate = useNavigate();

  const switchAccount = async (did: string) => {
    await didManager.switchAccount({ did });
    dispatch({ type: "setCurrentAccount", payload: { did } });
    navigate("/protected");
  };
  const addAccount = async () => {
    navigate("/setup/0");
  };
  const onBack = async () => {
    navigate(-1);
  };

  return (
    <SwitchAccountView
      accounts={Object.values(accounts) as IntegralAccount[]}
      currentAccount={currentAccount?.did!}
      onSubmit={switchAccount}
      addAccount={addAccount}
      onBack={onBack}
    />
  );
};
