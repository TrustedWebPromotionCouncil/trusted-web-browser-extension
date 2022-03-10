import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";

import { Store } from "@/store/storeContext";
import { VcKey } from "@/types";

import { SelectDataTypeView } from "./SelectDataType.view";

const checkItemsAll = [
  { label: "在籍証明", value: "jobCredential" },
  { label: "本人確認", value: "citizenshipCredential" },
  { label: "応募情報", value: "jopApplicationCredential" },
  { label: "回答情報", value: "referenceCredential" },
];

export const SelectDataType: FunctionComponent = () => {
  const [vcKeys, setVcKeys] = useState<VcKey[]>([]);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const { dispatch } = useContext(Store);
  const navigate = useNavigate();

  useEffect(() => {
    const f = async () => {
      const parsed = queryString.parse(window.location.search);
      const keys: { [key: string]: string } = {};
      const _vcKeys = Object.entries(parsed).map((entry) => {
        const [key, value] = entry;
        return { name: key, value: value as string };
      });
      setVcKeys(_vcKeys);

      const _checkItems = checkItemsAll.filter((item) =>
        _vcKeys.find((vcKey) => vcKey.name === item.value)
      );
      if (_checkItems) {
        setItems(_checkItems);
      }
      console.log({ parsed, keys });
    };
    f();
  }, []);

  const onClick = async () => {
    console.debug("redirect to /protected/download", vcKeys);
    dispatch({
      type: "setVcKeys",
      payload: vcKeys,
    });
    navigate("/protected/download");
  };

  return (
    <SelectDataTypeView
      items={items.map((item) => item.label)}
      onClick={onClick}
    />
  );
};
