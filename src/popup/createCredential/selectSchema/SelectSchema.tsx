import React, { FunctionComponent } from "react";
import { useNavigate } from "react-router-dom";

import { SelectSchemaView } from "./SelectSchema.view";

export const SelectSchema: FunctionComponent = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/protected/input-credential");
  };
  const onBack = () => {
    navigate(-1);
  };
  return <SelectSchemaView onSubmit={onClick} onBack={onBack} />;
};
