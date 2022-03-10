export * from "./accessLog";

export type KeyTypes = "secp256k1" | "Ed25519";

export interface PublicJwk {
  crv: KeyTypes;
  kty: "EC";
  x: string;
  y?: string;
}

export interface PrivateJwk extends PublicJwk {
  d: string;
}

export interface KeyPair {
  publicJwk: PublicJwk;
  privateJwk: PrivateJwk;
}

export interface DidStatus {
  shortForm: string;
  longForm: string;
}

export interface KeyringStore {
  isUnlocked: boolean;
}

export interface ErrorMessage {
  title: string;
  subTitle?: string;
}

export interface Stored<T> {
  type: "stored";
  value: T;
}

export interface NotStored {
  type: "not_stored";
}

export interface Name {
  lastname: string;
  firstname: string;
}

export interface Company {
  companyId: string;
  organization: string;
  jobTitle: string;
}

export interface Reference {
  input1: string;
  input2: string;
  input3: string;
}

export interface Account {
  did: string;
  encryptedVault?: string;
  initialState?: DidStatus;
  name?: Name;
  company?: Company;
  reference?: Reference;
}
export interface IntegralAccount extends Account {
  encryptedVault: string;
  initialState: DidStatus;
  name: Name;
  company: Company;
}
export type Accounts = { [key: string]: Account };
export type IntegralAccounts = { [key: string]: IntegralAccount };

export interface CompanyDid {
  didStatus: DidStatus;
  keys: PrivateJwk;
}

export interface CreateDidResult {
  initialState: DidStatus;
  keys: PrivateJwk;
}

export interface VcKey {
  name: string;
  value: string;
}

export interface ProcessResultFailure {
  type: "failure";
  message: string;
}
