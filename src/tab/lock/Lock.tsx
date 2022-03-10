import React, { FunctionComponent } from "react";
import { Lock as GenericLock } from "@/shared/pages/lock/Lock";

interface Props {}

export const Lock: FunctionComponent<Props> = () => {
  return <GenericLock onPopup={false} />;
};
