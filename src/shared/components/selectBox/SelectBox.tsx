import React, { FunctionComponent, SelectHTMLAttributes } from "react";

import { FormikErrors } from "formik";
import classNames from "classnames";

import "./selectBox.scss";

interface selectBoxItems {
  value: number | string | undefined;
  text: string | undefined;
}

interface selectBoxProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string | FormikErrors<any>;
  items: Array<selectBoxItems>;
  label?: string;
}

export const SelectBox: FunctionComponent<selectBoxProps> = ({ ...props }) => {
  const { className, error, label, items, ...rest } = props;
  return (
    <div>
      {label && (
        <label htmlFor={rest?.name} className="item-title">
          {label}
        </label>
      )}
      <select className={classNames("form-select", className)} {...rest}>
        {items.map((data) => {
          return (
            <option key={data.value} value={data.value}>
              {data.text}
            </option>
          );
        })}
      </select>
      <div className="error-container">
        {error && <label className="error-text"> {error}</label>}
      </div>
    </div>
  );
};
