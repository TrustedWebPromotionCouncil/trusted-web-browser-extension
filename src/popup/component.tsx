import React, { useEffect, useContext, useCallback } from "react";
import { ec as EC } from "elliptic";

import { Store } from "@/store/storeContext";
import { Vault } from "@/shared/vault/vault";
import { boot } from "@/shared/boot/bootApp";
import companyHelper from "@/shared/company/companyHelper";
import "./styles.scss";
import PopUpRoutes from "./routes";

function App() {
  const { state, dispatch } = useContext(Store);
  const { lockContext, vault, currentAccount } = state;

  const currentDid = currentAccount?.did;

  const resetVault = useCallback(
    async (encryptedVault: string) => {
      console.debug("reset vault");
      const vault = new Vault();
      await vault.initialize(
        encryptedVault,
        (keyPairs: EC.KeyPair[], state) => {
          dispatch({
            type: "setLockContext",
            payload: { name: "state_changed", vaultState: state },
          });
        }
      );
      dispatch({
        type: "setVault",
        payload: vault,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    const f = async () => {
      // boot
      const result = await boot();
      console.debug("booted", { result });
      dispatch({
        type: "booted",
        payload: result,
      });
      // vault
      const encryptedVault =
        result.state === "authed" ? result.currentAccount.encryptedVault : "";
      await resetVault(encryptedVault);
      // companies
      const arr = await companyHelper.getCompanies();
      dispatch({
        type: "setCompanies",
        payload: arr,
      });
    };
    f();
  }, [dispatch, resetVault]);

  useEffect(() => {
    if (vault && lockContext.lastEvent === "request") {
      vault.lockVault();
    }
  }, [vault, lockContext]);

  useEffect(() => {
    const f = async () => {
      if (currentDid && currentAccount?.encryptedVault) {
        const encryptedVault = currentAccount.encryptedVault;
        await resetVault(encryptedVault);
      }
    };
    f();
  }, [currentDid, currentAccount, resetVault]);

  return (
    <div className="popup-container">
      <PopUpRoutes />
    </div>
  );
}

export default App;
