import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import {
  Button,
  FormSection,
  Header,
  Title,
  SelectBox,
  Spacer,
} from "@/shared/components";

import "./selectSchema.scss";
import { Store } from "@/store/storeContext";
import { THROTTLING_WAIT_TIME } from "@/constants";

export interface SelectSchemaViewProps {
  onSubmit: (value: { schema: string }) => void;
  onBack: () => void;
}

const FormSchema = yup.object().shape({
  schema: yup.object({ value: yup.string().required() }),
});

export const SelectSchemaView: FunctionComponent<SelectSchemaViewProps> = (
  props
) => {
  const { onSubmit, onBack } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: {
      schema: { value: "" },
    },
    validationSchema: FormSchema,
    onSubmit: ({ schema }) => onSubmit({ schema: schema.value }),
  });
  const throttled = useCallback(
    _.throttle(formik.handleSubmit, THROTTLING_WAIT_TIME, {
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
  const schemas = [
    { text: "", value: "" },
    { text: "レファレンス回答", value: "reference" },
  ];
  return (
    <>
      <Header onBack={onBack} />
      <div className="container">
        <Title headline="クレデンシャル選択" />
        <Spacer space={32} />
        <form className="form" onSubmit={handleSubmit}>
          <FormSection>
            <SelectBox
              items={schemas}
              label="スキーマ"
              name="schema.value"
              onChange={formik.handleChange("schema.value")}
              value={formik.values.schema.value}
              error={formik.errors.schema}
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
