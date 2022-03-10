/**
 * @jest-environment ./jest-custom-environment
 */
// @ts-ignore
import ION from "@decentralized-identity/ion-tools";
import { ec as EC } from "elliptic";
import b64url from "base64url";

import credentials from "./credentials";
import converter from "../convertCredentials/converter";

const personPubKey = {
  kty: "EC",
  crv: "secp256k1",
  x: "60cMlepXP5Vu-J7S6XmW2YohzCrfgbjDpTduaBNvYbo",
  y: "lH4Hy3AEAaWahDhFlXU_8hpRLqgdFUIM1BfIpCtKjnI",
};
const companyPubKey = {
  kty: "EC",
  crv: "secp256k1",
  x: "yVAe3kFElncWIqoYFlQVuD5DFCbHgotaeQuGwlhdwc4",
  y: "LWKrr19pvV0deZtGETHjMUjvi8ffdmIULatCou_iGTw",
};
const person = {
  did: "did:ion:EiB1808G0NYU9VElEL-DJHBFwo-DyMqh3Ee3MSpOw6pPnw",
  publicKeyJwk: personPubKey,
  privateJwk: {
    ...personPubKey,
    d: "sWuTJdiChdrrBySzDzyczqlUg_5QmXz4-V0PIWFIEpE",
  },
};
const company = {
  did: "did:ion:EiBoZxu209mxIv-fAYJU6b3ekH-6qYWWlBPQJBvyNTxggQ",
  publicKeyJwk: companyPubKey,
  privateJwk: {
    ...companyPubKey,
    d: "dvfzu_Nx2OB4iaVfdTpnG6Ct83dsLMSNGIFPVvKrnVM",
  },
};
// this variable name must start with `mock` under the jest constraints.
const mockKeyMap = {
  [company.did]: companyPubKey,
  [person.did]: personPubKey,
};
jest.mock("@decentralized-identity/ion-tools", () => {
  // https://jestjs.io/ja/docs/mock-functions#mocking-partials
  const originalModule = jest.requireActual(
    "@decentralized-identity/ion-tools"
  );
  const paritallyMocked = {
    ...originalModule,
    resolve: async (did: string) => {
      return {
        didDocument: {
          id: did,
          verificationMethod: [
            {
              id: "#key-1",
              controller: "",
              type: "EcdsaSecp256k1VerificationKey2019",
              publicKeyJwk: mockKeyMap[did],
            },
          ],
          authentication: ["#key-1"],
          keyAgreement: ["#key-1"],
        },
        didDocumentMetadata: {
          method: {
            published: true,
            recoveryCommitment:
              "EiCHxp_GRfxyh1tcZXJFV9ijNc3iuqLlqw0FN9Mcx9GkPg",
            updateCommitment: "EiDrrQKCcNeIgrEbn3soN-l1OtL6F5QLrxgSxN6bKbFqfg",
          },
          canonicalId: did,
        },
      };
    },
  };
  return {
    __esModule: true,
    default: paritallyMocked,
  };
});

describe("create vc", () => {
  test("job application", async () => {
    const ec = new EC("secp256k1");
    const keyPair = ec.keyFromPrivate(b64url.toBuffer(person.privateJwk.d));
    const data = converter.toJobApplicationPayload("test@example.com");
    const vcJwt = await credentials.createVC(
      person.did,
      person.did,
      "ApplicationInformation",
      data,
      keyPair
    );
    const verifiedVC = await credentials.verifyVC(vcJwt);
    console.log({
      vcJwt,
      verifiedVC,
      subject: verifiedVC.verifiableCredential.credentialSubject,
    });
    const { issuer, credentialSubject } = verifiedVC.verifiableCredential;
    expect(issuer.id).toBe(person.did);
    expect(credentialSubject.id).toBe(person.did);
    expect(credentialSubject.applicationDate).toBeTruthy();
    expect(credentialSubject.email).toBe("test@example.com");
  });
  test("citizenship", async () => {
    const ec = new EC("secp256k1");
    const keyPair = ec.keyFromPrivate(b64url.toBuffer(person.privateJwk.d));
    const data = converter.toCitizenshipCredentialPayload("yamada", "taro");
    const vcJwt = await credentials.createVC(
      person.did,
      person.did,
      "JapanCitizenshipCredential",
      data,
      keyPair
    );
    const verifiedVC = await credentials.verifyVC(vcJwt);
    const { issuer, credentialSubject } = verifiedVC.verifiableCredential;
    expect(issuer.id).toBe(person.did);
    expect(credentialSubject.id).toBe(person.did);
    expect(credentialSubject.familyName).toBe("yamada");
    expect(credentialSubject.givenName).toBe("taro");
  });
  test("job", async () => {
    const expectedWorksFor = "test-jobTitle";
    const expectedMemberOf = "test-organization";
    const ec = new EC("secp256k1");
    const keyPair = ec.keyFromPrivate(b64url.toBuffer(company.privateJwk.d));
    const data = converter.toJobCredentialPayload(
      company.did,
      expectedWorksFor,
      expectedMemberOf
    );
    const vcJwt = await credentials.createVC(
      company.did,
      person.did,
      "EmployeeCredential",
      data,
      keyPair
    );
    const verifiedVC = await credentials.verifyVC(vcJwt);
    const { issuer, credentialSubject } = verifiedVC.verifiableCredential;
    expect(issuer.id).toBe(company.did);
    expect(credentialSubject.id).toBe(person.did);
    expect(credentialSubject.worksFor).toBe(company.did);
    expect(credentialSubject.jobTitle).toBe(expectedWorksFor);
    expect(credentialSubject.memberOf.name).toBe(expectedMemberOf);
  });
});

// eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIiwiQXBwbGljYXRpb25JbmZvcm1hdGlvbiJdLCJjcmVkZW50aWFsU3ViamVjdCI6eyJlbWFpbCI6Indha2FiYUBkYXRhc2lnbi5qcCIsImFwcGxpZWQiOiIyMDIyLTAxLTI0VDA3OjM5OjAxLjAyNVoifX0sInN1YiI6ImRpZDppb246RWlERnlRV1A0anAwd3BYRTkwUjV0Z0ZnXzdRUk9XeWpaWXl5ckJJSTdQV1c3UTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUpyWlhrdE1TSXNJbkIxWW14cFkwdGxlVXAzYXlJNmV5SmpjbllpT2lKelpXTndNalUyYXpFaUxDSnJkSGtpT2lKRlF5SXNJbmdpT2lKNGVYbEhVVVJNTW5Oa1RrdHdTMHh1ZEhWWlRtbGxiMmREUnpkQ1FYWm9kMmh6UkdSbVMzbE1WWHBqSWl3aWVTSTZJbmgxV0hSS2FHTlJRbU42YVVad1YyWkNUVzF5UlVKWWVGVjNNWHBPWlUxYVZFaEVZbTFtUjJ0NVdXc2lmU3dpY0hWeWNHOXpaWE1pT2xzaVlYVjBhR1Z1ZEdsallYUnBiMjRpTENKclpYbEJaM0psWlcxbGJuUWlYU3dpZEhsd1pTSTZJa1ZqWkhOaFUyVmpjREkxTm1zeFZtVnlhV1pwWTJGMGFXOXVTMlY1TWpBeE9TSjlYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRbU5MVFhkRFVrUkRYMVZsUkRsek9FRmhZMTlITWtaelFUQnRVRFZJUjJaQk5XbzNWblJOYUhaMGNsRWlmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVKbmVVUXlNMnRtZWpCRU9FSTJVRWxCUjFRNFVYVXhNMVJaVVdoUGFHMVVPRU41TjI5Wk5WVnVOVkpCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xCZG1obFVUWm1WME5MUzB3ME9XTTJPSGhLYUVJeE0wOXBXVWRNYTBVMVkzb3Riak5YY3poWFJFSkZkeUo5ZlEiLCJuYmYiOjE2NDMwMDk5NDEsImlzcyI6ImRpZDppb246RWlERnlRV1A0anAwd3BYRTkwUjV0Z0ZnXzdRUk9XeWpaWXl5ckJJSTdQV1c3UTpleUprWld4MFlTSTZleUp3WVhSamFHVnpJanBiZXlKaFkzUnBiMjRpT2lKeVpYQnNZV05sSWl3aVpHOWpkVzFsYm5RaU9uc2ljSFZpYkdsalMyVjVjeUk2VzNzaWFXUWlPaUpyWlhrdE1TSXNJbkIxWW14cFkwdGxlVXAzYXlJNmV5SmpjbllpT2lKelpXTndNalUyYXpFaUxDSnJkSGtpT2lKRlF5SXNJbmdpT2lKNGVYbEhVVVJNTW5Oa1RrdHdTMHh1ZEhWWlRtbGxiMmREUnpkQ1FYWm9kMmh6UkdSbVMzbE1WWHBqSWl3aWVTSTZJbmgxV0hSS2FHTlJRbU42YVVad1YyWkNUVzF5UlVKWWVGVjNNWHBPWlUxYVZFaEVZbTFtUjJ0NVdXc2lmU3dpY0hWeWNHOXpaWE1pT2xzaVlYVjBhR1Z1ZEdsallYUnBiMjRpTENKclpYbEJaM0psWlcxbGJuUWlYU3dpZEhsd1pTSTZJa1ZqWkhOaFUyVmpjREkxTm1zeFZtVnlhV1pwWTJGMGFXOXVTMlY1TWpBeE9TSjlYWDE5WFN3aWRYQmtZWFJsUTI5dGJXbDBiV1Z1ZENJNklrVnBRbU5MVFhkRFVrUkRYMVZsUkRsek9FRmhZMTlITWtaelFUQnRVRFZJUjJaQk5XbzNWblJOYUhaMGNsRWlmU3dpYzNWbVptbDRSR0YwWVNJNmV5SmtaV3gwWVVoaGMyZ2lPaUpGYVVKbmVVUXlNMnRtZWpCRU9FSTJVRWxCUjFRNFVYVXhNMVJaVVdoUGFHMVVPRU41TjI5Wk5WVnVOVkpCSWl3aWNtVmpiM1psY25sRGIyMXRhWFJ0Wlc1MElqb2lSV2xCZG1obFVUWm1WME5MUzB3ME9XTTJPSGhLYUVJeE0wOXBXVWRNYTBVMVkzb3Riak5YY3poWFJFSkZkeUo5ZlEifQ.opJvix6jkKVfxRi3sYUlLK3nN1czfj_zkGptFiFOuEcOPCR321rpcmX72aJxqb4fyPZtRxqak9qoTxUVY--18A
