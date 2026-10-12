import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { OutlineButton } from "sprint-asia-custom-component";
import { PiDownloadSimple } from "react-icons/pi";
import { DownloadDetailsReport, GetReportAnalyticsSummaryCampaign } from "../../service/ReportManagement/endpoint";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import { useFormik } from "formik";
import DropdownCheckbox from "../DropdownCheckbox";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend, Filler);

const ReportAnalytics = ({ title, description, statusPoint, id, reportDetail }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);

  const [selected, setSelected] = useState(
    statusPoint
      ? [
          { label: "Point Earned", value: "Point Earned" },
          { label: "Active Customer", value: "Active Customer" },
        ]
      : [
          { label: "Active Customer", value: "Active Customer" },
          { label: "Reward Generated", value: "Reward Generated" },
          { label: "Reward Redeemed", value: "Reward Redeemed" },
        ]
  );

  const options = statusPoint
    ? [
        { label: "Point Earned", value: "Point Earned" },
        { label: "Active Customer", value: "Active Customer" },
      ]
    : [
        { label: "Active Customer", value: "Active Customer" },
        { label: "Reward Generated", value: "Reward Generated" },
        { label: "Reward Redeemed", value: "Reward Redeemed" },
      ];
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startDate: moment().subtract(14, "days").format("YYYY-MM-DD"),
      endDate: moment().format("YYYY-MM-DD"),
      isEndDate: true,
      isIncludeTime: false,
    },
    validateOnChange: true,
  });
  const [analyticsData, setAnalyticsData] = useState(null);
  const { data: reportAnalytics } = useFetch(
    GetReportAnalyticsSummaryCampaign,
    "campaign",
    [id, formik.values.startDate, formik.values.endDate, selected],
    {
      id: id,
      startDate: moment(formik.values.startDate).format("DD-MM-YYYY"),
      endDate: moment(formik.values.endDate).format("DD-MM-YYYY"),
      isIncludeTime: false,
      filter: Array.isArray(selected) && selected.length > 0 ? selected.map((i) => i.value) : [],
    }
  );

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

  const chartData = {
    labels: analyticsData?.labels?.length
      ? analyticsData?.labels.map((item) => moment(item, "DD-MM-YYYY").format("DD MMM"))
      : ["-"],
    datasets: statusPoint
      ? [
          {
            label: "Point Earned",
            data: analyticsData?.pointEarned || [0],
            borderColor: "#064CAD",
            backgroundColor: "#064CAD",
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#064CAD",
          },
          {
            label: "Active Customer",
            data: analyticsData?.activeCustomer || [0],
            borderColor: "#28A745",
            backgroundColor: "#28A745",
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#28A745",
          },
        ]
      : [
          {
            label: "Active Customer",
            data: analyticsData?.activeCustomer || [0],
            borderColor: "#28A745",
            backgroundColor: "#28A745",
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#28A745",
          },
          {
            label: "Reward Generated",
            data: analyticsData?.rewardGenerated || [0],
            borderColor: "#A6D609",
            backgroundColor: "#A6D609",
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#A6D609",
          },
          {
            label: "Reward Redeemed",
            data: analyticsData?.rewardRedeemed || [0],
            borderColor: "#064CAD",
            backgroundColor: "#064CAD",
            fill: false,
            tension: 0,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointBackgroundColor: "#064CAD",
          },
        ],
  };

  const selectedValues = selected.map((s) => s.value);

  const finalDatasets =
    selected.length === 0 ? chartData.datasets : chartData.datasets.filter((ds) => selectedValues.includes(ds.label));

  const finalChartData = {
    ...chartData,
    datasets: finalDatasets,
  };

  const allValues = [
    ...(analyticsData?.activeCustomer || []),
    ...(analyticsData?.pointEarned || []),
    ...(analyticsData?.rewardGenerated || []),
    ...(analyticsData?.rewardRedeemed || []),
  ];

  const maxValue = Math.max(...allValues, 0);
  const roundedMax = Math.ceil(maxValue / 5) * 5;
  const stepSize = Math.ceil(roundedMax / 5);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        onClick: null,
        display: true,
        position: "bottom",
        align: "center",
        labels: {
          boxWidth: 10,
          boxHeight: 10,
        },
      },
      tooltip: {
        enabled: false,
        external: function (context) {
          const { chart, tooltip } = context;
          let tooltipEl = document.getElementById("custom-tooltip");

          // CREATE TOOLTIP ELEMENT
          if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "custom-tooltip";
            tooltipEl.style.position = "absolute";
            tooltipEl.style.background = "#fff";
            tooltipEl.style.border = "1px solid #ddd";
            tooltipEl.style.borderRadius = "6px";
            tooltipEl.style.zIndex = "999";
            tooltipEl.style.padding = "8px";
            tooltipEl.style.pointerEvents = "none";
            tooltipEl.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)";
            tooltipEl.style.font = "12px sans-serif";
            tooltipEl.style.transition = "all .1s ease";
            document.body.appendChild(tooltipEl);
          }

          // HIDE TOOLTIP
          if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
          }

          const { dataPoints } = tooltip;
          const hoveredDataset = dataPoints[0].dataset.label;

          // ORDER DATASETS LOGIC (tetap pakai punyamu)
          let orderedDatasets = [];
          if (statusPoint) {
            orderedDatasets =
              hoveredDataset === "Active Customer"
                ? ["Active Customer", "Point Earned"]
                : ["Point Earned", "Active Customer"];
          } else {
            if (hoveredDataset === "Active Customer") {
              orderedDatasets = ["Active Customer", "Reward Generated", "Reward Redeemed"];
            } else if (hoveredDataset === "Reward Generated") {
              orderedDatasets = ["Reward Generated", "Active Customer", "Reward Redeemed"];
            } else if (hoveredDataset === "Reward Redeemed") {
              orderedDatasets = ["Reward Redeemed", "Active Customer", "Reward Generated"];
            }
          }

          const dataHover = analyticsData;

          // TOOLTIP CONTENT
          let innerHtml = `
            <div style="font-weight:600; color:#636364; margin-bottom:4px; font-size:14px;">
                ${moment(dataHover?.labels[dataPoints[0]?.dataIndex], "DD-MM-YYYY").format("DD MMMM YYYY")}
            </div>
        `;

          orderedDatasets.forEach((label, i) => {
            let value = "0";
            if (label === "Point Earned") value = dataHover?.pointEarned[dataPoints[0]?.dataIndex];
            if (label === "Active Customer") value = dataHover?.activeCustomer[dataPoints[0]?.dataIndex];
            if (label === "Reward Redeemed") value = dataHover?.rewardRedeemed[dataPoints[0]?.dataIndex];
            if (label === "Reward Generated") value = dataHover?.rewardGenerated[dataPoints[0]?.dataIndex];

            innerHtml += `
                <div style="color:${i === 0 ? "#064CAD" : "#A6AAB3"}; margin:2px 0;">
                    ${label} : ${parseInt(value).toLocaleString("id")} ${label === "Point Earned" ? "Point" : ""}
                </div>
            `;
          });

          tooltipEl.innerHTML = innerHtml;

          // === POSITION TOOLTIP ON LEFT SIDE ===
          const canvasRect = chart.canvas.getBoundingClientRect();
          const scrollX = window.pageXOffset;
          const scrollY = window.pageYOffset;

          const tooltipWidth = tooltipEl.offsetWidth;
          const tooltipHeight = tooltipEl.offsetHeight;

          const offset = 12; // jarak dari titik hover

          // POSISI KIRI TITIK HOVER
          const left = canvasRect.left + scrollX + tooltip.caretX - tooltipWidth - offset;

          // POSISI VERTIKAL TENGAH
          const top = canvasRect.top + scrollY + tooltip.caretY - tooltipHeight / 2;

          tooltipEl.style.left = left + "px";
          tooltipEl.style.top = top + "px";

          tooltipEl.style.opacity = 1;
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000",
        },
        grid: {
          display: true,
          color: "#ECECEC",
          borderDash: [0, 0],
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: stepSize,
          color: "#000",
        },
        grid: {
          display: true,
          color: "#ECECEC",
          borderDash: [5, 5],
          drawBorder: false,
        },
      },
    },
    hover: {
      mode: "nearest",
      intersect: false,
      animationDuration: 0,
    },
    interaction: {
      mode: "nearest",
      axis: "xy",
      intersect: false,
    },
  };

  async function handleDownloadReport() {
    try {
      toggleLoadingModal();
      var response = await DownloadDetailsReport({
        id: id,
        startDate: moment(formik.values.startDate).format("DD-MM-YYYY"),
        endDate: moment(formik.values.endDate).format("DD-MM-YYYY"),
        isIncludeTime: false,
        filter: Array.isArray(selected) && selected.length > 0 ? selected.map((i) => i.value) : [],
      });
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

  function handleCheckCampaignPeriod() {
    const startRaw = reportDetail?.data?.startDateCampaign;
    const endRaw = reportDetail?.data?.endDateCampaign;

    const formatDateManual = (dateStr) => {
      if (!dateStr) return "";
      const clean = moment(dateStr, "DD-MM-YYYY HH:mm").format("YYYY-MM-DD");
      return clean;
    };

    formik.setFieldValue("startDate", formatDateManual(startRaw));
    formik.setFieldValue("endDate", formatDateManual(endRaw));
  }

  useEffect(() => {
    if (statusPoint === null || statusPoint === undefined) return;

    const newSelected = statusPoint
      ? [
          { label: "Point Earned", value: "Point Earned" },
          { label: "Active Customer", value: "Active Customer" },
        ]
      : [
          { label: "Active Customer", value: "Active Customer" },
          { label: "Reward Generated", value: "Reward Generated" },
          { label: "Reward Redeemed", value: "Reward Redeemed" },
        ];

    setSelected(newSelected);
  }, [statusPoint]);

  useEffect(() => {
    const start = formik.values.startDate;
    const end = formik.values.endDate;
    let raw = reportAnalytics?.data;
    const convertedLabels = raw?.labels;
    if (reportAnalytics) {
      if ((start && end && start === end) || (start && !end)) {
        const duplicated = {
          ...raw,
          labels: [convertedLabels[0], convertedLabels[0]],
          activeCustomer: [raw.activeCustomer[0], raw.activeCustomer[0]],
          pointEarned: [raw.pointEarned[0], raw.pointEarned[0]],
          rewardGenerated: [raw.rewardGenerated[0], raw.rewardGenerated[0]],
          rewardRedeemed: [raw.rewardRedeemed[0], raw.rewardRedeemed[0]],
        };
        setAnalyticsData(duplicated);
      } else {
        setAnalyticsData({
          ...raw,
          labels: convertedLabels,
        });
      }
    }
  }, [formik.values.startDate, formik.values.endDate, reportAnalytics]);

  const parentRef = useRef(null);

  return (
    <>
      <div className="w-full bg-white shadow-sm rounded-lg border border-neutral40 p-6 mt-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold text-xl">{title}</p>
            <p className="text-neutral300 text-sm">{description}</p>
          </div>
          <div className="flex items-center">
            <CustomDateTimePicker
              parentRef={parentRef}
              placeholder="Select Upload Date"
              value={[
                formik.values.startDate,
                formik.values.endDate,
                formik.values.isEndDate,
                formik.values.isIncludeTime,
              ]}
              onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                formik.setFieldValue(
                  `startDate`,
                  startDate ? moment.utc(startDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD") : null
                );
                formik.setFieldValue(
                  `endDate`,
                  endDate ? moment.utc(endDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD") : null
                );
                formik.setFieldValue(`isEndDate`, isEndDate);
                formik.setFieldValue(`isIncludeTime`, isIncludeTime);
              }}
              isVisibleTime={false}
              maxDate={moment().toDate()}
            />
            <div className="ml-4">
              <DropdownCheckbox
                options={options}
                currentValues={selected}
                onSelect={(values) => {
                  setSelected(values);
                }}
                title={null}
                placeholder={"Select Filter"}
                handleCheckCampaignPeriod={handleCheckCampaignPeriod}
              />
            </div>
            <div className="ml-4">
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
          </div>
        </div>

        <div className="mt-6" style={{ height: "383px" }}>
          <Line data={finalChartData} options={chartOptions} />
        </div>
      </div>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </>
  );
};

export default ReportAnalytics;
