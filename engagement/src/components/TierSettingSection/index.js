import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Switch, DropdownText, Alert } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { GetSettingTierLevel, UpdateTierSetting } from "../../service/TieringManagement/endpoint/tieringLevel";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const TierSettingSection = ({ roleAccess, setTitleHeader, loyaltyId }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1500);
    }, 250);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      downgradeEnabled: false,
      evaluationPeriod: 1,
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  async function handleChangeTierSetting(evaluationPeriod, downgradeEnabled) {
    try {
      var bodyReq = {
        loyaltyId: loyaltyId,
        evaluationPeriod: evaluationPeriod,
        downgradeEnabled: downgradeEnabled,
      };
      var response = await UpdateTierSetting(loyaltyId, bodyReq);
      if (response.data.downgradeEnabled) {
        handleOpenModalResult(
          "success",
          `Tier evaluation period has been successfully activated with period ${
            evaluationPeriod === 1 ? "1 Month" : evaluationPeriod === 12 ? "1 Year" : evaluationPeriod + " Months"
          }`
        );
      }
      formik.setFieldValue("downgradeEnabled", response.data.downgradeEnabled);
      formik.setFieldValue("evaluationPeriod", response.data.evaluationPeriod);
    } catch (error) {
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to change setting at the moment. Please refresh the page and try again"
      );
    }
  }

  async function handleGetSettingTier() {
    try {
      var response = await GetSettingTierLevel(loyaltyId);
      if (response) {
        formik.setFieldValue("evaluationPeriod", response.data.evaluationPeriod);
        formik.setFieldValue("downgradeEnabled", response.data.downgradeEnabled);
      }
    } catch (error) {
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to get setting at the moment. Please refresh the page and try again"
      );
    }
  }

  useEffect(() => {
    setTitleHeader("Tier Level");
  }, []);

  useEffect(() => {
    handleGetSettingTier();
  }, [formik.values.evaluationPeriod, formik.values.downgradeEnabled]);

  return (
    <>
      <div className="w-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-3">
            <p className="font-semibold text-black text-lg">Tier Configuration</p>
            <hr className="text-neutral30" />
            <div className="flex mb-2 items-center justify-between">
              <div className="mt-4">
                <p className="font-semibold text-black">Allow Tier Downgrade</p>
                <p>Enable customers to move to lower tiers if they don't meet requirements</p>
              </div>
              <Switch
                isEdit
                checked={formik.values.downgradeEnabled}
                onChange={() => {
                  if (formik.values.downgradeEnabled === true) {
                    toggleConfirmationModal();
                  } else {
                    handleChangeTierSetting(formik.values.evaluationPeriod, true);
                  }
                }}
              />
            </div>
            {formik.values.downgradeEnabled ? (
              <DropdownText
                title="Evaluation Period"
                placeholder="Select Season Period"
                options={[
                  { option: "1 Month", value: 1 },
                  { option: "2 Months", value: 2 },
                  { option: "3 Months", value: 3 },
                  { option: "4 Months", value: 4 },
                  { option: "6 Months", value: 6 },
                  { option: "1 Year", value: 12 },
                ]}
                isRequired
                onSelect={(e) => {
                  handleChangeTierSetting(e.value, formik.values.downgradeEnabled);
                }}
                footer={
                  (formik.touched.evaluationPeriod || formik.submitCount > 0) && formik.errors.evaluationPeriod
                    ? formik.errors.evaluationPeriod
                    : "Rolling window period for tier evaluation"
                }
                currentOption={formik.values.evaluationPeriod}
                className="max-w-sm"
              />
            ) : (
              <Alert subtitle="Customers will maintain their highest achieved tier even if they don't meet current requirements." />
            )}
          </div>
        </div>
        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClick={() => {}}
        />
        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
        <StateModal
          title="Do you want to inactive?"
          subtitle="Are you sure you want to inactive tier downgrade?"
          isOpen={confirmationModalIsOpen}
          onClose={toggleConfirmationModal}
          type="default"
          titleButtonLeft="Cancel"
          titleButtonRight="Inactive"
          leftAction={toggleConfirmationModal}
          rightAction={() => {
            toggleConfirmationModal();
            handleChangeTierSetting(formik.values.evaluationPeriod, !formik.values.downgradeEnabled);
          }}
        />
      </div>
    </>
  );
};

export default TierSettingSection;
