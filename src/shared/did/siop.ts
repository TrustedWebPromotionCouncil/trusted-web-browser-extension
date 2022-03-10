import { ec as EC } from "elliptic";
import Provider, { SIOPError } from "@datasign/siop";
import { PublicJwk } from "@/types";

import { ionResolver } from "./resolver";

export const receiveRequest = async (params: string) => {
  const provider = new Provider(3000, ionResolver);
  const requestObject = await provider.receiveRequest(params);
  return { requestObject, provider };
};

export const generateResponse = async (
  did: string,
  keyPair: EC.KeyPair,
  additionalFields: {},
  provider: Provider
) => {
  const location = await provider.generateResponse(
    did,
    keyPair,
    additionalFields
  );
  return location;
};

export const resolvePublicJwkFromDID = async (did: string) => {
  const result = await ionResolver.resolve(did);
  const keyList = result.didDocument?.verificationMethod;
  if (typeof keyList !== "undefined") {
    // TODO: Support DID Documents with multiple public keys for different purposes.
    const firstKey = keyList[0];
    const publicKeyJwk = firstKey.publicKeyJwk;
    return publicKeyJwk as PublicJwk;
  } else {
    throw new Error(`failed to resolve public key of ${did}.`);
  }
};

const generateCancelResponse = (clientId: string, state?: string) => {
  const error = new SIOPError("user_cancelled", clientId, state);
  return error.toResponse();
};

const Modules = {
  receiveRequest,
  generateResponse,
  resolvePublicJwkFromDID,
  generateCancelResponse,
};

export default Modules;
