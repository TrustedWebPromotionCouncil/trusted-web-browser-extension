import { ec as EC } from "elliptic";
import b64url from "base64url";

import { PrivateJwk } from "@/types";

export const convertEcKeyPairToJwk = (keyPair: EC.KeyPair): PrivateJwk => {
  const base64ToBase64url = (b64: string) =>
    b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/[=]/g, "");

  const encodePoint = (point: Buffer) =>
    base64ToBase64url(point.toString("base64"));

  const publicKey = keyPair.getPublic();

  return {
    kty: "EC",
    // The crv type compatible with ion-tools
    // https://github.com/decentralized-identity/ion-tools#iongeneratekeypair-async
    crv: "secp256k1",
    // We must specify the length parameter (32) to avoid 00-truncated Buffer instances.
    // Example:
    //   Expected:
    //     <Buffer 00 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    //   Wrong (When the length parameter is omitted):
    //     <Buffer 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    x: encodePoint(publicKey.getX().toArrayLike(Buffer, "be", 32)),
    y: encodePoint(publicKey.getY().toArrayLike(Buffer, "be", 32)),
    d: encodePoint(keyPair.getPrivate().toArrayLike(Buffer, "be", 32)),
  };
};

export const convertPrivateJwkToKeyPair = (privateJwk: PrivateJwk) => {
  const ec = new EC("secp256k1");
  return ec.keyFromPrivate(b64url.toBuffer(privateJwk.d));
};
