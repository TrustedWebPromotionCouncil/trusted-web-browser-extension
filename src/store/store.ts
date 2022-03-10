import { Reducer } from "react";
import Provider, { RequestObject } from "@datasign/siop";

import { BootedState, BootResult } from "@/shared/boot/bootApp";
import {
  Account,
  Accounts,
  CompanyDid,
  Company,
  CreateDidResult,
  KeyringStore,
  Name,
  VcKey,
} from "@/types";
import accountHelper from "@/shared/account/accountHelper";
import { Vault } from "@/shared/vault/vault";

type EventType = "request" | "state_changed" | "clear" | "nothing";
interface LockContext {
  vaultState: KeyringStore;
  lastEvent: EventType;
  afterUnlockRoute: string;
}
interface LockRequestEvent {
  name: "request";
  afterUnlockRoute: string;
}
interface LockChangeEvent {
  name: "state_changed";
  vaultState: KeyringStore;
}
type LockEvent = LockRequestEvent | LockChangeEvent | { name: "clear" };
export interface RootState {
  bootState: "booting" | BootResult["state"]; // https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html
  locked: boolean;
  processing: boolean;
  currentAccount?: Account;
  accounts: Accounts;
  name?: Name;
  company?: Company;
  companyDids: CompanyDid[];
  vault?: Vault;
  companies: CreateDidResult[];
  siop?: { provider: Provider; requestObject: RequestObject };
  vcKeys?: VcKey[];
  lockContext: LockContext;
}
export const initialState: RootState = {
  bootState: "booting",
  locked: false,
  processing: false,
  accounts: {},
  companyDids: [],
  lockContext: {
    vaultState: { isUnlocked: false },
    lastEvent: "nothing",
    afterUnlockRoute: "",
  },
  companies: [],
};

export type GenericActions =
  | { type: "booted"; payload: BootedState }
  | {
      type: "setLockContext";
      payload: LockEvent;
    }
  | { type: "setProcessing"; payload: { processing: boolean } };

export type SetupActions =
  | { type: "setName"; payload: Name }
  | { type: "setCompany"; payload: Company }
  | { type: "setAccounts"; payload: Accounts }
  | { type: "addAccount"; payload: Account }
  | { type: "setCurrentAccount"; payload: { did: string } }
  | { type: "updateAccount"; payload: Account }
  | { type: "setVault"; payload: Vault }
  | { type: "setCompanies"; payload: CreateDidResult[] }
  | {
      type: "setSIOP";
      payload: { provider: Provider; requestObject: RequestObject };
    }
  | { type: "setVcKeys"; payload: VcKey[] }
  | { type: "resetAccount" };

export type Action = GenericActions | SetupActions;

export const reducer: Reducer<RootState, Action> = (state, action) => {
  console.debug(`action: ${action.type}`);
  switch (action.type) {
    case "booted":
      const bootState = action.payload;
      if (bootState.state === "authed") {
        const { accounts, currentAccount } = bootState;
        return {
          ...state,
          bootState: bootState.state,
          accounts,
          currentAccount,
        };
      } else {
        return {
          ...state,
          bootState: bootState.state,
        };
      }
    case "setLockContext":
      const { name } = action.payload;
      let lockContext: LockContext = {
        ...state.lockContext,
        lastEvent: name,
      };
      if (name === "request") {
        const { afterUnlockRoute } = action.payload;
        lockContext = {
          ...lockContext,
          afterUnlockRoute,
        };
      } else if (name === "state_changed") {
        const { vaultState } = action.payload;
        lockContext = {
          ...lockContext,
          vaultState: vaultState,
        };
      } else if (name === "clear") {
        lockContext = {
          ...lockContext,
          afterUnlockRoute: "",
        };
      }
      return {
        ...state,
        lockContext,
      };
    // return state;
    case "setProcessing":
      return { ...state, processing: action.payload.processing };
    case "setName":
      return {
        ...state,
        name: action.payload,
      };
    case "setCompany":
      return {
        ...state,
        company: action.payload,
      };
    case "setAccounts":
      return {
        ...state,
        accounts: action.payload,
      };
    case "addAccount":
      return {
        ...state,
        bootState: "authed",
        accounts: {
          ...state.accounts,
          [action.payload.did]: action.payload,
        },
        currentAccount: action.payload,
      };
    case "updateAccount":
      const mergedAccounts = accountHelper.mergeAccount(
        action.payload,
        state.accounts
      );
      return {
        ...state,
        accounts: {
          ...mergedAccounts,
        },
        currentAccount: mergedAccounts[action.payload.did],
      };
    case "setCurrentAccount":
      return {
        ...state,
        currentAccount: state.accounts[action.payload.did],
      };
    case "setVault":
      return {
        ...state,
        vault: action.payload,
      };
    case "setCompanies":
      return {
        ...state,
        companies: action.payload,
      };
    case "setSIOP":
      return {
        ...state,
        siop: action.payload,
      };
    case "setVcKeys":
      return {
        ...state,
        vcKeys: action.payload,
      };
    case "resetAccount":
      return {
        ...initialState,
        bootState: "not_authed",
        companyDids: state.companyDids,
      };
    default:
      throw new Error(`unsupported action`);
  }
};
