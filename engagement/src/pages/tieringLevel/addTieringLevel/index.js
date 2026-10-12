import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Footer } from "sprint-asia-custom-component";
import {
  CreateNewTieringLevel,
  GetAllClient,
  GetAllDivisionByClientId,
  GetDivisionLevel,
} from "../../../service/TieringManagement/endpoint/tieringLevel";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import TierInformationSection from "../../../components/TieringLevel/TieringLevelForm/TierInformationSection";
import TierDetailSection from "../../../components/TieringLevel/TieringLevelForm/TierDetailSection";
import TierBenefitSection from "../../../components/TieringLevel/TieringLevelForm/TierBenefitSection";
import TierIconSection from "../../../components/TieringLevel/TieringLevelForm/TierIconSection";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const AddTieringLevel = ({ roleAccess, setTitleHeader, clientId }) => {
  const navigate = useNavigate();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { data: clients, isLoading: clientIsLoading } = useFetch(GetAllClient, "clients", [], { roleAccess });

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 3500);
    }, 250);
  };

  const submitNewTierLevel = async (form) => {
    try {
      toggleLoadingModal();
      await CreateNewTieringLevel(form);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Tier level has been successfully added");
        setTimeout(() => {
          navigate("/prezent/engagement/tier-level");
        }, 4000);
      }, 250);
    } catch (error) {
      if (error?.response?.data?.rc === 1) {
        formik.setFieldError("targetAmount", "Amount transaction have to be more than previous tier level");
      } else if (error?.response?.data?.rc === 2) {
        formik.setFieldError("name", "Tier name already exists in this division");
      }
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to adding tier level at the moment. Please try again");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      level: "",
      name: "",
      clientId: roleAccess === "Client Administrator" ? clientId : "",
      divisionId: "",
      isTierDowngrade: 0,
      seasonPeriod: "",
      targetAmount: "",
      description: "",
      typeTierIcon: "Prezent",
      tierIcon: "",
    },
    validationSchema: yup.object().shape({
      level: yup.string().required("Tier level is required"),
      name: yup
        .string()
        .required("Tier name is required")
        .matches(/^[A-Za-z0-9 ]+$/, "Name can only contain letters, numbers, and spaces")
        .min(3, "Minimum 3 characters")
        .max(30, "Maximum 30 characters"),
      clientId: yup.string().required("Client is required"),
      divisionId: yup.string().required("Division is required"),
      isTierDowngrade: yup.string().required("Tier downgrade is required"),
      seasonPeriod: yup.string().when("isTierDowngrade", {
        is: (value) => value == 1,
        then: () => yup.string().required("Season period is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      targetAmount: yup.string().required("Target amount is required"),
      description: yup
        .string()
        .required("Description is requried")
        .min(10, "Minimum 10 characters")
        .max(300, "Maximum 300 characters"),
      typeTierIcon: yup.string().required(""),
      tierIcon: yup.string().when("typeTierIcon", {
        is: (value) => value === "Prezent",
        then: () => yup.string().notRequired().nullable(),
        otherwise: () => yup.string().required("Tier icon is required"),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      const formData = new FormData();

      if (level.data.level === 1) {
        values.isTierDowngrade = 0;
        values.seasonPeriod = "";
      }

      for (let key in values) {
        if (key === "clientId") {
          if (roleAccess === "System Administrator") {
            formData.append(key, values[key]);
          }
          continue; // Skip appending `clientId` in the else block
        }

        if (key === "level") {
          formData.append(key, values[key].replace(/^Level\s/, "")); // Remove "Level " from the value
        } else if (key === "tierIcon") {
          if (!(values.typeTierIcon === "Prezent" || values.tierIcon === formik.initialValues.tierIcon)) {
            formData.append(key, values.tierIcon);
          }
        } else if (key === "seasonPeriod" && !values.isTierDowngrade) {
          formData.append(key, "");
        } else {
          formData.append(key, values[key]);
        }
      }

      submitNewTierLevel(formData);
    },
  });

  const { data: divisions, isLoading: divisionIsLoading } = useFetch(
    formik.values.clientId && GetAllDivisionByClientId,
    "divisions",
    [],
    formik.values.clientId
  );

  const { data: level, isLoading: levelIsLoading } = useFetch(
    formik.values.divisionId && GetDivisionLevel,
    "level",
    [],
    formik.values.divisionId
  );

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      navigate("/prezent/engagement/tier-level");
    }
  };

  useEffect(() => {
    if (level?.rc === 200) {
      formik.setFieldValue("level", `Level ${level.data.level}`);
      formik.setFieldValue("isTierDowngrade", level.data.isTierDownGrade);
      formik.setFieldValue("seasonPeriod", level.data.seasonPeriod);

      if (level.data.level === 1) {
        formik.setFieldValue("targetAmount", 0);
      }
    } else {
      if (level?.response?.data?.rc === 2) {
        formik.setFieldValue("level", "Reached maximum limit");
        handleOpenModalResult(
          "failed",
          "Tier Level that has been created in the division has reached the maximum limit"
        );
        return;
      }
      formik.setFieldValue("level", "");
    }
  }, [level]);

  useEffect(() => {
    setTitleHeader("Add Tier Level");
  }, []);
  return (
    <div>
      <div className="bg-neutral20 mt-8 px-8 mb-16">
        <form className="flex flex-col gap-7">
          <TierInformationSection formik={formik} clients={clients} divisions={divisions} roleAccess={roleAccess} />

          <TierDetailSection
            formik={formik}
            level={level?.data?.level}
            previousTierDownGrade={level?.data?.isTierDownGrade}
          />

          <TierBenefitSection formik={formik} />

          <TierIconSection formik={formik} icon={level?.data?.iconFile} level={level?.data?.level} />
        </form>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        isActive
        onClickLeftButton={handleCancelButton}
        onClickRightButton={formik.handleSubmit}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen || clientIsLoading || divisionIsLoading || levelIsLoading}
        onClose={() => {}}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />

      <StateModal
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationModalIsOpen}
        onClose={toggleConfirmationModal}
        type="default"
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleConfirmationModal}
        rightAction={() => navigate("/prezent/engagement/tier-level")}
      />
    </div>
  );
};

export default AddTieringLevel;
