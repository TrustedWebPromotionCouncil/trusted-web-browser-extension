import React from "react";
import ReactDOM from "react-dom";

import PopUp from "./popup/component";

import { StoreProvider } from "@/store/StoreProvider";

import "@/cusom.scss";
import "@/index.scss";

console.debug("popup.js");
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <PopUp />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
