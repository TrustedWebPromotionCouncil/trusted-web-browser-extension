import React, {
  FunctionComponent,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import {
  Button,
  Header,
  FormSection,
  Title,
  Spacer,
  TextArea,
  SelectBox,
} from "@/shared/components";
import { Store } from "@/store/storeContext";
import { Reference } from "@/types";

import "./inputCredential.scss";

export interface InputCredentialViewProps {
  reference?: Reference;
  input1Candidates: { text: string; value: string }[];
  onSubmit: (value: Reference) => void;
  onBack: () => void;
}

const FormSchema = yup.object().shape({
  input1: yup.object({ value: yup.string().required() }),
  input2: yup.string().required(),
  input3: yup.string().required(),
});

export const InputCredentialView: FunctionComponent<
  InputCredentialViewProps
> = (props) => {
  const { reference, input1Candidates, onSubmit, onBack } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: {
      input1: { value: "" },
      input2: "",
      input3: "",
    },
    validationSchema: FormSchema,
    onSubmit: ({ input1, input2, input3 }) =>
      onSubmit({ input1: input1.value, input2, input3 }),
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
  useEffect(() => {
    if (reference) {
      formik.setValues({ ...reference, input1: { value: reference.input1 } });
    }
  }, [reference]);
  return (
    <>
      <Header onBack={onBack} />
      <div className="container">
        <Title headline="クレデンシャル入力" />
        <Spacer space={16} />
        <form className="form" onSubmit={handleSubmit}>
          <FormSection>
            <SelectBox
              items={input1Candidates}
              name="input1.value"
              onChange={formik.handleChange("input1.value")}
              value={formik.values.input1.value}
              error={formik.errors.input1}
              label={"あなたは求職者から見てどのような立場でしたか？"}
            />
          </FormSection>
          <FormSection>
            <TextArea
              name="input2"
              value={formik.values.input2}
              onChange={formik.handleChange("input2")}
              error={formik.errors.input2}
              label={"周囲とのコミュニケーションは良好ですか？"}
            />
          </FormSection>
          <FormSection>
            <TextArea
              name="input3"
              value={formik.values.input3}
              onChange={formik.handleChange("input3")}
              error={formik.errors.input3}
              label={"主な実績にはどのようなものがありますか？"}
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
