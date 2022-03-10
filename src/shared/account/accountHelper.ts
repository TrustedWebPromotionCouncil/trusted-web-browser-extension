import { Account, Accounts } from "@/types";

const mergeAccount = (newAccount: Account, accounts: Accounts) => {
  const { did } = newAccount;
  let mergedAccount = { ...newAccount };
  if (did in accounts) {
    mergedAccount = { ...accounts[did], ...newAccount };
  }
  const newAccounts = { ...accounts, [did]: mergedAccount };
  return newAccounts;
};

const Modules = {
  mergeAccount,
};

export default Modules;
