import React, { useEffect } from "react";
import { useFetch } from "prezent/useFetch";
import { useParams } from "react-router-dom";
import HeaderSection from "../../../components/SimulationSection/DetailSimulation/HeaderSection";
import { GetSimulationDetail } from "../../../service/pointrulesmanagement/endpoint";
import moment from "moment";
import LoadingModal from "prezent/LoadingModal";
import CampaignDetailSection from "../../../components/Simulation/CampaignDetailSection";
import SampleTransactionForm from "../../../components/SimulationSection/DetailSimulation/SampleTransactionForm";

const DetailSimulation = ({ setTitleHeader, userInfo }) => {
  const { id } = useParams();
  const { data: simulationDetail, isLoading: detailIsLoading } = useFetch(
    GetSimulationDetail,
    "simulation-detail",
    [],
    id
  );

  useEffect(() => {
    setTitleHeader("Detail Sample Data");
  }, []);
  return (
    <div className="flex flex-col gap-4 py-6 px-8 mb-16">
      <HeaderSection
        name={`${simulationDetail?.data?.campaignDetail?.name} - ${moment(
          simulationDetail?.data?.campaignDetail?.startDate
        ).format("DD MMM YYYY HH:mm")} - ${moment(simulationDetail?.data?.campaignDetail?.endDate).format(
          "DD MMM YYYY HH:mm"
        )}`}
      />

      <CampaignDetailSection
        name={simulationDetail?.data?.campaignDetail?.name}
        description={simulationDetail?.data?.campaignDetail?.description}
        startDate={simulationDetail?.data?.campaignDetail?.startDate}
        endDate={simulationDetail?.data?.campaignDetail?.endDate}
        isPointActive={simulationDetail?.data?.campaignDetail?.isPointActive}
        pointProcessingMethod={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointProcessing}
        method={simulationDetail?.data?.campaignDetail?.campaignPointActive?.earningPointMethod}
        parameters={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointParameters}
        pointEarned={simulationDetail?.data?.campaignDetail?.campaignPointActive?.earningPointAll?.pointEarned}
        pointEarnedException={
          simulationDetail?.data?.campaignDetail?.campaignPointActive?.earningPointAll?.pointEarnedException
        }
        segmentedCustomers={simulationDetail?.data?.campaignDetail?.campaignPointActive?.earningPointSegmented}
        channels={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointEarnedNotification?.channels}
        isPointEarnedNotification={
          simulationDetail?.data?.campaignDetail?.campaignPointActive?.isPointEarnedNotification
        }
        isPointMultiplier={simulationDetail?.data?.campaignDetail?.campaignPointActive?.isPointMultiplied}
        pointExpiration={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointExpiration}
        senderName={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointEarnedNotification?.senderName}
        subject={simulationDetail?.data?.campaignDetail?.campaignPointActive?.pointEarnedNotification?.subject}
      />

      <SampleTransactionForm
        customerName={simulationDetail?.data?.customerName}
        email={simulationDetail?.data?.email}
        phoneNumber={simulationDetail?.data?.phoneNumber}
        tierLevel={simulationDetail?.data?.tierLevel}
        earningPointMethod={simulationDetail?.data?.earningPointMethod}
        parameters={simulationDetail?.data?.parameters}
        calculatedPoints={simulationDetail?.data?.point}
        isException={simulationDetail?.data?.isException}
        transactionDate={simulationDetail?.data?.transactionDate}
      />

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={detailIsLoading} onClose={() => {}} />
    </div>
  );
};

export default DetailSimulation;
