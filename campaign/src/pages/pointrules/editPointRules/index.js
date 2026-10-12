import React, { useEffect, useState } from "react";
import { Footer } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import AddVoucherPointRules from "../../../components/AddVoucherPointRules";
import CampaignInformationSection from "../../../components/CampaignFormPage/CampaignInformationSection/CampaignInformationSection";
import CreatePointSection from "../../../components/CampaignFormPage/CreatePointSection/CreatePointSection";
import RewardsSection from "../../../components/CampaignFormPage/RewardsSection/RewardsSection";
import DraftModal from "../../../components/CampaignFormPage/DraftModal/DraftModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import { useNavigate, useParams } from "react-router-dom";
import {
  EditCampaign,
  GetAllSenderId,
  GetAllTemplates,
  GetCampaignRewards,
  GetDetailCampaign,
} from "../../../service/pointrulesmanagement/endpoint";
import moment from "moment";
import ModalConfirmation from "../../../components/CampaignFormPage/ModalConfirmation/ModalConfirmation";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import { GetVoucherList } from "../../../service/voucherManagement/endpoint";
import { GetTierLevels } from "../../../service/tierlevelmanagement/endpoint";
import { campaignValidation } from "../../../utils/campaignValidation";

const EditPointRules = ({ roleAccess, companyId, balance, setTitleHeader }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [initialRewards, setInitialRewards] = useState([]);
  const { isOpen: draftModalIsOpen, toggle: toggleDraftModal } = useDisclosure();
  const { isOpen: confirmationmodalIsOpen, toggle: toggleConfirmationModal } = useDisclosure();
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const { data: tierLevels } = useFetch(GetTierLevels, "tier-levels", [], {});
  const { data: campaign, isLoading } = useFetch(GetDetailCampaign, "detail-campaign", [], id);
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
    enableReinitialize: true,
    initialValues: {
      name: campaign?.data?.name || "",
      description: campaign?.data?.description || "",
      startDate: campaign?.data?.startDate || "",
      endDate: campaign?.data?.endDate || "",
      isPointActive: campaign?.data?.isPointActive || false,
      rewardUtilizationMethod: campaign?.data?.rewardUtilizationMethod || "",
      isDraft: campaign?.data?.isDraft || false,
      rewards: campaign?.data?.rewards || [],

      // Create Point
      pointEarned: campaign?.data?.campaignPointActive?.earningPointAll?.pointEarned || 0,
      pointEarnedException: campaign?.data?.campaignPointActive?.earningPointAll?.pointEarnedException || 0,
      method: campaign?.data?.campaignPointActive?.earningPointMethod || "all",
      segmentedCustomer: campaign?.data?.campaignPointActive?.earningPointSegmented || [
        { pointEarned: 0, pointEarnedException: 0, tierLevelId: "" },
      ],

      isPointMultiplier: campaign?.data?.campaignPointActive?.isPointMultiplied || false,
      isPointEarnedNotification: campaign?.data?.campaignPointActive?.isPointEarnedNotification || false,

      // Notification object
      channels: campaign?.data?.campaignPointActive?.pointEarnedNotification?.channels || [],
      emailTemplate: campaign?.data?.campaignPointActive?.pointEarnedNotification?.emailTemplate || "",
      senderID: campaign?.data?.campaignPointActive?.pointEarnedNotification?.senderId || "",
      smsTemplate: campaign?.data?.campaignPointActive?.pointEarnedNotification?.smsTemplate || "",
      subject: campaign?.data?.campaignPointActive?.pointEarnedNotification?.subject || "",
      templateLanguage: campaign?.data?.campaignPointActive?.pointEarnedNotification?.templateLanguage || "",
      whatsappTemplate: campaign?.data?.campaignPointActive?.pointEarnedNotification?.whatsappTemplate || "",

      pointExpiration: campaign?.data?.campaignPointActive?.pointExpiration || "",
      pointParameters: [],
      pointProcessingMethod: campaign?.data?.campaignPointActive?.pointProcessing || "",

      // Rewards
      recipients:
        campaign?.data?.campaignPointInactive?.recipients?.map((val) => ({
          ...val,
          distribution: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.channels,
        })) || [],
      rewardAssignmentMethod: campaign?.data?.campaignPointInactive?.rewardAssignmentMethod || "random",
      channels2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.channels || [],
      emailTemplate2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.emailTemplate || "",
      senderID2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.senderId || "",
      smsTemplate2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.smsTemplate || "",
      subject2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.subject || "",
      templateLanguage2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.templateLanguage || "",
      whatsappTemplate2: campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.whatsappTemplate || "",
    },
    validationSchema: campaignValidation,
    validateOnChange: true,
    validateOnBlur: true,
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

  const {
    data: vouchers,
    isLoading: rewardIsLoading,
    refetch,
  } = useFetch(GetVoucherList, "voucher-list", [campaign], { companyId, isCampaign: true });

  const { data: downloadedVouchers } = useFetch(
    campaign?.data?.rewardUtilizationMethod === "download" && GetCampaignRewards,
    "campaign-rewards",
    [campaign],
    { id, companyId }
  );

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

  const handleEditCampaign = async (form) => {
    try {
      openLoading();
      await EditCampaign(id, form);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Campaign has been successfully saved.");
        setTimeout(() => {
          navigate("/prezent/campaign");
        }, 1500);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to edit campaign at the moment. Please try again");
    }
  };

  const handleCreateDraftCampaign = () => {
    toggleConfirmationModal();
    handleEditCampaign({ ...payload, isDraft: true });
  };

  useEffect(() => {
    if (formik.values.pointProcessingMethod === "upload point") {
      if (campaign?.data?.rewardUtilizationMethod) {
        formik.setFieldValue(
          "rewardUtilizationMethod",
          campaign.data.rewardUtilizationMethod === "api" ? "pwa" : campaign.data.rewardUtilizationMethod
        );
      } else if (formik.values.rewardUtilizationMethod === "api") {
        formik.setFieldValue("rewardUtilizationMethod", "pwa");
      }
    }
  }, [
    formik.values.pointProcessingMethod,
    formik.values.rewardUtilizationMethod,
    campaign?.data?.rewardUtilizationMethod,
  ]);

  useEffect(() => {
    if (!campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.senderId) {
      if (senderIds?.data?.length === 1) {
        formik.setFieldValue("senderID2", senderIds.data[0].id);
      }
    }

    if (!campaign?.data?.campaignPointActive?.pointEarnedNotification?.senderId) {
      if (senderIds?.data?.length === 1) {
        formik.setFieldValue("senderID", senderIds.data[0].id);
      }
    }
  }, [campaign?.data, senderIds?.data?.length]);

  useEffect(() => {
    if (vouchers?.data?.length) {
      if (campaign?.data?.rewardUtilizationMethod !== "download") {
        const updatedRewards = vouchers.data.map((reward) => {
          const matchingRecipients = campaign?.data?.campaignPointInactive?.recipients?.filter(
            (r) => r.rewardId === reward.id
          );

          const totalQuantityUsed = matchingRecipients?.reduce((sum, r) => sum + (r.quantity || 0), 0);

          return {
            ...reward,
            actualOwnedQty: reward.ownedQty,
            ownedQuantity: Math.max(0, (reward.ownedQty ?? 0) - totalQuantityUsed),
          };
        });

        setInitialRewards(updatedRewards);
      } else {
        // ✅ Always map all rewards, even if no downloaded rewards exist
        const mergedRewards = vouchers.data.map((reward) => {
          const downloaded = downloadedVouchers?.data?.find((d) => d.id === reward.id);
          return {
            ...reward,
            quantity: downloaded ? downloaded.quantity : 0,
          };
        });

        setInitialRewards(mergedRewards);
      }
    }
  }, [
    vouchers,
    campaign?.data?.rewardUtilizationMethod,
    campaign?.data?.campaignPointInactive?.recipients,
    downloadedVouchers,
  ]);

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
            companyId={companyId}
            tierLevels={tierLevels?.data}
            templates={templates?.data}
            senderIds={senderIds?.data}
            existingParameters={campaign?.data?.campaignPointActive?.pointParameters}
            existingChannels={campaign?.data?.campaignPointActive?.pointEarnedNotification?.channels}
          />

          <RewardsSection
            allRewards={vouchers?.data}
            formik={formik}
            companyId={companyId}
            balance={balance}
            createPointIsChecked={formik.values.isPointActive}
            pointProcessing={formik.values.pointProcessingMethod}
            existingChannels={campaign?.data?.campaignPointInactive?.rewardDistributionNotification?.channels}
            existingRecipients={campaign?.data?.campaignPointInactive?.recipients}
            existingRewardUtil={campaign?.data?.rewardUtilizationMethod}
            initialRewards={initialRewards}
            rewards={formik.values.rewards}
            closeLoading={closeLoading}
            openLoading={openLoading}
            refetchVouchers={refetch}
            handleOpenModalResult={handleOpenModalResult}
            templates={templates?.data}
            senderIds={senderIds?.data}
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
          onClickSubmit={() => handleEditCampaign(payload)}
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
          isOpen={isLoading || rewardIsLoading || loadingIsOpen}
          onClose={() => {}}
        />

        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
      </div>
    </>
  );
};

export default EditPointRules;
