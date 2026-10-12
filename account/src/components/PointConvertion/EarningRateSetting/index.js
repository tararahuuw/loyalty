import React from "react";
import { TextInput, Switch, OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { PiChartLineUp, PiCoins } from "react-icons/pi";

const EarningRateSetting = ({ formik, handleBack, firstInitial, roleAccess }) => {
  const allowedRoles = ["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"];
  return (
    <div className="bg-white rounded-lg py-4 px-6 shadow-md">
      <div className="border rounded-md border-neutral40 p-4">
        <div className="flex items-center mb-4">
          <PiChartLineUp size="24" className="text-success500 mr-2" />
          <div>
            <p className="text-sm text-black font-medium">Basic Burning Rate</p>
            <p className="text-xs text-neutral300 mt-1">
              Set the base rate for point burning from customer transactions
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="font-medium text-sm">Burning Rate (IDR per 1 point)</p>
          <div className="flex gap-8 items-center mb-4">
            <p className="font-normal text-neutral300">1 point =</p>

            <div>
              <TextInput
                title=""
                leftAdornment={<p className="text-xs pl-1">Rp</p>}
                type="number"
                placeholder="Input amount here"
                value={formik.values.burningPointRate}
                onChangeInput={(e) => {
                  const value = e.target.value;

                  // Hanya izinkan angka dan maksimal 10 digit
                  if (/^\d*$/.test(value) && value.length <= 10) {
                    formik.setFieldValue("burningPointRate", value);
                    formik.setFieldTouched("burningPointRate", true, false);
                  }
                }}
                footer={
                  (formik?.touched?.burningPointRate || formik?.submitCount > 0) && formik?.errors?.burningPointRate
                    ? formik.errors.burningPointRate
                    : null
                }
                mode={
                  (formik?.touched?.burningPointRate || formik?.submitCount > 0) && formik?.errors?.burningPointRate
                    ? "danger"
                    : "default"
                }
                isRequired={false}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-black font-medium">Minimum Transaction</p>

                  <Switch
                    checked={formik.values.isMinimumTransaction}
                    onChange={() => {
                      const newState = !formik.values.isMinimumTransaction;
                      formik.setFieldValue("isMinimumTransaction", newState);
                    }}
                    isEdit
                  />
                </div>
                <p className="text-xs text-neutral300">Require a minimum transaction amount to burn points</p>
              </div>
            </div>
            {formik.values.isMinimumTransaction && (
              <>
                <TextInput
                  placeholder="Input amount here"
                  leftAdornment={<p className="text-xs pl-1">Rp</p>}
                  value={formik.values.minimumTransaction}
                  type="number"
                  onChangeInput={(e) => {
                    const value = e.target.value;

                    // Hanya izinkan angka dan maksimal 10 digit
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      formik.setFieldValue("minimumTransaction", value);
                      formik.setFieldTouched("minimumTransaction", true, false);
                    }
                  }}
                  disabled={!formik.values.isMinimumTransaction}
                  footer={
                    (formik?.touched?.minimumTransaction || formik?.submitCount > 0) &&
                    formik?.errors?.minimumTransaction
                      ? formik.errors.minimumTransaction
                      : null
                  }
                  mode={
                    (formik?.touched?.minimumTransaction || formik?.submitCount > 0) &&
                    formik?.errors?.minimumTransaction
                      ? "danger"
                      : "default"
                  }
                />
                <p className="text-xs text-neutral300 mt-1">
                  Customers must spend at least{" "}
                  <span className="font-semibold">
                    Rp {Number(formik.values.minimumTransaction).toLocaleString("id", "ID") || 0}
                  </span>{" "}
                  to burn points
                </p>
              </>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-black font-medium">Maximum Points per Transaction</p>

                  <Switch
                    checked={formik.values.isMaximumPointTransaction}
                    onChange={() => {
                      const newState = !formik.values.isMaximumPointTransaction;
                      formik.setFieldValue("isMaximumPointTransaction", newState);
                    }}
                    isEdit
                  />
                </div>
                <p className="text-xs text-neutral300">
                  Limit the maximum points that can be burn in a single transaction
                </p>
              </div>
            </div>
            {formik.values.isMaximumPointTransaction && (
              <>
                <TextInput
                  placeholder="Input amount here"
                  leftAdornment={<PiCoins />}
                  type="number"
                  value={formik.values.maximumPointTransaction}
                  onChangeInput={(e) => {
                    const value = e.target.value;

                    // Hanya izinkan angka dan maksimal 10 digit
                    if (/^\d*$/.test(value) && value.length <= 10) {
                      formik.setFieldValue("maximumPointTransaction", value);
                      formik.setFieldTouched("maximumPointTransaction", true, false);
                    }
                  }}
                  disabled={!formik.values.isMaximumPointTransaction}
                  footer={
                    (formik?.touched?.maximumPointTransaction || formik?.submitCount > 0) &&
                    formik?.errors?.maximumPointTransaction
                      ? formik.errors.maximumPointTransaction
                      : null
                  }
                  mode={
                    (formik?.touched?.maximumPointTransaction || formik?.submitCount > 0) &&
                    formik?.errors?.maximumPointTransaction
                      ? "danger"
                      : "default"
                  }
                />
                <p className="text-xs text-neutral300 mt-1">
                  Maximum{" "}
                  <span className="font-semibold">
                    {Number(formik.values.maximumPointTransaction).toLocaleString("id", "ID") || 0} points
                  </span>{" "}
                  can be burn per transaction
                  <br />
                  Equivalent to transactions above Rp{" "}
                  {(
                    Number(formik.values.maximumPointTransaction) * Number(formik.values.burningPointRate)
                  ).toLocaleString("id", "ID")}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {allowedRoles.includes(roleAccess) && (
        <div className="mt-6 flex gap-2 justify-end">
          {!firstInitial && (
            <div className="w-36">
              <OutlineButton type="full" title="Cancel" onClick={handleBack} />
            </div>
          )}

          <div className="w-36">
            <PrimaryButton type="full" title="Save" className="px-6" onClick={formik.handleSubmit} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningRateSetting;
