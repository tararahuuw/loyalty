import React from "react";
import { useNavigate } from "react-router-dom";
import KonnekLogo from "../../../assets/konnek_logo.png";
import cat from "../../../assets/cat.png";
import LoadingModal from "../../LoadingModal/LoadingModal";
import { OutlineButton, PrimaryButton } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { RedeemVoucher } from "../../../service/redeempage/endpoint";

const SomethingWentWrong = ({ refetch, redeemType, reffId, redeemId, handleResetUserInput }) => {
  const navigate = useNavigate();
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useDisclosure(false);

  const redeemVoucher = async () => {
    try {
      openLoading();
      const response = await RedeemVoucher({
        reffID: reffId,
      });
      if (response.code === 200) {
        closeLoading();
        setTimeout(() => {
          navigate(`/redeem-voucher/success/${redeemId}`);
        }, 1500);
      }
    } catch (error) {
      closeLoading();
      // Refetch redeem detail to increment the error count if retry is still error
      refetch();
    }
  };

  const retryHandler = () => {
    // if (redeemType !== "default") {
    //   localStorage.setItem("passedSection", 2);
    navigate(`/redeem-voucher/${redeemId}`);
    // } else {
    //   // Run the retry handler immediately
    //   redeemVoucher();
    // }
  };

  const cancelHandler = () => {
    navigate(`/redeem-voucher/${redeemId}`);
    // handleResetUserInput();
    // localStorage.removeItem("passedSection");
  };
  return (
    <div className="flex flex-col justify-end gap-6 sm:w-80 w-full h-full px-4 py-4">
      <div className="flex flex-col items-center justify-center px-4">
        <img src={cat} alt="retry-cat" className="h-40 w-40" />

        <p className="text-xl font-bold text-black text-center">Oops! Something went wrong</p>

        <p className="text-sm text-neutral300 text-center">
          It looks like there was an issue redeeming your voucher. Please try again or contact our customer support team
          on live chat.
        </p>
      </div>

      <div className="rounded-full bg-primary50 self-end p-4 cursor-pointer">
        <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
      </div>

      <div className="flex flex-col gap-2">
        <PrimaryButton title="Retry" onClick={retryHandler} />
        <OutlineButton title="Cancel" onClick={cancelHandler} />
      </div>

      <LoadingModal isLoading={isLoading} onClose={closeLoading} />
    </div>
  );
};

export default SomethingWentWrong;
