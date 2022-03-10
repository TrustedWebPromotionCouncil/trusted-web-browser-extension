import { registerReference } from "@/shared/account/accountManager";
import { RootState } from "@/store/store";
import { Reference } from "@/types";

export const save = async (state: RootState, reference: Reference) => {
  const { currentAccount } = state;
  if (!currentAccount) {
    throw new Error("no current account");
  }
  const account = await registerReference(currentAccount.did, reference);
  return account;
};

const Modules = {
  save,
};
export default Modules;
