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

import { Lock } from "@/tab/lock/Lock";
import { Consent } from "@/tab/provideData/Consent";
import { SelectDataType } from "@/tab/getData/selectDataType/SelectDataType";
import { Download } from "@/tab/getData/download/Download";

const isSIOPRequest = (queryParameter: string) => {
  return (
    queryParameter.includes("scope") && queryParameter.includes("response_type")
  );
};

const Layout: FunctionComponent = () => {
  const { state, dispatch } = useContext(Store);
  const { bootState, lockContext } = state;
  const navigate = useNavigate();

  useEffect(() => {
    let afterUnlockRoute = "/protected/select-data-type";
    const search = window.location.search;
    if (search) {
      console.log(search);
      if (isSIOPRequest(search)) {
        console.log("siop request");
        afterUnlockRoute = "/protected/consent";
      }
    }
    dispatch({
      type: "setLockContext",
      payload: {
        name: "request",
        afterUnlockRoute,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    if (bootState === "not_authed") {
      navigate("/setup/1");
    } else if (bootState === "authed") {
      if (lockContext.vaultState.isUnlocked === false) {
        console.debug("redirect to lock view");
        navigate("/lock");
      } else {
        console.debug("redirect to protected view");
        if (lockContext.lastEvent === "state_changed") {
          // 解除後のルートに遷移
          navigate(lockContext.afterUnlockRoute);
          dispatch({ type: "setLockContext", payload: { name: "clear" } });
        }
      }
    }
  }, [bootState, lockContext, dispatch]);

  return <Outlet />;
};

function PopUpRoutes() {
  return (
    <MemoryRouter>
      {/* https://reactrouter.com/docs/en/v6/api#memoryrouter */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="lock">
            <Route index element={<Lock />} />
          </Route>
          <Route
            path="protected/*"
            element={
              <ProtectedPageRouter>
                <Routes>
                  <Route path="consent" element={<Consent />} />
                  <Route path="select-data-type" element={<SelectDataType />} />
                  <Route path="download" element={<Download />} />
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
