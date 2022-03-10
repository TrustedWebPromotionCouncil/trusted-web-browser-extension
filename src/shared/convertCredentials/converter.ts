import companyHelper from "../company/companyHelper";

type CredentialSubject = { [x: string]: any };

export interface Data {
  type: "leaf";
  name: string;
  value: string | number;
}

export interface DataSet {
  type: "set";
  name: string;
  values: (Data | DataSet)[];
}

export const toJobApplicationPayload = (email: string) => {
  return {
    email,
    applicationDate: new Date().toISOString(),
  };
};

export const toJobApplicationDataSet = (
  credentialSubject: CredentialSubject
): DataSet => {
  return {
    type: "set",
    name: "応募情報",
    values: [
      {
        type: "leaf",
        name: "メールアドレス",
        value: credentialSubject.email,
      },
      {
        type: "leaf",
        name: "応募日時",
        value: new Date(credentialSubject.applicationDate).toLocaleString(),
      },
    ],
  };
};

export const toCitizenshipCredentialPayload = (
  familyName: string,
  givenName: string
) => {
  return {
    address: "",
    birthDate: "",
    familyName,
    givenName,
    gender: "",
  };
};

export const toCitizenshipCredentialDataSet = (
  credentialSubject: CredentialSubject
): DataSet => {
  return {
    type: "set",
    name: "本人確認情報",
    values: [
      {
        type: "leaf",
        name: "氏",
        value: credentialSubject.familyName,
      },
      {
        type: "leaf",
        name: "名",
        value: credentialSubject.givenName,
      },
    ],
  };
};

export const toJobCredentialPayload = (
  companyDid: string,
  jobTitle: string,
  organization: string
) => {
  const organizationSubject = {
    id: "https://example.com/dummy-id",
    type: ["Organization"],
    name: organization,
    parentOrganization: companyDid,
  };
  const subject = {
    worksFor: companyDid,
    // // 便宜上昇進などはしていないものとし、VC内に1つの部署・役職しか記載しないこととする。
    memberOf: organizationSubject,
    jobTitle: jobTitle,
  };
  return subject;
};

export const toJobCredentialDataSet = (
  credentialSubject: CredentialSubject
): DataSet => {
  return {
    type: "set",
    name: "所属企業の在籍証明",
    values: [
      {
        type: "leaf",
        name: "会社名",
        value: companyHelper.getCompany(credentialSubject.worksFor).name,
      },
      {
        type: "leaf",
        name: "部署",
        value: credentialSubject.memberOf.name,
      },
      {
        type: "leaf",
        name: "役職",
        value: credentialSubject.jobTitle,
      },
    ],
  };
};

export const toReferenceCredentialPayload = (
  relationship: string,
  communicationAbility: string,
  achievement: string,
  authorDid: string
) => {
  return {
    relationship,
    communicationAbility,
    achievement,
    author: authorDid,
    answerDate: new Date().toISOString(),
  };
};

export const toReferenceCredentialDataSet = (
  credentialSubject: CredentialSubject
): DataSet => {
  return {
    type: "set",
    name: "回答情報",
    values: [
      {
        type: "leaf",
        name: "求職者との関係",
        value: getRelationText(credentialSubject.relationship),
      },
      {
        type: "leaf",
        name: "コミュニケーション能力",
        value: credentialSubject.communicationAbility,
      },
      {
        type: "leaf",
        name: "主な実績",
        value: credentialSubject.achievement,
      },
      {
        type: "leaf",
        name: "回答者",
        value: credentialSubject.author,
      },
      {
        type: "leaf",
        name: "回答日時",
        value: new Date(credentialSubject.answerDate).toLocaleString(),
      },
    ],
  };
};

interface Input1 {
  value: "boss" | "staff" | "co_worker" | "client";
  text: string;
}

export const ReferenceInput1: Input1[] = [
  {
    value: "boss",
    text: "上司",
  },
  {
    value: "staff",
    text: "部下",
  },
  {
    value: "co_worker",
    text: "同僚",
  },
  {
    value: "client",
    text: "取引先",
  },
];

const getRelationText = (value: string) => {
  const text = ReferenceInput1.find((ri) => ri.value === value);
  if (!text) {
    throw new Error(`invalid relation value ${value}`);
  }
  return text.text;
};

const Modules = {
  toJobApplicationDataSet,
  toJobApplicationPayload,
  toCitizenshipCredentialDataSet,
  toCitizenshipCredentialPayload,
  toJobCredentialDataSet,
  toJobCredentialPayload,
  toReferenceCredentialDataSet,
  toReferenceCredentialPayload,
};
export default Modules;
