import React from "react";
import PhoneLayout from "prezent/PhoneLayout";

const LandingPagePreviewSection = ({
  contents = [],
  type,
  voucherPhoto,
  voucherName,
  endDate,
  description,
  howToRedeem,
  termAndConditions,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6 h-full">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Landing Page Preview
      </div>

      <div className="flex justify-center">
        <PhoneLayout
          mode="Voucher"
          data={{
            voucherPhoto: `${process.env.REACT_APP_API_URL}/voucher/${voucherPhoto}`,
            productName: voucherName,
            orderNumber: "1234567890",
            validDate: endDate,
            voucherDescription: description,
            howToRedeem: howToRedeem,
            terms: termAndConditions,
            voucherBackgroundType: "color",
            voucherBackground: "#034ea2",
            fields: contents,
            selectedType: type,
            messageTitle: "Message Title",
            message:
              "Enjoy exclusive savings with this special voucher! Whether it's a cozy dinner, exciting experience, or unique product, this offer is your ticket to something great. Terms and conditions apply.",
          }}
        />
      </div>
    </div>
  );
};

export default LandingPagePreviewSection;
