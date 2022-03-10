import React, { FunctionComponent } from "react";

import "./dataSetView.scss";

export interface Data {
  type: "leaf";
  name: string;
  value: string | number;
}

export interface DataSet {
  type: "set";
  name: string;
  values: (Data | DataSet)[];
}
interface DataSetViewProps {
  dataSet?: DataSet[];
}

export const DataSetView: FunctionComponent<DataSetViewProps> = (props) => {
  const { dataSet } = props;
  const expand = (dataSet: DataSet | Data, index: number | string) => {
    return (
      <ul className="data-set" key={index}>
        {dataSet.type === "leaf" && (
          <li key={index}>
            <span className="data-label">{dataSet.name}</span>
            <span className="data-value text-break">{dataSet.value} </span>
          </li>
        )}
        {dataSet.type === "set" && (
          <li key={index}>
            <div className=" data-section-label-wrapper border-bottom">
              <span className="data-label">{dataSet.name}</span>
            </div>
            {dataSet.values.map((ds, subindex) =>
              expand(ds, `${index}-${subindex}`)
            )}
          </li>
        )}
      </ul>
    );
  };

  return (
    <div className="data-set-container">
      {dataSet!.map((ds, index) => expand(ds, index))}
    </div>
  );
};
