import React, { useEffect, useState } from "react";

import _ from "lodash";

import {
  FilterDropdown,
  TabBar,
  SearchDropdown,
  OutlineButton,
  Pagination,
  ChipBar,
} from "sprint-asia-custom-component";
import { PiDownloadSimple } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import CustomTableReport from "../../../components/customTableReport";
import DatePicker from "../../../components/DatePicker/DatePicker";
import {
  DownloadReportLoyaltyDetailPoint,
  DownloadReportLoyaltyDetailReward,
  GetAllReportLoyaltyDetailPointWithPagination,
  GetAllReportLoyaltyDetailRewardWithPagination,
  GetAllReportLoyaltySummaryWithPagination,
} from "../../../service/reportloyaltymanagement/endpoint";
import { useFetch } from "prezent/useFetch";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DashboardLoyalty = ({ roleAccess, setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ campaignStatus: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [currentTab, setCurrentTab] = useState("1");
  const [currentChip, setCurrentChip] = useState("Point");
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState(moment().subtract(1, "month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const navigateTo = useNavigate();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Campaign ID",
    value: "campaignId",
  });

  const [reRender, setReRender] = useState(false);

  const endpoint =
    currentTab === "2"
      ? currentChip === "Point"
        ? GetAllReportLoyaltyDetailPointWithPagination
        : GetAllReportLoyaltyDetailRewardWithPagination
      : GetAllReportLoyaltySummaryWithPagination;

  const { data: reportData, isLoading } = useFetch(
    endpoint,
    "report",
    [dataSearch, page, dataFilter, dataFilterSearch, currentTab, endDate, currentChip],
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
    }
  );

  const getDataOptions = (currentTab, currentChip, roleAccess) => {
    if (currentTab === "2" && currentChip === "Reward") {
      const dataOptions = [{ option: "Reward Ref ID", value: "rewardRefId" }];

      if (roleAccess === "System Administrator") {
        dataOptions.push({ option: "Client", value: "client" });
      }

      dataOptions.push(
        { option: "Division", value: "division" },
        { option: "Campaign ID", value: "campaignId" },
        { option: "Campaign Name", value: "campaignName" },
        { option: "Customer ID", value: "customerId" },
        { option: "Customer Name", value: "customerName" },
        { option: "Reward Name", value: "rewardName" }
      );

      return dataOptions;
    }

    if (currentTab === "2" && currentChip === "Point") {
      const dataOptions = [
        { option: "Customer Name", value: "customerName" },
        { option: "Customer ID", value: "customerId" },
      ];

      if (roleAccess === "System Administrator") {
        dataOptions.push({ option: "Client", value: "client" }); // Setelah Customer ID
      }

      dataOptions.push(
        { option: "Division", value: "division" },
        { option: "Campaign ID", value: "campaignId" },
        { option: "Campaign Name", value: "campaignName" }
      );

      return dataOptions;
    }

    return [
      { option: "Campaign ID", value: "campaignId" },
      { option: "Campaign Name", value: "campaignName" },
    ];
  };

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
  };

  const dataCampaignStatus = [
    { option: "Active", value: "active" },
    { option: "Inactive", value: "inactive" },
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

  function handleNavigateToDetailLoyaltyReport(id) {
    navigateTo(`/prezent/report/loyalty/detail/${id}`);
  }

  async function handleGetExportDataExcel() {
    try {
      toggleLoadingModal();

      const DownloadReportLoyalty =
        currentChip === "Point" ? DownloadReportLoyaltyDetailPoint : DownloadReportLoyaltyDetailReward;

      const response = await DownloadReportLoyalty({ dataFilter, dataSearch, startDate, endDate, currentTab });
      if (reportData?.data) {
        const blob = response;
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Report ${currentChip === "Point" ? "Point" : "Reward"}_${moment(startDate).format(
          "DD-MM-YYYY"
        )}_${moment(endDate).format("DD-MM-YYYY")}.xlsx`;
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

  const handleChangeTab = (tab) => {
    setCurrentTab(tab);
  };

  useEffect(() => {
    if (roleAccess === "System Administrator" || roleAccess === "Client Administrator") {
      setTitleHeader("Loyalty");
    }
  }, []);

  useEffect(() => {
    if (currentTab === "1") {
      setDataFilterSearch({ option: "Campaign ID", value: "campaignId" });
    } else if (currentTab === "2" && currentChip === "Point") {
      setDataFilterSearch({ option: "Customer Name", value: "customerName" });
    } else if (currentTab === "2" && currentChip === "Reward") {
      setDataFilterSearch({ option: "Reward Ref ID", value: "rewardRefId" });
    }
  }, [currentTab, currentChip]);

  useEffect(() => {
    setPage(1);
  }, [currentTab, currentChip, dataSearch, dataFilter, endDate, setDataFilterSearch, setDataSearch]);

  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Summary", "Detail"]}
          dataValue={["1", "2"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => handleChangeTab(tab)}
        />
      </div>
      {currentTab == "2" && (
        <div className="fixed top-[195px] z-10 w-full">
          <ChipBar
            dataBar={["Point", "Reward"]}
            dataValue={["Point", "Reward"]}
            currentTab={currentChip}
            onChangeChipBar={(chip) => setCurrentChip(chip)}
          />
        </div>
      )}
      <div
        className="w-full overflow-y-auto bg-neutral20 pb-6 pt-16 px-8"
        style={{ minHeight: "calc(100dvh - 165px)" }}
      >
        {currentTab === "2" && (
          <div className="flex justify-end mb-4">
            <OutlineButton
              title="Download Data"
              icon={<PiDownloadSimple size={16} className="text-primary500" />}
              isIconVisible
              onClick={() => handleGetExportDataExcel()}
            />
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex items-center w-full py-3 px-4">
            <div className="flex justify-between">
              <div>
                <SearchDropdown
                  options={getDataOptions(currentTab, currentChip, roleAccess)}
                  placeholderSearch="Search Here"
                  filterDropdown={dataFilterSearch}
                  setFilterDropdown={setDataFilterSearch}
                  filterSearch={dataSearch}
                  onEnterPress={setDataSearch}
                />
              </div>
              {currentTab === "1" && (
                <div className="ml-2 w-48">
                  <FilterDropdown
                    options={[
                      {
                        menu: "Status Campaign",
                        parameter: "campaignStatus",
                        submenu: dataCampaignStatus,
                        type: "radiobutton",
                      },
                    ]}
                    dataFilterResult={dataFilter}
                    setDataFilterResult={setSelectedFilterOptions}
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
              typeReport="Loyalty"
              dataReport={reportData?.data || []}
              isLoading={isLoading}
              onClickRow={currentTab === "1" ? (id) => handleNavigateToDetailLoyaltyReport(id) : () => {}}
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

export default DashboardLoyalty;
