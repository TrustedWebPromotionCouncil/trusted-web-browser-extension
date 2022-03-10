import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "@/store/storeContext";

import { MnemonicPhraseView } from "./MnemonicPhrase.view";

export const MnemonicPhrase: FunctionComponent = () => {
  const { state } = useContext(Store);
  const { currentAccount } = state;
  const navigate = useNavigate();
  const [mnemonicArray, setMnemonicArray] = useState<string[]>([]);
  const { vault } = state;

  useEffect(() => {
    (async () => {
      const mnemonic = vault?.listMnemonic();
      setMnemonicArray(mnemonic?.split(" "));
    })();
  }, [vault]);

  const onoBack = () => {
    navigate(-2);
  };
  return (
    <MnemonicPhraseView
      mnemonics={mnemonicArray}
      did={currentAccount!.did}
      onBack={onoBack}
    />
  );
};
