import React, { useState, useEffect, useRef } from "react";
import _ from "lodash";

import { useParams } from "react-router-dom";
import { TabBar, ChipBar, OutlineButton, CardInfo, Alert, Chip } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import Description from "prezent/Description";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import moment from "moment";
import { PiClock, PiDownloadSimple } from "react-icons/pi";
import { formatPrefixPhoneNumber } from "../../../utils/index";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import {
  DownloadCustomerDetailPoint,
  DownloadCustomerDetailReward,
  GetActivityPointReport,
  GetActivityRewardReport,
  GetDetailCustomerReport,
  GetDetailCustomerSummaryReport,
} from "../../../service/ReportManagement/endpoint";
import MonthPicker from "../../../components/MonthPicker";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DetailCustomerReport = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [reRender, setReRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("Details");
  const [currentChip, setCurrentChip] = useState("Point");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const { data: data, isLoading: isLoadingData } = useFetch(id && GetDetailCustomerReport, "customer", [], { id });

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

  const columnsPoint = [
    {
      header: "Transaction Date",
      assessor: "Transaction Date",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm flex items-center">
              {moment(row.transactionDate).format("DD MMM YYYY HH:mm")}
            </p>
          </div>
        );
      },
    },
    {
      header: "Activity",
      assessor: "Activity",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.activity || "-"}</p>
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
              {row.status === "Earned" ? "+ " : row.status === "Claimed" ? "- " : ""}
              {row.pointTrx ? row.pointTrx.toLocaleString("id") : "-"}
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
            <p className="text-black text-sm">{row.remainingPoint ? row.remainingPoint.toLocaleString("id") : "-"}</p>
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
      header: "Reward Price",
      assessor: "Reward Price",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">{row.rewardPrice ? row.rewardPrice.toLocaleString("id") : "-"}</p>
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
            type={
              row.status === "Earned"
                ? "success"
                : row.status === "Claimed"
                  ? "warning"
                  : row.status === "Redeemed"
                    ? "primary"
                    : "warning"
            }
          />
        );
      },
    },
  ];

  const columnsReward = [
    {
      header: "Transaction Date",
      assessor: "Transaction Date",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm flex items-center">
              {moment(row.transactionDate).format("DD MMM YYYY HH:mm")}
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
          <div>
            <p className="text-black text-sm">{row.rewardName || "Loading..."}</p>
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
            <p className="text-black text-sm">{row.rewardType || "Loading..."}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Price",
      assessor: "Reward Price",
      Cell: (row) => {
        return (
          <div>
            <p className="text-black text-sm">
              {row.rewardPrice ? row.rewardPrice.toLocaleString("id") : "Loading..."}
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
            {row.validityPeriod?.start && row.validityPeriod?.end ? (
              <div>
                <p className="text-black text-sm flex items-center">
                  {moment(row.validityPeriod?.start).format("DD MMM YYYY HH:mm")} -
                </p>
                <p className="text-black text-sm flex items-center">
                  {moment(row.validityPeriod?.end).format("DD MMM YYYY HH:mm")}
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
      header: "Status",
      assessor: "Status",
      Cell: (row) => {
        return (
          <Chip
            title={row.status}
            type={
              row.status === "Generated"
                ? "success"
                : row.status === "Claimed"
                  ? "warning"
                  : row.status === "Redeemed"
                    ? "primary"
                    : "warning"
            }
          />
        );
      },
    },
  ];

  async function handleDownloadReportPoint() {
    try {
      toggleLoadingModal();
      var response = await DownloadCustomerDetailPoint({ time: timeDataPoint, filter: currentDataPoint, id: id });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportCustomer360_Activity_Points_${today}`;
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
      var response = await DownloadCustomerDetailReward({ time: timeDataReward, filter: currentDataReward, id: id });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `ReportCustomer360_Activity_Rewards_${today}`;
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

  // filter untuk Point
  const pointFilters = [
    {
      id: "transactionDate",
      label: "Transaction Date",
      type: "date",
    },
    { id: "activity", label: "Activity", type: "string" },
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
      id: "status",
      label: "Status",
      type: "checkbox",
      options: [
        { label: "Earned", value: "Earned" },
        { label: "Claimed", value: "Claimed" },
      ],
    },
  ];

  // filter untuk Rewards
  const rewardFilters = [
    {
      id: "transactionDate",
      label: "Transaction Date",
      type: "date",
    },
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
    { id: "rewardPrice", label: "Reward Price", type: "string" },
    {
      id: "validityPeriod",
      label: "Validity Period",
      type: "date",
    },
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      options: [
        { label: "Redeemed", value: "Redeemed" },
        { label: "Generated", value: "Generated" },
        { label: "Claimed", value: "Claimed" },
      ],
    },
  ];
  const filterOptionsPoint = pointFilters;
  const filterOptionsReward = rewardFilters;
  const [currentDataPoint, setCurrentDataPoint] = useState({
    transactionDate: { startDate: "", endDate: "", minRange: "", maxRange: "" },
    activity: "",
    rewardType: [],
    status: [],
  });
  const [currentDataReward, setCurrentDataReward] = useState({
    transactionDate: { startDate: "", endDate: "", minRange: "", maxRange: "" },
    rewardName: "",
    rewardType: [],
    rewardPrice: "",
    validityPeriod: { startDate: "", endDate: "" },
    status: [],
  });
  const [timeDataPoint, setTimeDataPoint] = useState({
    startDate: moment().format("MM-YYYY"),
    endDate: "",
  });
  const [timeDataReward, setTimeDataReward] = useState({
    startDate: moment().format("MM-YYYY"),
    endDate: "",
  });

  const { data: dataSummary, isLoading: isLoadingSummary } = useFetch(
    id && GetDetailCustomerSummaryReport,
    "summary",
    [id, currentChip, currentChip === "Point" ? timeDataPoint : timeDataReward],
    {
      id,
      startDate: currentChip === "Point" ? timeDataPoint.startDate : timeDataReward.startDate,
      endDate: currentChip === "Point" ? timeDataPoint.endDate : timeDataReward.endDate,
      chip: currentChip,
    }
  );

  const parentRef = useRef(null);
  const getMonthStartDate = (monthYear) =>
    monthYear
      ? moment(monthYear, "MM-YYYY").startOf("month").format("DD-MM-YYYY")
      : null;

  const getMonthEndDate = (monthYear) =>
    monthYear
      ? moment(monthYear, "MM-YYYY").endOf("month").format("DD-MM-YYYY")
      : null;

  useEffect(() => {
    setTitleHeader("Customer Details");
  }, []);

  useEffect(() => {
    setCurrentDataPoint((prev) => ({
      ...prev,
      transactionDate: {
        ...prev.transactionDate,
        startDate: "",
        endDate: "",
        minRange: getMonthStartDate(timeDataPoint?.startDate),
        maxRange: getMonthEndDate(
          timeDataPoint?.endDate || timeDataPoint?.startDate
        ),
      },
    }));
  }, [timeDataPoint]);
  useEffect(() => {
    setCurrentDataReward((prev) => ({
      ...prev,
      transactionDate: {
        ...prev.transactionDate,
        startDate: "",
        endDate: "",
        minRange: getMonthStartDate(timeDataReward?.startDate),
        maxRange: getMonthEndDate(
          timeDataReward?.endDate || timeDataReward?.startDate
        ),
      },
    }));
  }, [timeDataReward]);

  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Details", "Activity"]}
          dataValue={["Details", "Activity"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
        {currentTab === "Activity" && (
          <ChipBar
            dataBar={["Point", "Rewards"]}
            dataValue={["Point", "Rewards"]}
            currentTab={currentChip}
            onChangeChipBar={(chip) => setCurrentChip(chip)}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral20" style={{ minHeight: "calc(100dvh - 165px)" }}>
        {currentTab === "Details" ? (
          <div>
            <div className="pt-16 px-8">
              <div className="bg-white rounded-lg py-4 px-6 shadow-md mb-4">
                <div className="flex items-center justify-between">
                  <p className="text-black text-lg font-semibold">Personal Detail</p>
                  <div className="flex items-center">
                    <PiClock size={20} />
                    <p className="ml-2 font-medium text-sm">
                      Last updated on {moment(data?.data?.updatedAt).format("DD MMM YYYY HH:mm:ss")}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                  <div className="grid grid-cols-5 gap-4">
                    <Description title="Customer Name" value={data?.data?.customerName || "Loading..."} />
                    <Description title="Customer ID" value={data?.data?.id || "Loading..."} />
                    <Description title="Email" value={
                      <span className="break-words whitespace-normal">
                        {data?.data?.email || "Loading..."}
                      </span>
                    } />
                    <Description
                      title="Phone Number"
                      value={formatPrefixPhoneNumber(data?.data?.phoneNumber) || "Loading..."}
                    />
                    <Description
                      title="Total Earned Point"
                      value={
                        data?.data?.totalEarnedPoint !== null
                          ? data?.data?.totalEarnedPoint.toLocaleString("id")
                          : "Loading..."
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            {data?.data?.tierLevels && (
              <div className="pt-2 px-8 mb-8">
                <div className="bg-white rounded-lg py-5 px-6 shadow-md">
                  <div>
                    <p className="text-black text-lg font-semibold">Tier Level</p>
                    <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                    <p className="text-black text-sm font-normal">
                      Customers will be upgraded to the tier immediately once the criteria is reached.
                    </p>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {data &&
                        data?.data?.tierLevels?.map((value, index) => (
                          <div
                            className={`border-2 
                              ${data?.data?.tier?.currentTierId === value?.id
                                ? "border-info500 shadow"
                                : "border-neutral30"
                              } 
                              rounded-lg p-4 w-fit flex items-start`}
                            key={index}
                            style={{ minHeight: "10px" }}
                          >
                            <div>
                              {data?.data?.tier?.currentTierId === value?.id && (
                                <div className="w-fit">
                                  <p className="inline-block px-4 py-0.5 bg-info500 rounded-full text-white text-sm">
                                    Current tier
                                  </p>
                                </div>
                              )}
                              <p
                                className={`text-2xl ${data?.data?.tier?.currentTierId === value?.id ? "text-black" : "text-neutral80"
                                  } py-2 font-semibold`}
                              >
                                {value?.name}
                              </p>
                              <div>
                                {value?.criteriaName === "Spend Amount" && (
                                  <p className="text-neutral80 text-sm font-medium">
                                    Amount Transaction :{" "}
                                    <span className="text-black font-normal">
                                      Rp {value?.valueCriteria1 ? value?.valueCriteria1?.toLocaleString("id") : 0}
                                    </span>
                                  </p>
                                )}
                                {value?.criteriaName === "Frequency" && (
                                  <p className="text-neutral80 text-sm font-medium">
                                    Frequency :{" "}
                                    <span className="text-black font-normal">
                                      {value?.valueCriteria1 ? value?.valueCriteria1?.toLocaleString("id") : 0} x
                                    </span>
                                  </p>
                                )}
                                {(value?.criteriaName === "Amount AND Frequency" ||
                                  value?.criteriaName === "Amount OR Frequency") && (
                                    <p className="text-neutral80 text-sm font-medium">
                                      Amount :{" "}
                                      <span className="text-black font-normal">
                                        Rp {value?.valueCriteria1 ? value?.valueCriteria1?.toLocaleString("id") : 0}
                                      </span>
                                    </p>
                                  )}
                                {value?.criteriaName === "Amount OR Frequency" && (
                                  <p className="text-neutral80 text-sm font-medium my-1">OR</p>
                                )}
                                {value?.criteriaName === "Amount AND Frequency" && (
                                  <p className="text-neutral80 text-sm font-medium my-1">AND</p>
                                )}
                                {(value?.criteriaName === "Amount AND Frequency" ||
                                  value?.criteriaName === "Amount OR Frequency") && (
                                    <p className="text-neutral80 text-sm font-medium">
                                      Frequency :{" "}
                                      <span className="text-black font-normal">
                                        {value?.valueCriteria2 ? value?.valueCriteria2?.toLocaleString("id") : 0} x
                                      </span>
                                    </p>
                                  )}
                                {value?.criteriaName !== "Amount AND Frequency" &&
                                  value?.criteriaName !== "Amount OR Frequency" &&
                                  value?.criteriaName !== "Spend Amount" &&
                                  value?.criteriaName !== "Frequency" && (
                                    <p className="text-neutral80 text-sm font-medium">
                                      {value?.criteriaName} :{" "}
                                      <span className="text-black font-normal">
                                        {value?.valueCriteria1
                                          ? value?.valueCriteria1?.toLocaleString("id")
                                          : "Loading..."}
                                      </span>
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="border rounded-lg p-4 mt-4">
                      <div>
                        <p className="text-neutral300 text-sm">
                          Customers have accumulated
                          <span className="text-black">
                            {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                              data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                              data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                              " Amount :"}
                          </span>
                          <span className="text-black">
                            {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                              data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                              data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                              ` ${data?.data?.tier?.criteriaName} : `}
                          </span>
                          <span className="text-neutral300">
                            {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                              data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                              data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                              " Rp "}
                          </span>
                          <span className="text-black">
                            {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                              data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                              data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                              data?.data?.tier?.progress?.valueProgress1.toLocaleString("id")}
                          </span>
                          <span className="text-black">
                            {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                              data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                              data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                              data?.data?.tier?.progress?.valueProgress1.toLocaleString("id")}
                          </span>
                          <span className="text-neutral300">
                            {data?.data?.tier?.criteriaName === "Amount OR Frequency" && " OR "}
                          </span>
                          <span className="text-neutral300">
                            {data?.data?.tier?.criteriaName === "Amount AND Frequency" && " AND "}
                          </span>
                          <span className="text-black">
                            {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                              data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                              "Frequency : " + data?.data?.tier?.progress?.valueProgress2.toLocaleString("id")}
                          </span>
                          <span className="text-neutral300">
                            {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                              data?.data?.tier?.criteriaName === "Amount AND Frequency" ||
                              data?.data?.tier?.criteriaName === "Frequency") &&
                              " x"}
                          </span>
                          {data?.data?.tier?.maxTierMessage !== "have reached the highest tier" ? " ." : " and have reached the highest tier."}
                        </p>
                        {
                          data?.data?.tier?.maxTierMessage !== "have reached the highest tier" &&
                          <>
                            {data?.data?.tier?.isParameterIdentic ? (
                              <p className="text-neutral300 text-sm">
                                To reach the next tier,
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    " Amount : "}
                                </span>
                                <span className="text-black">
                                  {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                                    data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                                    data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                                    ` ${data?.data?.tier?.criteriaName} : `}
                                </span>
                                <span className="text-neutral300">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    " Rp "}
                                </span>
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    data?.data?.tier?.progress?.valueProgress3.toLocaleString("id")}
                                </span>
                                <span className="text-black">
                                  {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                                    data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                                    data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                                    data?.data?.tier?.progress?.valueProgress3.toLocaleString("id")}
                                </span>
                                <span className="text-neutral300">
                                  {data?.data?.tier?.criteriaName === "Amount OR Frequency" && " OR "}
                                </span>
                                <span className="text-neutral300">
                                  {data?.data?.tier?.criteriaName === "Amount AND Frequency" && " AND "}
                                </span>
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    " Frequency : " + data?.data?.tier?.progress?.valueProgress4.toLocaleString("id")}
                                </span>
                                <span className="text-neutral300">
                                  {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency" ||
                                    data?.data?.tier?.criteriaName === "Frequency") &&
                                    " x"}
                                </span>{" "}
                                is required .
                              </p>
                            ) : (
                              <p className="text-neutral300 text-sm">
                                Left out of
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    " Amount :"}
                                </span>
                                <span className="text-black">
                                  {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                                    data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                                    data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                                    ` ${data?.data?.tier?.criteriaName} : `}
                                </span>
                                <span className="text-neutral300">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    " Rp "}
                                </span>
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Spend Amount" ||
                                    data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    data?.data?.tier?.progress?.valueProgress3.toLocaleString("id")}
                                </span>
                                <span className="text-black">
                                  {data?.data?.tier?.criteriaName !== "Spend Amount" &&
                                    data?.data?.tier?.criteriaName !== "Amount OR Frequency" &&
                                    data?.data?.tier?.criteriaName !== "Amount AND Frequency" &&
                                    data?.data?.tier?.progress?.valueProgress3.toLocaleString("id")}
                                </span>
                                <span className="text-neutral300">
                                  {data?.data?.tier?.criteriaName === "Amount OR Frequency" && " OR "}
                                </span>
                                <span className="text-neutral300">
                                  {data?.data?.tier?.criteriaName === "Amount AND Frequency" && " AND "}
                                </span>
                                <span className="text-black">
                                  {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency") &&
                                    "Frequency : " + data?.data?.tier?.progress?.valueProgress4.toLocaleString("id")}
                                </span>
                                <span className="text-neutral300">
                                  {(data?.data?.tier?.criteriaName === "Amount OR Frequency" ||
                                    data?.data?.tier?.criteriaName === "Amount AND Frequency" ||
                                    data?.data?.tier?.criteriaName === "Frequency") &&
                                    " x"}
                                </span>{" "}
                                to reach the next tier .
                              </p>
                            )}
                          </>
                        }
                      </div>
                      <ProgressBar
                        progress={Math.round(data?.data?.tier?.progress.percentage || 0)}
                      />
                      {data?.data?.tier?.downGradePoint && (
                        <div className="mt-2">
                          <p className="text-neutral300 text-sm">
                            Encourage your Customers to purchase and maintain their level before:
                          </p>
                          <p className="text-black font-medium text-sm">
                            {moment(data?.data?.tier?.downGradePoint).format("DD MMM YYYY")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="pt-28 px-8 mb-6">
              <div className="bg-white rounded-lg py-4 px-6 shadow-md">
                <div>
                  <div class="grid grid-cols-2 gap-4">
                    <Description
                      title={<p className="font-semibold text-lg">{dataSummary?.data?.customerName || "Loading..."}</p>}
                      value={
                        <p className="font-normal text-neutral300">
                          {"CUSTOMER ID : " + (dataSummary?.data?.id || "Loading...")}
                        </p>
                      }
                    />
                    {currentChip === "Point" ? (
                      <Description
                        title={<p className="text-neutral300">Point Balance</p>}
                        value={
                          <p className="font-semibold text-lg text-black">
                            {dataSummary?.data?.pointBalance?.toLocaleString("id", "ID") || 0} pts
                          </p>
                        }
                      />
                    ) : (
                      <div>
                        <Description
                          title={<p className="text-neutrasl300">Reward Balance</p>}
                          value={
                            <p className="font-semibold text-lg text-black">
                              {dataSummary?.data?.rewardBalance?.toLocaleString("id", "ID") || 0} qty
                            </p>
                          }
                        />
                        <p>of {dataSummary?.data?.rewardItems?.toLocaleString("id", "ID") || 0} Reward Item</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg py-4 px-6 shadow-md mt-4">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-lg">Perfomance Overview</p>
                    <div className="flex items-center">
                      {currentChip === "Point" ? (
                        <MonthPicker
                          value={[
                            timeDataPoint.startDate ? moment(timeDataPoint.startDate, "MM-YYYY").toDate() : null,
                            timeDataPoint.endDate ? moment(timeDataPoint.endDate, "MM-YYYY").toDate() : null,
                          ]}
                          onChange={([start, end]) => {
                            setTimeDataPoint((prev) => ({
                              ...prev,
                              startDate: start ? moment(start).format("MM-YYYY") : "",
                              endDate: end ? moment(end).format("MM-YYYY") : "",
                            }));
                          }}
                        />
                      ) : (
                        <MonthPicker
                          value={[
                            timeDataReward.startDate ? moment(timeDataReward.startDate, "MM-YYYY").toDate() : null,
                            timeDataReward.endDate ? moment(timeDataReward.endDate, "MM-YYYY").toDate() : null,
                          ]}
                          onChange={([start, end]) => {
                            setTimeDataReward((prev) => ({
                              ...prev,
                              startDate: start ? moment(start).format("MM-YYYY") : "",
                              endDate: end ? moment(end).format("MM-YYYY") : "",
                            }));
                          }}
                        />
                      )}

                      <div className="ml-4">
                        <OutlineButton
                          title={
                            <p className="flex items-center">
                              <PiDownloadSimple className="mr-2" />
                              Download
                            </p>
                          }
                          onClick={
                            currentChip === "Point"
                              ? () => handleDownloadReportPoint()
                              : () => handleDownloadReportReward()
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <CardInfo
                      title={currentChip === "Point" ? "Total Earned Point" : "Total Rewards Generated"}
                      value={
                        currentChip === "Point"
                          ? `${dataSummary?.data?.totalEarnedPoint.toLocaleString("id")
                            ? dataSummary?.data?.totalEarnedPoint.toLocaleString("id")
                            : 0
                          } pts`
                          : `${dataSummary?.data?.totalRewardsGenerated
                            ? dataSummary?.data?.totalRewardsGenerated.toLocaleString("id")
                            : 0
                          } qty`
                      }
                    />
                    <CardInfo
                      title={currentChip === "Point" ? "Total Claimed Rewards" : "Total Rewards Redeemed"}
                      value={
                        currentChip === "Point"
                          ? `${dataSummary?.data?.totalClaimedRewards
                            ? dataSummary?.data?.totalClaimedRewards.toLocaleString("id")
                            : 0
                          } pts`
                          : `${dataSummary?.data?.totalRewardsRedeemed
                            ? dataSummary?.data?.totalRewardsRedeemed.toLocaleString("id")
                            : 0
                          } qty`
                      }
                    />
                  </div>
                  <div className="mt-4">
                    {currentChip === "Point" ? (
                      <Alert
                        title={
                          <p className="text-neutral300">
                            Usage Ratio:{" "}
                            <span className="text-primary500">
                              {dataSummary?.data?.usageRatio !== undefined
                                ? Number.isInteger(dataSummary.data.usageRatio)
                                  ? dataSummary.data.usageRatio.toLocaleString("id")
                                  : dataSummary.data.usageRatio.toString().split(".")[1]?.length === 1
                                    ? dataSummary.data.usageRatio.toLocaleString("id", {
                                      minimumFractionDigits: 1,
                                      maximumFractionDigits: 1,
                                    })
                                    : dataSummary.data.usageRatio.toLocaleString("id", {
                                      maximumFractionDigits: 2,
                                    })
                                : 0}
                            </span>
                            %
                          </p>
                        }
                        subtitle={
                          <p className="text-neutral300">
                            Customer earned a total of{" "}
                            <span className="text-neutral300">
                              {dataSummary?.data?.totalEarnedPoint
                                ? dataSummary.data.totalEarnedPoint.toLocaleString("id")
                                : 0}
                            </span>{" "}
                            points in{" "}
                            <span className="text-neutral300">
                              {(() => {
                                const start = moment(timeDataPoint?.startDate, "MM-YYYY").format("MMMM YYYY");
                                const end = timeDataPoint?.endDate
                                  ? moment(timeDataPoint.endDate, "MM-YYYY").format("MMMM YYYY")
                                  : null;
                                return end && start !== end ? `${start} - ${end}` : start;
                              })()}
                            </span>
                            , with{" "}
                            <span className="text-neutral300">
                              {dataSummary?.data?.totalClaimedRewards
                                ? dataSummary.data.totalClaimedRewards.toLocaleString("id")
                                : 0}
                            </span>{" "}
                            points claimed.
                          </p>
                        }
                      />
                    ) : (
                      <Alert
                        title={
                          <p className="text-neutral300">
                            Usage Ratio:{" "}
                            <span className="text-primary500">
                              {dataSummary?.data?.usageRatio !== undefined
                                ? Number.isInteger(dataSummary.data.usageRatio)
                                  ? dataSummary.data.usageRatio.toLocaleString("id")
                                  : dataSummary.data.usageRatio.toString().split(".")[1]?.length === 1
                                    ? dataSummary.data.usageRatio.toLocaleString("id", {
                                      minimumFractionDigits: 1,
                                      maximumFractionDigits: 1,
                                    })
                                    : dataSummary.data.usageRatio.toLocaleString("id", {
                                      maximumFractionDigits: 2,
                                    })
                                : 0}
                            </span>
                            %
                          </p>
                        }
                        subtitle={
                          <p className="text-neutral300">
                            Customer generated{" "}
                            <span className="text-neutral300">
                              {dataSummary?.data?.totalRewardsGenerated
                                ? dataSummary.data.totalRewardsGenerated.toLocaleString("id")
                                : 0}
                            </span>{" "}
                            rewards in{" "}
                            <span className="text-neutral300">
                              {(() => {
                                const start = moment(timeDataReward?.startDate, "MM-YYYY").format("MMMM YYYY");
                                const end = timeDataReward?.endDate
                                  ? moment(timeDataReward.endDate, "MM-YYYY").format("MMMM YYYY")
                                  : null;
                                return end && start !== end ? `${start} - ${end}` : start;
                              })()}
                            </span>
                            , with{" "}
                            <span className="text-neutral300">
                              {dataSummary?.data?.totalRewardsRedeemed
                                ? dataSummary.data.totalRewardsRedeemed.toLocaleString("id")
                                : 0}
                            </span>{" "}
                            redeemed.
                          </p>
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md h-full my-3 mx-8 p-6">
              <div className="flex justify-between items-center w-full pb-3">
                <div className="flex w-full">
                  <div>
                    {currentChip === "Point" ? (
                      <FilterDropdownMixed
                        parentRef={parentRef}
                        filterOptions={filterOptionsPoint}
                        currentData={currentDataPoint}
                        setCurrentData={setCurrentDataPoint}
                      />
                    ) : (
                      <FilterDropdownMixed
                        parentRef={parentRef}
                        filterOptions={filterOptionsReward}
                        currentData={currentDataReward}
                        setCurrentData={setCurrentDataReward}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="drop-shadow h-full">
                {currentChip === "Point" ? (
                  <DataTable
                    columns={columnsPoint}
                    reRender={reRender}
                    service={GetActivityPointReport}
                    queryName="customer-360"
                    dependencies={[currentDataPoint, id, currentChip, timeDataPoint]}
                    params={{
                      time: timeDataPoint,
                      filter: currentDataPoint,
                      id: id,
                    }}
                    options={{ pagination: true, isRounded: true }}
                    searchKeyword={`${JSON.stringify(currentDataPoint)}`}
                    onClickRow={() => { }}
                  />
                ) : (
                  <DataTable
                    columns={columnsReward}
                    reRender={reRender}
                    service={GetActivityRewardReport}
                    queryName="customer-360"
                    dependencies={[currentDataReward, id, currentChip, timeDataReward]}
                    params={{
                      time: timeDataReward,
                      filter: currentDataReward,
                      id: id,
                    }}
                    options={{ pagination: true, isRounded: true }}
                    searchKeyword={`${JSON.stringify(currentDataReward)}`}
                    onClickRow={() => { }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen || isLoadingData} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default DetailCustomerReport;
