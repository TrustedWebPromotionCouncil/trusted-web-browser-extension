import React, { FunctionComponent } from "react";

import "./spacer.scss";

interface SpacerProps {
  space?: 4 | 8 | 12 | 16 | 24 | 32 | 38 | 40 | 48;
}

export const Spacer: FunctionComponent<SpacerProps> = ({ ...props }) => {
  const { space } = props;
  const className = `x-times${space}`;
  return <div className={className} />;
};
