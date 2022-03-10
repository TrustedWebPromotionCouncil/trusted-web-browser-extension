import React, { FunctionComponent, useCallback, useContext } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import { ErrorMessage } from "@/types";
import {
  Button,
  DataSetView,
  DataSet,
  Header,
  Spacer,
  Title,
  FormSection,
  InputText,
} from "@/shared/components";

import "./consent.scss";
import { Store } from "@/store/storeContext";

export type { DataSet };

const FormSchema = yup.object().shape({
  email: yup.string().required(),
});

interface ConsentViewProps {
  error?: ErrorMessage;
  dataDestination?: string;
  dataSet?: DataSet[];
  onSubmit: (email: string) => void;
  onCancel: () => void;
}

export const ConsentView: FunctionComponent<ConsentViewProps> = (props) => {
  const { dataDestination, dataSet, error, onSubmit, onCancel } = props;
  const { state } = useContext(Store);
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: FormSchema,
    onSubmit: ({ email }) => onSubmit(email),
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

  if (error) {
    return (
      <div className="container">
        <div>
          <div className="page-error-text">{error.title}</div>
          <div className="page-error-text">{error.subTitle}</div>
        </div>
      </div>
    );
  }
  return (
    <>
      <Header />
      <div className="container tab-container">
        <Title
          headline="提供データ"
          subtitle={`以下のデータの提供を求められています`}
        />
        <Spacer space={24} />
        <div className="destination">
          <span className="text-styles-caption">提供先情報</span>
          <span className="ps-2 text-styles-body1">{dataDestination}</span>
        </div>
        <Spacer space={12} />
        <form onSubmit={handleSubmit}>
          <FormSection>
            <DataSetView dataSet={dataSet} />
          </FormSection>
          <FormSection>
            <div className="mb-1 border-bottom text-styles-caption">連絡先</div>
            <div className="input-field">
              <div className="text-styles-caption">メールアドレス</div>
              <div className="input-field-email">
                <InputText
                  id="email"
                  type="email"
                  value={formik.values.email}
                  onChange={formik.handleChange("email")}
                  error={formik.errors.email}
                  data-testid="email"
                />
              </div>
            </div>
          </FormSection>
          <Spacer space={16} />
          <div className="button-on-anywhere">
            <Button
              type="button"
              buttonType="outlined"
              onClick={onCancel}
              data-testid="cancel"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={!formik.dirty || !formik.isValid}
              loading={state.processing}
              data-testid="consent"
            >
              同意して{dataDestination}に提供する
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};
