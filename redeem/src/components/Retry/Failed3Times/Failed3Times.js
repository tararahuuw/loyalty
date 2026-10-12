import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import KonnekLogo from "../../../assets/konnek_logo.png";
import notfound from "../../../assets/notfound.png";
import { PrimaryButton } from "sprint-asia-custom-component";

const Failed3Times = ({ redeemId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("passedSection");
  }, []);
  return (
    <div className="flex flex-col justify-end gap-6 sm:w-80 w-full h-full px-4 py-4">
      <div className="flex flex-col items-center justify-center px-4">
        <img src={notfound} alt="error-img" className="h-40 w-40" />

        <p className="text-xl font-bold text-black text-center">Oops! Need Help with Voucher?</p>

        <p className="text-sm text-neutral300 text-center">
          It seems you've attempted to redeem your voucher 3 times. Please contact our customer support through live
          chat for help with the next steps.
        </p>
      </div>

      <div className="rounded-full bg-primary50 self-end p-4 cursor-pointer">
        <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton title="Back" onClick={() => navigate(`/redeem-voucher/${redeemId}`)} />
      </div>
    </div>
  );
};

export default Failed3Times;
