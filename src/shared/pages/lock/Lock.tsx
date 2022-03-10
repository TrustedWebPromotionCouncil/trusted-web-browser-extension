import React, { FunctionComponent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { LockView } from "./Lock.view";
import { Store } from "@/store/storeContext";

interface Props {
  onPopup?: boolean;
}

export const Lock: FunctionComponent<Props> = ({ onPopup = true }) => {
  const { state } = useContext(Store);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { vault } = state;
  const submitHandler = async (password: string) => {
    setError("");
    const result = await vault?.unlockVault(password);
    if (result) {
      setError("");
    } else {
      setError("パスワードが違います");
    }
  };
  const onBack = () => {
    console.log("back");
    navigate(-1);
  };
  return (
    <LockView
      onSubmit={submitHandler}
      onBack={onBack}
      error={{ title: error }}
      onPopup={onPopup}
    />
  );
};
