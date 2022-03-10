import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState,
} from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import _ from "lodash";

import { THROTTLING_WAIT_TIME } from "@/constants";
import {
  Button,
  FormSection,
  Header,
  InputText,
  SelectBox,
  Spacer,
  Title,
} from "@/shared/components";

import "./provideCredential.scss";
import { ErrorMessage } from "@/types";
import { Store } from "@/store/storeContext";
import {
  addNotationToCompanyName,
  CompanyMetaInfo,
} from "@/shared/company/companyHelper";

export type DataTypes = "jobCredential" | "referenceCredential";
export interface CheckItem {
  value: DataTypes;
  label: string;
}
interface ProvideCredentialViewProps {
  checkItems: CheckItem[];
  companyArray: CompanyMetaInfo[];
  onSubmit: (args: { dataTypes: DataTypes[]; destDid: string }) => void;
  onCancel: () => void;
  error?: ErrorMessage;
}

const FormSchema = yup.object().shape({
  dataTypes: yup.array().min(1),
  destDid: yup.string().required(),
});

export const ProvideCredentialView: FunctionComponent<
  ProvideCredentialViewProps
> = (props) => {
  const { checkItems, companyArray, onSubmit, onCancel, error } = props;
  const { state } = useContext(Store);
  const [didUserTouchDIDForm, setDidUserTouchDIDForm] =
    useState<boolean>(false);
  const [useRegisteredID, setUseRegisteredID] = useState<boolean>(false);
  const formik = useFormik<{ dataTypes: DataTypes[]; destDid: string }>({
    initialValues: { dataTypes: [], destDid: "" },
    validationSchema: FormSchema,
    onSubmit: ({ dataTypes, destDid }) => onSubmit({ dataTypes, destDid }),
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
  return (
    <>
      <Header />
      <div className="container">
        <Title headline="クレデンシャル提供" />
        {(error && (
          <div>
            <div className="page-error-text">{error?.title}</div>
            <div className="page-error-text">{error?.subTitle}</div>
          </div>
        )) || <Spacer space={38} />}
        <Spacer space={32} />
        <form className="form" onSubmit={handleSubmit}>
          <FormSection>
            {checkItems.map((item) => {
              return (
                <div
                  key={`div-${item.value}`}
                  className="form-check border-bottom checkbox-container"
                >
                  <input
                    id={`checkbox-${item.value}`}
                    className="form-check-input"
                    type="checkbox"
                    name="dataTypes"
                    checked={formik.values.dataTypes.includes(item.value)}
                    onChange={() => {
                      const values = formik.values.dataTypes;
                      if (values.includes(item.value)) {
                        const update = values.filter((v) => v !== item.value);
                        formik.setFieldValue("dataTypes", update);
                      } else {
                        const update = [...values, item.value];
                        formik.setFieldValue("dataTypes", update);
                      }
                    }}
                  />
                  <label
                    htmlFor={`checkbox-${item.value}`}
                    className="form-check-label checkbox-label"
                  >
                    {item.label}
                  </label>
                </div>
              );
            })}
          </FormSection>
          <Spacer space={24} />
          <div>
            <SelectBox
              required
              placeholder="..."
              label="DIDの指定方法"
              defaultValue={"undefined"}
              items={[
                { value: "undefined", text: "選択してください" },
                { value: "true", text: "登録してあるDIDから選ぶ" },
                { value: "false", text: "新しいDIDに提供する" },
              ]}
              onChange={(event) => {
                const value = event.target.value;
                setDidUserTouchDIDForm(value !== "undefined");
                setUseRegisteredID(event.target.value.toString() === "true");
              }}
            />
          </div>

          <FormSection>
            {didUserTouchDIDForm &&
              (useRegisteredID ? (
                <div>
                  <SelectBox
                    id="did"
                    label="提供先DID"
                    items={companyArray.map((c) => {
                      return {
                        value: c.did,
                        text: addNotationToCompanyName(c),
                      };
                    })}
                    value={formik.values.destDid}
                    onChange={formik.handleChange("destDid")}
                    error={formik.errors.destDid}
                    data-testid="destDid"
                  />
                  <pre>
                    <code>{formik.values.destDid}</code>
                  </pre>
                </div>
              ) : (
                <InputText
                  id="did"
                  label="提供先DID"
                  placeholder="did:ion: から始まるDIDを入力してください"
                  value={formik.values.destDid}
                  onChange={formik.handleChange("destDid")}
                  error={formik.errors.destDid}
                  data-testid="destDid"
                />
              ))}
          </FormSection>
          <FormSection>
            <div className="buttons">
              <Button
                type="button"
                buttonType={"outlined"}
                data-testid="cancel"
                onClick={onCancel}
              >
                キャンセル
              </Button>
              <Button
                type="submit"
                loading={state.processing}
                disabled={!formik.dirty || !formik.isValid}
                data-testid="provide"
              >
                提供する
              </Button>
            </div>
          </FormSection>
        </form>
      </div>
    </>
  );
};
