import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Footer, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { ApproveIpAddress, GetAllIpAddress, GetIntegrationById } from "../../../service/settingmanagement/endpoint";
import StatusSection from "../../../components/DetailIntegration/StatusSection/StatusSection";
import ClientSection from "../../../components/DetailIntegration/ClientSection/ClientSection";
import InformationSection from "../../../components/DetailIntegration/InformationSection/InformationSection";

const DetailIntegration = ({ roleAccess, setTitleHeader, integrationId, clientId, divisionId }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [ipAddresses, setIpAddresses] = useState([]);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [divisionIdFromIntegration, setDivisionIdFromIntegration] = useState("");

  const { data } = useFetch(GetIntegrationById, "integration", [], { roleAccess, integrationId: id || integrationId });

  useEffect(() => {
    if (data?.data?.division_id) {
      setDivisionIdFromIntegration(data.data.division_id);
    }
  }, [data]);

  const { data: integrationAddresses, refetch } = useFetch(
    GetAllIpAddress,
    "ipAddresses",
    [],
    divisionIdFromIntegration
      ? {
        roleAccess,
        integrationId: id || integrationId,
        clientId: clientId,
        divisionId: divisionIdFromIntegration,
      }
      : null 
  );

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  };

  const navigateToEditIntegration = () => {
    navigateTo(`/prezent/setting/integration/edit/${id || integrationId}`);
  };

  const navigateToDashboardIntegration = () => {
    navigateTo("/prezent/setting/integration");
  };

  const approveOrRejectIpAddress = async (data) => {
    try {
      toggleLoadingModal();
      const response = await ApproveIpAddress(roleAccess, data);
      if (response.code === 200) {
        refetch();
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", `Integration has been successfully ${data.status.toLowerCase()}`);
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        `Sorry, we are unable to ${data.status === "Approved" ? "approve" : "reject"
        } integration at the moment. Please try again`
      );
    }
  };

  useEffect(() => {
    if (integrationAddresses?.data?.length) {
      const transformedArray = integrationAddresses.data.map((item) => ({
        id: item.id,
        ipAddress: item.ip_address,
        status: item.status,
        reason: item.reason,
      }));
      setIpAddresses(transformedArray);
    } else {
      setIpAddresses([]);
    }
  }, [integrationAddresses?.data]);

  useEffect(() => {
    setTitleHeader("Detail Integration");
  }, []);
  return (
    <>
      <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
        <StatusSection status={data?.data?.status ? "Active" : "Inactive"} />

        {roleAccess !== "Client Support" && (
          <ClientSection client={data?.data?.clientName} division={data?.data?.divisionName} roleAccess={roleAccess} />
        )}

        <InformationSection
          ipAddresses={ipAddresses}
          url={data?.data?.url_callback}
          description={data?.data?.description}
          roleAccess={roleAccess}
          onClickHandler={approveOrRejectIpAddress}
        />
      </div>

      <Footer
        modeLeftButton="primary"
        modeRightButton="outline"
        titleLeftButton="Cancel"
        titleRightButton="Edit"
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={navigateToDashboardIntegration}
        onClickRightButton={navigateToEditIntegration}
      />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default DetailIntegration;
