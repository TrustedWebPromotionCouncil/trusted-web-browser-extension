import React, { FunctionComponent, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Store } from "@/store/storeContext";

import { MenuView, MenuName } from "./Menu.view";

export const Menu: FunctionComponent = () => {
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  const onClick = (name: MenuName) => {
    switch (name) {
      case "create-credential":
        navigate("/protected/select-schema");
        break;
      case "provide-credential":
        dispatch({
          type: "setLockContext",
          payload: {
            name: "request",
            afterUnlockRoute: "/protected/provide-credential",
          },
        });
        break;
      case "recovery-phrase":
        dispatch({
          type: "setLockContext",
          payload: {
            name: "request",
            afterUnlockRoute: "/protected/mnemonic-phrase",
          },
        });
        break;
      case "switch-account":
        navigate("/protected/switch-account");
        break;
      case "access-log":
        dispatch({
          type: "setLockContext",
          payload: {
            name: "request",
            afterUnlockRoute: "/protected/access-log",
          },
        });
        break;
      default:
        // never pass through
        break;
    }
  };
  return <MenuView onClick={onClick} />;
};
