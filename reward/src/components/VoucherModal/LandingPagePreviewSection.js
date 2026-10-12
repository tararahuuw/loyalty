import React from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import moment from "moment";
import { Copy } from "@phosphor-icons/react";
import voucher from "../../assets/images/voucher_placeholder.png";
import LogoPrezentHidden from "../../assets/images/logo_prezent_hidden.png";
import KonnekLogo from "../../assets/images/konnek_logo.png";
import { PrimaryButton } from "sprint-asia-custom-component";

const LandingPagePreviewSection = ({
  name,
  refID,
  validDate,
  title,
  message,
  description,
  howToRedeem,
  termAndCondition,
  image,
}) => {
  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-sm p-6 h-full">
      <p className="pb-2 border-b border-neutral40 font-semibold text-lg">Landing Page Preview</p>

      <div className="flex justify-center overflow-hidden" style={{ height: 650 }}>
        <div style={{ transform: "scale(0.65)", transformOrigin: "top center" }}>
          <DeviceFrameset device="iPhone X" color="black" landscape={false} width={375} height={812}>
            <div className="flex flex-col h-full border overflow-y-auto no-scrollbar relative">
              <div className="bg-primary500 px-4 pt-40 pb-4 flex items-center justify-center">
                <img
                  src={image || voucher}
                  alt={image}
                  className="object-contain"
                  style={{ maxWidth: "340px", maxHeight: "188px" }}
                />
              </div>
              <div className="bg-white p-4 flex flex-row gap-1 items-center">
                <img alt="client-logo" src={LogoPrezentHidden} className="rounded-md h-9 w-9 object-cover" />
                <div>
                  <p className="font-semibold">{name}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-neutral300">Voucher Ref ID : {refID}</p>

                    <Copy size={14} className="text-neutral300 cursor-pointer" />
                  </div>
                  <p className="text-neutral300">
                    {validDate ? `Valid until ${moment(validDate).format("DD MMMM YYYY")}` : "-"}
                  </p>
                </div>
              </div>

              <div className="bg-neutral20 p-4 flex flex-col gap-4">
                <div>
                  <p className="font-semibold">{title || "-"}</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line">{message || "-"}</p>
                </div>

                <div>
                  <p className="font-semibold">Description</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line">{description || "-"}</p>
                </div>

                <div>
                  <p className="font-semibold">How to redeem</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line">{howToRedeem || "-"}</p>
                </div>

                <div>
                  <p className="font-semibold">Terms & conditions</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line">{termAndCondition || "-"}</p>
                </div>
              </div>

              <div className="sticky bottom-0 flex flex-col gap-4 items-end">
                <div className="w-16 h-16 rounded-full bg-primary50 flex justify-center items-center shadow-sm mr-4">
                  <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
                </div>

                <div className="w-full bg-white p-4 pb-8">
                  <PrimaryButton title="Redeem Now" type="full" />
                </div>
              </div>
            </div>
          </DeviceFrameset>
        </div>
      </div>
    </div>
  );
};

export default LandingPagePreviewSection;
