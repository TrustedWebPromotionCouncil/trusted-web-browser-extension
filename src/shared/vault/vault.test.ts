/**
 * @jest-environment ./jest-custom-environment
 */

import { ec as EC } from "elliptic";
import { convertEcKeyPairToJwk } from "../keys";
import { Vault } from "./vault";

describe("Vault class", () => {
  test("convert elliptic.keyPair to Jwk private key", async () => {
    const ec = new EC("secp256k1");

    // Key value is from: https://github.com/decentralized-identity/ion-tools/tree/9c6572daf91cc59f4bd489eb51da261d2483c0be#iongeneratekeypair-async
    const privateKeyHex =
      "91b9f23abb1919ab25c9ea1fcc362a30289b5b3b112c96fb6679d0dab6dd24b0";
    const keyPair = ec.keyFromPrivate(privateKeyHex);

    expect(convertEcKeyPairToJwk(keyPair)).toEqual({
      crv: "secp256k1",
      d: "kbnyOrsZGaslyeofzDYqMCibWzsRLJb7ZnnQ2rbdJLA",
      kty: "EC",
      x: "L60Mcg_4uhbAO4RaL1eAJ5CKVqBD8cm6PrBuua4gyGA",
      y: "wwVm2dFCamLZkpGTlRMhdASmPtWuPW9Eg1wLfziwEAs",
    });
  });

  test("able to recover identical wallet", async () => {
    const vault = new Vault();
    await vault.initialize();
    await vault.createNewVault("dummy password");
    // Generate three keypairs to compare later on
    await Promise.all([1, 2, 3].map(() => vault.addAccount()));
    const expectedKeyPairList = await vault.listKeyPairs();
    // get mnemonic phrase
    const mnemonics = await vault.listMnemonic();
    const mnemonicArray = mnemonics.split(" ");

    // Restore the vault created above
    const restoredVault = new Vault();
    await restoredVault.initialize();
    await restoredVault.restore(mnemonicArray, "dummy password2");
    await Promise.all([1, 2, 3].map(() => restoredVault.addAccount()));

    expect(
      (await restoredVault.listKeyPairs()).map((kp) => kp.getPrivate())
    ).toStrictEqual(
      expectedKeyPairList.map((kp: EC.KeyPair) => kp.getPrivate())
    );
  });
});
