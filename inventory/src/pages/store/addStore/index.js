import React, { useEffect, useState } from "react";
import BasicInformationSection from "../../../components/store/StoreForm/BasicInformationSection";
import { useFormik } from "formik";
import * as yup from "yup";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { CreateStore, GetAllClient } from "../../../service/inventoryManagement/endpoint/store";
import { useNavigate, useParams } from "react-router-dom";
import StoreInformationSection from "../../../components/store/StoreForm/StoreInformationSection";
import { Footer } from "sprint-asia-custom-component";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const AddStore = ({ roleAccess, setTitleHeader }) => {
  const { merchantId, clientId } = useParams();
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

  const submitNewStore = async (form) => {
    try {
      toggleLoadingModal();
      await CreateStore(roleAccess, form);

      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Store has been successfully added");
        setTimeout(() => {
          navigate("/prezent/inventory/store");
        }, 4000);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to adding Store at the moment. Please try again");
    }
  };

  const formik = useFormik({
    initialValues: {
      clientId: clientId || "",
      outlets: [],
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
      outlets: yup.array().min(1, "Outlets must not be empty").required("Outlets is required"),
    }),
    onSubmit: (values) => {
      submitNewStore({
        clientId: values.clientId,
        stores: values.outlets,
      });
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      navigate("/prezent/inventory/store");
    }
  };

  useEffect(() => {
    setTitleHeader("Add Store");
  }, []);
  return (
    <div>
      <div className="bg-neutral20 mt-8 px-8 mb-16">
        <form className="flex flex-col gap-7">
          <BasicInformationSection formik={formik} clients={clients} />

          <StoreInformationSection merchantId={merchantId} parentFormik={formik} roleAccess={roleAccess} />
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
        rightAction={() => navigate("/prezent/inventory/store")}
      />
    </div>
  );
};

export default AddStore;
