import React, { FunctionComponent, InputHTMLAttributes } from "react";

import { FormikErrors } from "formik";
import classNames from "classnames";

import "./inputText.scss";

interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | string[] | FormikErrors<any> | FormikErrors<any>[];
}

export const InputText: FunctionComponent<InputTextProps> = ({ ...props }) => {
  const { className, error, label } = props;
  return (
    <div>
      {label && <label className="item-title">{label}</label>}
      <input
        type="text"
        {...props}
        className={classNames("form-control", className)}
      />
      {/*エラー状態か否かで下の要素の位置が上下しないように常に固定の高さを維持する*/}
      <div className="error-container">
        {error && <label className="error-text"> {error}</label>}
      </div>
    </div>
  );
};
