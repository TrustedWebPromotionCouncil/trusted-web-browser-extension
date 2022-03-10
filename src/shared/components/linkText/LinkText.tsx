import React, { FunctionComponent, ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

import './linkText.scss';

interface LinkTextProps extends ButtonHTMLAttributes<HTMLDivElement> {}


export const LinkText: FunctionComponent<LinkTextProps> = ({
  children,
  ...props
}) => {
  const { className } = props;
  return (
      <div {...props} className={classNames('link-text', className)}>
        <span className={'link-text-span'} onClick={props.onClick}>
          {children}
        </span>
      </div>
  );
};
