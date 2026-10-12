import React, { useEffect, useState } from "react";
import moment from "moment";
import PercentageIndicator from "../PercentageIndicator";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { GetAllDataDashboard, GetSalesAnalytics } from "../../service/dashboardmanagement/endpoint";
import DateButton from "../DateButton";
import { formatPrice } from "../../utils";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler);

const LineChart = ({ roleAccess, clientId, title, description, salesCardData, startDateButton, setStartDateButton }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [startDate, setStartDate] = useState(moment().format("MM-YYYY"));
  const [salesAnalytics, setSalesAnalytics] = useState({ labels: [], data: [] });
  const [selectedData, setSelectedData] = useState([]);
  const [previousData, setPreviousData] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState([]);

  useEffect(() => {
    if (roleAccess === "Client Administrator") {
      setSelectedDivisionId([]);
    }
  }, [roleAccess]);

  useEffect(() => {
    let fetchInterval;
    let timeInterval;

    const fetchData = async () => {
      await fetchSalesAnalytics();
    };

    fetchData();

    fetchInterval = setInterval(fetchData, 3600000);

    timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 3600000);

    return () => {
      clearInterval(fetchInterval);
      clearInterval(timeInterval);
    };
  }, [startDateButton, selectedDivisionId]);

  const fetchSalesAnalytics = async () => {
    try {
      const formattedDate = moment(startDateButton, "MM-YYYY").format("MM-YYYY");

      const body = {
        date: formattedDate,
        clientId: clientId ? [clientId] : [],
        divisionId: selectedDivisionId.length > 0 ? selectedDivisionId : [],
      };

      const response = await GetAllDataDashboard(body);

      if (response?.data?.rewardSalesAnalytic?.chart) {
        const chartData = response.data.rewardSalesAnalytic.chart;

        const selectedData = chartData.find(item => item.label === "Selected Period")?.data || [];
        const previousData = chartData.find(item => item.label === "Previous Period")?.data || [];

        setSalesAnalytics({
          labels: selectedData.length > 0 ? selectedData.map((_, i) => (i + 1).toString()) : [],
          selected: selectedData,
          previous: previousData,
        });
      } else {
        const numDays = 31;
        setSalesAnalytics({
          labels: Array.from({ length: numDays }, (_, i) => (i + 1).toString()),
          selected: [],
          previous: [],
        });
      }
    } catch (error) {
      const numDays = 31;
      setSalesAnalytics({
        labels: Array.from({ length: numDays }, (_, i) => (i + 1).toString()),
        selected: [],
        previous: [],
      });
    }
  };

  const todayLabel = moment().format("D");
  const previousLabel = moment().subtract(1, "day").format("D");

  const chartData = {
    labels: salesAnalytics.labels.length ? salesAnalytics.labels : ["No Data"],
    datasets: [
      {
        label: "Selected Period",
        data: salesAnalytics.selected || [0],
        borderColor: "#034EA2",
        backgroundColor: "rgba(3, 78, 162, 0.1)",
        tension: 0.3,
        pointRadius: (context) => {
          const label = chartData.labels[context.dataIndex];
          return context.hovered ? 4 : 0;
        },
        pointHoverRadius: 4,
        pointBackgroundColor: "#034EA2",
      },
      {
        label: "Previous Period",
        data: salesAnalytics.previous || [0],
        borderColor: "#E0E0E0",
        backgroundColor: "rgba(224, 224, 224, 0.1)",
        fill: true,
        tension: 0.3,
        pointRadius: 0,
        pointRadius: (context) => {
          const label = chartData.labels[context.dataIndex];
          return context.hovered ? 4 : 0;
        },
        pointHoverRadius: 4,
        pointBackgroundColor: "#E0E0E0",
      },
    ],
  };

  const allValues = [
    ...(salesAnalytics.selected || []),
    ...(salesAnalytics.previous || []),
  ];

  const maxValue = Math.max(...allValues, 0);

  let yAxisMax;
  let yAxisStepSize;

  if (maxValue === 0) {
    yAxisMax = 20000000;
    yAxisStepSize = 5000000;
  } else {
    const rawStep = maxValue / 4;
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    yAxisStepSize = Math.ceil(rawStep / magnitude) * magnitude;
    yAxisMax = yAxisStepSize * 4;
  }


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#121214',
        bodyColor: '#175ACD',
        footerColor: '#9B9B9C',
        borderWidth: 1,
        borderColor: '#ddd',
        displayColors: false,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        animation: false,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 12,
        },
        footerFont: {
          size: 12,
        },
        callbacks: {
          title: (tooltipItems) => {
            const date = tooltipItems[0].label;
            return moment(date, "D").format("DD MMMM YYYY");
          },
          label: (tooltipItem) => {
            if (tooltipItem.dataset.label === "Selected Period") {
              const value = tooltipItem.raw.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              });
              return `Selected Period: ${value}`;
            }
            return null;
          },
          footer: (tooltipItems) => {
            if (!tooltipItems.length) return;
            const index = tooltipItems[0].dataIndex;
            const previousValue = salesAnalytics.previous[index] || 0;
            const formattedPrevValue = previousValue.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            });
            return `Previous Period: ${formattedPrevValue}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#000",
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: yAxisMax,
        ticks: {
          stepSize: yAxisStepSize,
          color: "#000",
          callback: function (value) {
            if (value === 0) return "0";
            if (value >= 1000000) return `Rp ${value / 1000000} m`;
            if (value >= 1000) return `Rp ${value / 1000} k`;
            return `Rp ${value}`;
          },
        },
        grid: {
          display: false,
        },
      },
    },
    hover: {
      mode: 'nearest',
      intersect: false,
      animationDuration: 0,
    },
  };

  return (
    <div className="w-full bg-white rounded-lg border border-neutral40 p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-xl">{title}</p>
          <p className="text-neutral300 text-sm">{description}</p>
        </div>

        <div className="flex justify-end">
          <div className="w-fit justify-items-center items-center">
            <DateButton
              startDateButton={startDateButton}
              setStartDateButton={startDateButton}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {salesCardData.map((item, index) => (
          <PercentageIndicator
            key={index}
            title={item.title}
            status={item.status}
            statusPercentage={item.statusPercentage}
            total={`Rp ${formatPrice(item.total)}`}
            totalLastMonth={`Rp ${formatPrice(item.totalLastMonth)}`}
          />
        ))}
      </div>
      <div className="mt-6" style={{ height: "383px" }}>
        <Line data={chartData} options={chartOptions} />
      </div>
      <div className="w-full flex justify-between mt-4">
        <div className="flex justify-items-start">
          <div className="flex items-center mr-4">
            <span className="w-7 h-1 bg-primary500 mr-2"></span>
            <p className="text-xs text-neutral500 whitespace-nowrap">Selected Period</p>
          </div>
          <div className="flex items-center mr-4">
            <span className="w-7 h-1 bg-neutral40 mr-2"></span>
            <p className="text-xs text-neutral500 whitespace-nowrap">Previous Period</p>
          </div>
        </div>
        <div className="w-full justify-items-end mt-4">
          <p className="text-xs text-neutral300">
            Last updated on{" "}
            <span className="font-bold">
              {currentTime.toLocaleDateString("en-GB", {
                day: "numeric",
              })}
            </span>{" "}
            {currentTime.toLocaleDateString("en-GB", {
              month: "short",
            })}{" "}
            {currentTime.toLocaleDateString("en-GB", {
              year: "numeric",
            })}{" "}
            at{" "}
            {currentTime.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
