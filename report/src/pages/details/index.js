import React, { useEffect, useState } from "react";

import moment from "moment";
import _, { isArray } from "lodash";

import { OutlineButton, Chip } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { PiDownloadSimple } from "react-icons/pi";
import { DownloadDetailReport, GetDetailsReportPagination } from "../../service/ReportManagement/endpoint";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import { useRef } from "react";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardDetailsReport = ({ setTitleHeader, userInfo }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [reRender, setReRender] = useState(false);

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

  const columns = [
    {
      header: "Transaction Date",
      assessor: "Transaction Date",
      Cell: (row) => {
        return (
          <div>
            {row.transactionDate ? (
              <p className="text-black text-sm flex items-center">
                {moment(row.transactionDate).format("DD MMM YYYY HH:mm")}
              </p>
            ) : (
              <p className="text-black text-sm flex items-center">-</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Customer Name",
      assessor: "Customer Name",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.customerName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      assessor: "Phone Number",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.phoneNumber || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "Email",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.email || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Campaign Name",
      assessor: "Campaign Name",
      Cell: (row) => {
        return (
          <div className="w-24">
            <p className="text-black text-sm truncate">{row.campaignName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Point TRX",
      assessor: "Point TRX",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.status === "Earned" ? "+" : row.status === "Claimed" ? "-" : ""}
              {row.pointTrx
                ? row.status === "Redeemed" || row.status === "Expired"
                  ? "-"
                  : row.pointTrx.toLocaleString("id")
                : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Remaining Point",
      assessor: "Remaining Point",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.remainingPoint
                ? row.status === "Redeemed" || row.status === "Expired"
                  ? "-"
                  : row.remainingPoint.toLocaleString("id")
                : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Reward Name",
      assessor: "Reward Name",
      Cell: (row) => {
        return (
          <div className="w-24">
            <p className="text-black text-sm truncate">{row.rewardName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Type",
      assessor: "Reward Type",
      Cell: (row) => {
        return (
          <div className="w-24">
            <p className="text-black text-sm truncate">{row.rewardType || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Price",
      assessor: "Reward Price",
      Cell: (row) => {
        return (
          <div className="w-24">
            <p className="text-black text-sm truncate">
              {row.rewardPrice ? row.rewardPrice.toLocaleString("id") : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <Chip
            title={row.status}
            type={
              row.status === "Redeemed"
                ? "primary"
                : row.status === "Earned" || row.status === "Generated"
                ? "success"
                : row.status === "Claimed"
                ? "warning"
                : "neutral"
            }
          />
        );
      },
    },
  ];

  async function handleDownloadReport() {
    try {
      toggleLoadingModal();
      var response = await DownloadDetailReport({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportDetails_${today}`;
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
    {
      id: "transactionDate",
      label: "Transaction Date",
      type: "date",
    },
    { id: "customerName", label: "Customer Name", type: "string" },
    { id: "phoneNumber", label: "Phone Number", type: "string" },
    { id: "email", label: "Email", type: "string" },
    { id: "campaignName", label: "Campaign Name", type: "string" },
    { id: "rewardName", label: "Reward Name", type: "string" },
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      isArray,
      options: [
        { label: "Earned", value: "Earned" },
        { label: "Redeemed", value: "Redeemed" },
        { label: "Claimed", value: "Claimed" },
        { label: "Expired", value: "Expired" },
      ],
    },
  ];
  const [currentData, setCurrentData] = useState({
    transactionDate: {
      startDate: "",
      endDate: "",
    },
    customerName: "",
    phoneNumber: "",
    email: "",
    campaignName: "",
    rewardName: "",
    status: [],
  });
  const parentRef = useRef(null);

  useEffect(() => {
    setTitleHeader("Report Detail");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
        <div className="bg-white rounded-lg shadow-md px-8 py-6">
          <div className="flex justify-between items-center w-full pb-3">
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
              service={GetDetailsReportPagination}
              queryName="report"
              dependencies={[currentData]}
              params={{ filter: currentData }}
              options={{ pagination: true, isRounded: true }}
              onClickRow={() => {}}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DashboardDetailsReport;
