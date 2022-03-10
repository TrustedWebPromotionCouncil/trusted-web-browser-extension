import React, { FunctionComponent, ButtonHTMLAttributes } from "react";
import classNames from "classnames";
import { Spinner } from "react-bootstrap";

import "./button.scss";

type ButtonType = "contained" | "outlined" | "text";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  buttonType?: ButtonType;
}

export const Button: FunctionComponent<ButtonProps> = ({
  children,
  ...props
}) => {
  const { buttonType, className, onClick, loading, ...rest } = props;

  const onPressButton = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (onClick && "function" === typeof onClick) {
      onClick(e);
    }
  };

  const btnTypes = {
    contained: "button",
    outlined: "button-outlined",
    text: "btn-link",
  };
  const btnStyle = buttonType ? btnTypes[buttonType] : "button";

  return (
    <button
      {...rest}
      className={classNames(`btn-lg ${btnStyle} text-styles-button`, className)}
      disabled={props.disabled}
      onClick={(e) => (!loading ? onPressButton(e) : null)}
    >
      {loading ? (
        <Spinner
          as={"span"}
          animation={"border"}
          variant={"light"}
          size={"sm"}
          role={"status"}
          aria-hidden={"true"}
        />
      ) : (
        children
      )}
    </button>
  );
};
