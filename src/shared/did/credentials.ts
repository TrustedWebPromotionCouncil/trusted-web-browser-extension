import {
  Issuer,
  JwtCredentialPayload,
  createVerifiableCredentialJwt,
  verifyCredential,
} from "did-jwt-vc";
import { ES256KSigner } from "did-jwt";

import { ionResolver } from "./resolver";

export const createVC = async (
  issuerId: string,
  subjectId: string,
  type: string,
  data: any,
  keyPair: any
) => {
  const issuer: Issuer = {
    did: issuerId,
    alg: "ES256K",
    signer: ES256KSigner(keyPair.getPrivate("hex")),
  };
  const vcPayload: JwtCredentialPayload = {
    sub: subjectId,
    // nbf: a UNIX timestamp when this VC is issued
    nbf: Math.floor(new Date().getTime() / 1000),
    vc: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://github.com/DataSignInc/trusted-web-vocab/blob/f0780b88084cfbae3b119473362b2d1e1c807ab9/schema.jsonld",
      ],
      type: ["VerifiableCredential", type],
      credentialSubject: data,
    },
  };

  const vcJwt = await createVerifiableCredentialJwt(vcPayload, issuer);
  return vcJwt;
};

const verifyVC = async (vcJwt: string) => {
  const verifiedVC = await verifyCredential(vcJwt, ionResolver);
  return verifiedVC;
};

const Modules = {
  createVC,
  verifyVC,
};
export default Modules;
