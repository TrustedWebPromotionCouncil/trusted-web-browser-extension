// @ts-ignore
import ION from "@decentralized-identity/ion-tools";
import {
  DIDResolver,
  DIDResolutionResult,
  ParsedDID,
  Resolver,
} from "did-resolver";

export function getResolver(): Record<string, DIDResolver> {
  async function resolve(
    did: string,
    parsed: ParsedDID
  ): Promise<DIDResolutionResult> {
    const response = await resolveIon(did);
    return response;
  }
  return { ion: resolve };
}

export const resolveIon = async (did: string): Promise<DIDResolutionResult> => {
  const response = await ION.resolve(did);
  console.debug({ response });
  return response;
};

export const ionResolver = new Resolver(getResolver());
