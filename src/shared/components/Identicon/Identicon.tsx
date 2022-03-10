import React, { FunctionComponent, useEffect, useState } from "react";
import Jazzicon from "react-jazzicon";

interface Props {
  did: string;
  diameter: number;
}

export const Identicon: FunctionComponent<Props> = ({ did, diameter }) => {
  const [seed, setSeed] = useState<number>();

  useEffect(() => {
    (async () => {
      const seedArray = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(did.substring("did:ion:".length))
      );
      const seedNumber = new DataView(seedArray).getInt32(0);
      setSeed(seedNumber);
    })();
  }, [did]);

  return <Jazzicon diameter={diameter} seed={seed} />;
};
