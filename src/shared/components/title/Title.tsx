import React, { FunctionComponent, HtmlHTMLAttributes } from "react";
import classNames from "classnames";

import "./title.scss";

interface TitleProps extends HtmlHTMLAttributes<HTMLDivElement> {
  headline: string;
  subtitle?: string;
}

export const Title: FunctionComponent<TitleProps> = ({
  headline,
  subtitle,
  ...props
}) => {
  const { className } = props;
  return (
    <div className={classNames("title-container", className)}>
      <div className="text-styles-headline4 title">{headline}</div>
      {subtitle && (
        <div className="text-styles-subtitle1 sub-title">{subtitle}</div>
      )}
    </div>
  );
};
