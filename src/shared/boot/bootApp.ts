import { IntegralAccount, Accounts } from "@/types";
import { getAccounts, getCurrentAccount } from "../account/accountManager";

// const browser = require("webextension-polyfill");

/*
@startuml
state c <<choice>>

state s1 as "authed" {
  state c2 <<choice>>

  state s1_1 as "locked"
  state s1_2 as "unlocked"

  [*] --> c2: auto / get last unlocked time
  c2 --> s1_1: More than xxx hours have passed
  c2 --> s1_2: Within xxx hours

}
state s2 as "not authed"

[*] --> c
c --> s1: person's did exists
c --> s2: person's did don't exist

@enduml
*/

// interface NestedState<T, S> {
//   state: T;
//   subState: S;
// }
interface State<T> {
  state: T;
}

export interface Authed extends State<"authed"> {
  accounts: Accounts;
  currentAccount: IntegralAccount;
}
interface NOT_AUTHED extends State<"not_authed"> {}

export type BootedState = Authed | NOT_AUTHED;

export const boot = async (): Promise<BootedState> => {
  // get the current account from the WebExtention storage and return it.
  const result = await getAccounts();
  if (result.type === "stored") {
    const { value } = result;
    const current = await getCurrentAccount();
    if (current.type === "not_stored") {
      throw new Error("illegal storage state");
    }
    // didが保存されていた場合は、続けて現在のアカウントも取得する
    const currentAccount = value[current.value];
    return {
      state: "authed",
      accounts: value,
      currentAccount,
    };
  } else {
    return { state: "not_authed" };
  }
};

export type BootResult = Authed | NOT_AUTHED;
