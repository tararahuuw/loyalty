import React from "react";
import moment from "moment";
import { DownloadSimple, CheckCircle, Copy } from "@phosphor-icons/react";
import prezentWhite from "../../../assets/prezent_white.png";

const PPOBCard = ({
  downloadScreenshot,
  isClicked,
  category,
  voucherTitle,
  redeemTime,
  validUntil,
  refID,
  customerID,
  background,
  templateName,
  templatePhoto,
  voucherPhoto,
  tokenCode,
}) => {
  const handleCopyTokenCode = (code) => {
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

        {background === "upload_image" ? (
          <section
            className="h-72 px-4 flex items-center justify-center rounded-md"
            style={{
              backgroundImage: `url(${process.env.REACT_APP_VOUCHER_API_URL}/template_voucher/${templatePhoto})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={`${process.env.REACT_APP_VOUCHER_API_URL}/voucher/${voucherPhoto}`}
                alt="voucher-img"
                className="object-contain w-full h-full"
              />
            </div>
          </section>
        ) : (
          <section
            className="h-72 px-4 flex items-center justify-center rounded-md"
            style={{ background: templateName || "#034ea2" }}
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <img
                src={`${process.env.REACT_APP_VOUCHER_API_URL}/voucher/${voucherPhoto}`}
                alt="voucher-img"
                className="object-contain w-full h-full"
              />
            </div>
          </section>
        )}

        <div className="flex flex-col items-center gap-2">
          <p className="font-medium text-base text-black text-center">{voucherTitle}</p>
          <p className="text-sm text-neutral300 text-center">Use this E-Voucher to get your awesome benefits.</p>
        </div>

        <div className="flex flex-col gap-4 border-b-2 border-t-2 border-neutral40 py-4 w-full">
          <div className="flex items-center justify-between">
            <p className="text-neutral300 text-sm">Redeem Time</p>
            <p className="text-black font-bold text-sm">{moment(redeemTime).format("DD MMM YYYY, HH:mm")}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-neutral300 text-sm">Voucher ref ID</p>
            <p className="text-black font-bold text-sm">{refID}</p>
          </div>

          {(category === "Data Package" || category === "Paket Data") && (
            <div className="flex items-center justify-between">
              <p className="text-neutral300 text-sm">Phone Number</p>
              <p className="text-black font-bold text-sm">{customerID}</p>
            </div>
          )}

          {category === "PLN" && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-neutral300 text-sm">Meter Number</p>
                <p className="text-black font-bold text-sm">{customerID}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-neutral300 text-sm">No. Token</p>
                  <a className="cursor-pointer" onClick={() => handleCopyTokenCode(tokenCode?.replaceAll("-", "."))}>
                    <Copy className="text-neutral300" />
                  </a>
                </div>
                <p className="text-black font-bold text-sm">{tokenCode?.replaceAll("-", ".")}</p>
              </div>
            </>
          )}

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

export default PPOBCard;
