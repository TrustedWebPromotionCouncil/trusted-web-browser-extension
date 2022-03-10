/**
 * @jest-environment ./jest-custom-environment
 */

import { ec as EC } from "elliptic";
import { encrypt, decrypt } from "./encryption";
import { PrivateJwk, PublicJwk } from "@/types";

const ec = new EC("secp256k1");

describe("encryption", () => {
  test("encryption", async () => {
    const content = "It’s a dangerous business, Frodo, going out your door.";
    const kp = ec.genKeyPair();
    const encrypted = await encrypt(content, kp);
    const decrypted = await decrypt(encrypted, kp);
    // assert plaintext field equals to decoded `content`
    expect(decrypted).toBe(content);
  });

  test("encrypt() accepts did", async () => {
    const content = "It’s a dangerous business, Frodo, going out your door.";
    const company1Did =
      "did:ion:EiBoZxu209mxIv-fAYJU6b3ekH-6qYWWlBPQJBvyNTxggQ";
    const company1PrivateJwk = {
      kty: "EC",
      crv: "secp256k1",
      d: "dvfzu_Nx2OB4iaVfdTpnG6Ct83dsLMSNGIFPVvKrnVM",
      x: "yVAe3kFElncWIqoYFlQVuD5DFCbHgotaeQuGwlhdwc4",
      y: "LWKrr19pvV0deZtGETHjMUjvi8ffdmIULatCou_iGTw",
    } as PrivateJwk;
    const encrypted = await encrypt(content, company1Did);
    const decrypted = await decrypt(encrypted, company1PrivateJwk);
    // assert plaintext field equals to decoded `content`
    expect(decrypted).toBe(content);
  });

  test("accept public keys in the JWK format", async () => {
    const content = "It’s a dangerous business, Frodo, going out your door.";

    const d = "kbnyOrsZGaslyeofzDYqMCibWzsRLJb7ZnnQ2rbdJLA";
    const publicKeyJwk: PublicJwk = {
      crv: "secp256k1",
      kty: "EC",
      x: "L60Mcg_4uhbAO4RaL1eAJ5CKVqBD8cm6PrBuua4gyGA",
      y: "wwVm2dFCamLZkpGTlRMhdASmPtWuPW9Eg1wLfziwEAs",
    };
    const encrypted = await encrypt(content, publicKeyJwk);
    const decrypted = await decrypt(encrypted, { ...publicKeyJwk, d });
    // assert plaintext field equals to decoded `content`
    expect(decrypted).toBe(content);
  });
});
