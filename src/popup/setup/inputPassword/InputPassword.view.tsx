import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import { Button, Header, InputText, Title } from "@/shared/components";
import { ErrorMessage } from "@/types";
import { Store } from "@/store/storeContext";

const FormSchema = yup.object().shape({
  password: yup.string().required(),
});

export interface InputPasswordViewProps {
  error?: ErrorMessage;
  onSubmit: (password: string) => void;
}

export const InputPasswordView: FunctionComponent<InputPasswordViewProps> = (
  props
) => {
  const { onSubmit } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: FormSchema,
    onSubmit: ({ password }) => onSubmit(password),
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
          headline="ウォレットの作成"
          subtitle="まずはパスワードを設定してください"
        />
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-section">
            <InputText
              id="password"
              type="password"
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
