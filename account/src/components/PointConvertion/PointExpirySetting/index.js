import React from "react";
import { TextInput, Switch } from "sprint-asia-custom-component";
import { PiCalendarX } from "react-icons/pi";

const PointExpirySetting = ({
    isPointExpiry,
    setExpiryEnabled,
    formik,
}) => {
    return (
        <div className="bg-white rounded-lg py-5 px-6 mt-8 shadow-md">
            <div className="flex items-center mb-4">
                <PiCalendarX size="24" className="text-danger500 mr-2" />
                <div>
                    <p className="text-sm text-black font-medium">Point Expiry Settings</p>
                    <p className="text-xs text-neutral300">Configure point expiration rules for earned points</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-sm text-black font-medium">Automatic Point Expiry</p>
                    <p className="text-xs text-neutral300">Points will expire after a period of inactivity</p>
                </div>
                <Switch
                    checked={isPointExpiry}
                    onChange={() => {
                        const newState = !isPointExpiry;
                        setExpiryEnabled(newState);
                    }}

                    isEdit
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-1/2 mb-2">
                <TextInput
                    placeholder="365"
                    value={formik.values.pointExpiryDays}
                    onChangeInput={(e) => {
                        formik.setFieldValue("pointExpiryDays", e.target.value);
                        formik.setFieldTouched("pointExpiryDays", true, false);
                    }}
                    type="number"
                    disabled={!isPointExpiry}
                    footer={(formik?.touched?.pointExpiryDays || formik?.submitCount > 0) && formik?.errors?.pointExpiryDays ? formik.errors.pointExpiryDays : null}
                    mode={(formik?.touched?.pointExpiryDays || formik?.submitCount > 0) && formik?.errors?.pointExpiryDays ? "danger" : "default"}
                />
                <span className="text-sm text-neutral500">days</span>
            </div>
            <div className="mt-2">
                <p className="text-xs text-neutral500">
                    Points will expire after{" "}
                    <span className="font-semibold text-neutral800">
                        <span className="font-semibold">{formik.values.pointExpiryDays} days </span>
                    </span>
                    of customer inactivity
                </p>
            </div>
        </div>
    );
};

export default PointExpirySetting;