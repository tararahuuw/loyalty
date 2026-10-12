import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";

import EarningRateSetting from "../../../components/PointConvertion/EarningRateSetting";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import { CreatePointConvertion, GetPointConversion } from "../../../service/pointconvertion/endpoint/pointconvertion";
import DetailPointConversion from "../../../components/PointConvertion/DetailPointConversion/DetailPointConversion";

const DashboardPointConvertion = ({ setTitleHeader, clientId }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const [editMode, setEditMode] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const { isOpen: resultModalIsOpen, open: openResult, close: closeResult } = useDisclosure();
  const {
    data: pointConversion,
    isLoading,
    refetch,
  } = useFetch(GetPointConversion, "point-conversion", [], {
    companyId: clientId,
  });

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResult();
      setTimeout(() => {
        closeResult();
      }, 1000);
    }, 250);
  };

  const handleSubmitPointConversion = async (form, resetForm) => {
    try {
      openLoading();
      await CreatePointConvertion(form);
      refetch();
      resetForm();
      closeLoading();
      setEditMode(false);
      handleOpenModalResult("success", "Your point conversion has been successfully saved.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to edit point conversion at the moment. Please try again");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      burningPointRate: pointConversion?.data?.earningPointRate || "",
      isMinimumTransaction: pointConversion?.data?.isMinimumTransaction || false,
      minimumTransaction: pointConversion?.data?.minimumTransaction || "",
      isMaximumPointTransaction: pointConversion?.data?.isMaximumPointTransaction || false,
      maximumPointTransaction: pointConversion?.data?.maximumPointTransaction || "",
    },
    validationSchema: yup.object().shape({
      burningPointRate: yup
        .number()
        .min(1, "Earning rate minimum 1")
        .max(1000000000, "Earning rate maximum 1.000.000.000")
        .required("Earning rate is required"),
      isMinimumTransaction: yup.boolean(),
      minimumTransaction: yup
        .number()
        .min(1, "Limit minimum 1")
        .max(1000000000, "Limit maximum 1.000.000.000")
        .when("isMinimumTransaction", {
          is: true,
          then: (schema) => schema.required("Minimum transaction is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      isMaximumPointTransaction: yup.boolean(),
      maximumPointTransaction: yup
        .number()
        .min(1, "Limit minimum 1")
        .max(1000000000, "Limit maximum 1.000.000.000")
        .when("isMaximumPointTransaction", {
          is: true,
          then: (schema) => schema.required("Maximum transaction is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    }),
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      handleSubmitPointConversion(
        {
          companyId: clientId,
          earningPointRate: Number(values.burningPointRate),
          isMaximumPointTransaction: values.isMaximumPointTransaction,
          isMinimumTransaction: values.isMinimumTransaction,
          maximumPointTransaction: values.isMaximumPointTransaction ? Number(values.maximumPointTransaction) : 0,
          minimumTransaction: values.isMinimumTransaction ? Number(values.minimumTransaction) : 0,
        },
        resetForm
      );
    },
  });

  useEffect(() => {
    setTitleHeader("Point Conversion");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
      {pointConversion?.response?.data?.rc === 404 || editMode ? (
        <EarningRateSetting
          formik={formik}
          handleBack={() => {
            setEditMode(!editMode);
            formik.resetForm();
          }}
          firstInitial={pointConversion?.response?.data?.rc === 404}
          roleAccess={roleAccess}
        />
      ) : (
        <DetailPointConversion
          roleAccess={roleAccess}
          onClick={() => setEditMode(!editMode)}
          data={pointConversion?.data}
        />
      )}

      <LoadingModal
        isOpen={isLoading || loadingModalIsOpen}
        onClose={() => {}}
        title="Loading"
        subtitle="Please wait a moment"
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
    </div>
  );
};

export default DashboardPointConvertion;
