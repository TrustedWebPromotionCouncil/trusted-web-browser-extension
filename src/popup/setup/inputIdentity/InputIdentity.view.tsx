import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import {
  Button,
  Header,
  FormSection,
  InputText,
  Title,
} from "@/shared/components";
import { ErrorMessage, Name } from "@/types";
import { Store } from "@/store/storeContext";

const FormSchema = yup.object().shape({
  lastname: yup.string().required(),
  firstname: yup.string().required(),
});

export interface InputIdentityViewProps {
  error?: ErrorMessage;
  onSubmit: (name: Name) => void;
}

export const InputIdentityView: FunctionComponent<InputIdentityViewProps> = (
  props
) => {
  const { onSubmit } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: { lastname: "", firstname: "" },
    validationSchema: FormSchema,
    onSubmit: ({ lastname, firstname }) => onSubmit({ lastname, firstname }),
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
          headline="本人確認VC作成"
          subtitle="本人確認証明を作成してください"
        />
        <form className="form" onSubmit={handleSubmit}>
          <FormSection>
            <InputText
              id="lastname"
              type="input"
              label="氏"
              value={formik.values.lastname}
              onChange={formik.handleChange("lastname")}
              error={formik.errors.lastname}
              data-testid="password"
            />
          </FormSection>
          <FormSection>
            <InputText
              id="firstname"
              type="input"
              label="名"
              value={formik.values.firstname}
              onChange={formik.handleChange("firstname")}
              error={formik.errors.firstname}
              data-testid="password"
            />
          </FormSection>
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
