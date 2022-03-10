import React, { FunctionComponent, useContext, useEffect } from "react";
import {
  Routes,
  Route,
  MemoryRouter,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { ProtectedPageRouter } from "@/shared/components/routers/ProtectedPageRouter";
import { Store } from "@/store/storeContext";

import { InputPassword } from "@/popup/setup/inputPassword/InputPassword";
import { InputIdentity } from "@/popup/setup/inputIdentity/InputIdentity";
import { InputCareer } from "@/popup/setup/inputCareer/InputCareer";
import { SetupDone } from "@/popup/setup/setupDone/SetupDone";
import { RecoverWallet } from "./setup/recoverWallet/RecoverWallet";
import { Welcome } from "./setup/Welcome/Welcome";
import { Menu } from "@/popup/menu/Menu";
import { SwitchAccount } from "@/popup/accountSetting/SwitchAccount";
import { MnemonicPhrase } from "@/popup/mnemonicPhrase/MnemonicPhrase";
import { SelectSchema } from "@/popup/createCredential/selectSchema/SelectSchema";
import { InputCredential } from "@/popup/createCredential/inputCredential/InputCredential";
import { InputCredentialComplete } from "@/popup/createCredential/inputCredentialComplete/InputCredentialComplete";
import { ProvideCredential } from "@/popup/provideCredential/ProvideCredential";
import { ProvideCredentialComplete } from "@/popup/provideCredentialComplete/ProvideCredentialComplete";
import { AccessLogList } from "@/popup/accessLog/AccessLogList";
import { Lock } from "@/shared/pages/lock/Lock";

const Layout: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const { bootState, currentAccount, lockContext } = state;
  const { vaultState } = lockContext;
  const navigate = useNavigate();

  useEffect(() => {
    console.debug(
      "=================== layout useEffect() starts ==============="
    );
    console.debug(bootState);
    console.debug(currentAccount);
    console.debug(
      "=================== layout useEffect() ends ==============="
    );

    if (bootState === "not_authed") {
      // The current account not found.
      navigate("/setup/0");
    } else if (bootState === "authed") {
      // The current account found.
      if (currentAccount && !currentAccount.name) {
        navigate("/setup/2");
      } else if (currentAccount && !currentAccount.company) {
        navigate("/setup/3");
      } else {
        navigate("/protected");
      }
    }
  }, [bootState, currentAccount]);

  useEffect(() => {
    if (vaultState.isUnlocked === false) {
      console.debug("redirect to lock view");
      navigate("/lock");
    } else {
      if (lockContext.lastEvent === "state_changed") {
        console.log(
          "go to next route",
          lockContext.afterUnlockRoute,
          lockContext.vaultState.isUnlocked
        );
        // 解除後のルートに遷移
        navigate(lockContext.afterUnlockRoute);
        dispatch({ type: "setLockContext", payload: { name: "clear" } });
      }
    }
  }, [
    dispatch,
    lockContext.afterUnlockRoute,
    lockContext.lastEvent,
    lockContext.vaultState.isUnlocked,
    vaultState,
  ]);

  return <Outlet />;
};

function PopUpRoutes() {
  return (
    <MemoryRouter>
      {/* https://reactrouter.com/docs/en/v6/api#memoryrouter */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="lock" element={<Lock />} />
          <Route path="setup">
            <Route path="0" element={<Welcome />} />
            <Route path="1" element={<InputPassword />} />
            <Route path="recover" element={<RecoverWallet />} />
            <Route path="2" element={<InputIdentity />} />
            <Route path="3" element={<InputCareer />} />
            <Route path="done" element={<SetupDone />} />
          </Route>
          <Route
            path="/protected/*"
            element={
              <ProtectedPageRouter>
                <Routes>
                  <Route index element={<Menu />} />
                  <Route path="switch-account" element={<SwitchAccount />} />
                  <Route path="mnemonic-phrase" element={<MnemonicPhrase />} />
                  <Route path="select-schema" element={<SelectSchema />} />
                  <Route
                    path="input-credential"
                    element={<InputCredential />}
                  />
                  <Route
                    path="input-credential-complete"
                    element={<InputCredentialComplete />}
                  />
                  <Route
                    path="provide-credential"
                    element={<ProvideCredential />}
                  />
                  <Route
                    path="provide-credential-complete"
                    element={<ProvideCredentialComplete />}
                  />
                  <Route path="access-log" element={<AccessLogList />} />
                </Routes>
              </ProtectedPageRouter>
            }
          />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default PopUpRoutes;
