import React from "react";
import { initialState, Action } from "@/store/store";

export const Store = React.createContext({
  state: initialState,
  dispatch: (value: Action) => {},
});
