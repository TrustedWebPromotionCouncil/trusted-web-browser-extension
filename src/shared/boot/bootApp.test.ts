import fetchMock from "fetch-mock";

import { boot } from "./bootApp";

const browser = require("webextension-polyfill");

describe("State Patterns", () => {
  beforeAll(() => {
    fetchMock.get("extension://company.json", {
      status: 200,
      body: {
        didStatus: {},
        keys: {},
      },
    });
  });
  beforeEach(() => {
    browser.runtime.getURL.mockResolvedValue("extension://company.json");
  });
  test("not authed", async () => {
    browser.storage.local.get.mockResolvedValueOnce(undefined);
    const result = await boot();
    expect(result.state).toBe("not_authed");
  });
  test("authed", async () => {
    browser.storage.local.get.mockResolvedValueOnce({
      didStatus: { "did:ion:dummy": { did: "did:ion:dummy" } },
    });
    browser.storage.local.get.mockResolvedValueOnce({
      current_account: "did:ion:dummy",
    });
    const result = await boot();
    expect(result.state).toBe("authed");
  });
});
