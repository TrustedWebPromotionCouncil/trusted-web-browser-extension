/**
 * @jest-environment ./jest-custom-environment
 */
// @ts-ignore
import ION from "@decentralized-identity/ion-tools";
import fetchMock from "fetch-mock";
import jwt_decode from "jwt-decode";

import { KeyTypes } from "../../types";
import { generateNewDID, signPayload } from "./ion";

jest.mock("@decentralized-identity/ion-tools", () => {
  // https://jestjs.io/ja/docs/mock-functions#mocking-partials
  const originalModule = jest.requireActual(
    "@decentralized-identity/ion-tools"
  );
  const originalConstrucor = originalModule.AnchorRequest.prototype.constructor;
  class AnchorRequest {
    submit() {}
  }
  AnchorRequest.prototype.constructor = originalConstrucor;
  const paritallyMocked = {
    ...originalModule,
    AnchorRequest,
  };
  return {
    __esModule: true,
    default: paritallyMocked,
  };
});

describe("generate did", () => {
  beforeAll(() => {
    const ionNode = process.env.REACT_APP_ION_NODE;
    const endpoint = `${ionNode}/operations`;
    fetchMock.post(endpoint, {
      status: 200,
      body: {
        didStatus: {},
        keys: {},
      },
    });
  });
  test("new key", async () => {
    const result = await generateNewDID({
      keyInfo: { type: "new", keyTypes: "secp256k1" },
    });
    const { initialState, privateJwk } = result;
    expect(initialState).toBeTruthy();
    expect(initialState.shortForm).toBeTruthy();
    expect(initialState.longForm).toBeTruthy();

    expect(privateJwk).toBeTruthy();
    expect(privateJwk.kid).toBe("key-1");
    expect(privateJwk.crv).toBe("secp256k1");
    expect(privateJwk.x).toBeTruthy();
    expect(privateJwk.y).toBeTruthy();
    expect(privateJwk.d).toBeTruthy();
  });

  test("use key", async () => {
    const keyPair = await ION.generateKeyPair("secp256k1");
    const result = await generateNewDID({
      keyInfo: { type: "use", privateJwk: keyPair.privateJwk },
    });
    const { initialState, privateJwk } = result;
    expect(initialState).toBeTruthy();
    expect(initialState.shortForm).toBeTruthy();
    expect(initialState.longForm).toBeTruthy();

    expect(privateJwk).toBeTruthy();
    expect(privateJwk.kid).toBe("key-1");
    expect(privateJwk.crv).toBe("secp256k1");
    expect(privateJwk.x).toBe(keyPair.privateJwk.x);
    expect(privateJwk.y).toBe(keyPair.privateJwk.y);
    expect(privateJwk.d).toBe(keyPair.privateJwk.d);
  });
});
describe("sign payload", () => {
  test("sign", async () => {
    const publicKeyJwk = {
      kty: "EC" as "EC",
      crv: "secp256k1" as KeyTypes,
      x: "60cMlepXP5Vu-J7S6XmW2YohzCrfgbjDpTduaBNvYbo",
      y: "lH4Hy3AEAaWahDhFlXU_8hpRLqgdFUIM1BfIpCtKjnI",
    };
    const privateJwk = {
      ...publicKeyJwk,
      d: "sWuTJdiChdrrBySzDzyczqlUg_5QmXz4-V0PIWFIEpE",
    };
    const payload = {
      key: "0702f378-7320-49b9-b006-5f6a8abf1ea6",
    };
    const jwt = await signPayload(payload, privateJwk);
    const decoded = jwt_decode<{ key: string }>(jwt);
    expect(decoded.key).toBe("0702f378-7320-49b9-b006-5f6a8abf1ea6");
  });
});
