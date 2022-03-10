import React, { useEffect, useContext } from "react";
import { ec as EC } from "elliptic";

import { Store } from "@/store/storeContext";
import { Vault } from "@/shared/vault/vault";
import { boot } from "@/shared/boot/bootApp";
import companyHelper from "@/shared/company/companyHelper";

import TabRoutes from "./routes";

function App() {
  const { state, dispatch } = useContext(Store);
  const { lockContext, vault } = state;

  useEffect(() => {
    const f = async () => {
      // boot
      const result = await boot();
      dispatch({
        type: "booted",
        payload: result,
      });

      // initialize vault
      const encryptedVault =
        result.state === "authed" ? result.currentAccount.encryptedVault : "";
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

      // load extension embedded companies
      const arr = await companyHelper.getCompanies();
      dispatch({
        type: "setCompanies",
        payload: arr,
      });
    };
    f();
  }, [dispatch]);

  useEffect(() => {
    if (vault && lockContext.lastEvent === "request") {
      vault.lockVault();
    }
  }, [vault, lockContext]);

  return (
    <div>
      <TabRoutes />
    </div>
  );
}

export default App;
