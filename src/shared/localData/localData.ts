import { Stored, NotStored } from "@/types";

const browser = require("webextension-polyfill");

type GetResult<T> = Stored<T> | NotStored;

export const store = async <T>(key: string, value: T) => {
  await browser.storage.local.set({ [key]: value });
};

export const get = async <T>(key: string): Promise<GetResult<T>> => {
  const value = await browser.storage.local.get(key);
  if (value && key in value) {
    return { type: "stored", value: value[key] };
  } else {
    return { type: "not_stored" };
  }
};

export const clear = async () => {
  await browser.storage.local.clear();
};

const Modules = {
  store,
  get,
  clear,
};

export default Modules;
