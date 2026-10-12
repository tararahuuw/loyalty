import React, { createRef, useState } from "react";
import { useParams } from "react-router-dom";
import { createFileName } from "use-react-screenshot";
import * as htmlToImage from "html-to-image";
import DigitalCard from "../../components/SuccessPage/DigitalCard/DigitalCard";
import PPOBCard from "../../components/SuccessPage/PPOBCard/PPOBCard";
import { useFetch } from "prezent/useFetch";
import { GetRedeemDetail } from "../../service/redeempage/endpoint";

const SuccessPage = () => {
  const { redeemId } = useParams();
  const [isClicked, setIsClicked] = useState(false);
  // const { data: redeem } = useFetch(GetRedeemDetail, "redeem", [], { redeemId });
  const ref = createRef(null);
  const voucherType = redeem?.data?.voucherType;

  const takeScreenShot = async (node) => {
    try {
      const dataURI = await htmlToImage.toJpeg(node);
      return dataURI;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const download = (image, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = async () => {
    try {
      setIsClicked(true);
      await takeScreenShot(ref.current).then(download);
      setIsClicked(false);
    } catch (error) {
      setIsClicked(false);
    }
  };

  const redeem = {
    data: {
      voucherName: "Starbucks eGift Rp 50.000",
      // voucherPhoto: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800", // sample coffee image
      endDate: "2025-12-31T23:59:59Z",
      refID: "SBX-2025-REDEEM-00123",
      productID: "PROD-5678",
      voucherCategory: "PLN",
      voucherType: "PPOB",
      description:
        "Enjoy your favorite Starbucks beverage with this Rp 50,000 eGift card. Perfect for coffee lovers and quick refreshment breaks.",
      howToRedeem: [
        "Open your Starbucks App and go to the 'eGift' section.",
        "Enter the voucher code at checkout or scan the barcode at the counter.",
        "Enjoy your drink!",
      ],
      terms: [
        "Voucher valid until the expiry date stated above.",
        "Cannot be exchanged for cash.",
        "Valid for all Starbucks stores in Indonesia.",
        "One-time use only.",
      ],
      errorReason: null,
      retryCount: 2,
    },
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 bg-primary500 sm:pt-3 sm:pb-6 pt-0 pb-0 relative ${
        !redeem?.data && "h-screen"
      }`}
    >
      <div ref={ref}>
        {voucherType === "PPOB Voucher" && (
          <PPOBCard
            downloadScreenshot={downloadScreenshot}
            isClicked={isClicked}
            category={redeem?.data?.voucherCategory}
            customerID={redeem?.data?.customerID}
            redeemTime={redeem?.data?.redeemTime}
            refID={redeem?.data?.refID}
            validUntil={redeem?.data?.validUntil}
            voucherTitle={redeem?.data?.voucherName}
            background={redeem?.data?.template?.background}
            templateName={redeem?.data?.template?.templateName}
            templatePhoto={redeem?.data?.template?.templateVoucherPhoto}
            voucherPhoto={redeem?.data?.voucherPhoto}
            tokenCode={redeem?.data?.redeemValue}
          />
        )}

        {voucherType === "Digital Voucher" && (
          <DigitalCard
            downloadScreenshot={downloadScreenshot}
            isClicked={isClicked}
            voucherName={redeem?.data?.voucherName}
            category={redeem?.data?.voucherCategory}
            voucherRefID={redeem?.data?.reffID}
            voucherCode={redeem?.data?.voucherCode}
            redeemTime={redeem?.data?.redeemTime}
            validUntil={redeem?.data?.validUntil}
          />
        )}
      </div>
    </div>
  );
};

export default SuccessPage;
