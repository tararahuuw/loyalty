import React, { useEffect, useState } from "react";

import PhoneLayout from "prezent/PhoneLayout";
import { TabBar } from "sprint-asia-custom-component";

const PreviewSection = ({ contents, selectedType, formik }) => {
  const [currentTab, setCurrentTab] = useState("screen1");

  useEffect(() => {
    if (selectedType && selectedType !== "default") {
      setCurrentTab("screen2");
    } else {
      setCurrentTab("screen1");
    }
  }, [selectedType]);

  return (
    <div className="flex flex-col bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left">Preview</div>

      <div className="flex flex-col gap-4">
        <TabBar
          dataBar={selectedType === "default" || !selectedType ? ["Screen 1"] : ["Screen 1", "Screen 2"]}
          dataValue={["screen1", "screen2"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />

        <div className="flex justify-center">
          {currentTab === "screen1" ? (
            <PhoneLayout
              mode="Voucher"
              data={{
                voucherPhoto: formik.values.voucherPhoto
                  ? typeof formik.values.voucherPhoto === "string"
                    ? `${process.env.REACT_APP_API_URL}/voucher/${formik.values.voucherPhoto}`
                    : URL.createObjectURL(formik.values.voucherPhoto)
                  : null,
                productName: formik.values.voucherName,
                orderNumber: "1234567890",
                validDate: formik.values.validityEndDate,
                voucherDescription: formik.values.description,
                voucherBackgroundType: "color",
                voucherBackground: "#034ea2",
                messageTitle: "Message Title",
                message:
                  "MAP Gift Voucher is the official gift voucher of PT Mitra Adiperkasa Tbk. Accepted in 2,900 retail stores managed under MAP Group Indonesia, with a wide range of product brands. It is a perfect gift for Birthdays, Annivesaries, Valentines, Holidays, Festivals",
                howToRedeem: formik.values.howToRedeem,
                terms: formik.values.termAndConditions,
                clientLogo: "",
              }}
            />
          ) : (
            <PhoneLayout
              mode="Voucher2"
              data={{
                voucherPhoto: formik.values.voucherPhoto
                  ? typeof formik.values.voucherPhoto === "string"
                    ? `${process.env.REACT_APP_API_URL}/voucher/${formik.values.voucherPhoto}`
                    : URL.createObjectURL(formik.values.voucherPhoto)
                  : null,
                productName: formik.values.voucherName,
                orderNumber: "1234567890",
                validDate: formik.values.validityEndDate,
                voucherDescription: formik.values.description,
                voucherBackgroundType: "color",
                voucherBackground: "#034ea2",
                fields: contents,
                selectedType: selectedType,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;
