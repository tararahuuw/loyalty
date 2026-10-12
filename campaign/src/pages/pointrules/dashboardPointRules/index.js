import React, { useEffect, useState, useRef, useCallback } from "react";

import moment from "moment";
import { useNavigate } from "react-router-dom";
import { PrimaryButton, Chip, TabBar, OutlineButton } from "sprint-asia-custom-component";
import { PiArrowRight } from "react-icons/pi";
import { DotsThreeVerticalIcon, DownloadSimpleIcon } from "@phosphor-icons/react";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import {
  ChangeCampaignStatus,
  DeleteCampaign,
  DownloadCampaign,
  DownloadRewards,
  GetCampaignsPagination,
} from "../../../service/pointrulesmanagement/endpoint";
import StatusConfirmationModal from "../../../components/StatusConfirmationModal/StatusConfirmationModal";
import SearchDropDown from "prezent/SearchDropDown";
import FilterDropDown from "prezent/FilterDropDown";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const CampaignSection = ({ companyId, setTitleHeader }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: confirmationmodalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const [currentTab, setCurrentTab] = useState("campaign");
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [], ids: [], parameterNames: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Campaign Name",
    value: "campaignName",
  });
  const [campaigns, setCampaigns] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);

  const open = Boolean(menuPosition);

  const handleOpen = useCallback((event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top;

    if (spaceBelow < menuHeight && spaceAbove > menuHeight) {
      top = rect.top - menuHeight;
    } else {
      top = rect.bottom;
    }

    setMenuPosition({
      top,
      left: rect.left - 150,
    });

    setSelectedRow(row);
    event.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    setMenuPosition(null);
    setSelectedRow(null);
  }, []);

  const dataOptions = [
    {
      option: "Campaign Name",
      value: "campaignName",
    },
  ];

  const dataStatus = [
    { option: "Active", value: "active" },
    { option: "Waiting for Approval", value: "submit" },
    { option: "Rejected", value: "rejected" },
    { option: "Scheduled", value: "scheduled" },
    { option: "Inactive", value: "inactive" },
    { option: "Draft", value: "draft" },
    { option: "Expired", value: "expired" },
  ];

  const allowedRoles = [
    "Client Admin - Loyalty",
    "Client User - Loyalty",
    "Client WhatsApp - Loyalty",
    "Client Approval - Loyalty",
    "Client Loyalty",
  ];

  const navigate = useNavigate();

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1000);
    }, 250);
  };

  const handleNavigateToAddPointRules = () => {
    navigate("/prezent/campaign/add");
  };

  const handleNavigateToDetailPointRules = (data) => {
    navigate(`/prezent/campaign/${data}`);
  };

  const handleDeleteCampaign = async () => {
    try {
      toggleLoadingModal();
      toggleDeleteModal();
      await DeleteCampaign(selectedRow?.id);
      setSelectedRow(null);
      setReRender(!reRender);
      toggleLoadingModal();
      handleOpenModalResult("success", "Campaign has been successfully deleted.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Campaign has been failed deleted.");
      setSelectedRow(null);
    }
  };

  const columns = [
    {
      header: "CAMPAIGN ID",
      assessor: "campaignId",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.id || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "CAMPAIGN Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.name}</p>
          </div>
        );
      },
    },
    {
      header: "PARAMETER",
      assessor: "parameter",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">
              {(row.parameters.length && row.parameters[0].settingParameterName) || "-"}
            </p>
            <p className="text-neutral300 text-xs">
              {row.parameters.length > 1 ? `See more (${row.parameters.length - 1})` : ""}
            </p>
          </div>
        );
      },
    },
    {
      header: "CAMPAIGN PERIOD",
      assessor: "campaignPeriod",
      Cell: (row) => {
        return (
          <div>
            <div className="flex items-center">
              <p className="text-sm mr-1">{moment(row.startDate).format("DD MMM YYYY HH:mm")}</p>
              <PiArrowRight />
            </div>
            <p className="text-sm">{moment(row.endDate).format("DD MMM YYYY HH:mm")}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      tdStyle: { textAlign: "center" },
      Cell: (row) => {
        return (
          <div className="flex w-full justify-center">
            <div>
              <Chip
                title={
                  row.status === "submit"
                    ? "Waiting for Approval"
                    : row.status.charAt(0).toUpperCase() + row.status.slice(1)
                }
                type={
                  row.status === "active"
                    ? "success"
                    : row.status === "inactive"
                      ? "warning"
                      : row.status == "submit"
                        ? "primary"
                        : row.status == "rejected"
                          ? "danger"
                          : row.status === "scheduled"
                            ? "primary"
                            : "neutral"
                }
              />
            </div>
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row) => (
        <>
          <button
            onClick={(e) => handleOpen(e, row)}
            className="p-2 hover:bg-neutral20 rounded-full"
            disabled={row.status === "expired"}
          >
            <DotsThreeVerticalIcon size={24} />
          </button>

          {open && selectedRow?.id === row.id && (
            <>
              <div className="top-0 right-0 left-0 bottom-0 fixed z-40" onClick={handleClose} />
              <div
                ref={menuRef}
                className="fixed z-50 bg-white border border-neutral40 rounded-md shadow-md flex flex-col p-2 w-44"
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
              >
                {row.rewardUtilizationMethod === "download" &&
                  allowedRoles.includes(roleAccess) &&
                  (row.status === "scheduled" || row.status === "active") && (
                    <a
                      className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                      onClick={handleDownloadRewards}
                    >
                      Download Reward
                    </a>
                  )}
                {row.isPointActive && row.status !== "draft" && row.status !== "expired" && (
                  <a
                    className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                    onClick={() => navigate(`/prezent/campaign/simulation/${row.id}`)}
                  >
                    Simulation
                  </a>
                )}
                {(row.status === "inactive" || row.status === "active" || row.status === "scheduled") && (
                  <a
                    className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md whitespace-nowrap"
                    onClick={toggleConfirmationModal}
                  >
                    {row.status === "active" || row.status === "scheduled" ? "Deactivate" : "Activate"}
                  </a>
                )}
                {(row.status === "draft" || row.status === "rejected") && (
                  <a
                    className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                    onClick={() => navigate(`/prezent/campaign/edit/${row.id}`)}
                  >
                    Edit
                  </a>
                )}
                {row.status !== "scheduled" && row.status !== "active" && (
                  <a
                    className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md text-danger500"
                    onClick={toggleDeleteModal}
                  >
                    Delete
                  </a>
                )}
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
  };

  const handleChangeStatus = async (status) => {
    try {
      toggleConfirmationModal();
      toggleLoadingModal();
      await ChangeCampaignStatus(selectedRow.id, { status });
      setReRender(!reRender);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          status === "active"
            ? "Campaign has been successfully activated. Customers will have access to receive benefits from this campaign."
            : "Campaign has been successfully deactivated. Customers no longer have access to or receive benefits from this campaign.",
        );
      }, 250);
      setSelectedRow(null);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        status === "active"
          ? "Failed to activate campaign. Please try again."
          : "Failed to deactivate campaign. Please try again.",
      );
      setSelectedRow(null);
    }
  };

  const handleDownloadRewards = async () => {
    try {
      toggleLoadingModal();

      const response = await DownloadRewards(selectedRow.id); // ArrayBuffer

      // Step 1: Create a Blob with the correct MIME type
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Step 2: Create object URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rewards.xlsx";
      document.body.appendChild(link);
      link.click();

      // Step 3: Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      handleOpenModalResult("success", "Rewards have been successfully downloaded.");
    } catch (error) {
      console.error("Download error:", error);
      handleOpenModalResult("failed", "Failed to download rewards. Please try again.");
    } finally {
      toggleLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleDownloadCampaign = async () => {
    try {
      toggleLoadingModal();
      const response = await DownloadCampaign({
        params: { companyId, name: dataSearch },
        body: { status: dataFilter.status },
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `all_campaign-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleLoadingModal();
      handleOpenModalResult("success", `Campaign data downloaded successfully.`);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", `Failed to download Campaign data. Please try again.`);
    }
  };

  useEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuHeight(rect.height);
    }
  }, [open, selectedRow]);

  useEffect(() => {
    setTitleHeader("Campaign");
  }, []);
  return (
    <div>
      <TabBar
        dataBar={["All Campaign", "Simulation"]}
        dataValue={["campaign", "simulation"]}
        currentTab={currentTab}
        onChangeTabBar={(tab) => {
          setCurrentTab(tab);
          if (tab === "campaign") {
            navigate("/prezent/campaign");
          } else if (tab === "simulation") {
            navigate("/prezent/campaign/simulation");
          }
        }}
      />
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex gap-2 items-center">
              <SearchDropDown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                filterSearch={dataSearch}
                onEnterPress={setDataSearch}
              />
              <div>
                <FilterDropDown
                  options={[
                    {
                      menu: "Status",
                      parameter: "status",
                      submenu: dataStatus,
                      type: "radiobutton",
                    },
                  ]}
                  dataFilterResult={dataFilter}
                  setDataFilterResult={setSelectedFilterOptions}
                />
              </div>
              <OutlineButton
                title={
                  <div className="flex items-center gap-1">
                    <DownloadSimpleIcon />
                    <p>Download</p>
                  </div>
                }
                isActive={campaigns?.data?.length || false}
                onClick={handleDownloadCampaign}
              />
            </div>

            {allowedRoles.includes(roleAccess) && (
              <PrimaryButton title="+ Add Campaign" onClick={handleNavigateToAddPointRules} />
            )}
          </div>
          <div className="drop-shadow h-full">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetCampaignsPagination}
              queryName="campaigns"
              dependencies={[dataFilter.value, dataSearch, dataFilter]}
              params={{ name: dataSearch, companyId, body: dataFilter }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(id) => handleNavigateToDetailPointRules(id)}
              getResponse={setCampaigns}
              loadingIndicator={loadingModalIsOpen}
            />
          </div>
        </div>

        <StatusConfirmationModal
          isOpen={confirmationmodalIsOpen}
          onClick={handleChangeStatus}
          onClose={() => {
            toggleConfirmationModal();
            handleClose();
          }}
          status={selectedRow?.status}
          startDate={selectedRow?.startDate}
        />

        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />

        <StateModal
          title="Confirm Deletion"
          subtitle={`Are you sure you want to delete the campaign: ${
            selectedRow?.name || "-"
          }? This action cannot be undone.`}
          isOpen={deleteModalIsOpen}
          onClose={() => {
            toggleDeleteModal();
            handleClose();
          }}
          type="danger"
          titleButtonRight="Delete"
          leftAction={() => {
            toggleDeleteModal();
            handleClose();
          }}
          rightAction={handleDeleteCampaign}
        />
      </div>
    </div>
  );
};

export default CampaignSection;
