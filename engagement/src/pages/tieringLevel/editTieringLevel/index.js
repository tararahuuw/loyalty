import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Footer } from "sprint-asia-custom-component";
import {
  EditTieringLevel as EditTieringLevelService,
  GetAllClient,
  GetAllDivisionByClientId,
  GetTierLevelById,
  GetLevelIcon,
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

const EditTieringLevel = ({ roleAccess, setTitleHeader }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { data: clients, isLoading: clientIsLoading } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: tierLevel, isLoading: tierLevelIsLoading } = useFetch(GetTierLevelById, "tier-level", [], id);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  };

  const submitTierLevel = async (form) => {
    try {
      toggleLoadingModal();
      await EditTieringLevelService(form);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Tier level has been successfully edited");
        setTimeout(() => {
          navigate("/prezent/engagement/tier-level");
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to edit tier level at the moment. Please try again");
    }
  };

  const previousTierDownGrade = {
    status: 0,
    period: "4 month",
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      level: `Level ${tierLevel?.data?.level}` || "",
      name: tierLevel?.data?.name || "",
      clientId: tierLevel?.data?.clientId || "",
      divisionId: tierLevel?.data?.divisionId || "",
      isTierDowngrade: tierLevel?.data?.isDownGrade || 0,
      seasonPeriod: tierLevel?.data?.seasonPeriod || "",
      targetAmount: tierLevel?.data?.targetAmount || "",
      description: tierLevel?.data?.description || "",
      typeTierIcon: tierLevel?.data?.typeIconFile || "Prezent",
      tierIcon: tierLevel?.data?.iconFile || "",
    },
    validationSchema: yup.object().shape({
      level: yup.string().required("Tier level is required"),
      name: yup.string().required("Tier name is required"),
      clientId: yup.string().required("Client is required"),
      divisionId: yup.string().required("Division is required"),
      isTierDowngrade: yup.string().required("Tier downgrade is required"),
      seasonPeriod: yup.string().when("isTierDowngrade", {
        is: (value) => value === 1,
        then: () => yup.string().required("Season period is required"),
        otherwise: () => yup.string().notRequired(),
      }),
      targetAmount: yup.string().required("Target amount is required"),
      description: yup.string().required("Description is requried"),
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

      for (let key in values) {
        if (key === "level") {
          formData.append(key, values[key].replace(/^Level\s/, "")); // Remove "Level " from the value
        } else if (key === "tierIcon") {
          if (!(values.typeTierIcon === "Prezent" || values.tierIcon === formik.initialValues.tierIcon)) {
            formData.append(key, values.tierIcon);
          }
        } else if (key === "seasonPeriod" && !values.isTierDowngrade) {
          formData.append(key, "");
        } else if (key === "targetFrequency" && !values.isFrequency) {
          formData.append(key, 0);
        } else {
          formData.append(key, values[key]);
        }
      }
      formData.append("id", id);

      submitTierLevel(formData);
    },
  });

  const { data: icon, isLoading: iconIsLoading } = useFetch(
    tierLevel?.data?.level && GetLevelIcon,
    "icon",
    [],
    tierLevel?.data?.level
  );

  const { data: divisions, isLoading: divisionIsLoading } = useFetch(
    formik.values.clientId && GetAllDivisionByClientId,
    "divisions",
    [],
    formik.values.clientId
  );

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      navigate("/prezent/engagement/tier-level");
    }
  };

  useEffect(() => {
    setTitleHeader("Edit Tier Level");
  }, []);
  return (
    <div>
      <div className="bg-neutral20 mt-8 px-8 mb-16">
        <form className="flex flex-col gap-7">
          <TierInformationSection formik={formik} clients={clients} divisions={divisions} />

          <TierDetailSection formik={formik} previousTierDownGrade={previousTierDownGrade} />

          <TierBenefitSection formik={formik} />

          <TierIconSection formik={formik} icon={icon?.data} level={tierLevel?.data?.level} />
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
        isOpen={loadingModalIsOpen || clientIsLoading || divisionIsLoading || tierLevelIsLoading || iconIsLoading}
        onClose={() => {}}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

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

export default EditTieringLevel;
