import React, { FunctionComponent } from "react";
import { FaChevronRight } from "react-icons/fa";

import { Header, Title, Spacer } from "@/shared/components";

import "./menu.scss";

export type MenuName =
  | "create-credential"
  | "provide-credential"
  | "recovery-phrase"
  | "switch-account"
  | "access-log";

export interface MenuViewProps {
  onClick: (name: MenuName) => void;
}

export interface MenuProps {
  label: string;
  onClick: () => void;
}

const Menu: FunctionComponent<MenuProps> = (props) => {
  const { label, onClick } = props;
  return (
    <div className="menu-container">
      <div className="menu border-bottom" onClick={onClick}>
        <span>{label}</span>
        <FaChevronRight className="chevron" />
      </div>
    </div>
  );
};

export const MenuView: FunctionComponent<MenuViewProps> = (props) => {
  const { onClick } = props;
  return (
    <>
      <Header />
      <div className="container">
        <Title headline="メニュー" />
        <Spacer space={32} />
        <Menu
          label={"クレデンシャル作成"}
          onClick={() => onClick("create-credential")}
        />
        <Spacer space={8} />
        <Menu
          label={"クレデンシャル提供"}
          onClick={() => onClick("provide-credential")}
        />
        <Spacer space={8} />
        <Menu
          label={"アカウント復元用フレーズ"}
          onClick={() => onClick("recovery-phrase")}
        />
        <Spacer space={8} />
        <Menu
          label={"アカウント切り替え"}
          onClick={() => onClick("switch-account")}
        />
        <Spacer space={8} />
        <Menu label={"アクセス履歴"} onClick={() => onClick("access-log")} />
      </div>
    </>
  );
};
