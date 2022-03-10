import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { SetupDoneView } from "./SetupDone.view";

export const SetupDone: FunctionComponent = () => {
  const navigate = useNavigate();
  const submitHandler = async () => {
    navigate("/protected");
  };
  return <SetupDoneView onClick={submitHandler} />;
};
