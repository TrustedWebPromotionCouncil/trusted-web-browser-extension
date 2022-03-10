import apiClient from "@/shared/apiClient";
import ion from "@/shared/did/ion";
import { convertEcKeyPairToJwk } from "@/shared/keys";
import companyHelper from "@/shared/company/companyHelper";
import { AccessLog, Account } from "@/types";
import { Vault } from "@/shared/vault/vault";

export const getAccessLog = async (currentAccount: Account, vault: Vault) => {
  const did = currentAccount?.did;
  try {
    const keyPairs = await vault?.listKeyPairs();
    const ownKeyPair = keyPairs![0];
    const jws = await ion.signPayload(
      { did },
      convertEcKeyPairToJwk(ownKeyPair)
    );
    const data = await apiClient.get<AccessLog[]>(`/access-log/${jws}`);
    const viewModels = data.map((accessLog) => {
      return {
        ...accessLog,
        operatorName: companyHelper.getCompany(accessLog.operator).name,
        cvTypeLabel: value2Label(accessLog),
      };
    });
    return viewModels;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const value2Label = (accessLog: AccessLog) => {
  const { cvType } = accessLog;
  switch (cvType) {
    case "jopApplicationCredential":
      return "応募情報";
    case "citizenshipCredential":
      return "本人確認情報";
    case "jobCredential":
      return "在籍証明";
    case "referenceCredential":
      return "レファレンス回答";
  }
};
