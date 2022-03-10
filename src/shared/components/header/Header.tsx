import React, { FunctionComponent, useContext } from "react";
import { FaArrowLeft } from "react-icons/fa";

import { Store } from "@/store/storeContext";
import "./header.scss";
import { Identicon } from "../Identicon/Identicon";

interface HeaderProps {
  onBack?: () => void;
}

export const Header: FunctionComponent<HeaderProps> = (props) => {
  const { onBack } = props;
  const { state } = useContext(Store);
  const { currentAccount } = state;
  const getRight = () => {
    if (currentAccount && currentAccount.name) {
      const { lastname, firstname } = currentAccount.name;
      return (
        <div className="account-area">
          <div className="account-icon">
            <div className="account-name">
              {lastname} {firstname}
            </div>
            <Identicon did={currentAccount.did} diameter={30} />
          </div>
        </div>
      );
    } else {
      return <div>SetUp</div>;
    }
  };
  return (
    <header className="navbar shadow-sm p-2 mb-3 header-container">
      <div>
        {onBack && (
          <div className="back" onClick={onBack}>
            <FaArrowLeft color="white" />
          </div>
        )}
      </div>
      <div>{getRight()}</div>
    </header>
  );
};
