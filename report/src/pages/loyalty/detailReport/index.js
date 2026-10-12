import React, { useState, useEffect } from "react";
import moment from "moment";
import { PiArrowRight } from "react-icons/pi";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import PerformanceAnalytics from "../../../components/PerformanceAnalytics";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { GetDetailReportPoint } from "../../../service/reportloyaltymanagement/endpoint";
import { Description } from "sprint-asia-custom-component";
ChartJS.register(ArcElement, Tooltip, Legend);

const DetailReport = ({ roleAccess, setTitleHeader }) => {
    const { id } = useParams();
    const [reportDetail, setReportDetail] = useState(null);
    const [salesAnalyticCard, setSalesAnalyticCard] = useState([]);


    const fetchDetailReport = async () => {
        try {
            const response = await GetDetailReportPoint({ id, roleAccess })
            setReportDetail(response.data.customerPointReport);
        } catch (err) {
            setError("Error Fetching Report Data");
        }
    }

    useEffect(() => {
        setTitleHeader("Detail Report");
        fetchDetailReport();
    }, []);

    return (
        <>
            <div className="flex-1 h-full overflow-y-auto bg-neutral20">
                <div className="py-6 px-8 mb-16">
                    <div className="bg-white rounded-lg py-5 px-6 shadow-sm mb-6">
                        <div>
                            <p className="text-black text-lg font-semibold">Campaign Status</p>
                            <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                            <p className={`text-md font-semibold ${reportDetail?.campaignStatus ? "text-success500" : "text-neutral500"}`}>
                                {reportDetail?.campaignStatus ? "Campaign is Active" : "Campaign is Inactive"}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg py-5 px-6 shadow-sm">
                        <div className="mb-8">
                            <p className="text-black text-lg font-semibold">Point Rule Information</p>
                            <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                <div>
                                    <Description title="Campaign ID" value={reportDetail?.campaignId || "-"} />
                                </div>
                                <div>
                                    <Description title="Client" value={reportDetail?.clientName || "-"} />
                                </div>
                                <div>
                                    <Description title="Division" value={reportDetail?.divisionName || "-"} />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                <div>
                                    <Description title="Campaign Name" value={reportDetail?.pointRulesName || "-"} />
                                </div>
                                <div>
                                    <Description title="Active User" value={reportDetail?.activeUser || 0} />
                                </div>
                                <div>
                                    <Description
                                        title="Period"
                                        value={
                                            <>
                                                <div className="flex items-center">
                                                    <p className="text-sm font-semibold text-black mr-1">{moment(reportDetail?.startDatePeriod).format("DD MMM YYYY HH:mm")}</p>
                                                    <PiArrowRight />
                                                    <p className="text-sm font-semibold text-black">{moment(reportDetail?.endDatePeriod).format("DD MMM YYYY HH:mm")}</p>
                                                </div>
                                            </>
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                <div>
                                    <Description title="Point Generated" value={reportDetail?.generatedPoint || 0} />
                                </div>
                                <div>
                                    <Description title="Point Redeemed" value={reportDetail?.redeemedPoint || 0} />
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <PerformanceAnalytics
                            title="Campaign Analytics"
                            description="Campaign Analytics only displays the information about your campaign performance monthly."
                            salesCardData={salesAnalyticCard}
                            isPoint={true}
                            idCampaign={id}
                        />
                    </div>

                </div>
            </div>
        </>
    );
};

export default DetailReport;
