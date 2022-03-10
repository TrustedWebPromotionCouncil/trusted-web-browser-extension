import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Store } from "@/store/storeContext";
import { saveNewAccount } from "@/shared/account/accountManager";

import { RecoverWalletView } from "./RecoverWallet.view";
import { convertLongFormToShortForm } from "@/shared/did/ion";

export const RecoverWallet: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();

  const { vault } = state;
  const submitHandler = async (
    password: string,
    mnemonic: string,
    didLongForm: string
  ) => {
    const mnemonicArray = mnemonic.split(" ");
    await vault?.restore(mnemonicArray, password);

    const short = convertLongFormToShortForm(didLongForm);
    const initialState = { longForm: didLongForm, shortForm: short };
    await saveNewAccount(didLongForm, initialState, vault!.encryptedVault);

    dispatch({
      type: "addAccount",
      payload: { did: didLongForm, initialState },
    });
    navigate("/setup/2");
  };
  return <RecoverWalletView onSubmit={submitHandler} />;
};
