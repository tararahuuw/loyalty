import React, { useEffect, useState } from "react";

import _ from "lodash";

import {
  FilterDropdown,
  TabBar,
  SearchDropdown,
  OutlineButton,
  Pagination,
  ChipBar,
  FilterCheckboxDropdown,
} from "sprint-asia-custom-component";
import { PiDownloadSimple } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import CustomTableReport from "../../../components/customTableReport";
import DatePicker from "../../../components/DatePicker/DatePicker";
import {
  DownloadReportMerchant,
  GetAllReportDetailVoucherExternalWithPagination,
  GetAllReportDetailVoucherWithPagination,
  GetAllReportPartnerVoucherWithPagination,
} from "../../../service/reportvouchermanagement/endpoint";
import { GetAllDivisionByClientId, GetAllDivisionByClientName } from "../../../service/usermanagement/endpoint";
import { useFetch } from "prezent/useFetch";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardVoucher = ({ roleAccess, clientId, divisionId, setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ voucherStatus: [] });
  const [dataDivision, setDataDivision] = useState([]);
  const [optionsDivision, setOptionsDivision] = useState([]);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const [currentChip, setCurrentChip] = useState("Digital Voucher");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(moment().subtract(1, "month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const navigateTo = useNavigate();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Voucher Ref ID",
    value: "voucherRefId",
  });

  useEffect(() => {
    setDataFilterSearch({
      option: "Voucher Ref ID",
      value: "voucherRefId",
    });
  }, [currentTab]);

  const endpoint =
    currentTab === "1"
      ? roleAccess === "System Administrator"
        ? GetAllReportDetailVoucherWithPagination
        : GetAllReportDetailVoucherExternalWithPagination
      : GetAllReportPartnerVoucherWithPagination;

  const { data: reportData, isLoading } = useFetch(
    endpoint,
    "report",
    [dataSearch, page, dataFilter, dataFilterSearch, currentTab, endDate, currentChip, dataDivision],
    {
      roleAccess,
      page,
      dataFilter,
      dataFilterSearch: dataFilterSearch.value,
      dataSearch,
      dates: endDate
        ? {
            startDate: moment(startDate).format("YYYY-MM-DD"),
            endDate: moment(endDate).format("YYYY-MM-DD"),
          }
        : null,
      currentTab,
      currentChip,
      dataDivision: dataDivision.map((options) => options.value),
    }
  );

  const getDataOptions = (currentTab, roleAccess) => {
    if (currentTab === "2") {
      return [
        { option: "Voucher Ref ID", value: "voucherRefId" },
        { option: "Order ID", value: "orderId" },
        { option: "Campaign ID", value: "campaignId" },
        { option: "Campaign Name", value: "campaignName" },
        { option: "Voucher ID", value: "voucherId" },
        { option: "Voucher Name", value: "voucherName" },
      ];
    }

    const dataOptions = [
      { option: "Voucher Ref ID", value: "voucherRefId" },
      { option: "Campaign ID", value: "campaignId" },
      { option: "Campaign Name", value: "campaignName" },
      { option: "Voucher ID", value: "voucherId" },
      { option: "Voucher Name", value: "voucherName" },
    ];

    if (currentTab === "1") {
      dataOptions.splice(1, 0, { option: "Customer ID", value: "reffId" });
      dataOptions.splice(2, 0, { option: "Customer Name", value: "customerName" });

      if (roleAccess === "System Administrator") {
        dataOptions.splice(3, 0, { option: "Client", value: "clientName" });
      }
    }

    return dataOptions;
  };

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
  };

  const dataVoucherStatus = [
    { option: "Generated", value: "generated" },
    { option: "Redeemed", value: "redeemed" },
    { option: "Pending", value: "pending" },
    { option: "Expired", value: "expired" },
    { option: "Failed", value: "failed" },
  ];

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1000);
    }, 250);
  }

  async function handleGetExportDataExcel() {
    try {
      toggleLoadingModal();
      const response = await DownloadReportMerchant({
        dataFilter,
        dataSearch,
        startDate,
        endDate,
        currentTab,
        currentChip,
        dataDivision,
        roleAccess,
      });
      if (reportData?.data) {
        const blob = response;
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Report Voucher_${moment(startDate).format("DD-MM-YYYY")}_${moment(endDate).format(
          "DD-MM-YYYY"
        )}.xlsx`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
        toggleLoadingModal();
        handleOpenModalResult("success", "Report data has been successfully dowloaded");
      } else {
        toggleLoadingModal();
        handleOpenModalResult("failed", "The requested data is not available for download.");
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Oops! There was an error loading the data. Please try again.");
    }
  }

  async function getAllDivisionByClientName() {
    try {
      const response = await GetAllDivisionByClientName({ clientName: dataSearch });
      if (response.data) {
        setOptionsDivision(response.data.map((option) => ({ option: option.name, value: option.id })));
      } else {
        setOptionsDivision([]);
        setDataDivision([]);
      }
    } catch (error) {
      handleOpenModalResult("failed", "Oops! There was an error loading the data. Please try again.");
    }
  }

  async function getAllDivisionByClientId() {
    try {
      const response = await GetAllDivisionByClientId({ clientId: clientId });
      if (response.data) {
        setOptionsDivision(response.data.map((option) => ({ option: option.name, value: option.id })));
      } else {
        setOptionsDivision([]);
        setDataDivision([]);
      }
    } catch (error) {
      handleOpenModalResult("failed", "Oops! There was an error loading the data. Please try again.");
    }
  }

  const handleChangeTab = (tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (roleAccess === "System Administrator" || roleAccess === "Client Administrator") {
      setTitleHeader("Voucher");
    }
  }, []);

  useEffect(() => {
    if (clientId) {
      getAllDivisionByClientId(clientId);
    }
  }, [roleAccess, clientId, divisionId]);

  useEffect(() => {
    setPage(1);
  }, [
    dataSearch,
    dataFilter,
    dataFilterSearch,
    currentTab,
    endDate,
    currentChip,
    dataDivision,
    setDataFilterSearch,
    setDataSearch,
  ]);

  useEffect(() => {
    if (dataFilterSearch.option === "Client") {
      if (dataSearch === "") {
        setDataDivision([]);
        setOptionsDivision([]);
      } else {
        getAllDivisionByClientName();
      }
    }
  }, [dataSearch, dataFilterSearch]);

  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={roleAccess === "System Administrator" ? ["Detail", "Partner"] : ["Detail"]}
          dataValue={roleAccess === "System Administrator" ? ["1", "2"] : ["1"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => handleChangeTab(tab)}
        />
      </div>
      <div className="fixed top-[195px] z-10 w-full">
        <ChipBar
          dataBar={["Digital Voucher", "PPOB Voucher"]}
          dataValue={["Digital Voucher", "PPOB Voucher"]}
          currentTab={currentChip}
          onChangeChipBar={(chip) => setCurrentChip(chip)}
        />
      </div>
      <div
        className="w-full overflow-y-auto bg-neutral20 pb-6 pt-16 px-8"
        style={{ minHeight: "calc(100dvh - 165px)" }}
      >
        <div className="flex justify-end mb-4">
          <OutlineButton
            title="Download Data"
            icon={<PiDownloadSimple size={16} className="text-primary500" />}
            isIconVisible
            onClick={() => handleGetExportDataExcel()}
          />
        </div>
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex items-center w-full py-3 px-4">
            <div className="flex justify-between">
              <div>
                <SearchDropdown
                  options={getDataOptions(currentTab, roleAccess)}
                  placeholderSearch="Search Here"
                  filterDropdown={dataFilterSearch}
                  setFilterDropdown={setDataFilterSearch}
                  filterSearch={dataSearch}
                  onEnterPress={setDataSearch}
                />
              </div>
              <div className="ml-2 w-48">
                <FilterDropdown
                  options={[
                    {
                      menu: "Voucher Status",
                      parameter: "voucherStatus",
                      submenu: dataVoucherStatus,
                      type: "radiobutton",
                    },
                  ]}
                  dataFilterResult={dataFilter}
                  setDataFilterResult={setSelectedFilterOptions}
                />
              </div>
              {currentTab === "1" && (
                <div className="ml-2 w-48">
                  <FilterCheckboxDropdown
                    buttonText="Division"
                    options={optionsDivision}
                    currentValue={dataDivision}
                    onSelect={setDataDivision}
                  />
                </div>
              )}
              <div className="ml-2 z-50 w-80">
                <DatePicker
                  placeholder="Select Validity Period"
                  mode={"default"}
                  value={[startDate, endDate]}
                  onChangeRange={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                  }}
                  onReset={() => {
                    setStartDate(moment().subtract(1, "month").format("YYYY-MM-DD"));
                    setEndDate(moment().format("YYYY-MM-DD"));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="drop-shadow h-full w-full">
            <CustomTableReport
              roleAccess={roleAccess}
              typeLoyalty={currentTab}
              typeVoucher={currentChip}
              typeReport="Voucher"
              dataReport={reportData?.data || []}
              isLoading={isLoading}
              onClickRow={() => {}}
            />
            <Pagination
              firstData={reportData?.firstRow || 0}
              lastData={reportData?.lastRow || 0}
              totalCount={reportData?.totalCount || 0}
              currentPage={page}
              totalPage={reportData?.totalPages || 0}
              isLoading={isLoading}
              onChangePages={setPage}
            />
          </div>
        </div>
      </div>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DashboardVoucher;
