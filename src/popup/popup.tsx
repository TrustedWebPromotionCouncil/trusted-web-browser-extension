import React from "react";
import ReactDOM from "react-dom";
import App from "./component";

import { StoreProvider } from "@/store/StoreProvider";

import "@/cusom.scss";

console.debug("popup.js");
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
