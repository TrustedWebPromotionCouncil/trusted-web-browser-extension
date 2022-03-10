import { createVC } from "@/shared/did/credentials";
import converter from "@/shared/convertCredentials/converter";
import { ProcessResultFailure } from "@/types";
import { RootState } from "@/store/store";
import apiClient from "@/shared/apiClient";
import { encrypt } from "@/shared/encryption/encryption";
import siop from "@/shared/did/siop";
import { convertPrivateJwkToKeyPair } from "@/shared/keys";

// interface AdditionalFields {
//   jobCredential: string;
//   referenceCredential: string;
// }
interface ProvideVcSuccess {
  type: "success";
  data: { name: string; key: string }[];
}

const uploadVc = async (
  vc: string,
  owner: string,
  aud: string,
  cvType: string
) => {
  const payload = { vc, owner, aud, cvType };
  try {
    const data = await apiClient.post<{ key: string }>(
      `/verifiable-credentials`,
      payload
    );
    return data.key;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export type DataTypes = "jobCredential" | "referenceCredential";

const provide = async (
  state: RootState,
  selectedDataTypes: DataTypes[],
  destDid: string
): Promise<ProvideVcSuccess | ProcessResultFailure> => {
  const { currentAccount, companies, vault } = state;
  const { did, name, company, reference } = currentAccount!;
  if (!name || !company) {
    throw new Error("company in not found");
  }

  if (!reference) {
    throw new Error("Reference is not found");
  }
  const { input1, input2, input3 } = reference;

  const personId = did;
  const { companyId, jobTitle } = company;
  const getCompanyKeyPair = () => {
    const companyDid = companies.find(
      (v) => v.initialState.shortForm === companyId
    );
    return convertPrivateJwkToKeyPair(companyDid!.keys);
  };
  const companyKeyPair = getCompanyKeyPair();
  const keyPairs = await vault?.listKeyPairs();
  const ownKeyPair = await keyPairs![0];
  const owner = did;
  const aud = destDid;
  try {
    const publicKeyJwkDest = await siop.resolvePublicJwkFromDID(destDid);
    const vcKeys = await Promise.all(
      selectedDataTypes.map(async (dataType) => {
        // create vc
        let vc;
        if (dataType === "jobCredential") {
          vc = await createVC(
            company.companyId,
            personId,
            "EmployeeCredential",
            converter.toJobCredentialPayload(
              companyId,
              jobTitle,
              company.organization
            ),
            companyKeyPair
          );
        } else {
          vc = await createVC(
            personId,
            personId,
            "ReferenceCredential",
            converter.toReferenceCredentialPayload(
              input1,
              input2,
              input3,
              personId
            ),
            ownKeyPair
          );
        }
        console.log({ dataType, vc });
        // encrypt vc
        const encryptedVc = await encrypt(vc, publicKeyJwkDest);
        console.log({ encryptedVc });
        // upload vc
        const vcKey = await uploadVc(encryptedVc, owner, aud, dataType);
        console.log({ vcKey });
        return { name: dataType, key: vcKey };
      })
    );
    return {
      type: "success",
      data: vcKeys,
    };
  } catch (err) {
    return { type: "failure", message: (err as Error).message };
  }
};

const Modules = { provide };
export default Modules;
