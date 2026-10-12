import React, { useState, useEffect } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const SectionOneDefault = ({ formik, voucherData, title, message }) => {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const screenWidth = window.innerWidth;
      let scaleValue = 1;

      if (screenWidth < 320) {
        scaleValue = 0.7;
      } else if (screenWidth >= 320) {
        scaleValue = 0.9;
      }

      setScale(scaleValue);
    };

    updateScale();

    window.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  const onChange = (val) => {
    formik.setFieldValue("captcha", val);
  };

  return (
    <section className="bg-neutral10 flex-1 flex flex-col px-4 py-2 gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-black font-bold text-base">{title}</p>
        <p className="text-neutral300 text-sm">{message}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-black font-bold text-sm">Description</p>
        <p className="text-neutral300 text-sm">{voucherData?.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-black font-bold text-sm">How to redeem</p>
        <p className="text-neutral300 text-sm">{voucherData?.howToRedeem}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-black font-bold text-sm">Terms & conditions</p>
        <p className="text-neutral300 text-sm">{voucherData?.terms}</p>
      </div>

      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "0 0",
        }}
        className="flex flex-col gap-1"
      >
        <ReCAPTCHA sitekey={process.env.REACT_APP_GRECAPTCHA_API_KEY} onChange={onChange} />
        <p className="text-danger500 text-sm">{formik.errors.captcha}</p>
      </div>
    </section>
  );
};

export default SectionOneDefault;
