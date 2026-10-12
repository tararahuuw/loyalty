import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "sprint-asia-custom-component";
import CampaignInformationSection from "../../../components/CampaignDetailPage/CampaignInformationSection";
import CreatePointSection from "../../../components/CampaignDetailPage/CreatePointSection/CreatePointSection";
import RewardsSection from "../../../components/CampaignDetailPage/RewardsSection/RewardsSection";
import ApproveCampaignSection from "../../../components/CampaignDetailPage/ApproveCampaignSection";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import ModalRejectCampaign from "../../../components/CampaignDetailPage/ModalRejectCampaign";
import {
  ChangeCampaignStatus,
  GetAllTemplates,
  GetCampaignRewards,
  GetDetailCampaign,
} from "../../../service/pointrulesmanagement/endpoint";
import { useFormik } from "formik";
import * as yup from "yup";

import { NotePencilIcon } from "@phosphor-icons/react";
import { GetVoucherList } from "../../../service/voucherManagement/endpoint";
import RejectedReasonSection from "../../../components/CampaignDetailPage/RejectedReasonSection";
import ScheduledSection from "../../../components/CampaignDetailPage/ScheduledSection";
import { GetTierLevels } from "../../../service/tierlevelmanagement/endpoint";
import ResultModal from "prezent/ResultModal";
import LoadingModal from "prezent/LoadingModal";

const DetailPointRules = ({ setTitleHeader, companyId }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const { id } = useParams();
  const navigate = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [initialRewards, setInitialRewards] = useState([]);
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const { isOpen: rejectFormIsOpen, close: closeRejectForm, toggle: toggleRejectForm } = useDisclosure();
  const { data, isLoading } = useFetch(GetDetailCampaign, "detail-campaign", [], id);
  const { data: tierLevels } = useFetch(GetTierLevels, "tier-levels", [], {});
  const { data: templates } = useFetch(GetAllTemplates, "templates", [], companyId);

  const { data: vouchers, isLoading: rewardIsLoading } = useFetch(GetVoucherList, "voucher-list", [data], {
    companyId,
    isCampaign: true,
  });

  const { data: downloadedVouchers } = useFetch(
    data?.data?.rewardUtilizationMethod === "download" && GetCampaignRewards,
    "campaign-rewards",
    [data],
    { id, companyId }
  );

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
      reason: "",
    },
    validationSchema: yup.object().shape({
      reason: yup.string().required("Reason is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      handleChangeStatus({ ...values, status: "rejected" });
    },
  });

  const handleChangeStatus = async (form) => {
    try {
      closeRejectForm();
      openLoading();
      await ChangeCampaignStatus(id, form);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          `Campaign has been successfully ${form.status === "rejected" ? "Rejected" : "Approved"}.`
        );
        setTimeout(() => {
          navigate("/prezent/campaign");
        }, 1500);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult(
        "failed",
        `Failed to ${form.status === "rejected" ? "reject" : "approve"} campaign. Please try again.`
      );
    }
  };

  useEffect(() => {
    if (vouchers?.data?.length) {
      if (data?.data?.rewardUtilizationMethod !== "download") {
        const updatedRewards = vouchers.data.map((reward) => {
          return {
            ...reward,
            ownedQuantity: reward.ownedQty,
          };
        });

        setInitialRewards(updatedRewards);
      } else {
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
    data?.data?.rewardUtilizationMethod,
    data?.data?.campaignPointInactive?.recipients,
    downloadedVouchers,
  ]);

  const allowedRoles = [
    "Client Admin - Loyalty",
    "Client User - Loyalty",
    "Client WhatsApp - Loyalty",
    "Client Approval - Loyalty",
    "Client Loyalty",
  ];

  useEffect(() => {
    setTitleHeader("Detail Campaign");
  }, []);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-neutral20">
      <div className="flex flex-col gap-4 py-6 px-8 mb-16">
        {data?.data?.status === "submit" && allowedRoles.includes(roleAccess) && (
          <ApproveCampaignSection onApprove={handleChangeStatus} onReject={toggleRejectForm} />
        )}
        {data?.data?.status === "rejected" && <RejectedReasonSection reason={data?.data?.reason} />}

        {(data?.data?.status === "active" || data?.data?.status === "scheduled") && <ScheduledSection />}

        <CampaignInformationSection
          name={data?.data?.name}
          endDate={data?.data?.endDate}
          startDate={data?.data?.startDate}
          description={data?.data?.description}
        />
        <CreatePointSection data={data?.data} tiers={tierLevels?.data} templates={templates?.data} />
        <RewardsSection
          data={data?.data}
          rewardUtilizationMethod={data?.data?.rewardUtilizationMethod}
          rewards={initialRewards}
          templates={templates?.data}
        />
      </div>

      <ModalRejectCampaign
        formik={formik}
        isOpen={rejectFormIsOpen}
        onClose={toggleRejectForm}
        onClick={formik.handleSubmit}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={isLoading || loadingIsOpen || rewardIsLoading}
        onClose={() => {}}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Back"
        titleRightButton={
          <div className="flex items-center gap-2">
            <NotePencilIcon />
            <p>Edit</p>
          </div>
        }
        isActiveLeftButton
        isActiveRightButton={data?.data?.status === "draft" || data?.data?.status === "rejected"}
        onClickLeftButton={() => navigate("/prezent/campaign")}
        onClickRightButton={() => navigate(`/prezent/campaign/edit/${id}`)}
      />
    </div>
  );
};

export default DetailPointRules;
