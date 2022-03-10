import { ec as EC } from "elliptic";

import { Name, Company, ProcessResultFailure } from "@/types";
import { createVC } from "@/shared/did/credentials";
import converter from "@/shared/convertCredentials/converter";
import siop from "@/shared/did/siop";
import { RootState } from "@/store/store";
import { convertPrivateJwkToKeyPair } from "@/shared/keys";
import { encrypt } from "@/shared/encryption/encryption";

// interface VcSet {
//   vc1: string;
//   vc2: string;
//   vc3: string;
// }
interface AdditionalFields {
  jopApplicationCredential: string;
  citizenshipCredential: string;
  jobCredential: string;
}
interface CreateVcSuccess {
  type: "success";
  vcSet: AdditionalFields;
}
interface UploadVcSetSuccess {
  type: "success";
  vcKeySet: AdditionalFields;
}
interface GenerateResponseSuccess {
  type: "success";
  location: string;
}

class CreateVC {
  private personId: string;
  private ownKeyPair: EC.KeyPair;
  private companyKeyPair: EC.KeyPair;

  constructor(
    personId: string,
    ownKeyPair: EC.KeyPair,
    companyKeyPair: EC.KeyPair
  ) {
    this.personId = personId;
    this.ownKeyPair = ownKeyPair;
    this.companyKeyPair = companyKeyPair;
  }
  async jobApplicationCredential(email: string) {
    const vc = await createVC(
      this.personId,
      this.personId,
      "ApplicationInformation",
      converter.toJobApplicationPayload(email),
      this.ownKeyPair
    );
    return vc;
  }
  async citizenshipCredential(name: Name) {
    const vc = await createVC(
      this.personId,
      this.personId,
      "JapanCitizenshipCredential",
      converter.toCitizenshipCredentialPayload(
        name?.lastname!,
        name?.firstname!
      ),
      this.ownKeyPair
    );
    return vc;
  }
  async jobCredential(name: Name, company: Company) {
    const vc = await createVC(
      company.companyId,
      this.personId,
      "EmployeeCredential",
      converter.toJobCredentialPayload(
        company?.companyId!,
        company?.jobTitle!,
        company?.organization!
      ),
      this.companyKeyPair
    );
    return vc;
  }
}

const createVc = async (
  state: RootState,
  email: string
): Promise<CreateVcSuccess | ProcessResultFailure> => {
  console.debug("create vc");

  const { currentAccount, companies, vault } = state;
  const { did, name, company } = currentAccount!;
  const personId = did;
  const companyId = company?.companyId!; // 所属企業のDID
  const getCompanyKeyPair = () => {
    const companyDid = companies.find(
      (v) => v.initialState.shortForm === companyId
    );
    return convertPrivateJwkToKeyPair(companyDid!.keys);
  };

  try {
    const keyPairs = await vault?.listKeyPairs();
    const vcCreate = new CreateVC(personId, keyPairs![0], getCompanyKeyPair());
    const vc1 = await vcCreate.jobApplicationCredential(email);
    const vc2 = await vcCreate.citizenshipCredential(name!);
    const vc3 = await vcCreate.jobCredential(name!, company!);
    return {
      type: "success",
      vcSet: {
        jopApplicationCredential: vc1,
        citizenshipCredential: vc2,
        jobCredential: vc3,
      },
    };
  } catch (err) {
    console.error(err);
    return { type: "failure", message: (err as Error).message };
  }
};

const uploadVc = async (
  vc: string,
  owner: string,
  aud: string,
  cvType: string
) => {
  const payload = { vc, owner, aud, cvType };
  const host = process.env.REACT_APP_TRACE_APP_HOST;
  try {
    const response = await fetch(`${host}/verifiable-credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const { status, statusText } = response;
    console.debug({ status, statusText });
    if (200 <= status && status < 300) {
      const result = await response.json();
      return result;
    } else if (300 <= status && status < 400) {
      throw new Error("returned unexpected response.");
    } else if (400 <= status && status < 500) {
      throw new Error(statusText);
    } else if (500 <= status) {
      throw new Error("internal server error occurred.");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const uploadVcSet = async (
  state: RootState,
  vcSet: AdditionalFields
): Promise<UploadVcSetSuccess | ProcessResultFailure> => {
  console.debug("upload vc");

  const { currentAccount } = state;
  if (!currentAccount) {
    throw new Error("illegal store state. current account is not set.");
  }
  const { jopApplicationCredential, citizenshipCredential, jobCredential } =
    vcSet;
  try {
    const owner = currentAccount.did;
    const aud = state.siop?.requestObject.iss!; // did of the rp issued siop request
    const publicKeyJwk = await siop.resolvePublicJwkFromDID(aud);
    if (!publicKeyJwk) {
      throw new Error("failed to resolve public key of RP.");
    }
    const encryptedVc1 = await encrypt(jopApplicationCredential, publicKeyJwk);
    const encryptedVc2 = await encrypt(citizenshipCredential, publicKeyJwk);
    const encryptedVc3 = await encrypt(jobCredential, publicKeyJwk);
    const vc1Key = await uploadVc(
      encryptedVc1,
      owner,
      aud,
      "jopApplicationCredential"
    );
    const vc2Key = await uploadVc(
      encryptedVc2,
      owner,
      aud,
      "citizenshipCredential"
    );
    const vc3Key = await uploadVc(encryptedVc3, owner, aud, "jobCredential");
    return {
      type: "success",
      vcKeySet: {
        jopApplicationCredential: vc1Key.key,
        citizenshipCredential: vc2Key.key,
        jobCredential: vc3Key.key,
      },
    };
  } catch (err) {
    console.error(err);
    return { type: "failure", message: (err as Error).message };
  }
};

const generateResponse = async (
  state: RootState,
  vcKeySet: AdditionalFields
): Promise<GenerateResponseSuccess | ProcessResultFailure> => {
  console.debug("generate response");

  const { currentAccount, siop: siopState, vault } = state;
  const personId = currentAccount?.did!;

  const keyPairs = await vault?.listKeyPairs();
  try {
    const location = await siop.generateResponse(
      personId,
      keyPairs![0],
      { data: vcKeySet },
      siopState!.provider
    );
    return { type: "success", location };
  } catch (err) {
    console.error(err);
    return { type: "failure", message: (err as Error).message };
  }
};

const generateCancelResponse = (state: RootState): string => {
  if (!state.siop) {
    throw new Error("illegal root state");
  }
  const clientId = state.siop?.requestObject.client_id;
  return siop.generateCancelResponse(clientId);
};

const Modules = {
  createVc,
  uploadVcSet,
  generateResponse,
  generateCancelResponse,
};

export default Modules;
