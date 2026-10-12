import React, { useEffect, useState } from "react";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import {
  DeletePaymentMethod,
  EditPaymentMethod,
  GetPaymentMethodSummaryById,
} from "../../../service/inventoryManagement/endpoint/paymentMethod";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "sprint-asia-custom-component";
import { NotePencil, Trash } from "@phosphor-icons/react";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import BasicInformationSection from "../../../components/paymentMethod/DetailPage/BasicInformationSection";
import PaymentMethodInformationSection from "../../../components/paymentMethod/DetailPage/PaymentMethodInformationSection";
import DetailActivitySection from "../../../components/paymentMethod/DetailPage/DetailActivitySection";
import AddSinglePaymentMethodModal from "../../../components/paymentMethod/PaymentMethodForm/AddSinglePaymentMethodModal";

const DetailPaymentMethod = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: isLoading, toggle: toggleIsLoading } = useDisclosure(false);
  const { isOpen: isEditModalOpen, toggle: toggleEditModal, close: closeEditModal } = useDisclosure(false);
  const { data: summary, isLoading: summaryIsLoading } = useFetch(
    GetPaymentMethodSummaryById,
    "payment-method-summary",
    [],
    id
  );

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

  const handleDeletePaymentMethod = async () => {
    try {
      closeDeleteModal();
      toggleIsLoading();
      await DeletePaymentMethod(id);
      handleOpenModalResult("success", "Payment method has been successfully deleted.");
      toggleIsLoading();
      setTimeout(() => {
        navigate("/loyaltypoint/inventory/payment-method");
      }, 3500);
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to delete payment method at the moment. Please try again");
      toggleIsLoading();
    }
  };

  const handleSubmitEditPaymentMethod = async (form, resetForm) => {
    try {
      closeEditModal();
      toggleIsLoading();
      await EditPaymentMethod(roleAccess, summary?.data?.id, {
        id: summary?.data?.id,
        loyaltyID: summary?.data?.loyaltyID,
        paymentID: form.paymentID,
        paymentName: form.paymentName,
        status: form.status,
      });
      handleOpenModalResult("success", "Payment method has been successfully edited.");
      toggleIsLoading();
      setTimeout(() => {
        navigate("/loyaltypoint/inventory/payment-method");
      }, 3500);
    } catch (error) {
      toggleIsLoading();
      handleOpenModalResult("failed", "Unable to edit payment method. Please try again.");
    }
  };

  useEffect(() => {
    setTitleHeader("Detail Payment Method");
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-7 bg-neutral20 mt-8 px-8 mb-16">
        <BasicInformationSection
          paymentID={summary?.data?.paymentID}
          paymentName={summary?.data?.paymentName}
          status={summary?.data?.status}
        />

        <DetailActivitySection
          createdAt={summary?.data?.createdAt}
          updatedAt={summary?.data?.updatedAt}
          createdByName={summary?.data?.createdByName}
          updatedByName={summary?.data?.updatedByName}
        />
      </div>

      <Footer
        modeLeftButton="danger"
        modeRightButton="outline"
        titleLeftButton={
          <div className="flex items-center gap-2">
            <Trash />
            <p>Delete</p>
          </div>
        }
        titleRightButton={
          <div className="flex items-center gap-2">
            <NotePencil />
            <p>Edit</p>
          </div>
        }
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={openDeleteModal}
        onClickRightButton={toggleEditModal}
      />

      <StateModal
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete the Payment method ${summary?.data?.paymentName}? This action cannot be undone.`}
        isOpen={deleteModalIsOpen}
        onClose={closeDeleteModal}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Payment method</p>
          </div>
        }
        leftAction={closeDeleteModal}
        rightAction={handleDeletePaymentMethod}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={summaryIsLoading || isLoading}
        onClose={() => {}}
      />

      <AddSinglePaymentMethodModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        selectedPaymentMethod={summary?.data}
        roleAccess={roleAccess}
        onSubmit={handleSubmitEditPaymentMethod}
      />
    </div>
  );
};

export default DetailPaymentMethod;
