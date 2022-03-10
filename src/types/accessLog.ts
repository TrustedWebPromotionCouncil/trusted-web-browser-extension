export interface AccessLog {
  operator: string;
  targetKey: string;
  cvType:
    | "jopApplicationCredential"
    | "citizenshipCredential"
    | "jobCredential"
    | "referenceCredential";
  createdAt: Date;
}
