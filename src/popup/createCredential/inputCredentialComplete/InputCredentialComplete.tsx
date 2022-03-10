import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { InputCredentialCompleteView } from "./InputCredentialComplete.view";

export const InputCredentialComplete: FunctionComponent = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/protected");
  };
  return <InputCredentialCompleteView onClick={onClick} />;
};
