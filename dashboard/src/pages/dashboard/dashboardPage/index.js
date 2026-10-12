import React, { useEffect, useState } from "react";
import moment from "moment";
import _, { size } from "lodash";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DoughnutChart from "../../../components/DoughnutChart";
import DateTimePicker from "../../../components/DateTimePicker";
import { GetAllDataDashboard, GetAllDataDashboardClient, GetBestReward, GetCampaignData, GetDataDashboardDoughnut, GetSalesAnalyticCard, GetStatisticData, GetStatisticDataExternal, GetVoucherData } from "../../../service/dashboardmanagement/endpoint";

ChartJS.register(ArcElement, Tooltip, Legend);

import { useNavigate } from "react-router-dom";
import {
    FilterCheckboxDropdown
} from "sprint-asia-custom-component";
import { PiArrowRight, PiNotePencil, PiTrash } from "react-icons/pi";
import DataTable from "../../../components/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { DeleteDashboard, GetAllDashboard } from "../../../service/dashboardmanagement/endpoint";
import PercentageIndicator from "../../../components/PercentageIndicator";
import BestVoucherList from "../../../components/BestVocuherList";
import LineChart from "../../../components/SalesAnalytics";
import ClientTraffic from "../../../components/ClientTraffic";
import SalesAnalyticCard from "../../../components/SalesAnalytics";
import axios from "axios";
import PerformanceAnalytics from "../../../components/PerformanceAnalytics";
import DropdownButton from "../../../components/DropdownButton";
import MonthPicker from "../../../components/MonthPicker";
import { GetAllDivisionByClientId, GetAllDivisionByClientName } from "../../../service/usermanagement/endpoint";

const DashboardPage = ({ userName, clientId, divisionId, clientName, divisionName, roleAccess, setTitleHeader }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [startDate, setStartDate] = useState(moment().format("MM-YYYY"));
    const [generatedVouchers, setGeneratedVouchers] = useState([]);
    const [redeemedVouchers, setRedeemedVouchers] = useState([]);
    const [generatedVouchersClient, setGeneratedVouchersClient] = useState([]);
    const [redeemedVouchersClient, setRedeemedVouchersClient] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statisticData, setStatisticData] = useState([]);
    const [statisticDataClient, setStatisticDataClient] = useState([]);
    const [statisticDataExternal, setStatisticDataExternal] = useState([]);
    const [salesAnalyticCard, setSalesAnalyticCard] = useState([]);
    const [salesAnalytics, setSalesAnalytics] = useState({ labels: [], data: [] });
    const [activeCampaign, setActiveCampaign] = useState(0);
    const [inactiveCampaign, setInactiveCampaign] = useState(0);
    const [selectedVoucherType, setSelectedVoucherType] = useState('digitalVoucher');
    const [selectedMonthYear, setSelectedMonthYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [optionsDivision, setOptionsDivision] = useState([]);
    const [dataDivision, setDataDivision] = useState([]);
    const [selectedDivisionId, setSelectedDivisionId] = useState([]);

    useEffect(() => {
        if (roleAccess === "Client Administrator") {
            setSelectedDivisionId([]);
        }
    }, [roleAccess]);

    const handleMonthChange = (monthYear) => {
        setSelectedMonthYear(monthYear);
    };

    useEffect(() => {
        setTitleHeader("Dashboard");
    }, []);

    useEffect(() => {
        if (roleAccess === "Client Administrator" && clientId && divisionId) {
            getAllDivisionByClientId(clientId)
            setDataDivision([divisionId])
        }
    }, [roleAccess, clientId, divisionId])

    async function getAllDivisionByClientId() {
        try {
            const response = await GetAllDivisionByClientId({ clientId: clientId });
            if (response.data) {
                setOptionsDivision(response.data.map(option => ({ option: option.name, value: option.id })));
            }
            else {
                setOptionsDivision([]);
                setDataDivision([]);
            }
        } catch (error) {
            handleOpenModalResult("failed", "Oops! There was an error loading the data. Please try again.");
        }
    }

    const [dataRewardItem, setDataRewardItem] = useState({
        labels: [],
        datasets: [{
            data: [0, 0, 0, 0],
            backgroundColor: [],
            hoverOffset: 4
        }]
    });


    const [totalVoucher, setTotalVoucher] = useState(0);

    const optionRewardItem = {
        cutout: '75%',
        rotation: -90,
        circumference: 360,
        animation: {
            duration: 0,
        },
        plugins: {
            legend: {
                display: false,
                position: "bottom",
                align: "start",
                labels: {
                    font: {
                        size: 12,
                        family: "Arial",
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
                        const label = context[0].label;
                        const value = context[0].raw || 0;
                        const total = context[0].dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);

                        const formattedLabel = label
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/^\w/, (c) => c.toUpperCase());

                        return `${formattedLabel}`;
                    },
                    label: function (context) {
                        const label = context.label;
                        const currentMonth = new Date().toLocaleString('default', { month: 'short' });

                        const formattedLabel = label
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/^\w/, (c) => c.toUpperCase());

                        return `Stock ${formattedLabel} Reward Item in ${currentMonth}: `;
                    },
                    afterLabel: function (context) {
                        const label = context.label;
                        const index = dataRewardItem.labels.indexOf(label);
                        const dataValues = dataRewardItem.datasets[0].data;
                        const value = dataValues[index] || 0;
                        return `${value.toLocaleString()}`;
                    },
                }
            },
            centerText: {
                text: "Total Voucher",
                subText: totalVoucher.toLocaleString()
            }
        }
    };

    useEffect(() => {
        if (roleAccess === "System Administrator") {
            const fetchDataVoucher = async () => {
                try {

                    const body = { clientId: clientId ? [clientId] : [] }
                    const response = await GetDataDashboardDoughnut(body);

                    if (response.data?.voucherStock) {

                        const voucherData = response.data.voucherStock
                            .find(v => v.type === selectedVoucherType)?.data;
                        if (voucherData) {
                            const total = voucherData.totalVoucher || 0;
                            const dataLabels = [];
                            const dataValues = [];

                            for (const key in voucherData) {
                                if (Object.prototype.hasOwnProperty.call(voucherData, key) && key !== 'totalVoucher') {
                                    const element = voucherData[key];
                                    dataLabels.push(key)
                                    dataValues.push(element)
                                }
                            }

                            setTotalVoucher(total);

                            setDataRewardItem({
                                labels: dataLabels,
                                datasets: [{
                                    data: dataValues,
                                    backgroundColor: ['#E0E0E0', '#034EA2', '#BCCB33', '#F9BA15'],
                                    hoverOffset: 4
                                }]
                            });
                        }
                    }
                } catch (error) {
                    throw error;
                }
            };

            fetchDataVoucher();

            const interval = setInterval(() => {
                fetchDataVoucher();
            }, 3600000);

            return () => clearInterval(interval);
        }
    }, [roleAccess, selectedVoucherType]);

    const [dataCampaign, setDataCampaign] = useState({
        labels: [],
        datasets: [{
            data: [0, 0],
            backgroundColor: [],
            hoverOffset: 4
        }]
    });

    const [totalCampaign, setTotalCampaign] = useState(0);

    const optionCampaign = {
        cutout: '75%',
        rotation: -90,
        circumference: 360,
        animation: {
            duration: 0,
        },
        plugins: {
            legend: {
                display: false,
                position: 'bottom',
                labels: {
                    color: '#555',
                    font: {
                        size: 14
                    },
                    textAlign: 'left',
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
                        const label = context[0].label;
                        const value = context[0].raw || 0;
                        const total = context[0].dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);

                        return `${label} ${percentage}%`;
                    },
                    label: function (context) {
                        const label = context.label;
                        const currentMonth = new Date().toLocaleString('default', { month: 'short' });

                        return `Campaign ${label} in ${currentMonth}: `;
                    },
                    afterLabel: function (context) {
                        const label = context.label;
                        const index = dataCampaign.labels.indexOf(label);
                        const dataValues = dataCampaign.datasets[0].data;
                        const value = dataValues[index] || 0;
                        return `${value.toLocaleString()}`;
                    },
                }
            },
            centerText: {
                text: "Total Campaign",
                subText: totalCampaign.toLocaleString()
            }
        }
    };

    useEffect(() => {
        if (roleAccess === "System Administrator") {
            const fetchCampaignData = async () => {
                try {
                    const body = { clientId: clientId ? [clientId] : [] }

                    const response = await GetDataDashboardDoughnut(body);

                    if (response.data?.campaign) {
                        const campaignData = response.data.campaign;
                        const active = campaignData.active || 0;
                        const inactive = campaignData.inactive || 0;
                        const total = campaignData.total || 0;

                        const dataLabels = [];
                        const dataValues = [];

                        for (const key in campaignData) {
                            if (Object.prototype.hasOwnProperty.call(campaignData, key) && key !== 'total') {
                                const element = campaignData[key];
                                dataLabels.push(key)
                                dataValues.push(element)
                            }
                        }

                        setActiveCampaign(active);
                        setInactiveCampaign(inactive);
                        setTotalCampaign(total);

                        setDataCampaign({
                            labels: dataLabels.map(label =>
                                label.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^\w/, (c) => c.toUpperCase())
                            ),
                            datasets: [{
                                data: dataValues,
                                backgroundColor: ['#034EA2', '#E6EDF6'],
                                hoverOffset: 4
                            }]
                        });

                        optionCampaign.plugins.centerText.subText = total.toString();
                    } else {
                        setDataCampaign([]);
                    }
                } catch (error) {
                    throw error;
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCampaignData();
            const interval = setInterval(() => {
                fetchCampaignData();
            }, 3600000);

            return () => clearInterval(interval);
        }

    }, [roleAccess]);

    const centerTextPlugin = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width } = chart;
            const { top, bottom } = chart.chartArea;
            const { ctx } = chart;

            const centerTextOptions = chart.config.options.plugins.centerText;
            if (!centerTextOptions) return;

            const text = centerTextOptions.text || "";
            const subText = centerTextOptions.subText || "";

            ctx.save();
            ctx.textAlign = "center";
            ctx.fillStyle = "#636364";

            ctx.font = "14px Arial";
            const textHeight = ctx.measureText("M").width;
            const textMargin = 16;

            ctx.font = "32px Arial";
            const subTextHeight = ctx.measureText("M").width;

            const centerX = width / 2;
            const centerY = (top + bottom) / 2;

            ctx.font = "14px Arial";
            ctx.fillText(text, centerX, centerY - (textHeight / 2) - (textMargin / 2));

            ctx.font = "32px Arial";
            ctx.fillStyle = "#121214";
            ctx.fillText(subText, centerX, centerY + (subTextHeight / 2) + (textMargin / 2));

            ctx.restore();
        }
    };

    ChartJS.register(centerTextPlugin);

    useEffect(() => {
        const fetchStatisticData = async () => {
            try {
                setIsLoading(true);
                const formattedDate = moment(startDate, "MM-YYYY").format("MM-YYYY");

                const body = {
                    date: formattedDate,
                    clientId: clientId ? [clientId] : [],
                    divisionId: selectedDivisionId.length > 0
                        ? selectedDivisionId.map(div => div.value)
                        : []
                };

                const { data } = await GetAllDataDashboard(body);

                const statistic = data?.statisticCard?.map((item) => ({
                    title: item.title,
                    status: item.status,
                    statusPercentage: item.statusPercentage,
                    total: item.total,
                    totalLastMonth: item.totalLastMonth,
                })) || [];

                setStatisticData(statistic);

            } catch (error) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        fetchStatisticData();
        const interval = setInterval(() => {
            fetchStatisticData();
        }, 3600000);
        return () => clearInterval(interval);
    }, [startDate, selectedDivisionId]);

    useEffect(() => {
        const fetchSalesAnalyticCardData = async () => {
            try {
                const formattedDate = moment(startDate, "MM-YYYY").format("MM-YYYY");

                const body = {
                    date: formattedDate,
                    clientId: clientId ? [clientId] : [],
                    divisionId: selectedDivisionId.length > 0
                        ? selectedDivisionId.map(div => div.value)
                        : []
                };
                const { data } = await GetAllDataDashboard(body);

                const card = data?.rewardSalesAnalytic?.card;

                if (card) {
                    const salesAnalyticCard = [{
                        title: card.title,
                        status: card.status,
                        statusPercentage: card.statusPercentage,
                        total: card.total,
                        totalLastMonth: card.totalLastMonth,
                    }];

                    setSalesAnalyticCard(salesAnalyticCard);
                } else {
                    setSalesAnalyticCard([]);
                }
            } catch (error) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        fetchSalesAnalyticCardData();

        const interval = setInterval(() => {
            fetchSalesAnalyticCardData();
        }, 3600000);

        return () => clearInterval(interval);
    }, [startDate, selectedDivisionId]);

    useEffect(() => {
        const fetchDataBestListVoucher = async () => {
            try {
                setIsLoading(true);
                const formattedDate = moment(startDate, "MM-YYYY").format("MM-YYYY");

                const body = {
                    date: formattedDate,
                    clientId: clientId ? [clientId] : [],
                    divisionId: selectedDivisionId.length > 0
                        ? selectedDivisionId.map(div => div.value)
                        : []
                };
                const { data } = await GetAllDataDashboard(body);
                const generated = data?.bestGeneratedReward?.map((item) => ({
                    image: item.voucherPhoto,
                    name: item.voucherName,
                    price: `Rp ${item.voucherPrice.toLocaleString("id-ID")}`,
                    generated: item.voucherQty,
                    stock: item.voucherStock
                })) || [];

                const redeemed = data?.bestRedeemedReward?.map((item) => ({
                    image: item.voucherPhoto,
                    name: item.voucherName,
                    price: `Rp ${item.voucherPrice.toLocaleString("id-ID")}`,
                    redeemed: item.voucherQty,
                    stock: item.voucherStock
                })) || [];

                setGeneratedVouchers(generated || []);
                setRedeemedVouchers(redeemed || []);
            } catch (error) {
                throw error;
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataBestListVoucher();

        const interval = setInterval(() => {
            fetchDataBestListVoucher();
        }, 3600000);

        return () => clearInterval(interval);

    }, [startDate, selectedDivisionId]);

    const internalRoles = [
        "System Administrator",
        "Ops Administrator",
        "Business Administrator",
        "Business Support",
        "Reconcile",
    ];

    const eksternalRoles = [
        "Client Administrator",
        "Client Support",
    ];

    return (
        <>
            <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
                {internalRoles.includes(roleAccess) ? (
                    <div>
                        <p className="font-semibold text-2xl">Hi! {userName ? userName : "Undefined Name"}</p>
                        <p className="text-neutral300 text-base">
                            Here's how {clientName ? clientName : "Undefined Client Name"} - {divisionName ? divisionName : "Undefined Client Name"} team is doing
                        </p>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-2xl">Hi! {userName ? userName : "Undefined Name"}</p>
                            <p className="text-neutral-300 text-base">
                                Here's how {clientName ? clientName : "Undefined Client Name"} - {divisionName ? divisionName : "Undefined Client Name"} team is doing
                            </p>
                        </div>
                        <div className="flex justify-items-center space-x-2">
                            <div className="w-fit mx-auto">
                                <MonthPicker
                                    value={startDate}
                                    onChange={setStartDate}
                                    placeholder={moment().format('MMMM YYYY')}
                                    mode="default"
                                    minDate={moment().toDate()}
                                />

                            </div>
                            <div className="flex-shrink-0 w-40 mx-auto">
                                <FilterCheckboxDropdown
                                    buttonText="Division"
                                    options={optionsDivision}
                                    currentValue={selectedDivisionId}
                                    onSelect={(selected) => {
                                        setSelectedDivisionId(selected);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {internalRoles.includes(roleAccess) && (
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <DoughnutChart
                            data={dataRewardItem}
                            options={optionRewardItem}
                            title="Stock Reward Item"
                            onSelectVoucherType={setSelectedVoucherType}
                        />
                        <DoughnutChart
                            data={dataCampaign}
                            options={optionCampaign}
                            title="Campaign"
                        />
                    </div>
                )}

                {internalRoles.includes(roleAccess) && (
                    <div className="mt-6 flex justify-end">
                        <div className="inline-block">
                            <MonthPicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder={moment().format('MMMM YYYY')}
                                mode="default"
                                minDate={moment().toDate()}
                            />

                        </div>
                    </div>
                )}

                <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {statisticData.slice(0, 4).map((data, index) => (
                            <PercentageIndicator
                                key={index}
                                title={data.title}
                                status={data.status}
                                statusPercentage={data.statusPercentage}
                                total={data.total}
                                totalLastMonth={data.totalLastMonth}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {statisticData.slice(4).map((data, index) => (
                            <PercentageIndicator
                                key={index + 4}
                                title={data.title}
                                status={data.status}
                                statusPercentage={data.statusPercentage}
                                total={data.total}
                                totalLastMonth={data.totalLastMonth}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex space-x-6">
                    {(eksternalRoles.includes(roleAccess)) && (
                        <PerformanceAnalytics
                            title="Performance Analytics"
                            description="Performance Analytics only displays the information about your reward performance monthly."
                            salesCardData={salesAnalyticCard}
                            startDateButton={startDate}
                            setStartDateButton={setStartDate}
                            clientId={clientId}
                        />
                    )}
                </div>

                <div className="mt-6 flex space-x-6">
                    {(internalRoles.includes(roleAccess)) ? (
                        <LineChart
                            title="Reward Sales Analytics"
                            description="Sales Analytics only displays the information about your team activities when they are connected."
                            salesCardData={salesAnalyticCard}
                            startDateButton={startDate}
                            setStartDateButton={setStartDate}
                            clientId={clientId}
                        />
                    ) : (
                        <LineChart
                            title="Reward Spending Analytics"
                            description="Reward Sales Analytics only displays the information about your team activities when they are connected."
                            salesCardData={salesAnalyticCard}
                            startDateButton={startDate}
                            setStartDateButton={setStartDate}
                            clientId={clientId}
                        />
                    )}
                </div>

                <div className="mt-6 flex space-x-6">
                    {(internalRoles.includes(roleAccess)) && (
                        <ClientTraffic
                            title="Client Traffic"
                            description="Displays client activity graphic"
                            clientId={clientId}
                        />
                    )}
                </div>


                <div className="mt-6 flex space-x-6">
                    <BestVoucherList
                        title="Best-Generated Reward"
                        description="Products with the most sales."
                        vouchers={generatedVouchers}
                        isLoading={isLoading}
                    />
                    <BestVoucherList
                        title="Best-Redeemed Reward"
                        description="Products with the most sales."
                        vouchers={redeemedVouchers}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
};

export default DashboardPage;