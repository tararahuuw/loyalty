import React, { useEffect, useCallback, useState } from "react";

import moment from "moment";
import _ from "lodash";

import { useNavigate } from "react-router-dom";
import { OutlineButton, TabBar } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { PiDownloadSimple } from "react-icons/pi";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import ModalRewardReport from "../../../components/ModalRewardReport";
import {
  DownloadSummaryRewardDetailReport,
  DownloadSummaryRewardReport,
  GetSummaryRewardReportPagination,
} from "../../../service/ReportManagement/endpoint";
import { useRef } from "react";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardRewardReport = ({ setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const {
    isOpen: modalRewardReport,
    close: closeModalRewardReport,
    open: openModalRewardReport,
  } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [currentTab, setCurrentTab] = useState("Reward");
  const [selectedData, setSelectedData] = useState(null);
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
      header: "Reward Name",
      assessor: "Reward Name",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.rewardName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Type",
      assessor: "Reward Type",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.rewardType || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Owned QTY",
      assessor: "Owned QTY",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.ownedQty ? row.ownedQty.toLocaleString("id") : "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Generated",
      assessor: "Reward Generated",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.rewardGenerated ? row.rewardGenerated.toLocaleString("id") : "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Redeemed",
      assessor: "Reward Redeemed",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.rewardRedeemed !== null ? row.rewardRedeemed.toLocaleString("id") : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Validity Period",
      assessor: "Validity Period",
      Cell: (row) => {
        return (
          <div>
            {row.startDate && row.endDate ? (
              <div>
                <p className="text-black text-sm flex items-center">
                  {moment(row.startDate).format("DD MMM YYYY HH:mm")} -
                </p>
                <p className="text-black text-sm flex items-center">
                  {moment(row.endDate).format("DD MMM YYYY HH:mm")}
                </p>
              </div>
            ) : (
              <p className="text-black text-sm flex items-center">-</p>
            )}
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

          {open && selectedRow?.id === row.id && (
            <>
              <div className="top-0 right-0 left-0 bottom-0 fixed z-40" onClick={handleClose} />
              <div
                className="fixed z-50 bg-white border border-neutral40 rounded-md shadow-md flex flex-col p-2"
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
              >
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md text-black"
                  onClick={() => {
                    setSelectedData(row);
                    openModalRewardReport();
                  }}
                >
                  Detail
                </a>
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md text-black"
                  onClick={() => {
                    setSelectedData(row);
                    handleDownloadReportReward();
                    handleClose();
                  }}
                >
                  Download
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
      var response = await DownloadSummaryRewardReport({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportSummary_Reward_${today}`;
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

  async function handleDownloadReportReward() {
    try {
      toggleLoadingModal();
      var response = await DownloadSummaryRewardDetailReport({ filter: { catalogId: selectedData.catalogId } });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportSummary_Reward_${today}`;
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

  const filterOptions = [
    { id: "rewardName", label: "Reward Name", type: "string" },
    {
      id: "rewardType",
      label: "Reward Type",
      type: "checkbox",
      options: [
        { label: "Cashback & Discounts", value: "Cashback & Discounts" },
        { label: "Digital Voucher", value: "Digital Voucher" },
        { label: "Goods", value: "Goods" },
        { label: "PPOB Voucher", value: "PPOB Voucher" },
      ],
    },
    {
      id: "validityPeriod",
      label: "Validity Period",
      type: "date",
    },
  ];
  const [currentData, setCurrentData] = useState({
    rewardName: "",
    rewardType: [],
    validityPeriod: {
      startDate: "",
      endDate: "",
    },
  });
  const parentRef = useRef(null);

  useEffect(() => {
    setTitleHeader("Report Summary");
  }, []);

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
              service={GetSummaryRewardReportPagination}
              queryName="rewards"
              dependencies={[currentData]}
              params={{ filter: currentData }}
              options={{ pagination: true }}
              onClickRow={(id, row) => {
                setSelectedData(row);
                openModalRewardReport();
              }}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <ModalRewardReport isOpen={modalRewardReport} onClose={closeModalRewardReport} selectedData={selectedData} />
    </>
  );
};

export default DashboardRewardReport;
