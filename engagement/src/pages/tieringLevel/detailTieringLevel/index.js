import React, { useEffect, useState } from "react";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { useNavigate, useParams } from "react-router-dom";
import { DeleteTierLevel, GetTierLevelById } from "../../../service/TieringManagement/endpoint/tieringLevel";
import TierInformationSection from "../../../components/TieringLevel/DetailPage/TierInformationSection";
import TierDetailSection from "../../../components/TieringLevel/DetailPage/TierDetailSection";
import TierBenefitSection from "../../../components/TieringLevel/DetailPage/TierBenefitSection";
import TierIconSection from "../../../components/TieringLevel/DetailPage/TierIconSection";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const DetailTieringLevel = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: isLoading, toggle: toggleIsLoading } = useDisclosure(false);
  const { data: tierLevel, isLoading: tierLevelIsLoading } = useFetch(GetTierLevelById, "tier-level", [], id);

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

  const handleDeleteTierLevel = async () => {
    try {
      closeDeleteModal();
      toggleIsLoading();
      await DeleteTierLevel(id);
      handleOpenModalResult("success", "Tier level has been successfully deleted.");
      toggleIsLoading();
      setTimeout(() => {
        navigate("/prezent/engagement/tier-level");
      }, 3500);
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to delete tier level at the moment. Please try again");
      toggleIsLoading();
    }
  };

  useEffect(() => {
    setTitleHeader("Detail Tier Level");
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-7 bg-neutral20 mt-8 px-8 mb-16">
        <TierInformationSection
          name={tierLevel?.data?.name}
          level={tierLevel?.data?.level}
          client={tierLevel?.data?.clientName}
          division={tierLevel?.data?.divisionName}
          roleAccess={roleAccess}
        />

        <TierDetailSection
          level={tierLevel?.data?.level}
          isDownGrade={tierLevel?.data?.isTierDownGrade}
          seasonPeriod={tierLevel?.data?.seasonPeriod}
          amountTransaction={tierLevel?.data?.targetAmount}
        />

        <TierBenefitSection description={tierLevel?.data?.description} />

        <TierIconSection icon={tierLevel?.data?.iconFile} level={tierLevel?.data?.level} />
      </div>

      <StateModal
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete the tier: ${tierLevel?.data?.name}? This action cannot be undone.`}
        isOpen={deleteModalIsOpen}
        onClose={closeDeleteModal}
        type="danger"
        titleButtonRight="Delete"
        leftAction={closeDeleteModal}
        rightAction={handleDeleteTierLevel}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={tierLevelIsLoading || isLoading}
        onClose={() => {}}
      />
    </div>
  );
};

export default DetailTieringLevel;