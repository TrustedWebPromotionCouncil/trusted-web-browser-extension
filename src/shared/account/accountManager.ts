import { generateNewDID } from "../did/ion";
import {
  Account,
  Accounts,
  Company,
  IntegralAccounts,
  Name,
  NotStored,
  PrivateJwk,
  Reference,
  Stored,
} from "@/types";

import accountHelper from "./accountHelper";
import localData from "../localData/localData";

// const browser = require("webextension-polyfill");

const KEY_DID_STATUS = "didStatus";
const KEY_CURRENT_ACCOUNT = "current_account";

export const issuePersonalDid = async (
  privateJwk: PrivateJwk,
  encryptedVault: string
): Promise<Account> => {
  // issue did
  console.debug("issue did");
  const result = await generateNewDID({
    keyInfo: { type: "use", privateJwk },
  });

  // store did
  console.debug("store did");
  const { longForm, shortForm } = result.initialState;
  const account = await saveNewAccount(
    longForm,
    { longForm, shortForm },
    encryptedVault
  );
  return account;
};

export const saveNewAccount = async (
  did: string,
  initialState: any,
  encryptedVault: string
) => {
  const account: Account = {
    did,
    initialState: initialState,
    encryptedVault,
  };
  let accounts: Accounts = { [did]: account };
  // get already saved account list
  const getResult = await localData.get<Accounts>(KEY_DID_STATUS);
  if (getResult.type === "stored") {
    accounts = { ...getResult.value, [did]: account };
  }
  // save new account
  await localData.store<Accounts>(KEY_DID_STATUS, accounts);
  await localData.store<string>(KEY_CURRENT_ACCOUNT, did);
  return account;
};

export const switchAccount = async (account: Account) => {
  await localData.store<string>(KEY_CURRENT_ACCOUNT, account.did);
};

export const registerName = async (did: string, name: Name) => {
  const account: Account = { did, name };
  const accounts = await patchAccount(account);
  return accounts[did];
};

export const registerCompany = async (did: string, company: Company) => {
  const account: Account = { did, company };
  const accounts = await patchAccount(account);
  return accounts[did];
};

export const registerReference = async (did: string, reference: Reference) => {
  const account: Account = { did, reference };
  const accounts = await patchAccount(account);
  return accounts[did];
};

const patchAccount = async (account: Account) => {
  const { did } = account;
  // let accounts: Accounts = { [did]: account };
  const getResult = await localData.get<Accounts>(KEY_DID_STATUS);
  const accounts =
    getResult.type === "stored"
      ? accountHelper.mergeAccount(account, getResult.value)
      : { [did]: account };
  await localData.store<Accounts>(KEY_DID_STATUS, accounts);
  return accounts;
};

type GetAccountsResult = Stored<IntegralAccounts> | NotStored;
type GetCurrentAccountResult = Stored<string> | NotStored;

export const getAccounts = async (): Promise<GetAccountsResult> => {
  const result = await localData.get<IntegralAccounts>(KEY_DID_STATUS);
  if (result.type === "stored") {
    return { type: "stored", value: result.value };
  } else {
    return { type: "not_stored" };
  }
};

export const getCurrentAccount = async (): Promise<GetCurrentAccountResult> => {
  const result = await localData.get<string>(KEY_CURRENT_ACCOUNT);
  if (result.type === "stored") {
    return { type: "stored", value: result.value };
  } else {
    return { type: "not_stored" };
  }
};
