import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import ResultModal from "prezent/ResultModal";
import { GetAllClient } from "../../../service/inventoryManagement/endpoint/store";
import { useNavigate } from "react-router-dom";
import { Footer } from "sprint-asia-custom-component";
import BasicInformationSection from "../../../components/paymentMethod/PaymentMethodForm/BasicInformationSection";
import PaymentMethodInformationSection from "../../../components/paymentMethod/PaymentMethodForm/PaymentMethodInformationSection";
import { CreatePaymentMethod } from "../../../service/inventoryManagement/endpoint/paymentMethod";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";

const AddPaymentMethod = ({ roleAccess, setTitleHeader }) => {
  const navigate = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const { data: clients, isLoading: clientIsLoading } = useFetch(GetAllClient, "clients", [], {});

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

  const submitNewPaymentMethod = async (form) => {
    try {
      toggleLoadingModal();
      await CreatePaymentMethod(form);

      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Payment method has been successfully added");
        setTimeout(() => {
          navigate("/prezent/inventory/payment-method");
        }, 4000);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to adding Payment method at the moment. Please try again");
    }
  };

  const formik = useFormik({
    initialValues: {
      clientId: "",
      paymentMethods: [],
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
      paymentMethods: yup.array().min(1, "Payment methods must not be empty").required("Payment methods is required"),
    }),
    onSubmit: (values) => {
      submitNewPaymentMethod(values);
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      navigate("/prezent/inventory/payment-method");
    }
  };

  useEffect(() => {
    setTitleHeader("Add Payment Method");
  }, []);
  return (
    <div>
      <div className="bg-neutral20 mt-8 px-8 mb-16">
        <form className="flex flex-col gap-7">
          <BasicInformationSection formik={formik} clients={clients} />

          <PaymentMethodInformationSection parentFormik={formik} />
        </form>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={handleCancelButton}
        onClickRightButton={formik.handleSubmit}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen || clientIsLoading}
        onClose={() => {}}
      />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

      <StateModal
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationModalIsOpen}
        onClose={toggleConfirmationModal}
        type="default"
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleConfirmationModal}
        rightAction={() => navigate("/prezent/inventory/payment-method")}
      />
    </div>
  );
};

export default AddPaymentMethod;
