// @ts-ignore
import ION from "@decentralized-identity/ion-tools";

import { PrivateJwk, KeyPair, KeyTypes } from "../../types";

export interface NewKey {
  type: "new";
  keyTypes: KeyTypes;
}

export interface UseKey {
  type: "use";
  privateJwk: PrivateJwk;
}

export interface Opts {
  keyId?: string;
  keyInfo: NewKey | UseKey;
}

const buildKeyPair = (privateJwk: PrivateJwk): KeyPair => {
  const { d, ...rest } = privateJwk;
  const publicJwk = rest;
  return { publicJwk, privateJwk };
};

// https://identity.foundation/sidetree/spec/#did-operations
// https://github.com/decentralized-identity/ion-cli/blob/main/src/commands/new.ts
export const generateNewDID = async ({ keyId = "key-1", keyInfo }: Opts) => {
  try {
    // https://github.com/decentralized-identity/ion-tools#iongeneratekeypair-async
    let keyPair;
    if (keyInfo.type === "new") {
      keyPair = await ION.generateKeyPair(keyInfo.keyTypes);
    } else {
      keyPair = buildKeyPair(keyInfo.privateJwk);
    }

    // Mix in the kid
    const privateJwk = Object.assign({ kid: keyId }, keyPair.privateJwk);

    // Now generate the DID using the new key
    console.debug("generate");
    const did = new ION.DID({
      content: {
        publicKeys: [
          {
            id: keyId,
            type: "EcdsaSecp256k1VerificationKey2019",
            publicKeyJwk: keyPair.publicJwk,
            purposes: ["authentication", "keyAgreement"],
          },
        ],
      },
    });
    const didState = await did.getState();

    console.debug("publish");
    // https://github.com/decentralized-identity/ion-cli/blob/main/src/commands/publish.ts
    // https://github.com/decentralized-identity/ion-tools#generaterequest-async
    const requestBody = await did.generateRequest();

    const ionNode = process.env.REACT_APP_ION_NODE;
    // https://github.com/decentralized-identity/ion-tools#new-ionanchorrequestrequest_body-options
    // > NOTE: Endpoint URIs will default to https://beta.ion.msidentity.com if not supplied
    // NOTE: The code below commented out is not working now(2022-01-17),
    // because server side ion core modules published on git-hub does not implement challenge endpoint.
    // const request = new ION.AnchorRequest(requestBody, {
    //   challengeEndpoint: `${ionNode}/api/v1.0/proof-of-work-challenge`,
    //   solutionEndpoint: `${ionNode}/api/v1.0/operations`,
    // });
    // await request.submit();
    // Note: Instead, request `/operations` endpoint directly.
    const endpoint = `${ionNode}/operations`;
    const response = await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(requestBody),
      headers: {
        // "Challenge-Nonce": challengeNonce,
        // "Answer-Nonce": answerNonce,
        "Content-Type": "application/json",
      },
    });
    const responseBody = await response.json();
    console.debug("submitted", responseBody);
    return { initialState: didState, privateJwk };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signPayload = async (payload: {}, privateJwk: PrivateJwk) => {
  const jws = await ION.signJws({ payload, privateJwk });
  return jws;
};

export const convertLongFormToShortForm = (didLongForm: string) => {
  const [did, ion, shortForm] = didLongForm.split(":");
  return [did, ion, shortForm].join(":");
};

const Modules = {
  generateNewDID,
  signPayload,
};
export default Modules;
