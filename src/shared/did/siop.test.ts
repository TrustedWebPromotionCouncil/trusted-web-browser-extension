/**
 * @jest-environment ./jest-custom-environment
 */
import { receiveRequest } from "./siop";

jest.mock("@decentralized-identity/ion-tools", () => {
  // https://jestjs.io/ja/docs/mock-functions#mocking-partials
  const originalModule = jest.requireActual(
    "@decentralized-identity/ion-tools"
  );
  const paritallyMocked = {
    ...originalModule,
    resolve: async () => {
      return {
        didDocument: {
          id: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
          verificationMethod: [
            {
              id: "#key-1",
              controller: "",
              type: "EcdsaSecp256k1VerificationKey2019",
              publicKeyJwk: {
                kty: "EC",
                crv: "secp256k1",
                x: "t7IIqzGGnzqhgmAOpJdkEjjV_E81hbI3DKngqrUdz3k",
                y: "J3jDgTOsUl9-Ncpk5tZ78-DGRy28dQlv0W-uoZagEI0",
              },
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
          canonicalId: "did:ion:EiBiVaUb_7fr1sYefT1-1jy3ysNQ1pU29znEjTal9TFJkA",
        },
      };
    },
  };
  return {
    __esModule: true,
    default: paritallyMocked,
  };
});

describe("receive siop request", () => {
  test("new key", async () => {
    const url =
      "?response_type=id_token&scope=openid%20did_authn&client_id=http%3A%2F%2Flocalhost%3A3000%2Fapply-done&request=eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6aW9uOkVpQmlWYVViXzdmcjFzWWVmVDEtMWp5M3lzTlExcFUyOXpuRWpUYWw5VEZKa0Eja2V5LTEifQ.eyJpc3MiOiJkaWQ6aW9uOkVpQmlWYVViXzdmcjFzWWVmVDEtMWp5M3lzTlExcFUyOXpuRWpUYWw5VEZKa0EiLCJyZXNwb25zZV90eXBlIjoiaWRfdG9rZW4iLCJzY29wZSI6Im9wZW5pZCBkaWRfYXV0aG4iLCJjbGllbnRfaWQiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvYXBwbHktZG9uZSIsInJlZ2lzdHJhdGlvbiI6eyJhdXRob3JpemF0aW9uX2VuZHBvaW50Ijoib3BlbmlkOiIsImlzc3VlciI6Imh0dHBzOi8vc2VsZi1pc3N1ZWQubWUvdjIiLCJyZXNwb25zZV90eXBlc19zdXBwb3J0ZWQiOlsiaWRfdG9rZW4iXSwic2NvcGVzX3N1cHBvcnRlZCI6WyJvcGVuaWQiXSwiY3JlZGVudGlhbF9mb3JtYXRzX3N1cHBvcnRlZCI6WyJqd3RfdmMiXSwic3ViamVjdF90eXBlc19zdXBwb3J0ZWQiOlsicGFpcndpc2UiXSwic3ViamVjdF9pZGVudGlmaWVyX3R5cGVzX3N1cHBvcnRlZCI6WyJkaWQ6d2ViOiJdLCJpZF90b2tlbl9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2SyJdLCJyZXF1ZXN0X29iamVjdF9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcHBseS1kb25lIl0sImp3a3MiOnsia2V5cyI6W3sia2lkIjoiZGlkOmlvbjpFaUJpVmFVYl83ZnIxc1llZlQxLTFqeTN5c05RMXBVMjl6bkVqVGFsOVRGSmtBI2tleS0xIiwia3R5IjoiRUMiLCJjcnYiOiJzZWNwMjU2azEiLCJ4IjoidDdJSXF6R0duenFoZ21BT3BKZGtFampWX0U4MWhiSTNES25ncXJVZHozayIsInkiOiJKM2pEZ1RPc1VsOS1OY3BrNXRaNzgtREdSeTI4ZFFsdjBXLXVvWmFnRUkwIn1dfSwiZGlkIjoiZGlkOmlvbjpFaUJpVmFVYl83ZnIxc1llZlQxLTFqeTN5c05RMXBVMjl6bkVqVGFsOVRGSmtBIn0sInJlZGlyZWN0X3VyaSI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hcHBseS1kb25lIiwia2lkIjoiZGlkOmlvbjpFaUJpVmFVYl83ZnIxc1llZlQxLTFqeTN5c05RMXBVMjl6bkVqVGFsOVRGSmtBI2tleS0xIn0.ycHE7oyjEWGHY2uhxYw4UlB52GWB1nEzbRdTwe7CGsd1m5crUjYy3HQqjSdQmmWw0GD3_zXP9Y4LwmUSMh7FFg";
    const result = await receiveRequest(url);
    expect(result.requestObject.client_id).toBe(
      "http://localhost:3000/apply-done"
    );
  });
});
