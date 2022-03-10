import { CreateDidResult } from "@/types";

const COMPANY_COUNT = 4;

export interface CompanyMetaInfo {
  did: string;
  name: string;
  forStaff: boolean;
}
let companies: CompanyMetaInfo[] = [];

fetch("company-meta-info.json")
  .then((value) => {
    return value.json().then((metaInfo) => {
      companies = metaInfo;
    });
  })
  .catch((err) => {
    console.error(err);
  });

export const getCompany = (did: string): CompanyMetaInfo => {
  const metaInfo = companies.find((c) => c.did === did);
  if (!metaInfo) {
    throw new Error("company meta info is not found");
  }
  return metaInfo;
};

const getCompanies = async () => {
  const arr: CreateDidResult[] = [];
  for (let i = 0; i < COMPANY_COUNT; i++) {
    const response = await fetch(`/company${i + 1}.json`);
    const createResult = await response.json();
    arr.push(createResult);
  }
  return arr;
};

export const addNotationToCompanyName = (metaInfo: CompanyMetaInfo) => {
  const nameWithNotation = metaInfo.forStaff
    ? `${metaInfo.name} (応募先担当者用)`
    : metaInfo.name;
  return nameWithNotation;
};

const Modules = {
  getCompany,
  getCompanies,
};

export default Modules;
