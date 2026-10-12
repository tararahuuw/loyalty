import React from "react";
import { PiClockCounterClockwise } from "react-icons/pi";

const RecentChangesSection = ({ recentChanges = [] }) => {
    return (
        <div className="bg-white rounded-lg py-5 px-6 mt-8 shadow-md">
            <div className="flex items-center mb-4">
                <PiClockCounterClockwise size="24" className="text-warning500 mr-2" />
                <div>
                    <p className="text-sm text-black font-medium">Recent Changes</p>
                    <p className="text-xs text-neutral300">History of redemption settings changes</p>
                </div>
            </div>

            <div className="space-y-3">
                {recentChanges.map((change, index) => (
                    <div key={index} className="bg-warning50 px-4 py-2 rounded text-sm flex justify-between items-start">
                        <div>
                            <p className="text-sm text-black font-medium">{change.fieldName}</p>
                            <p className="text-neutral900 text-sm font-normal">{change.action}</p>
                        </div>
                        <div className="text-right text-neutral300 text-xs">
                            <p>{change.createdAt}</p>
                            <p>by {change.createdBy}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentChangesSection;