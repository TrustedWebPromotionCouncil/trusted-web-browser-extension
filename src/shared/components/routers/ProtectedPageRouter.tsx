import React, { FunctionComponent, ReactElement, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { Store } from "@/store/storeContext";

interface PrivateRouteProps {
  redirectPath?: string;
}

// https://reactrouter.com/docs/en/v6/examples/auth:w
export const ProtectedPageRouter: FunctionComponent<PrivateRouteProps> = ({
  children,
  ...rest
}) => {
  const { state } = useContext(Store);
  const { redirectPath } = rest;
  const location = useLocation();
  const redirectTo = redirectPath ? redirectPath : "/";
  if (state.bootState === "authed" || state.currentAccount) {
    return children as ReactElement;
  } else {
    return <Navigate to={redirectTo} state={{ from: location }} />;
  }
};
