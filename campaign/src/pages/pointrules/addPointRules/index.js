import React, { useEffect, useState } from "react";
import { Footer } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import AddVoucherPointRules from "../../../components/AddVoucherPointRules";
import CampaignInformationSection from "../../../components/CampaignFormPage/CampaignInformationSection/CampaignInformationSection";
import CreatePointSection from "../../../components/CampaignFormPage/CreatePointSection/CreatePointSection";
import RewardsSection from "../../../components/CampaignFormPage/RewardsSection/RewardsSection";
import DraftModal from "../../../components/CampaignFormPage/DraftModal/DraftModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useNavigate } from "react-router-dom";
import { CreateCampaign, GetAllSenderId, GetAllTemplates } from "../../../service/pointrulesmanagement/endpoint";
import moment from "moment";
import ModalConfirmation from "../../../components/CampaignFormPage/ModalConfirmation/ModalConfirmation";
import { useFetch } from "prezent/useFetch";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import { GetVoucherList } from "../../../service/voucherManagement/endpoint";
import { GetTierLevels } from "../../../service/tierlevelmanagement/endpoint";
import { campaignValidation } from "../../../utils/campaignValidation";

const AddPointRules = ({ roleAccess, companyId, balance, setTitleHeader }) => {
  const navigate = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const { isOpen: draftModalIsOpen, toggle: toggleDraftModal } = useDisclosure();
  const { isOpen: confirmationmodalIsOpen, toggle: toggleConfirmationModal } = useDisclosure();
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const {
    data: vouchers,
    refetch,
    isLoading,
  } = useFetch(GetVoucherList, "voucher-list", [], { companyId, isCampaign: true });
  const { data: tierLevels } = useFetch(GetTierLevels, "tier-levels", [], {});
  const { data: templates } = useFetch(GetAllTemplates, "templates", [], companyId);
  const { data: senderIds } = useFetch(GetAllSenderId, "senderIds", [], companyId);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1500);
    }, 250);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      isPointActive: false,
      rewardUtilizationMethod: "",
      isDraft: false,
      rewards: [],

      // Create Point
      pointEarned: 0,
      pointEarnedException: 0,
      method: "all",
      segmentedCustomer: [{ pointEarned: 0, pointEarnedException: 0, tierLevelId: "" }],

      isPointMultiplier: false,
      isPointEarnedNotification: false,

      // Notification object
      channels: [],
      emailTemplate: "",
      senderID: "",
      smsTemplate: "",
      subject: "",
      templateLanguage: "",
      whatsappTemplate: "",

      pointExpiration: "",
      pointParameters: [{ exception: "", id: "", value: "" }],
      pointProcessingMethod: "",

      // Rewards
      recipients: [],
      rewardAssignmentMethod: "random",
      channels2: [],
      emailTemplate2: "",
      senderID2: "",
      smsTemplate2: "",
      subject2: "",
      templateLanguage2: "",
      whatsappTemplate2: "",
    },
    validationSchema: campaignValidation,
    onSubmit: (values) => {
      const downloadedRewards = values.rewards.filter((reward) => reward.quantity > 0);
      const totalDownloadedRewardsQuantity = downloadedRewards.reduce((sum, reward) => sum + reward.quantity, 0);

      if (values.rewardUtilizationMethod === "download" && !totalDownloadedRewardsQuantity) {
        formik.setFieldError("rewards", "Please input download qty to continue.");
      } else {
        toggleDraftModal();
      }
    },
  });

  const payload = {
    campaignPointActive: {
      earningPointMethod: {
        allCustomer: {
          pointEarned: formik.values.pointEarned,
          pointEarnedException: formik.values.pointEarnedException,
        },
        method: formik.values.method,
        segmentedCustomer: formik.values.segmentedCustomer,
      },
      isPointMultiplier: formik.values.isPointMultiplier,
      isPointEarnedNotification: formik.values.isPointEarnedNotification,
      pointEarnedNotification: {
        channels: formik.values.channels,
        emailTemplate: formik.values.emailTemplate,
        senderId: formik.values.senderID,
        smsTemplate: formik.values.smsTemplate,
        subject: formik.values.subject,
        templateLanguage: formik.values.templateLanguage,
        whatsappTemplate: formik.values.whatsappTemplate,
      },
      pointExpiration: formik.values.pointExpiration ? moment(formik.values.pointExpiration).format("YYYY-MM-DD") : "",
      pointParameters: formik.values.pointParameters,
      pointProcessingMethod: formik.values.pointProcessingMethod,
    },
    campaignPointInactive: {
      recipients: formik.values.recipients,
      rewardAssignmentMethod: formik.values.rewardAssignmentMethod,
      rewardDistributionNotification: {
        channels: formik.values.channels2,
        emailTemplate: formik.values.emailTemplate2,
        senderId: formik.values.senderID2,
        smsTemplate: formik.values.smsTemplate2,
        subject: formik.values.subject2,
        templateLanguage: formik.values.templateLanguage2,
        whatsappTemplate: formik.values.whatsappTemplate2,
      },
    },
    description: formik.values.description,
    endDate: moment(formik.values.endDate).format("DD-MM-YYYY HH:mm"),
    isDraft: formik.values.isDraft,
    isPointActive: formik.values.isPointActive,
    name: formik.values.name,
    rewardUtilizationMethod: formik.values.rewardUtilizationMethod,
    rewards:
      formik.values.rewardUtilizationMethod === "download"
        ? formik.values.rewards.filter((r) => r.quantity && r.quantity > 0)
        : vouchers?.data?.map((reward) => ({ catalogId: reward.id, type: reward.type, quantity: reward.ownedQty })),
    startDate: moment(formik.values.startDate).format("DD-MM-YYYY HH:mm"),
  };

  const handleCreateCampaign = async (form) => {
    try {
      openLoading();
      await CreateCampaign(form);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Campaign has been successfully saved.");
        setTimeout(() => {
          navigate("/prezent/campaign");
        }, 1500);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to create campaign at the moment. Please try again");
    }
  };

  const handleCreateDraftCampaign = () => {
    toggleConfirmationModal();
    handleCreateCampaign({ ...payload, isDraft: true });
  };

  useEffect(() => {
    if (formik.values.pointProcessingMethod === "upload point") {
      formik.setFieldValue("rewardUtilizationMethod", "pwa");
    }
  }, [formik.values.pointProcessingMethod]);

  useEffect(() => {
    if (senderIds?.data?.length === 1) {
      formik.setFieldValue("senderID", senderIds.data[0].id);
      formik.setFieldValue("senderID2", senderIds.data[0].id);
    }
  }, [senderIds?.data?.length]);

  useEffect(() => {
    setTitleHeader("Campaign");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="flex flex-col gap-6 p-8">
          <CampaignInformationSection formik={formik} />

          <CreatePointSection
            formik={formik}
            tierLevels={tierLevels?.data}
            companyId={companyId}
            templates={templates?.data}
            senderIds={senderIds?.data}
          />

          <RewardsSection
            allRewards={vouchers?.data}
            initialRewards={vouchers?.data}
            formik={formik}
            companyId={companyId}
            balance={balance}
            createPointIsChecked={formik.values.isPointActive}
            pointProcessing={formik.values.pointProcessingMethod}
            openLoading={openLoading}
            closeLoading={closeLoading}
            refetchVouchers={refetch}
            templates={templates?.data}
            senderIds={senderIds?.data}
            handleOpenModalResult={handleOpenModalResult}
          />
        </div>

        <DraftModal
          formik={formik}
          isOpen={draftModalIsOpen}
          onClose={toggleDraftModal}
          onClickCancel={toggleDraftModal}
          rewards={
            formik.values.rewardUtilizationMethod !== "download"
              ? vouchers?.data?.map((reward) => ({
                  id: reward.id,
                  name: reward.name,
                  type: reward.type,
                  price: reward.price,
                  pointNeeded: reward.pointNeeded,
                  ownedQuantity: reward.ownedQty,
                }))
              : formik.values.rewards
          }
          tiers={tierLevels?.data}
          senderIds={senderIds?.data}
          onClickSubmit={() => handleCreateCampaign(payload)}
        />

        <Footer
          titleLeftButton="Cancel"
          titleRightButton="Submit"
          modeLeftButton="outline"
          modeRightButton="primary"
          isActiveLeftButton={true}
          isActiveRightButton={true}
          onClickLeftButton={toggleConfirmationModal}
          onClickRightButton={formik.handleSubmit}
        />

        <ModalConfirmation
          isOpen={confirmationmodalIsOpen}
          onClick={handleCreateDraftCampaign}
          onClose={toggleConfirmationModal}
          onDiscard={() => navigate("/prezent/campaign")}
        />

        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingIsOpen || isLoading}
          onClose={() => {}}
        />

        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
      </div>
    </>
  );
};

export default AddPointRules;
