import React, { useEffect, useState } from "react";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import StateModal from "prezent/StateModal";
import APIDocumentationSection from "../../../components/IntegrationForm/APIDocumentationSection/APIDocumentationSection";
import IPSection from "../../../components/IntegrationForm/IPSection/IPSection";
import CallBackSection from "../../../components/IntegrationForm/CallBackSection/CallBackSection";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import {
  CreateNewIpAddress,
  DeleteIpAddress,
  EditURLCallback,
  GetAllURLCallback,
} from "../../../service/settingmanagement/endpoint";
import PWASection from "../../../components/IntegrationForm/PWASection/PWASection";
import { CreateLoyalty, EditLoyalty, GetCurrentPWA } from "../../../service/programmanagement/endpoint";

const AddIntegration = ({ setTitleHeader, companyId }) => {
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [selected, setSelected] = useState(null);
  const [reRender, setReRender] = useState(false);
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, open: openConfirmation, close: closeConfirmation } = useDisclosure(false);
  const { data: callbacks, isLoading, refetch } = useFetch(GetAllURLCallback, "call-backs", [], companyId);
  const {
    data: pwa,
    isLoading: pwaIsLoading,
    refetch: refetchPWA,
  } = useFetch(GetCurrentPWA, "current-pwa", [], companyId);

  const handleOpenDeleteConfirmation = (row) => {
    setSelected(row);
    openConfirmation();
  };

  const handleCloseConfirmation = () => {
    setSelected(null);
    closeConfirmation();
  };

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1000);
    }, 250);
  };

  const handleSubmitIpAddress = async (form, resetForm, setFieldTouched, setFieldError) => {
    try {
      openLoading();
      await CreateNewIpAddress({ companyId, ...form });
      resetForm();
      setReRender(!reRender);
      closeLoading();
      handleOpenModalResult("success", "IP Address has been created.");
    } catch (error) {
      const rc = error?.response?.data?.rc;
      if (rc === 9) {
        setFieldError("ipAddress", "IP Address can't be duplicate.");
      } else if (rc === 2) {
        setFieldError("ipAddress", "Please use correct IPv4 format.");
      }
      setFieldTouched("ipAddress", true, false);
      closeLoading();
      handleOpenModalResult("failed", "Sorry, we are unable to add IP Address at the moment. Please try again");
    }
  };

  const handleDeleteIpAddress = async () => {
    try {
      openLoading();
      handleCloseConfirmation();
      await DeleteIpAddress(selected?.id);
      setReRender(!reRender);
      closeLoading();
      handleOpenModalResult("success", "IP Address has been deleted.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, we are unable to delete IP Address at the moment. Please try again");
    }
  };

  const handleCreateCallBacks = async (form, setEditMode) => {
    try {
      openLoading();
      await EditURLCallback(companyId, form);
      refetch();
      closeLoading();
      setEditMode("");
      handleOpenModalResult("success", "URL Callback has been updated.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, we are unable to update URL Callback at the moment. Please try again");
    }
  };

  const handleSubmitPWA = async (form, closeForm) => {
    try {
      openLoading();
      if (pwa?.data?.data) {
        await EditLoyalty(form);
      } else {
        await CreateLoyalty(form);
      }
      refetchPWA();
      closeForm();
      closeLoading();
      handleOpenModalResult("success", "PWA has been successfully updated.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", `Failed to update PWA. Please try again.`);
    }
  };

  useEffect(() => {
    setTitleHeader("Integration");
  }, []);

  return (
    <div className="flex flex-col gap-6 bg-neutral20 p-8">
      <div className="flex flex-col gap-7">
        <APIDocumentationSection />
        <PWASection selectedLoyalty={pwa?.data?.data} handleSubmitPWA={handleSubmitPWA} />
        <IPSection
          loading={loadingIsOpen}
          handleOpenDeleteConfirmation={handleOpenDeleteConfirmation}
          handleSubmitIpAddress={handleSubmitIpAddress}
          reRender={reRender}
        />
        <CallBackSection callbacks={callbacks} handleCreateCallBacks={handleCreateCallBacks} />
      </div>

      <LoadingModal
        isOpen={loadingIsOpen || isLoading || pwaIsLoading}
        onClose={() => {}}
        title="Loading..."
        subtitle="Please wait a moment"
      />

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />

      <StateModal
        title="Delete IP Address?"
        subtitle="Are you sure you want to delete this IP Address?"
        isOpen={confirmationIsOpen}
        onClose={handleCloseConfirmation}
        type="default"
        titleButtonLeft="Cancel"
        titleButtonRight="Yes"
        leftAction={handleCloseConfirmation}
        rightAction={handleDeleteIpAddress}
      />
    </div>
  );
};

export default AddIntegration;
