import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import moment from "moment";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { formatPrice } from "../../utils";
import { GetAllDataDashboard, GetClientTraffic } from "../../service/dashboardmanagement/endpoint";
import FilterCheckbox from "../filter/filterCheckbox";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ClientTraffic = ({ clientId, title, description }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [dataFilter, setDataFilter] = useState([]);
    const [clientTraffic, setClientTraffic] = useState({ labels: [], data: [] });
    const [companyOptions, setCompanyOptions] = useState([]);
    const [startDate, setStartDate] = useState(moment().format("MM-YYYY"));

    useEffect(() => {
        let fetchInterval;
        let timeInterval;

        const fetchData = async () => {
            await fetchClientTraffic();
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
    }, [startDate]);

    const fetchClientTraffic = async () => {
        try {
            const formattedDate = moment(startDate, "MM-YYYY").format("MM-YYYY");

            const body = {
                date: formattedDate,
            };
            const { data } = await GetAllDataDashboard(body);

            if (data && data.clientTraffic) {
                const clientTrafficData = data.clientTraffic;

                setClientTraffic({
                    labels: clientTrafficData.label,
                    data: clientTrafficData.data,
                });

                setCompanyOptions(clientTrafficData.label);
            }
        } catch (error) {
            throw error;
        }
    };



    const handleFilterChange = (selectedCompanies) => {
        setDataFilter(selectedCompanies || []);
    };

    const filteredData = {
        labels: clientTraffic.labels.length > 0 && clientTraffic.labels.some(label => label.trim() !== "")
            ? (dataFilter.length > 0 ? clientTraffic.labels.filter(label => dataFilter.includes(label)) : clientTraffic.labels)
            : ["No Client Data Available"],
        datasets: [
            {
                label: "Traffic Transaction",
                data: dataFilter.length > 0
                    ? clientTraffic.data.filter((_, index) => dataFilter.includes(clientTraffic.labels[index]))
                    : clientTraffic.data,
                backgroundColor: "#034EA2",
                borderColor: "#034EA2",
                borderWidth: 1,
                borderRadius: {
                    topLeft: 10,
                    topRight: 10,
                    bottomLeft: 0,
                    bottomRight: 0,
                },
                borderSkipped: "bottom",
            },
        ],
    };

        const allValues = clientTraffic.data || [];
    const maxValue = Math.max(...allValues, 0);

    const getStepSize = (value, steps) => {
        const rawStep = value / (steps - 1);
        const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const step = Math.ceil(rawStep / magnitude) * magnitude;
        return step;
    };

    const numberOfSteps = 6;

    const stepSize = maxValue === 0 ? 500 : getStepSize(maxValue, numberOfSteps);
    const roundedMax = maxValue === 0 ? 2500 : stepSize * (numberOfSteps - 1);

    const options = {
        responsive: true,
        animation: {
            duration: 0,
        },
        plugins: {
            legend: {
                display: false,
                position: "top",
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: '#fff',
                titleColor: '#000',
                bodyColor: '#636364',
                borderWidth: 1,
                borderColor: '#ddd',
                displayColors: false,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                animation: false,
                callbacks: {
                    title: function (context) {
                        return context.label;
                    },
                    label: function (context) {
                        const label = context.label;
                        const currentDate = new Date();
                        const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
                        const previousMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                        const previousMonth = previousMonthDate.toLocaleString('default', { month: 'short' });
                        return `Traffic Trasaction on ${previousMonth}-${currentMonth}:`;
                    },
                    afterLabel: function (context) {
                        const value = context.raw || 0;
                        return formatPrice(value);
                    },
                },
            },
            title: {
                display: false,
                text: "Traffic Chart",
                font: {
                    size: 16,
                },
            },
        },

        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                    drawTicks: true,
                },
            },
            y: {
                beginAtZero: true,
                max: roundedMax,
                ticks: {
                    stepSize: stepSize,
                    color: "#000",
                    callback: function (value) {
                        if (value >= 1000) {
                            return `${value / 1000} k`;
                        }
                        return value;
                    },
                },
                grid: {
                    display: false,
                },
            },
        },

    };

    return (
        <div className="w-full bg-white rounded-lg border border-neutral40 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-semibold text-xl">{title}</p>
                    <p className="text-neutral300 text-sm">{description}</p>
                </div>

                <div className="flex items-center pl-4">
                    <FilterCheckbox
                        options={companyOptions}
                        dataFilterResult={dataFilter}
                        onSelect={handleFilterChange}
                        disabled={
                            clientTraffic.labels.length === 0 ||
                            clientTraffic.labels.every((label) => label.trim() === "")
                        }
                    />
                </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-4">
                <Bar data={filteredData} options={options} />
            </div>
            <div className="mt-2 text-right">
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
    );
};

export default ClientTraffic;
