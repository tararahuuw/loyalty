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
import DateTimePicker from "../DateTimePicker";
import { GetAllDataDashboard, GetAllDataDashboardClient } from "../../service/dashboardmanagement/endpoint";
import DateButton from "../DateButton";

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler);

const PerformanceAnalytics = ({ roleAccess, clientId, title, description, salesCardData, startDateButton, setStartDateButton }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [performanceAnalytics, setPerformanceAnalytics] = useState({ labels: [], data: [] });
    const [startDate, setStartDate] = useState(moment().format("MM-YYYY"));
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
            await fetchPerformanceAnalytics();
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

    const fetchPerformanceAnalytics = async () => {
        try {
            const formattedDate = moment(startDateButton, "MM-YYYY").format("MM-YYYY");

            const body = {
                date: formattedDate,
                clientId: clientId ? [clientId] : [],
                divisionId: selectedDivisionId.length > 0 ? selectedDivisionId : []
            };

            const response = await GetAllDataDashboard(body);

            if (response?.data?.performanceAnalyticChart) {
                const chartData = response.data.performanceAnalyticChart;

                const activeUser = chartData.find(item => item.label === "Active User")?.data || [];
                const engagedCustomer = chartData.find(item => item.label === "Engaged Customer")?.data || [];
                const pointGenerated = chartData.find(item => item.label === "Point Generated")?.data || [];
                const pointRedeemed = chartData.find(item => item.label === "Point Redeemed")?.data || [];

                setPerformanceAnalytics({
                    labels: activeUser.length > 0 ? activeUser.map((_, i) => (i + 1).toString()) : [],
                    active: activeUser,
                    engaged: engagedCustomer,
                    pointgenerated: pointGenerated,
                    pointredeemed: pointRedeemed
                });

            } else {
                const numDays = 31;

                setPerformanceAnalytics({
                    labels: Array.from({ length: numDays }, (_, i) => (i + 1).toString()),
                    active: [],
                    engaged: [],
                    pointgenerated: [],
                    pointredeemed: []
                });
            }
        } catch (error) {
            console.error("Error fetching performance analytics:", error);
            const numDays = 31;

            setPerformanceAnalytics({
                labels: Array.from({ length: numDays }, (_, i) => (i + 1).toString()),
                selected: [],
                previous: [],
            });
        }
    };

    const chartData = {
        labels: performanceAnalytics.labels.length ? performanceAnalytics.labels : ["No Data"],
        datasets: [
            {
                label: "Active User",
                data: performanceAnalytics.active || [0],
                borderColor: "#F1AEB5",
                backgroundColor: "rgba(3, 78, 162, 0.1)",
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#F1AEB5",
            },
            {
                label: "Engaged Customer",
                data: performanceAnalytics.engaged || [0],
                borderColor: "#034EA2",
                backgroundColor: "rgba(3, 78, 162, 0.1)",
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#034EA2",
            },
            {
                label: "Point Generated",
                data: performanceAnalytics.pointgenerated || [0],
                borderColor: "#BCCB33",
                backgroundColor: "rgba(255, 168, 0, 0.1)",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#BCCB33",
            },
            {
                label: "Point Redeemed",
                data: performanceAnalytics.pointredeemed || [0],
                borderColor: "#F9BA15",
                backgroundColor: "rgba(255, 69, 0, 0.1)",
                fill: false,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointBackgroundColor: "#F9BA15",
            },
        ],
    };

    const allValues = [
        ...(performanceAnalytics.active || []),
        ...(performanceAnalytics.pointgenerated || []),
        ...(performanceAnalytics.pointredeemed || [])
    ];

    const maxValue = Math.max(...allValues, 0);

    const getStepSize = (value, steps) => {
        const rawStep = value / (steps - 1);
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const step = Math.ceil(rawStep / magnitude) * magnitude;
        return step;
    };

    const numberOfSteps = 7;

    const stepSize = maxValue === 0 ? 200 : getStepSize(maxValue, numberOfSteps);
    const roundedMax = maxValue === 0 ? 1200 : stepSize * (numberOfSteps - 1);

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
                    size: 10,
                },
                callbacks: {
                    title: (tooltipItems) => {
                        const date = tooltipItems[0].label;
                        return moment(date, "D").format("DD MMMM YYYY");
                    },
                    label: (tooltipItem) => {
                        const chart = tooltipItem.chart;
                        const data = chart.data;
                        const datasetIndex = tooltipItem.datasetIndex;
                        const dataIndex = tooltipItem.dataIndex;

                        if (!data || !data.datasets) return '';

                        const hoveredDataset = data.datasets[datasetIndex].label;
                        const orderedDatasets = [];

                        if (hoveredDataset === "Active User") {
                            orderedDatasets.push("Active User", "Engaged Customer", "Point Generated", "Point Redeemed");
                        } else if (hoveredDataset === "Engaged Customer") {
                            orderedDatasets.push("Engaged Customer", "Active User", "Point Generated", "Point Redeemed");
                        }
                        else if (hoveredDataset === "Point Generated") {
                            orderedDatasets.push("Point Generated", "Active User", "Engaged Customer", "Point Redeemed");
                        } else if (hoveredDataset === "Point Redeemed") {
                            orderedDatasets.push("Point Redeemed", "Active User", "Engaged Customer", "Point Generated");
                        }

                        return orderedDatasets.map((label) => {
                            const dataset = data.datasets.find((d) => d.label === label);
                            const value = dataset?.data[dataIndex] || 0;
                            return `${label} : ${value.toLocaleString("id-ID")}`;
                        });
                    },
                    labelTextColor: (tooltipItem) => {
                        const tooltip = tooltipItem.chart.tooltip;

                        if (!tooltip || !tooltip.dataPoints || tooltip.dataPoints.length === 0) {
                            return "#9B9B9C";
                        }

                        const hoveredIndex = tooltip.dataPoints[0].datasetIndex;
                        return tooltipItem.datasetIndex === hoveredIndex ? "#064CAD" : "#9B9B9C";
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
                max: maxValue === 0 ? 1200 : roundedMax,
                ticks: {
                    stepSize: maxValue === 0 ? 200 : stepSize,
                    color: "#000",
                    callback: function (value) {
                        return value.toLocaleString("id-ID");
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

            <div className="mt-6" style={{ height: "383px" }}>
                <Line data={chartData} options={chartOptions} />
            </div>
            <div className="w-full flex justify-between mt-4">
                <div className="flex justify-items-start">
                    <div className="flex items-center mr-4">
                        <span className="w-3 h-3 bg-danger200 mr-2"></span>
                        <p className="text-xs text-neutral500 whitespace-nowrap">Active User</p>
                    </div>
                    <div className="flex items-center mr-4">
                        <span className="w-3 h-3 bg-primary500 mr-2"></span>
                        <p className="text-xs text-neutral500 whitespace-nowrap">Engaged Customer</p>
                    </div>
                    <div className="flex items-center mr-4">
                        <span className="w-3 h-3 bg-secondary500 mr-2"></span>
                        <p className="text-xs text-neutral500 whitespace-nowrap">Point Generated</p>
                    </div>
                    <div className="flex items-center mr-4">
                        <span className="w-3 h-3 bg-warning500 mr-2"></span>
                        <p className="text-xs text-neutral500 whitespace-nowrap">Point Redeemed</p>
                    </div>
                </div>
                <div className="w-full justify-items-end mt-4">
                    <p className="text-sm text-neutral300">
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

export default PerformanceAnalytics;