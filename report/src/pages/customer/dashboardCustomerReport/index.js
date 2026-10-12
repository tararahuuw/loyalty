import React, { useCallback, useEffect, useRef, useState } from "react";

import moment from "moment";
import _, { isArray } from "lodash";

import { useNavigate } from "react-router-dom";
import { OutlineButton, Chip } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { PiDownloadSimple } from "react-icons/pi";
import { DotsThreeVertical } from "@phosphor-icons/react";
import { DownloadCustomerReport, GetCustomerReportPagination } from "../../../service/ReportManagement/endpoint";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardCustomerReport = ({ setTitleHeader, userInfo }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [reRender, setReRender] = useState(false);
  const parentRef = useRef(null);

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

  function handleNavigateToDetailReport(id) {
    navigateTo(`/prezent/report/customer-360/${id}`);
  }

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
      header: "Tier Level",
      assessor: "Tier Level",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.tierLevel || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "Status",
      Cell: (row) => {
        return (
          <Chip
            title={row.status}
            type={row.status === "Active" ? "success" : row.status === "Suspended" ? "warning" : "neutral"}
          />
        );
      },
    },
    {
      header: "Last Updated",
      assessor: "Last Updated",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{moment(row.updatedAt).format("DD MMM YYYY, HH.mm")}</p>
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
                  onClick={() => handleNavigateToDetailReport(row.id)}
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
      var response = await DownloadCustomerReport({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportCustomer360_${today}`;
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
    { id: "customerName", label: "Customer Name", type: "string" },
    { id: "phoneNumber", label: "Phone Number", type: "string" },
    { id: "email", label: "Email", type: "string" },
    { id: "tierLevel", label: "Tier Level", type: "string" },
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      isArray,
      options: [
        { label: "Active", value: "Active" },
        { label: "Suspended", value: "Suspended" },
      ],
    },
  ];
  const [currentData, setCurrentData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    tierLevel: "",
    status: [],
  });

  useEffect(() => {
    setTitleHeader("Customer 360");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
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
              service={GetCustomerReportPagination}
              queryName="report"
              dependencies={[currentData]}
              params={{ filter: currentData }}
              options={{ pagination: true }}
              searchKeyword={`${JSON.stringify(currentData)}`}
              onClickRow={(id) => navigateTo(`/prezent/report/customer-360/${id}`)}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DashboardCustomerReport;
