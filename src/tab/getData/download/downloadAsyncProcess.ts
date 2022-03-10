import { Account, CreateDidResult, ProcessResultFailure, VcKey } from "@/types";
import apiClient from "@/shared/apiClient";
import ion from "@/shared/did/ion";
import { decrypt } from "@/shared/encryption/encryption";
import credentials from "@/shared/did/credentials";
import converter, { DataSet } from "@/shared/convertCredentials/converter";

interface GetVcSuccess {
  type: "success";
  data: DataSet[][];
}

const getData = async (
  currentAccount: Account,
  vcKeys: VcKey[],
  companies: CreateDidResult[]
): Promise<GetVcSuccess | ProcessResultFailure> => {
  const currentCompany = companies.find(
    (c) => c.initialState.shortForm === currentAccount?.company?.companyId
  );
  if (!currentCompany) {
    return { type: "failure", message: "company could not be bound" };
  }
  if (!vcKeys) {
    return { type: "failure", message: "download keys are not specified" };
  }
  try {
    const privateKey = currentCompany.keys;
    const promises = vcKeys?.map(async (vcKey) => {
      console.debug("vc", vcKey.name);
      const jws = await ion.signPayload(
        { value: vcKey.value, contactId: currentAccount?.did },
        privateKey
      );
      // download
      console.debug("download", vcKey.value);
      const data = await apiClient.get<{ data: string }>(
        `/verifiable-credentials/${jws}`
      );
      // decrypt
      console.debug("decrypt", data.data);
      const decrypted = await decrypt(data.data, privateKey);
      // verify vc
      console.debug("verify vc", decrypted);
      const verifiedVC = await credentials.verifyVC(decrypted);
      const { issuer, credentialSubject } = verifiedVC.verifiableCredential;
      // success
      console.debug("verified", { issuer, credentialSubject });
      return { name: vcKey.name, data, credentialSubject };
    });
    const data = await Promise.all(promises).then((values) => {
      return values;
    });
    const dataSetList = data.map((d) => {
      if (d.name === "jopApplicationCredential") {
        return [converter.toJobApplicationDataSet(d.credentialSubject)];
      } else if (d.name === "citizenshipCredential") {
        return [converter.toCitizenshipCredentialDataSet(d.credentialSubject)];
      } else if (d.name === "jobCredential") {
        return [converter.toJobCredentialDataSet(d.credentialSubject)];
      } else if (d.name === "referenceCredential") {
        return [converter.toReferenceCredentialDataSet(d.credentialSubject)];
      } else {
        throw new Error("found unsupported key!");
      }
    });
    return { type: "success", data: dataSetList };
  } catch (err) {
    console.error(err);
    return { type: "failure", message: (err as Error).message };
  }
};

const Modules = {
  getData,
};
export default Modules;
