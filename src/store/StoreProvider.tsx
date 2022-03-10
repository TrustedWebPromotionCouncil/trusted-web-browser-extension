import * as React from "react";

import {
  initialState as defaultInitialState,
  reducer,
  RootState,
} from "./store";
import { Store } from "./storeContext";

interface StoreProviderProps {
  preloadedState?: RootState;
}

export const StoreProvider: React.FC<StoreProviderProps> = ({
  children,
  preloadedState,
}) => {
  const [state, dispatch] = React.useReducer(
    reducer,
    preloadedState ?? defaultInitialState
  );
  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
};
