import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import { Company, ErrorMessage } from "@/types";
import {
  Button,
  Header,
  FormSection,
  InputText,
  Title,
  SelectBox,
  Spacer,
} from "@/shared/components";
import { Store } from "@/store/storeContext";
import companyHelper, {
  addNotationToCompanyName,
} from "@/shared/company/companyHelper";

const FormSchema = yup.object().shape({
  companyId: yup.object({ value: yup.string().required() }),
  organization: yup.string().required(),
  jobTitle: yup.string().required(),
});

export interface InputCareerViewProps {
  error?: ErrorMessage;
  onSubmit: (company: Company) => void;
}

export const InputCareerView: FunctionComponent<InputCareerViewProps> = (
  props
) => {
  const { onSubmit } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: {
      companyId: { value: "" },
      organization: "",
      jobTitle: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ companyId, organization, jobTitle }) =>
      onSubmit({ companyId: companyId.value, organization, jobTitle }),
  });
  const handleSubmit = useCallback(
    _.throttle(formik.handleSubmit, THROTTLING_WAIT_TIME, { trailing: false }),
    []
  );
  const companies = [{ text: "", value: "" }];
  const arr = state.companies.map((c) => {
    const value = c.initialState.shortForm;
    const metaInfo = companyHelper.getCompany(value);
    const text = addNotationToCompanyName(metaInfo);
    return { text, value };
  });
  companies.push(...arr);
  return (
    <>
      <Header />
      <div className="container">
        <Title headline="所属VC作成" subtitle="在籍証明を作成してください" />
        <form className="form" onSubmit={handleSubmit}>
          <FormSection>
            <SelectBox
              items={companies}
              label="会社名"
              name="companyId.value"
              onChange={formik.handleChange("companyId.value")}
              value={formik.values.companyId.value}
              error={formik.errors.companyId}
            />
          </FormSection>
          <Spacer space={24} />
          <FormSection>
            <InputText
              id="lastname"
              type="input"
              label="組織・事業部"
              value={formik.values.organization}
              onChange={formik.handleChange("organization")}
              error={formik.errors.organization}
              data-testid="password"
            />
          </FormSection>
          <FormSection>
            <InputText
              id="firstname"
              type="input"
              label="役職など"
              value={formik.values.jobTitle}
              onChange={formik.handleChange("jobTitle")}
              error={formik.errors.jobTitle}
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
