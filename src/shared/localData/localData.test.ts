import {
  LOCAL_STORAGE_KEY_NAME,
  LOCAL_STORAGE_KEY_COMPANY,
} from "../..//constants";
import { Company, Name, Stored } from "@/types";

import * as localData from "./localData";

const browser = require("webextension-polyfill");

describe("name", () => {
  test("store", async () => {
    browser.storage.local.set.mockResolvedValueOnce(undefined);
    await localData.store<Name>(LOCAL_STORAGE_KEY_NAME, {
      lastname: "yamada",
      firstname: "taro",
    });
    expect(browser.storage.local.set.mock.calls.length).toBe(1);
    const args = browser.storage.local.set.mock.calls[0][0];
    expect(args.name.lastname).toBe("yamada");
    expect(args.name.firstname).toBe("taro");
  });
  test("stored", async () => {
    browser.storage.local.get.mockResolvedValueOnce({
      name: { lastname: "yamada", firstname: "taro" },
    });
    const result = await localData.get<Name>(LOCAL_STORAGE_KEY_NAME);
    const { type, value } = result as Stored<Name>;
    expect(type).toBe("stored");
    expect(value.lastname).toBe("yamada");
    expect(value.firstname).toBe("taro");
  });
  test("not stored", async () => {
    browser.storage.local.get.mockResolvedValueOnce(undefined);
    const result = await localData.get<Name>(LOCAL_STORAGE_KEY_NAME);
    const { type, value } = result as Stored<Name>;
    expect(type).toBe("not_stored");
    expect(value).toBeFalsy();
  });
});

describe("company", () => {
  test("store", async () => {
    browser.storage.local.set.mockResolvedValueOnce(undefined);
    await localData.store<Company>(LOCAL_STORAGE_KEY_COMPANY, {
      companyId: "did:ion:xxx",
      organization: "第一営業部",
      jobTitle: "一般",
    });
    expect(browser.storage.local.set.mock.calls.length).toBe(1);
    const args = browser.storage.local.set.mock.calls[0][0];
    expect(args.company.companyId).toBe("did:ion:xxx");
    expect(args.company.organization).toBe("第一営業部");
    expect(args.company.jobTitle).toBe("一般");
  });
  test("stored", async () => {
    browser.storage.local.get.mockResolvedValueOnce({
      company: {
        companyId: "did:ion:xxx",
        organization: "第一営業部",
        jobTitle: "一般",
      },
    });
    const result = await localData.get<Company>(LOCAL_STORAGE_KEY_COMPANY);
    const { type, value } = result as Stored<Company>;
    expect(type).toBe("stored");
    expect(value.companyId).toBe("did:ion:xxx");
    expect(value.organization).toBe("第一営業部");
    expect(value.jobTitle).toBe("一般");
  });
  test("not stored", async () => {
    browser.storage.local.get.mockResolvedValueOnce(undefined);
    const result = await localData.get<Company>(LOCAL_STORAGE_KEY_COMPANY);
    const { type, value } = result as Stored<Company>;
    expect(type).toBe("not_stored");
    expect(value).toBeFalsy();
  });
});
