import { MemoryRouter } from "react-router-dom";

import "../src/cusom.scss";
import "../src/index.scss";

import { StoreProvider } from "../src/store/StoreProvider";
import { initialState } from "../src/store/store";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

const currentAccount = {
  did: "did:ion:EiDS1uonEtvzBgHM7XNsTQYtgrQaB3BajhxCv5_nY1HVqA",
  initialState: {
    shortForm: "",
    longForm: "",
  },
  name: {
    lastname: "テスト",
    firstname: "太郎",
  },
  company: {
    companyId: "",
    organization: "",
    jobTitle: "",
  },
  encryptedVault: "",
};
export const decorators = [
  (Story) => (
    <MemoryRouter>
      <StoreProvider preloadedState={{ currentAccount, ...initialState }}>
        <Story />
      </StoreProvider>
    </MemoryRouter>
  ),
];
