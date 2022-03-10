import React, { FunctionComponent, TextareaHTMLAttributes } from "react";

import { FormikErrors } from "formik";
import classNames from "classnames";

import "./textArea.scss";

interface InputTextProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}

export const TextArea: FunctionComponent<InputTextProps> = ({ ...props }) => {
  const { className, error, label, name } = props;
  return (
    <div>
      {label && (
        <label htmlFor={name} className="item-title">
          {label}
        </label>
      )}
      <textarea {...props} className={classNames("form-control", className)} />
      {/*エラー状態か否かで下の要素の位置が上下しないように常に固定の高さを維持する*/}
      <div className="error-container">
        {error && <label className="error-text"> {error}</label>}
      </div>
    </div>
  );
};
