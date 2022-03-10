import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import { Button, Header, InputText, Spacer, Title } from "@/shared/components";
import { ErrorMessage } from "@/types";
import { Store } from "@/store/storeContext";

const FormSchema = yup.object().shape({
  password: yup.string().required(),
});

export interface WelcomeViewProps {
  error?: ErrorMessage;
  onSubmit: (password: string, mnemonic: string, did: string) => void;
}

export const RecoverWalletView: FunctionComponent<WelcomeViewProps> = (
  props
) => {
  const { onSubmit } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: { password: "", mnemonic: "", did: "" },
    validationSchema: FormSchema,
    onSubmit: ({ password, mnemonic, did }) =>
      onSubmit(password, mnemonic, did),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, THROTTLING_WAIT_TIME, { trailing: false }),
    []
  );
  return (
    <>
      <Header />
      <div className="container">
        <Title
          headline="ウォレットの復元"
          // subtitle=""
        />
        <Spacer space={32} />
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-section">
            <InputText
              id="mnemonic-phrase"
              type="text"
              placeholder="復元用フレーズ"
              value={formik.values.mnemonic}
              onChange={formik.handleChange("mnemonic")}
              error={formik.errors.mnemonic}
              data-testid="mnemonic"
            />
            <InputText
              id="did"
              type="text"
              placeholder="DID"
              required={true}
              value={formik.values.did}
              onChange={formik.handleChange("did")}
              error={formik.errors.did}
              data-testid="did"
            />
            <InputText
              id="password"
              type="password"
              placeholder="パスワード"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              error={formik.errors.password}
              data-testid="password"
            />
          </div>
          <div className="buttons">
            <Button
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
              loading={state.processing}
              data-testid="next"
            >
              次へ
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
