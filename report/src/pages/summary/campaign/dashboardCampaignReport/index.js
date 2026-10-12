import React, { useEffect, useState } from "react";

import moment from "moment";
import _, { isArray } from "lodash";

import { useNavigate } from "react-router-dom";
import { OutlineButton, Chip, TabBar } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { PiDownloadSimple } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useCallback } from "react";
import {
  DownloadSummaryCampaignReport,
  GetSummaryCampaignReportPagination,
} from "../../../../service/ReportManagement/endpoint";
import { useRef } from "react";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardCampaignReport = ({ setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const parentRef = useRef(null);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [currentTab, setCurrentTab] = useState("Campaign");
  const [reRender, setReRender] = useState(false);

  const navigateTo = useNavigate();

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
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const open = Boolean(menuPosition);

  const handleOpen = useCallback((event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom - 20,
      left: rect.left - 80,
    });
    setSelectedRow(row);
    event.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    setMenuPosition(null);
    setSelectedRow(null);
  }, []);

  const columns = [
    {
      header: "Campaign Name",
      assessor: "Campaign Name",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.campaignName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Campaign Period",
      assessor: "Campaign Period",
      Cell: (row) => {
        return (
          <div>
            {row.startDateCampaign && row.endDateCampaign ? (
              <p className="text-black text-sm flex items-center">
                {moment(row.startDateCampaign, "DD-MM-YYYY HH:mm").format("DD MMM YYYY HH:mm")} -{" "}
                {moment(row.endDateCampaign, "DD-MM-YYYY HH:mm").format("DD MMM YYYY HH:mm")}
              </p>
            ) : (
              <p className="text-black text-sm flex items-center">-</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Campaign Status",
      assessor: "Campaign Status",
      Cell: (row) => {
        return (
          <Chip
            title={row.statusCampaign}
            type={
              row.statusCampaign === "Active" ? "success" : row.statusCampaign === "Inactive" ? "warning" : "neutral"
            }
          />
        );
      },
    },
    {
      header: "Total Point Earned",
      assessor: "Total Point Earned",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.totalPointEarned !== null && row.statusPoint === true
                ? row.totalPointEarned.toLocaleString("id")
                : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Total Active Cust.",
      assessor: "Total Active Cust.",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.totalActiveCustomer !== null ? row.totalActiveCustomer.toLocaleString("id") : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row) => (
        <>
          <button onClick={(e) => handleOpen(e, row)} className="p-2 hover:bg-neutral20 rounded-full">
            <DotsThreeVertical size={24} />
          </button>

          {open && selectedRow?.campaignId === row.campaignId && (
            <>
              <div className="top-0 right-0 left-0 bottom-0 fixed z-40" onClick={handleClose} />
              <div
                className="fixed z-50 bg-white border border-neutral40 rounded-md shadow-md flex flex-col p-2"
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
              >
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md text-black"
                  onClick={() => handleNavigateToDetailCampaignReport(row.campaignId)}
                >
                  Detail
                </a>
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  async function handleDownloadReport() {
    try {
      toggleLoadingModal();
      var response = await DownloadSummaryCampaignReport({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportSummary_Campaign_${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleLoadingModal();
      handleOpenModalResult("success", `Report data downloaded successfully.`);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", `Failed to download report data. Please try again.`);
    }
  }

  function handleNavigateToDetailCampaignReport(id) {
    navigateTo(`/prezent/report/summary/campaign/${id}`);
  }

  useEffect(() => {
    setTitleHeader("Report Summary");
  }, []);
  const filterOptions = [
    { id: "campaignName", label: "Campaign Name", type: "string" },
    {
      id: "campaignPeriod",
      label: "Campaign Period",
      type: "date",
    },
    {
      id: "campaignStatus",
      label: "Campaign Status",
      type: "checkbox",
      isArray,
      options: [
        {
          label: "Active",
          value: "Active",
        },
        {
          label: "Inactive",
          value: "Inactive",
        },
        {
          label: "Expired",
          value: "Expired",
        },
      ],
    },
  ];
  const [currentData, setCurrentData] = useState({
    campaignName: "",
    campaignPeriod: {
      startDate: "",
      includeTime: false,
      endDate: "",
    },
    campaignStatus: [],
  });

  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Campaign", "Reward"]}
          dataValue={["Campaign", "Reward"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => {
            setCurrentTab(tab);
            if (tab === "Campaign") {
              navigateTo("/prezent/report/summary/campaign");
            }
            if (tab === "Reward") {
              navigateTo("/prezent/report/summary/reward");
            }
          }}
        />
      </div>
      <div
        className="flex-1 overflow-y-auto bg-neutral20 pb-6 pt-16 px-8"
        style={{ minHeight: "calc(100dvh - 165px)" }}
      >
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex w-full">
              <div>
                <FilterDropdownMixed
                  parentRef={parentRef}
                  filterOptions={filterOptions}
                  currentData={currentData}
                  setCurrentData={setCurrentData}
                />
              </div>
            </div>
            <OutlineButton
              title={
                <p className="flex items-center">
                  <PiDownloadSimple className="mr-2" />
                  Download
                </p>
              }
              onClick={handleDownloadReport}
            />
          </div>
          <div className="drop-shadow h-full">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetSummaryCampaignReportPagination}
              queryName="campaigns"
              dependencies={[currentData]}
              params={{ filter: currentData }}
              options={{ pagination: true }}
              onClickRow={(id, row) => handleNavigateToDetailCampaignReport(row.campaignId)}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DashboardCampaignReport;
