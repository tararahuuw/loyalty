import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import DropDownText from "../../DropDownText/DropDownText";
import moment from "moment";
import AddSimulationButton from "../../Simulation/AddSimulationButton";
import { useDisclosure } from "prezent/useDisclosure";
import AddBulkSimulationModal from "../../Simulation/AddBulkSimulationModal";

const CampaignDropDownSection = ({
  campaigns = [],
  selectedCampaignId,
  setSelectedCampaignId,
  setReRender,
  handleSetCampaignId,
}) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const navigate = useNavigate();
  const parentRef = useRef();
  const {
    isOpen: addBulkSimulationIsOpen,
    toggle: toggleAddBulkSimulation,
    close: closeBulkSimulation,
    open: openBulkSimulation,
  } = useDisclosure(false);

  const options = campaigns.map((campaign) => ({
    option: `${campaign.name} - ${moment(campaign.startDate).format("DD MMM YYYY HH:mm")} - ${moment(
      campaign.endDate
    ).format("DD MMM YYYY HH:mm")}`,
    value: campaign.id,
  }));

  const allowedRoles = [
    "Client Admin - Loyalty",
    "Client User - Loyalty",
    "Client WhatsApp - Loyalty",
    "Client Approval - Loyalty",
    "Client Loyalty",
  ];

  return (
    <div className="flex items-center justify-between p-4 text-sm bg-white rounded-md">
      <div className="flex items-center gap-1 flex-1">
        <span>Campaign Name</span>
        <span className="text-danger500">*</span>
        <span>:</span>
        <DropDownText
          title=""
          multiselect={false}
          className="max-w-xl"
          options={options}
          currentOption={[selectedCampaignId]}
          onSelect={(e) => setSelectedCampaignId(e.value)}
          placeholder="Select Campaign"
        />
      </div>

      {allowedRoles.includes(roleAccess) && (
        <AddSimulationButton
          addSingleHandler={() => navigate("/prezent/campaign/simulation/add")}
          addBulkHandler={toggleAddBulkSimulation}
        />
      )}

      <AddBulkSimulationModal
        isOpen={addBulkSimulationIsOpen}
        onClose={closeBulkSimulation}
        handlePopUpErrorFile={() => {}}
        onOpen={openBulkSimulation}
        reRender={() => setReRender((prevState) => !prevState)}
        campaigns={campaigns || []}
        campaignId={selectedCampaignId}
        handleSetCampaignId={handleSetCampaignId}
      />
    </div>
  );
};

export default CampaignDropDownSection;
