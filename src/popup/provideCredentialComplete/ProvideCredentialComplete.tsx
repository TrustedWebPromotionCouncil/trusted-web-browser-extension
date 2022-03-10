import React, { FunctionComponent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { ProvideCredentialCompleteView } from "./ProvideCredentialComplete.view";

export const ProvideCredentialComplete: FunctionComponent = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  const url = `${
    process.env.REACT_APP_EXTENSION_OBSERVABLE_HOST
  }?${searchParams.toString()}`;

  const onClick = () => {
    navigate("/protected");
  };
  return <ProvideCredentialCompleteView url={url} onClick={onClick} />;
};
