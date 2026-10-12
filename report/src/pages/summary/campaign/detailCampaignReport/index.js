import React, { useState, useEffect } from "react";
import moment from "moment";
import { PiDownloadSimple, PiCaretDown, PiCaretUp } from "react-icons/pi";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Chip, OutlineButton, CardInfo } from "sprint-asia-custom-component";
import ReportAnalytics from "../../../../components/ReportAnalytics";
import DataTable from "prezent/DataTable";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import {
  DownloadSummaryCampaignDataDownload,
  DownloadSummaryCampaignRewardDataDownload,
  GetReportDetailCampaign,
  GetSummaryCampaignDataReportPagination,
  GetSummaryCampaignDataRewardReportPagination,
} from "../../../../service/ReportManagement/endpoint";
import { GetAllCampaign } from "../../../../service/CampaignManagement/endpoint";
import { useRef } from "react";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import ProductCell from "../../../../components/ProductCell";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

ChartJS.register(ArcElement, Tooltip, Legend);

const DetailCampaignReport = ({ roleAccess, setTitleHeader, userInfo }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [reRender, setReRender] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [isOpenCampaignInformation, setIsOpenCampaignInformation] = useState(true);
  const [openRows, setOpenRows] = useState({});
  const { data: campaigns } = useFetch(GetAllCampaign, "campaign", [userInfo], { companyId });
  const { data: reportDetail } = useFetch(GetReportDetailCampaign, "campaign", [id], { id: id });
  const handleToggleRowOpen = (rowId) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
  };

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

  const buildDataOptions = (campaignId, campaigns) => {
    if (reportDetail?.data?.statusPoint) {
      const baseOptions = [
        { id: "Transaction Date", label: "Transaction Date", type: "date" },
        { id: "Customer Name", label: "Customer Name", type: "string" },
        { id: "Phone Number", label: "Phone Number", type: "string" },
        { id: "Email", label: "Email", type: "string" },
      ];

      const endOptions = [
        // { id: "Point Earned", label: "Point Earned", type: "string" },
        // { id: "Total Point Earned", label: "Total Point Earned", type: "string" },
      ];

      let options = [];

      if (!campaignId) {
        options = [...baseOptions, ...endOptions];
      } else {
        const campaign = campaigns?.data?.find((c) => c.id === campaignId);
        const pointParameters = campaign?.campaignPointActive?.pointParameters || [];

        const dynamicOptions = pointParameters.map((param) => ({
          id: param.settingParameterName,
          label: param.settingParameterName,
          type:
            param.settingParameterType === "option"
              ? "dropdown"
              : param.settingParameterType === "date"
              ? "date"
              : "string",
          options: param.settingParameterType === "option" ? param.options : [],
        }));

        options = [...baseOptions, ...dynamicOptions, ...endOptions];
      }

      // build initialValues sesuai type
      const initialValues = {};
      options.forEach((opt) => {
        if (opt.type === "date") {
          initialValues[opt.id] = { startDate: "", endDate: "" };
        } else if (opt.type === "dropdown") {
          initialValues[opt.id] = "";
        } else {
          initialValues[opt.id] = "";
        }
      });

      return {
        options,
        initialValues,
      };
    } else {
      let options = [];
      const baseOptions = [
        { id: "transactionDate", label: "Transaction Date", type: "date" },
        { id: "customerName", label: "Customer Name", type: "string" },
        { id: "phoneNumber", label: "Phone Number", type: "string" },
        { id: "email", label: "Email", type: "string" },
        { id: "rewardName", label: "Reward Name", type: "string" },
        { id: "rewardType", label: "Reward Type", type: "string" },
        {
          id: "rewardStatus",
          label: "Reward Status",
          type: "checkbox",
          options: [
            { label: "Generated", value: "Generated" },
            { label: "Redeemed", value: "Redeemed" },
          ],
        },
      ];
      options = [...baseOptions];
      // build initialValues sesuai type
      const initialValues = {};
      options.forEach((opt) => {
        if (opt.type === "date") {
          initialValues[opt.id] = { startDate: "", endDate: "" };
        } else if (opt.type === "dropdown") {
          initialValues[opt.id] = "";
        } else if (opt.type === "checkbox") {
          initialValues[opt.id] = [];
        } else {
          initialValues[opt.id] = "";
        }
      });

      return {
        options,
        initialValues,
      };
    }
  };

  const buildColumns = (campaignId, campaigns, openRows, handleToggleRowOpen) => {
    if (reportDetail?.data?.statusPoint) {
      const baseColumns = [
        {
          header: "Transaction Date",
          assessor: "Transaction Date",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">
                {row?.value[0] ? moment(row?.value[0]).format("DD MMM YYYY, HH.mm") : "-"}
              </p>
            </div>
          ),
        },
        {
          header: "Customer Name",
          assessor: "Customer Name",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row?.value[1]}</p>
            </div>
          ),
        },
        {
          header: "Phone Number",
          assessor: "Phone Number",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row?.value[2]}</p>
            </div>
          ),
        },
        {
          header: "Email",
          assessor: "Email",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row?.value[3]}</p>
            </div>
          ),
        },
      ];

      const endColumns = [
        {
          header: "Point Earned",
          assessor: "Point Earned",
          Cell: (row) => (
            <div>
              <p
                className={`text-sm ${
                  row?.value[row?.value.length - 2] === -1 ? "italic text-neutral80" : "text-neutral300"
                }`}
              >
                {row?.value[row?.value.length - 2] !== -1
                  ? row?.value[row?.value.length - 2].toLocaleString("id")
                  : "Calculating"}
              </p>
            </div>
          ),
        },
        {
          header: "Total Point Earned",
          assessor: "Total Point Earned",
          Cell: (row) => (
            <div>
              <p
                className={`text-sm ${
                  row?.value[row?.value.length - 1] === -1 ? "italic text-neutral80" : "text-neutral300"
                }`}
              >
                {row?.value[row?.value.length - 1] !== -1
                  ? row?.value[row?.value.length - 1].toLocaleString("id")
                  : "Calculating"}
              </p>
            </div>
          ),
        },
      ];

      if (!campaignId) {
        return [...baseColumns, ...endColumns];
      }

      const selectedCampaign = campaigns?.data?.find((c) => c.id === id);

      const pointParameters = selectedCampaign?.campaignPointActive?.pointParameters || [];

      let dynamicColumns = [];

      pointParameters.forEach((param, index) => {
        if (param.settingParameterName === "Spend Amount") {
          dynamicColumns.push({
            header: "Amount",
            tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
            Cell: (row) => {
              const rowId = `${row?.value[0] + row?.value[1] + row?.value[2] + row?.value[3]}`;
              return (
                <ProductCell
                  row={row?.value[index + 4]}
                  isOpen={openRows[rowId]}
                  onOpen={() => handleToggleRowOpen(rowId)}
                />
              );
            },
          });
        } else if (param.settingParameterName === "Store") {
          dynamicColumns.push({
            header: "Store",
            assessor: "Store",
            Cell: (row) => (
              <div>
                <p className="text-black text-sm">{row?.value[index + 4].storeName || "-"}</p>
                <p className="text-neutral300 text-sm">{row?.value[index + 4].storeCode || "-"}</p>
              </div>
            ),
          });
        } else if (param.settingParameterName === "Date Time") {
          null;
          // dynamicColumns.push({
          //   header: "Date Time",
          //   assessor: "Date Time",
          //   Cell: (row) => (
          //     <div>
          //       <p className="text-black text-sm">
          //         {row?.value[index + 4].startDate
          //           ? moment(row?.value[index + 4].startDate).format("DD MMM YYYY, HH.mm") +
          //           (row?.value[index + 4].endDate ? " - " : "")
          //           : "-"}
          //       </p>
          //       {row?.value[index + 4].endDate && (
          //         <p className="text-black text-sm">
          //           {moment(row?.value[index + 4].endDate).format("DD MMM YYYY, HH.mm")}
          //         </p>
          //       )}
          //     </div>

          //   ),
          // });
        } else {
          dynamicColumns.push({
            header: param.settingParameterName,
            assessor: param.settingParameterName,
            Cell: (row) => (
              <div>
                <p className="text-black text-sm">{row?.value[index + 4] || "-"}</p>
              </div>
            ),
          });
        }
      });

      return [...baseColumns, ...dynamicColumns, ...endColumns];
    } else {
      const baseColumns = [
        {
          header: "Transaction Date",
          assessor: "Transaction Date",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">
                {row[0] ? moment(row[0], "DD-MM-YYYY HH:mm").format("DD MMM YYYY, HH.mm") : "-"}
              </p>
            </div>
          ),
        },
        {
          header: "Customer Name",
          assessor: "Customer Name",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row[1]}</p>
            </div>
          ),
        },
        {
          header: "Phone Number",
          assessor: "Phone Number",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row[2]}</p>
            </div>
          ),
        },
        {
          header: "Email",
          assessor: "Email",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row[3]}</p>
            </div>
          ),
        },
        {
          header: "Reward Name",
          assessor: "Reward Name",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row[4]}</p>
            </div>
          ),
        },
        {
          header: "Reward Type",
          assessor: "Reward Type",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">{row[5]}</p>
            </div>
          ),
        },
        {
          header: "Reward Price",
          assessor: "Reward Price",
          Cell: (row) => (
            <div>
              <p className="text-neutral300 text-sm">Rp {parseInt(row[6]).toLocaleString("id")}</p>
            </div>
          ),
        },
        {
          header: "Status",
          assessor: "Status",
          Cell: (row) => (
            <div>
              <Chip title={row[7]} type={row[7].toLowerCase() === "redeemed" ? "primary" : "success"} />
            </div>
          ),
        },
      ];
      return [...baseColumns];
    }
  };

  const columns = buildColumns(id, campaigns, openRows, handleToggleRowOpen);
  const { options: filterOptions, initialValues } = buildDataOptions(id, campaigns);

  async function handleDownloadReport() {
    try {
      toggleLoadingModal();
      var response = await DownloadSummaryCampaignDataDownload({
        filter: currentData,
        id: id,
        startDate: startDate,
        endDate: endDate,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportSummary_CampaignData_${today}`;
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
      var response = await DownloadSummaryCampaignRewardDataDownload({
        filter: currentData,
        id: id,
        startDate: startDate,
        endDate: endDate,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportSummary_CampaignData_${today}`;
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
  const [currentData, setCurrentData] = useState(initialValues);
  const parentRef = useRef(null);

  useEffect(() => {
    setTitleHeader("Detail Report");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-4">
          <div className="bg-white rounded-lg py-4 px-6 shadow-sm mb-6">
            <div className="mb-4">
              <div
                className="flex justify-between"
                onClick={() => setIsOpenCampaignInformation(!isOpenCampaignInformation)}
              >
                <p className="text-black text-lg font-semibold">Campaign Information</p>
                {isOpenCampaignInformation ? (
                  <PiCaretUp className="cursor-pointer" />
                ) : (
                  <PiCaretDown className="cursor-pointer" />
                )}
              </div>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
            </div>
            {isOpenCampaignInformation && (
              <>
                <div className="mb-4 flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium">{reportDetail?.data?.campaignName || "Loading..."}</p>
                    <p className="text-sm mt-1">
                      {moment(reportDetail?.data?.startDateCampaign, "DD-MM-YYYY HH:mm").format("DD MMM YYYY HH:mm")} -{" "}
                      {moment(reportDetail?.data?.endDateCampaign, "DD-MM-YYYY HH:mm").format("DD MMM YYYY HH:mm")}
                    </p>
                  </div>
                  <div>
                    <Chip
                      title={reportDetail?.data?.statusCampaign || "Loading..."}
                      type={
                        reportDetail?.data?.statusCampaign === "Active"
                          ? "success"
                          : reportDetail?.data?.statusCampaign === "Inactive"
                          ? "warning"
                          : "neutral"
                      }
                    />
                  </div>
                </div>
                <div className={`grid ${reportDetail?.data?.statusPoint ? "grid-cols-2" : "grid-cols-3"} gap-6 mb-2`}>
                  {reportDetail?.data?.statusPoint && (
                    <CardInfo title="Total Point Earned" value={reportDetail?.data?.totalPointEarned || 0} />
                  )}
                  <CardInfo title="Total Active Customers" value={reportDetail?.data?.totalActiveCustomer || 0} />
                  {!reportDetail?.data?.statusPoint && (
                    <>
                      <CardInfo title="Total Reward Generated" value={reportDetail?.data?.totalRewardGenerated || 0} />
                      <CardInfo title="Total Reward Redeemed" value={reportDetail?.data?.totalRewardRedeemed || 0} />
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="mb-6">
            <ReportAnalytics
              title="Campaign Analytics"
              description="Displays key metrics of the campaign performance."
              statusPoint={reportDetail?.data?.statusPoint}
              id={id}
              reportDetail={reportDetail}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm px-8 py-4">
            <p className="font-semibold text-lg">Campaign Data</p>
            <p className="text-black text-sm">
              {reportDetail?.data?.statusPoint
                ? "Displays detailed customer activities related to points earned and redeemed."
                : "Displays detailed customer activities related to reward generated and redeemed."}
            </p>
            <div className="h-px bg-neutral30 mt-2 mb-6"></div>
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
              {reportDetail?.data?.statusPoint ? (
                <OutlineButton
                  title={
                    <p className="flex items-center">
                      <PiDownloadSimple className="mr-2" />
                      Download
                    </p>
                  }
                  onClick={handleDownloadReport}
                />
              ) : (
                <OutlineButton
                  title={
                    <p className="flex items-center">
                      <PiDownloadSimple className="mr-2" />
                      Download
                    </p>
                  }
                  onClick={handleDownloadReportReward}
                />
              )}
            </div>
            <div className="shadow-sm h-full">
              {reportDetail?.data?.statusPoint ? (
                <DataTable
                  columns={columns}
                  reRender={reRender}
                  service={GetSummaryCampaignDataReportPagination}
                  queryName="report"
                  dependencies={[currentData, id, startDate, endDate, reportDetail?.data?.statusPoint]}
                  params={{ filter: currentData, id: id, startDate: startDate, endDate: endDate }}
                  options={{ pagination: true, isRounded: true }}
                  onClickRow={() => {}}
                  searchKeyword={`${JSON.stringify(currentData)}-${id}-${startDate || ""}-${endDate || ""}`}
                />
              ) : (
                <DataTable
                  columns={columns}
                  reRender={reRender}
                  service={GetSummaryCampaignDataRewardReportPagination}
                  queryName="report"
                  dependencies={[currentData, id, startDate, endDate, reportDetail?.data?.statusPoint]}
                  params={{ filter: currentData, id: id, startDate: startDate, endDate: endDate }}
                  options={{ pagination: true, isRounded: true }}
                  onClickRow={() => {}}
                  searchKeyword={`${JSON.stringify(currentData)}-${id}-${startDate || ""}-${endDate || ""}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DetailCampaignReport;
