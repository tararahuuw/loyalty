import React, { useState, useRef, useEffect, useCallback } from "react";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import DatePicker from "prezent/DatePicker";
import InformationSection from "./SimulationDashboard/InformationSection";
import CampaignDropDownSection from "./SimulationDashboard/CampaignDropDownSection";
import {
  DeleteSimulation,
  GetAllCampaignList,
  GetAllSimulationHistory,
} from "../../service/pointrulesmanagement/endpoint";
import { ModalState, SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { DotsThreeVerticalIcon } from "@phosphor-icons/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ExtandableCell from "./ExtandableCell";
import ResultModal from "prezent/ResultModal";

const SimulationSection = ({ companyId }) => {
  const navigate = useNavigate();
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [openRows, setOpenRows] = useState({});
  const [selectedRow, setSelectedRow] = useState(null);
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Simulation ID",
    value: "simulationId",
  });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [menuPosition, setMenuPosition] = useState(null);
  const [menuHeight, setMenuHeight] = useState(0);
  const menuRef = useRef(null);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { data: campaignList, isLoading: listIsLoading } = useFetch(GetAllCampaignList, "campaign-list", [], companyId);

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

  const open = Boolean(menuPosition);

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

  const buildDataOptions = (campaigns) => {
    const baseOptions = [
      { option: "Customer Name", value: "Customer Name" },
      { option: "Phone Number", value: "Phone Number" },
      { option: "Email", value: "Email" },
      { option: "Transaction Date", value: "Transaction Date" },
    ];

    if (!selectedCampaignId) {
      return [...baseOptions, { option: "Point", value: "Point" }];
    }

    const campaign = campaigns?.data?.find((c) => c.id === selectedCampaignId);
    const pointParameters = campaign?.campaignPointActive?.pointParameters || [];
    const dynamicOptions = pointParameters.map((param) => ({
      option: param.name,
      value: param.name,
    }));
    return [...baseOptions, ...dynamicOptions, { option: "Point", value: "Point" }];
  };

  const buildColumns = (campaigns, openRows, handleToggleRowOpen) => {
    const baseColumns = [
      {
        header: "Transaction Date",
        assessor: "Transaction Date",
        Cell: (row) => (
          <div>
            <p className="text-sm">{moment(row.transactionDate).format("DD MMM YYYY, HH:mm")}</p>
          </div>
        ),
      },
    ];

    const endColumns = [
      {
        header: "Point",
        assessor: "Point",
        Cell: (row) => (
          <div>
            <p className="text-sm">{row.point?.toLocaleString("id-ID") || 0}</p>
          </div>
        ),
      },
      {
        header: "Simulation Date",
        assessor: "Simulation Date",
        Cell: (row) => (
          <div>
            <p className="text-sm">{moment(row.createdAt).format("DD MMM YYYY HH:mm")}</p>
          </div>
        ),
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
                  <a
                    className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                    onClick={() => navigate(`/prezent/campaign/simulation/detail/${row.id}`)}
                  >
                    Detail
                  </a>

                  <a className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md" onClick={toggleDeleteModal}>
                    Delete
                  </a>
                </div>
              </>
            )}
          </>
        ),
      },
    ];

    if (!selectedCampaignId) {
      return [...baseColumns, ...endColumns];
    }
    const selectedCampaign = campaigns?.data?.find((c) => c.id === selectedCampaignId);
    const pointParameters = selectedCampaign?.campaignPointActive?.pointParameters || [];

    let dynamicColumns = [];

    pointParameters.forEach((param) => {
      if (param.settingParameterType === "datetime") return;

      dynamicColumns.push({
        header: param.settingParameterName,
        accessor: param.settingParameterName,
        Cell: (row) => {
          // Find matching parameter from row.parameters
          const matchedParam = row.parameters?.find(
            (p) => p.id === param.settingParameterId || p.name === param.settingParameterName
          );

          // Handle when no match found
          if (!matchedParam) {
            return <p className="text-neutral300 text-sm">No Data</p>;
          }

          // Special handling based on type / name
          if (param.settingParameterName === "Product") {
            return (
              <ExtandableCell
                values={Array.isArray(matchedParam.value) ? matchedParam.value : [matchedParam.value]}
                isOpen={openRows[row.id]}
                onOpen={() => handleToggleRowOpen(row.id)}
              />
            );
          }

          if (param.settingParameterName === "Store") {
            return (
              <div>
                <p className="text-black text-sm">{matchedParam.value?.label || "No Data"}</p>
                <p className="text-neutral300 text-sm">{matchedParam.value?.code || "No Data"}</p>
              </div>
            );
          }

          if (param.settingParameterName === "Amount" || param.settingParameterName === "Total Saving") {
            return <p className="text-black text-sm">Rp {Number(matchedParam.value).toLocaleString("id-ID")}</p>;
          }

          return <p className="text-black text-sm">{matchedParam.value || "No Data"}</p>;
        },
      });
    });

    return [...baseColumns, ...dynamicColumns, ...endColumns];
  };

  const handleToggleRowOpen = (rowId) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
  };

  const columns = buildColumns(campaignList, openRows, handleToggleRowOpen);
  const dataOptions = buildDataOptions(campaignList);

  const handleDeleteSimulation = async () => {
    try {
      toggleLoadingModal();
      toggleDeleteModal();
      await DeleteSimulation(selectedRow?.id);
      setSelectedRow(null);
      setReRender(!reRender);
      toggleLoadingModal();
      handleOpenModalResult("success", "Transaction data has been successfully deleted from the campaign simulation.");
    } catch (error) {
      console.log(error);
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        "Failed to delete transaction data from the campaign simulation. Please try again."
      );
      setSelectedRow(null);
    }
  };

  useEffect(() => {
    if (open && menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuHeight(rect.height);
    }
  }, [open, selectedRow]);

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
      <InformationSection />

      <CampaignDropDownSection
        campaigns={campaignList?.data}
        selectedCampaignId={selectedCampaignId}
        setSelectedCampaignId={setSelectedCampaignId}
      />

      <div className="bg-white rounded-lg shadow-md">
        <div className="flex items-center w-full py-3 px-4 gap-3 flex-1">
          <div>
            <SearchDropdown
              options={dataOptions}
              placeholderSearch="Search Here"
              filterDropdown={dataFilterSearch}
              setFilterDropdown={setDataFilterSearch}
              onEnterPress={setDataSearch}
            />
          </div>

          <DatePicker
            onChangeRange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            value={[startDate, endDate]}
            onReset={() => {
              setStartDate("");
              setEndDate(null);
            }}
            placeholder="Select Simulation Date"
            mode="dashboard"
            className="max-w-xs"
          />
        </div>

        <div className="drop-shadow h-full">
          <DataTable
            columns={columns}
            reRender={reRender}
            service={GetAllSimulationHistory}
            queryName="simulation-history"
            dependencies={[dataSearch]}
            params={{
              campaignId: selectedCampaignId,
              simulationId: dataSearch,
              startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : null,
              endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : null,
            }}
            options={{ pagination: true }}
            searchKeyword={dataSearch}
            onClickRow={(id) => navigate(`/prezent/campaign/simulation/detail/${id}`)}
            loadingIndicator={listIsLoading || loadingModalIsOpen}
          />
        </div>
      </div>

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />

      <ModalState
        title="Delete Sampe Data?"
        subtitle={
          <div>
            <p>This action will delete the selected transaction data from the campaign simulation.</p>
            <p>Are you sure you want to continue?</p>
          </div>
        }
        isOpen={deleteModalIsOpen}
        onClose={() => {
          toggleDeleteModal();
          handleClose();
        }}
        type="danger"
        titleButtonRight="Yes, Deactivate"
        leftAction={() => {
          toggleDeleteModal();
          handleClose();
        }}
        rightAction={handleDeleteSimulation}
      />
    </div>
  );
};

export default SimulationSection;
