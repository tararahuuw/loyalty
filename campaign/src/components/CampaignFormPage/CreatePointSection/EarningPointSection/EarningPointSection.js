import React from "react";
import ToolTip from "prezent/ToolTip";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";
import { TextInput, DropdownText } from "sprint-asia-custom-component";
import { PlusIcon, XCircleIcon } from "@phosphor-icons/react";

const EarningPointSection = ({ formik, tierLevels = [] }) => {
  const addTier = () => {
    formik.setFieldValue("segmentedCustomer", [
      ...formik.values.segmentedCustomer,
      { tierLevelId: "", pointEarned: 0, pointEarnedException: 0 },
    ]);
  };
  const removeTier = (idx) => {
    const filtered = formik.values.segmentedCustomer.filter((_, i) => i !== idx);
    formik.setFieldValue("segmentedCustomer", filtered);
  };

  const onSelect = (value, index) => {
    const updated = [...formik.values.segmentedCustomer];
    updated[index] = {
      ...updated[index],
      tierLevelId: value,
      pointEarned: updated[index].pointEarned || 0,
      pointEarnedException: updated[index].pointEarnedException || 0,
    };

    formik.setFieldValue("segmentedCustomer", updated);
    formik.setFieldTouched(`segmentedCustomer[${index}].tierLevelId`, true, false);
  };

  const handleChangePointEarned = (value, idx) => {
    // remove all non-digit characters
    const raw = value.replace(/\D/g, "");
    const num = raw ? parseInt(raw, 10) : 0;

    const updated = [...formik.values.segmentedCustomer];
    updated[idx].pointEarned = num;
    formik.setFieldValue("segmentedCustomer", updated);
    formik.setFieldTouched(`segmentedCustomer[${idx}].pointEarned`, true, false);
  };

  const handleChangeEarnedForException = (value, idx) => {
    // remove all non-numeric chars first (e.g. commas)
    const numericValue = value.replace(/\D/g, "");

    const updated = [...formik.values.segmentedCustomer];
    updated[idx] = {
      ...updated[idx],
      pointEarnedException: numericValue === "" ? 0 : Number(numericValue),
    };

    formik.setFieldValue("segmentedCustomer", updated);
    formik.setFieldTouched(`segmentedCustomer[${idx}].pointEarnedException`, true, false);
  };

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Earning Point</p>

          <ToolTip
            id="earning-point"
            message="When both the main rule and the exception rule are active, points will be calculated based on the exception rule first, followed by the main rule."
          />
        </div>

        <div className="rounded-lg bg-white p-4 flex flex-col gap-4">
          <RadioButtonComponent
            onChange={() => formik.setFieldValue("method", "all")}
            checked={formik.values.method === "all"}
            value="all"
            title="All Customer"
            description="Allows all Customers to earn points based on the transaction amount."
            disabled={formik.values.pointProcessingMethod === "upload point"}
          />

          {formik.values.method === "all" && (
            <div className="flex gap-4 items-center" style={{ width: 600 }}>
              <TextInput
                title="Point Earned"
                placeholder="Input Earning Point"
                value={formik.values.pointEarned.toLocaleString("id-ID")}
                onChangeInput={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const num = raw ? parseInt(raw, 10) : 0;
                  formik.setFieldValue("pointEarned", num);
                }}
                footer={
                  (formik.touched.pointEarned || formik.submitCount > 0) && formik.errors.pointEarned
                    ? formik.errors.pointEarned
                    : null
                }
                mode={
                  formik.values.pointProcessingMethod === "upload point"
                    ? "disable"
                    : (formik.touched.pointEarned || formik.submitCount > 0) && formik.errors.pointEarned
                    ? "danger"
                    : "default"
                }
              />

              <TextInput
                title="Point Earned for Exception"
                placeholder="Input Exception Point"
                value={formik.values.pointEarnedException.toLocaleString("id-ID")}
                onChangeInput={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  const num = raw ? parseInt(raw, 10) : 0;
                  formik.setFieldValue("pointEarnedException", num);
                }}
                footer={
                  (formik.touched.pointEarnedException || formik.submitCount > 0) && formik.errors.pointEarnedException
                    ? formik.errors.pointEarnedException
                    : null
                }
                mode={
                  formik.values.pointProcessingMethod === "upload point"
                    ? "disable"
                    : (formik.touched.pointEarnedException || formik.submitCount > 0) &&
                      formik.errors.pointEarnedException
                    ? "danger"
                    : "default"
                }
              />
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-4 flex flex-col gap-4">
          <RadioButtonComponent
            onChange={() => formik.setFieldValue("method", "segmented")}
            checked={formik.values.method === "segmented"}
            value="segmented"
            title="Segmentation Customer"
            description="Enables specific customer segments to earn points based on the transaction amount."
            disabled={formik.values.pointProcessingMethod === "upload point"}
          />

          {formik.values.method === "segmented" && (
            <div>
              <div className="flex">
                <div className="flex-1">
                  <div className="bg-neutral20 border border-r-0 border-neutral40 rounded-tl-md h-10 flex items-center px-4">
                    <p className="font-normal text-sm">TIER LEVEL</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-neutral20 border border-r-0 border-neutral40 h-10 flex items-center px-4">
                    <p className="font-normal text-sm">POINT EARNED</p>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-neutral20 border border-neutral40 h-10 flex items-center px-4">
                    <p className="font-normal text-sm">POINT EARNED FOR EXCEPTION</p>
                  </div>
                </div>

                <div className="w-20">
                  <div className="bg-neutral20 border border-l-0 border-neutral40 rounded-tr-md h-10 flex items-center justify-center px-2">
                    <p className="font-normal text-sm">ACTION</p>
                  </div>
                </div>
              </div>

              {formik.values.segmentedCustomer.map((tier, idx) => (
                <div className="flex font-normal" key={idx}>
                  <div className="border border-t-0 border-r-0 border-neutral40 p-4 flex-1">
                    <DropdownText
                      title=""
                      onSelect={(e) => onSelect(e.value, idx)}
                      isEdited
                      placeholder="Choose tier level"
                      options={tierLevels
                        ?.filter(
                          (level) =>
                            !formik.values.segmentedCustomer.some(
                              (t, tIdx) => t.tierLevelId === level.id && tIdx !== idx
                            )
                        )
                        .map((item) => ({
                          option: item.tierName,
                          value: item.id,
                        }))}
                      currentOption={tier.tierLevelId}
                      footer={
                        (formik.touched.segmentedCustomer?.[idx]?.tierLevelId || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.tierLevelId
                          ? formik.errors.segmentedCustomer?.[idx]?.tierLevelId
                          : null
                      }
                      mode={
                        (formik.touched.segmentedCustomer?.[idx]?.tierLevelId || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.tierLevelId
                          ? "danger"
                          : "default"
                      }
                    />
                  </div>

                  <div className="border border-t-0 border-r-0 border-neutral40 p-4 flex-1">
                    <TextInput
                      placeholder=""
                      value={tier.pointEarned.toLocaleString("id-ID")}
                      onChangeInput={(e) => handleChangePointEarned(e.target.value, idx)}
                      footer={
                        (formik.touched.segmentedCustomer?.[idx]?.pointEarned || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.pointEarned
                          ? formik.errors.segmentedCustomer?.[idx]?.pointEarned
                          : null
                      }
                      mode={
                        (formik.touched.segmentedCustomer?.[idx]?.pointEarned || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.pointEarned
                          ? "danger"
                          : "default"
                      }
                    />
                  </div>

                  <div className="border border-t-0 border-neutral40 p-4 flex-1">
                    <TextInput
                      placeholder=""
                      value={tier.pointEarnedException.toLocaleString("id-ID")}
                      onChangeInput={(e) => handleChangeEarnedForException(e.target.value, idx)}
                      footer={
                        (formik.touched.segmentedCustomer?.[idx]?.pointEarnedException || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.pointEarnedException
                          ? formik.errors.segmentedCustomer?.[idx]?.pointEarnedException
                          : null
                      }
                      mode={
                        (formik.touched.segmentedCustomer?.[idx]?.pointEarnedException || formik.submitCount > 0) &&
                        formik.errors.segmentedCustomer?.[idx]?.pointEarnedException
                          ? "danger"
                          : "default"
                      }
                    />
                  </div>

                  <div className="border border-t-0 border-l-0 border-neutral40 p-4 w-20 flex items-center justify-center">
                    <a className="cursor-pointer" onClick={() => removeTier(idx)}>
                      <XCircleIcon className="text-danger500" size={20} />
                    </a>
                  </div>
                </div>
              ))}

              {formik.values.segmentedCustomer.length !== tierLevels.length ? (
                <div className="border border-t-0 border-neutral40 rounded-b-md flex justify-end">
                  <a className="flex items-center gap-2 py-2 px-4 cursor-pointer" onClick={addTier}>
                    <PlusIcon className="text-primary500" size={20} />
                    <p className="text-primary500 font-normal">Add Tier Level</p>
                  </a>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EarningPointSection;
