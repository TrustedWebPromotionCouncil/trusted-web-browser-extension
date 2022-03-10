import React, { FunctionComponent } from "react";

import "./formSection.scss";

interface FormSectionProps {}

export const FormSection: FunctionComponent<FormSectionProps> = ({
  children,
}) => {
  return <div className="form-section">{children}</div>;
};
