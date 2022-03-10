import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { WelcomeView } from "./Welcome.view";

export const Welcome: FunctionComponent = () => {
  const navigate = useNavigate();

  const goToInputPassword = () => {
    navigate("/setup/1");
  };
  const goToRecoverWallet = () => {
    navigate("/setup/recover");
  };
  return (
    <WelcomeView
      goToInputPassword={goToInputPassword}
      goToRecoverWallet={goToRecoverWallet}
    />
  );
};
