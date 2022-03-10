import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import {
  Button,
  FormSection,
  Header,
  InputText,
  Spacer,
  Title,
} from "@/shared/components";
import { THROTTLING_WAIT_TIME_SHORT } from "@/constants";
import { Store } from "@/store/storeContext";
import { ErrorMessage } from "@/types";

interface LockViewProps {
  error?: ErrorMessage;
  onSubmit: (password: string) => void;
  onBack: () => void;
  onPopup: boolean;
}

const FormSchema = yup.object().shape({
  password: yup.string().required(),
});

export const LockView: FunctionComponent<LockViewProps> = ({
  error,
  onSubmit,
  onBack,
  onPopup = true,
}) => {
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: { password: "" },
    validationSchema: FormSchema,
    onSubmit: ({ password }) => onSubmit(password),
  });
  const throttled = useCallback(
    _.throttle(formik.handleSubmit, THROTTLING_WAIT_TIME_SHORT, {
      trailing: false,
    }),
    [formik.handleSubmit]
  );
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      throttled();
    },
    [throttled]
  );
  return (
    <>
      <Header onBack={onBack} />
      <div className="container tab-container">
        <Title headline="認証" subtitle="ロックを解除して認証してください" />
        <Spacer space={16} />
        <form className="form" onSubmit={handleSubmit}>
          {(error && (
            <FormSection>
              <div className="page-error-text">{error?.title}</div>
              <div className="page-error-text">{error?.subTitle}</div>
            </FormSection>
          )) || <Spacer space={38} />}
          <FormSection>
            <InputText
              id="password"
              type="password"
              label="パスワード"
              value={formik.values.password}
              onChange={formik.handleChange("password")}
              error={formik.errors.password}
              data-testid="password"
            />
          </FormSection>
          <FormSection>
            <div className={onPopup ? "buttons" : "button-on-anywhere"}>
              <Button
                type="submit"
                disabled={!formik.dirty || !formik.isValid}
                loading={state.processing}
                data-testid="next"
              >
                ロック解除
              </Button>
            </div>
          </FormSection>
        </form>
      </div>
    </>
  );
};
