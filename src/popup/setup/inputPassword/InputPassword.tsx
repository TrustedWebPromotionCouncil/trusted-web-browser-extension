import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Store } from "@/store/storeContext";
import { convertEcKeyPairToJwk } from "@/shared/keys";
import { issuePersonalDid } from "@/shared/account/accountManager";

import { InputPasswordView } from "./InputPassword.view";

export const InputPassword: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();

  const { vault } = state;
  const submitHandler = async (password: string) => {
    await vault?.createNewVault(password);
    const keyPairs = await vault?.listKeyPairs();
    // console.log("=== mnemonic phrase ===")
    // console.log(vault?.listMnemonic());
    const privateJwk = convertEcKeyPairToJwk(keyPairs![0]);
    console.log({ privateJwk });
    const result = await issuePersonalDid(privateJwk, vault?.encryptedVault!);
    dispatch({
      type: "addAccount",
      payload: { did: result.did, initialState: result.initialState },
    });
    navigate("/setup/2");
  };

  return <InputPasswordView onSubmit={submitHandler} />;
};
