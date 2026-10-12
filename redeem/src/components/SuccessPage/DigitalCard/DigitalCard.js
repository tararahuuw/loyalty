import React from "react";
import moment from "moment";
import { DownloadSimple, CheckCircle, Copy } from "@phosphor-icons/react";
import prezentWhite from "../../../assets/prezent_white.png";
import QRCode from "react-qr-code";

const DigitalCard = ({
  downloadScreenshot,
  isClicked,
  voucherName,
  voucherRefID,
  voucherCode,
  validUntil,
  redeemTime,
}) => {
  const handleCopyVoucherCode = (code) => {
    navigator.clipboard.writeText(code);
  };
  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-3 bg-primary500 w-full">
        <div />

        <img src={prezentWhite} alt="prezent-white" />

        <a
          className={`cursor-pointer ${isClicked ? "invisible" : "visible"} sm:mr-0 mr-2`}
          onClick={downloadScreenshot}
        >
          <DownloadSimple size={20} color="white" />
        </a>
      </div>

      <div
        className={`flex flex-col gap-4 items-center py-6 px-4 h-full bg-white sm:w-80 w-full ${
          isClicked ? "sm:rounded-none" : "sm:rounded-md"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <CheckCircle size={40} color="#4c9f51" weight="fill" />

          <p className="text-lg color-black font-bold text-center">Voucher successfully redeemed!</p>
        </div>

        <div className="border border-neutral40 rounded-md p-2 relative w-full">
          {voucherCode && (
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={voucherCode}
              viewBox={`0 0 256 256`}
            />
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="font-medium text-base text-black text-center">{voucherName}</p>
          <p className="text-sm text-neutral300 text-center">Use this E-Voucher to get your awesome benefits.</p>
        </div>

        <div className="flex flex-col gap-4 border-b-2 border-t-2 border-neutral40 py-4 w-full">
          <div className="flex items-center justify-between">
            <p className="text-neutral300 text-sm">Redeem Time</p>
            <p className="text-black font-bold text-sm">{moment(redeemTime).format("DD MMM YYYY, HH:mm")}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-neutral300 text-sm">Voucher ref ID</p>
            <p className="text-black font-bold text-sm">{voucherRefID}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-neutral300 text-sm">Voucher Code</p>
              <a className="cursor-pointer" onClick={() => handleCopyVoucherCode(voucherCode)}>
                <Copy className="text-neutral300" />
              </a>
            </div>
            <p className="text-black font-bold text-sm">{voucherCode}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-neutral300 text-sm">Valid Until</p>
            <p className="text-black font-bold text-sm">{moment(validUntil).format("DD MMMM YYYY")}</p>
          </div>
        </div>

        <div className={`${isClicked ? "invisible" : "visible"} flex items-center gap-1`}>
          <p className="text-neutral300 text-sm">Want to learn more about us?</p>
          <a className="cursor-pointer" href="https://sprintasia.co.id/id/" target="_blank" rel="noopener noreferrer">
            <p className="text-primary500 text-sm font-bold">Click Here!</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
