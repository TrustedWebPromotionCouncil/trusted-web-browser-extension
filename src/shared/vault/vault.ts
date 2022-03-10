import KeyringController from "eth-keyring-controller";
import HDKeyring from "eth-hd-keyring";
import "./types.d.ts";
import { ec as EC } from "elliptic";
import { KeyringStore } from "@/types";

// const browser = require("webextension-polyfill");

const ec = new EC("secp256k1");
interface SerializedVault {
  vault: string;
}

// const persist = async (serializedVault: SerializedVault) => {
//   // @ts-expect-error
//   chrome.storage.local.set(serializedVault, function () {});
// };

export class Vault {
  /*
  Wrapper class for KeyringController.
  
  Improvement:
  
  - Return secp256k1 key instead of ethereum address.
  - Manage browser storage and encryption in this class. Users of this class don't have to take care of it.
  - Exposing a subset of APIs/features we need.
  - Use just one keyring. KeyringController supports multiple keyrings but we don't need them.
  - keyring type is HDKeyring.
  */

  private keyringController: any;
  private onFullUpdate?: (addresses: EC.KeyPair[], state: KeyringStore) => void;
  private onNewAccount?: (address: EC.KeyPair) => void;
  private onRemovedAccount?: (address: EC.KeyPair) => void;
  private vaultState: KeyringStore;
  private _encryptedVault = "";

  constructor(
    onFullUpdate?: (addresses: EC.KeyPair[], state: KeyringStore) => void
  ) {
    this.onFullUpdate = onFullUpdate;
    this.keyringController = undefined;
    this.vaultState = { isUnlocked: false };
  }

  async initialize(
    encryptedVault?: string,
    onFullUpdate?: (addresses: EC.KeyPair[], state: KeyringStore) => void,
    onNewAccount?: (address: EC.KeyPair) => void,
    onRemovedAccount?: (address: EC.KeyPair) => void
  ) {
    this.onFullUpdate = this.onFullUpdate ? this.onFullUpdate : onFullUpdate;
    this.onNewAccount = this.onNewAccount ? this.onNewAccount : onNewAccount;
    this.onRemovedAccount = this.onRemovedAccount
      ? this.onRemovedAccount
      : onRemovedAccount;
    // Restore vault from local storage of this WebExtention
    let params;
    if (encryptedVault) {
      this._encryptedVault = encryptedVault;
      const serializedVault: SerializedVault = {
        vault: encryptedVault,
      };
      params = {
        initState: serializedVault,
      };
    } else {
      params = {};
    }
    // Initialize KeyringController with restored encrypted vault
    this.keyringController = new KeyringController({
      keyringTypes: [HDKeyring],
      ...params,
    });
    // Add an event handler. It persists updated vault into the local storage.
    this.keyringController.store.on(
      "update",
      (serializedVault: SerializedVault) => {
        this._encryptedVault = serializedVault.vault;
      }
    );
    // Add an event handler. It updates React states.
    this.keyringController.on("update", (state: KeyringStore) =>
      this._onFullUpdate(state)
    );
    this.keyringController.on("newAccount", this._onNewAccount);
    this.keyringController.on("removedAccount", this._onRemovedAccount);
  }

  async isInitialized() {
    const accountList = await this.listAccounts();
    return accountList.length > 0;
  }

  async lockVault() {
    console.debug("lock vault");
    this.vaultState = await this.keyringController.setLocked();
    return this.vaultState;
  }

  async unlockVault(vaultPassword: string) {
    console.debug("unlock vault");
    try {
      this.vaultState = await this.keyringController.submitPassword(
        vaultPassword
      );
      if (this.vaultState.isUnlocked) {
        return true;
      } else {
        throw new Error("`isUnlocked` is not true.");
      }
    } catch (error) {
      console.debug(error);
      return false;
    }
  }

  // Destroy old vault and create new one with new `vaultPassword`.
  async createNewVault(vaultPassword: string) {
    return this.keyringController.createNewVaultAndKeychain(vaultPassword);
  }

  // Destroy old vault and restore a wallet from `recoveryPhrases` with new `vaultPassword`.
  async restore(recoveryPhrases: string[], vaultPassword: string) {
    const seed = recoveryPhrases.join(" ");
    return this.keyringController.createNewVaultAndRestore(vaultPassword, seed);
  }

  async addAccount() {
    return this.keyringController.addNewAccount(
      this.keyringController.keyrings[0]
    );
  }

  async removeAccount(address: string) {
    return this.keyringController.removeAccount(address);
  }

  async listKeyPairs() {
    const accounts: string[] = await this.listAccounts();
    return Promise.all(
      accounts.map((address: string) => this.getSecp256k1KeyPairFor(address))
    );
  }

  async listAccounts(): Promise<string[]> {
    return await this.keyringController.getAccounts();
  }

  listMnemonic() {
    // console.log("listMnemonic()");
    // console.log(this.keyringController.keyrings);
    // this.keyringController.keyrings[0].serialize().then((data: any) => console.log(JSON.stringify(data, null, 2)));
    return this.keyringController.keyrings[0].mnemonic;
  }

  async _onNewAccount(address: string) {
    if (this.onNewAccount) {
      const keyPair = await this.getSecp256k1KeyPairFor(address);
      return this.onNewAccount(keyPair);
    }
  }

  async _onRemovedAccount(address: string) {
    if (this.onRemovedAccount) {
      const keyPair = await this.getSecp256k1KeyPairFor(address);
      return this.onRemovedAccount(keyPair);
    }
  }

  async _onFullUpdate(state: KeyringStore) {
    this.vaultState = state;
    if (this.onFullUpdate) {
      const keyPairs = await this.listKeyPairs();
      return this.onFullUpdate(keyPairs, state);
    }
  }

  async getSecp256k1KeyPairFor(address: string): Promise<EC.KeyPair> {
    const keyring = await this.keyringController.getKeyringForAccount(address);
    const privateKey: Buffer = keyring.getPrivateKeyFor(address);
    const privateKeyHex = privateKey.toString("hex");
    const keyPair = ec.keyFromPrivate(privateKeyHex);
    return keyPair;
  }

  get encryptedVault() {
    return this._encryptedVault;
  }
}
