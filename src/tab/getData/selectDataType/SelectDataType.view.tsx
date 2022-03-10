import React, { FunctionComponent, useCallback } from "react";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import { Button, Header, Spacer, Title } from "@/shared/components";

import "./selectDataType.scss";

interface SelectDataTypeViewProps {
  items: string[];
  onClick: () => void;
}

export const SelectDataTypeView: FunctionComponent<SelectDataTypeViewProps> = (
  props
) => {
  const { items, onClick } = props;
  const throttled = useCallback(
    _.throttle(onClick, THROTTLING_WAIT_TIME, {
      trailing: false,
    }),
    [onClick]
  );
  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      throttled();
    },
    [throttled]
  );
  return (
    <>
      <Header />
      <div className="container tab-container">
        <Title headline="情報の受け取り" subtitle="以下の情報が届いています" />
        <Spacer space={32} />
        <div className="dataTypes">
          <ul>
            {items.map((item) => {
              return <li className="pt-2 pb-1 border-bottom">{item}</li>;
            })}
          </ul>
        </div>
        <Spacer space={32} />
        <div className="buttons">
          <Button type="button" onClick={handleClick}>
            内容を確認する
          </Button>
        </div>
      </div>
    </>
  );
};
