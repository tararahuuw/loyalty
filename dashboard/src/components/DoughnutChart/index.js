import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import DropdownButton from "../DropdownButton";

const DoughnutChart = ({ data, options, title, onSelectVoucherType }) => {

    const handleSelect = (value) => {

        const formattedValue = value
            .toLowerCase()
            .replace(/\s(.)/g, (match, group1) => group1.toUpperCase());

        onSelectVoucherType(formattedValue);
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 3600000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full bg-white rounded-lg border border-neutral40 p-6">
            <div className="m-2">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xl font-semibold">
                            {title}
                        </p>
                        {(title === "Campaign") ? (
                            <p className="text-neutral300 text-sm">
                                The total active campaigns across all clients and divisions.
                            </p>
                        ) : (
                            <p className="text-neutral300 text-sm">
                                The total active reward items across all clients and divisions.
                            </p>
                        )}
                    </div>

                    {(title === "Stock Voucher" || title === "Stock Reward Item") && (
                        <div className="flex-shrink-0 w-fit">
                            <DropdownButton
                                defaultType="Digital Voucher"
                                options={['Digital Voucher', 'PPOB Voucher']}
                                onSelect={handleSelect}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-4 flex justify-center items-center w-80 h-80 mx-auto">
                <Doughnut data={data} options={options} />
            </div>

            <div className="w-full flex flex-wrap justify-center items-center mt-4">
                {data.labels.map((label, index) => (
                    <div key={index} className="flex items-center mr-6">
                        <span className="w-4 h-1 mr-2" style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}></span>
                        <p className="text-sm text-neutral300 whitespace-nowrap">
                            {label
                                .replace(/([a-z])([A-Z])/g, '$1 $2')
                                .replace(/^\w/, (c) => c.toUpperCase())
                            }
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-3 text-right">
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

export default DoughnutChart;