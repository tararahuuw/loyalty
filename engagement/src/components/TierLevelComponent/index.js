import React, { useState } from "react";
import {
  PiCakeFill,
  PiDotsSixVertical,
  PiGift,
  PiNotePencil,
  PiTrash,
  PiTrendDown,
  PiUsers,
  PiPlus,
  PiPercentFill,
  PiXFill,
  PiCertificateFill,
  PiHandCoinsFill,
  PiStarFill,
  PiLockSimple,
} from "react-icons/pi";
import moment from 'moment';
import {
  DropdownText,
  OutlineButton,
  PrimaryButton,
  Switch,
  TextInput,
} from "sprint-asia-custom-component";
import EmptyState from "../../assets/Empty_State.png"
import TierBenefitComponent from "../TierBenefitComponent";
import UploadImageBox from "../UploadImageBox";

const TierLevelComponent = ({
  isEdit = false,
  data,
  formikEditing,
  handleDeleteTier,
  handleEditTier,
  handleCancelEdit,
  handleUpdateEdit,
  isError,
  nameTierBefore,
  handleUploadImage
}) => {

  const handleDeleteData = (indexToRemove) => {
    const updatedBenefits = formikEditing.values.benefits.filter((_, index) => index !== indexToRemove);
    formikEditing.setFieldValue("benefits", updatedBenefits);
  };

  function handleAddBenefit() {
    const newBenefit = {
      benefitType: "",
      benefitTypeError: "",
      benefitValue: "",
      benefitValueError: "",
      benefitTitle: "",
      benefitTitleError: "",
      benefitDescription: "",
      benefitDescriptionError: ""
    };

    formikEditing.setFieldValue("benefits", [...formikEditing.values.benefits, newBenefit]);
  }

  return (
    <div className={`${isError ? "bg-danger50" : "bg-white"} border-2 border-neutral40 rounded-lg py-4 px-8 my-4`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <PiDotsSixVertical className="mr-4" />
          <img src={`${process.env.REACT_APP_TIER_LEVEL_URL}api/v1/tiers/icons/${data?.icon}`} className="w-12 h-12" />
          <p className="px-2">{data?.name}</p>
          <p className="rounded-full py-2 px-4 text-primary500 bg-primary50">{data?.status}</p>
        </div>
        <div className="flex items-center">
          <PiUsers className="text-neutral80" />
          <p className="text-neutral80 mx-2">{data?.totalCustomers} Customers</p>
          {
            data?.isEdited === false ?
              <>
                <PiNotePencil className="text-primary500 mr-2 cursor-pointer" onClick={handleEditTier} />
                <PiTrash className="text-danger500 cursor-pointer" onClick={handleDeleteTier} />
              </>
              :
              <>
                <div className="mr-2">
                  <OutlineButton title="Cancel" onClick={handleCancelEdit} />
                </div>
                <PrimaryButton title="Update" isActive={true} onClick={handleUpdateEdit} />
              </>
          }
        </div>
      </div>
      {data?.isEdited === false ? (
        <>
          <div className="grid grid-cols-3 gap-4 my-4">
            <div>
              <p>Tier Progression Criteria</p>
              <p className="font-semibold">{data?.progressionType}</p>
            </div>
            {
              data?.minSpend !== null &&
              <div>
                <p>Minimum Spend (Rp)</p>
                <p className="font-semibold">Rp {data?.minSpend.toLocaleString("id")}</p>
              </div>
            }
            {
              data?.minTransactions !== null &&
              <div>
                <p>Minimum Frequency</p>
                <p className="font-semibold">{data?.minTransactions.toLocaleString("id")} transaction</p>
              </div>
            }
          </div>

          <hr className="text-neutral80 my-2" />

          <div className="my-4">
            <div className="flex items-center">
              <PiGift className="text-primary500" />
              <p className="font-semibold ml-2">Tier Benefits ({data.benefits.length})</p>
            </div>

            {data.benefits.map((value, idx) => (
              <div
                key={idx}
                className="border-2 border-neutral40 bg-white rounded-lg my-2"
              >
                <div className="px-4 my-2 flex items-center">
                  {
                    value.type === "Percentage Discount" ?
                      <PiPercentFill size={24} className="text-primary500 mr-2" /> :
                      value.type === "Points Multiplier" ?
                        <PiXFill size={24} className="text-primary500 mr-2" /> :
                        value.type === "Priority Support" ?
                          <PiCertificateFill size={24} className="text-primary500 mr-2" /> :
                          value.type === "Cashback Rewards" ?
                            <PiHandCoinsFill size={24} className="text-success500 mr-2" /> :
                            value.type === "Birthday Bonus" ?
                              <PiCakeFill size={24} className="text-danger500 mr-2" /> :
                              value.type === "Custom Benefit" ?
                                <PiStarFill size={24} className="text-warning500 mr-2" /> : null
                  }
                  <div className="ml-2">
                    <div className="flex items-center">
                      <p className="font-semibold mr-2">{value.title}</p>
                      {
                        (value.type === "Percentage Discount" ||
                          value.type === "Points Multiplier" ||
                          value.type === "Cashback Rewards" ||
                          value.type === "Birthday Bonus") &&
                        <p className="rounded-full bg-primary50 text-primary500 py-1 px-2">
                          {value.value}
                          {
                            value.type === "Percentage Discount" ? "%" :
                              value.type === "Points Multiplier" ? "x" :
                                value.type === "Priority Support" ? "" :
                                  value.type === "Cashback Rewards" ? "%" :
                                    value.type === "Birthday Bonus" ? " point" :
                                      value.type === "Custom Benefit" ? "" : null
                          }
                        </p>
                      }
                    </div>
                    <p>{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {
            data?.downgradeEnabled &&
            <div className="bg-warning50 py-2 px-4 flex rounded-lg">
              <PiTrendDown size={20} className="text-warning800" />
              <div className="ml-2">
                <p className="font-semibold">Auto-downgrade settings</p>
                <p>After {data?.autoDowngradeInfo} of inactivity, customers will be moved to {nameTierBefore}</p>
              </div>
            </div>
          }
        </>
      ) : (
        <div className="mb-4 mt-2">
          <p className="font-semibold">Basic Information</p>
          <hr className="text-neutral40 mb-4" />

          <TextInput
            title="Tier Name"
            placeholder="Input Tier Name"
            onChangeInput={(e) => {
              formikEditing.setFieldValue("name", e.target.value);
              formikEditing.setFieldTouched("name", true, false);
            }}
            footer={
              (formikEditing.touched.name || formikEditing.submitCount > 0) &&
                formikEditing.errors.name
                ? formikEditing.errors.name
                : null
            }
            mode={
              (formikEditing.touched.name || formikEditing.submitCount > 0) &&
                formikEditing.errors.name
                ? "danger"
                : "default"
            }
            isRequired
            value={formikEditing.values.name}
          />

          <p className="mt-4 mb-2 text-sm">Tier Icon</p>
          <div className="grid grid-cols-12 gap-4">
            {formikEditing.values.tierIcons.length > 0 &&
              formikEditing.values.tierIcons.map((value) => (
                <div
                  className={`${formikEditing.values.icon === value.fileName
                    ? "border-4 border-primary50 rounded-xl"
                    : ""
                    }`}
                >
                  <div
                    className={`${formikEditing.values.icon === value.fileName
                      ? "border-2 border-primary500"
                      : "border border-neutral40"
                      } rounded-lg cursor-pointer w-full h-full`}
                    onClick={() =>
                      formikEditing.setFieldValue(
                        "icon",
                        value.fileName
                      )
                    }
                  >
                    <img
                      src={`${process.env.REACT_APP_TIER_LEVEL_URL}api/v1/tiers/icons/${value.fileName}`}
                      className="rounded-lg w-full h-full"
                    />
                  </div>
                </div>
              ))}

            <div className="w-full h-full flex">
              <UploadImageBox UploadImage={handleUploadImage} />
            </div>
          </div>

          <p className="font-semibold mt-4">Tier Requirements</p>
          <hr className="text-neutral40 mb-4" />

          <DropdownText
            title="Tier Progression Criteria"
            placeholder="Select Tier Progression Criteria"
            options={[
              { option: "Spend Only", value: "Spend Only" },
              { option: "Frequency Only", value: "Frequency Only" },
              { option: "Spend AND Frequency", value: "Spend AND Frequency" },
              { option: "Spend OR Frequency", value: "Spend OR Frequency" },
            ]}
            isRequired
            onSelect={(e) => {
              formikEditing.setFieldValue("progressionType", e.value);
              formikEditing.setFieldTouched("progressionType", true, false);
            }}
            footer={
              formikEditing.values.progressionType === "Spend Only"
                ? "Customer must reach the minimum spend amount to qualify for this tier."
                : formikEditing.values.progressionType === "Frequency Only"
                  ? "Customer must complete the minimum number of transactions to qualify for this tier."
                  : formikEditing.values.progressionType === "Spend AND Frequency"
                    ? "Customer must meet BOTH minimum spend and transaction frequency requirements."
                    : formikEditing.values.progressionType === "Spend OR Frequency"
                      ? "Customer must meet EITHER minimum spend OR transaction frequency requirement."
                      : null
            }
            currentOption={formikEditing.values.progressionType}
          />

          <div className="flex items-center justify-between mt-4">
            <TextInput
              title="Minimum Spend"
              placeholder="Input Min. Spend"
              onChangeInput={(e) => {
                formikEditing.setFieldValue("minSpend", e.target.value);
                formikEditing.setFieldTouched("minSpend", true, false);
              }}
              type="number"
              minimum={0}
              footer={
                (formikEditing.touched.minSpend || formikEditing.submitCount > 0) &&
                  formikEditing.errors.minSpend
                  ? formikEditing.errors.minSpend
                  : null
              }
              mode={
                (formikEditing.touched.minSpend || formikEditing.submitCount > 0) &&
                  formikEditing.errors.minSpend
                  ? "danger"
                  : "default"
              }
              isRequired
              value={formikEditing.values.minSpend}
              leftAdornment={<p className="text-sm">Rp</p>}
            />

            <div className="ml-4 w-full">
              <TextInput
                title="Minimum Frequency"
                placeholder="Input Min. Frequency"
                onChangeInput={(e) => {
                  formikEditing.setFieldValue("minTransactions", e.target.value);
                  formikEditing.setFieldTouched("minTransactions", true, false);
                }}
                type="number"
                minimum={0}
                footer={
                  (formikEditing.touched.minTransactions || formikEditing.submitCount > 0) &&
                    formikEditing.errors.minTransactions
                    ? formikEditing.errors.minTransactions
                    : null
                }
                mode={
                  (formikEditing.touched.minTransactions || formikEditing.submitCount > 0) &&
                    formikEditing.errors.minTransactions
                    ? "danger"
                    : "default"
                }
                isRequired
                value={formikEditing.values.minTransactions}
              />
            </div>
          </div>

          <div className="flex items-center justify-between my-4">
            <p className="font-semibold">Tier Benefits</p>
            <OutlineButton
              title={
                <div className="flex items-center text-primary500">
                  <PiPlus /> Add Benefit
                </div>
              }
              onClick={handleAddBenefit}
            />
          </div>

          <hr className="text-neutral40" />

          <div className="mt-4">
            {formikEditing.values.benefits.length === 0 ? (
              <div className="text-center w-full rounded-lg border-2 border-neutral40 p-4">
                <div className="w-full flex justify-center">
                  <img src={EmptyState} />
                </div>
                <p className="font-semibold">No benefits added yet</p>
                <p className="text-neutral300">
                  Add benefits to make this tier attractive to customers
                </p>
              </div>
            ) : (
              formikEditing.values.benefits.map((benefit, index) => (
                <TierBenefitComponent
                  key={index}
                  formik={formikEditing}
                  currentIndex={index}
                  onDeleteData={() => handleDeleteData(index)}
                />
              ))
            )}
          </div>

          <div className="flex items-center mt-4">
            <Switch
              isEdit={true}
              checked={formikEditing.values.status}
              onChange={() =>
                formikEditing.setFieldValue("status", !formikEditing.values.status)
              }
            />
            <p className="ml-2">Activate Tier</p>
          </div>
        </div>
      )}

      <div className="flex items-center text-neutral500 mt-4 justify-between text-sm">
        <p>Created: {moment(data?.createdAt).format("YYYY-MM-DD")}</p>
        <p>Modified: {moment(data?.createdAt).format("YYYY-MM-DD")}</p>
      </div>
    </div>
  );
};

export default TierLevelComponent;