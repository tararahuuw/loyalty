import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SectionOne from "../../components/SectionOne/SectionOne";
import LoadingModal from "../../components/LoadingModal/LoadingModal";
import ResultModal from "prezent/ResultModal";
import {
  CheckRedeemStatus,
  GetGeneratedDetail,
  GetRedeemDetail,
  RedeemReward,
} from "../../service/redeempage/endpoint";
import voucherDummy from "../../assets/voucher_dummy.png";
import { CalendarBlankIcon, TicketIcon, CopyIcon } from "@phosphor-icons/react";
import moment from "moment";
import { PrimaryButton } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import RedeemFormModal from "../../components/RedeemFormModal/RedeemFormModal";
import konnek from "../../assets/konnek_logo.png";
import VoucherCodeModal from "../../components/VoucherCodeModal/VoucherCodeModal";
import { useSnackbar } from "notistack";
import { useFetch } from "prezent/useFetch";
import SuccessSnackbar from "../../components/Snackbar/SuccessSnackbar";
import ErrorSnackbar from "../../components/Snackbar/ErrorSnackbar";

const RedeemPage = () => {
  const { redeemId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [initial, setInitial] = useState(false);
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const { isOpen: redeemFormIsOpen, toggle: toggleRedeemForm } = useDisclosure();
  const { isOpen: resultModalIsOPen, toggle: toggleResultModal } = useDisclosure();
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure();
  const { isOpen: voucherCodeModalIsOpen, toggle: toggleVoucherCodeModal } = useDisclosure();
  const { data: detail, isLoading: detailIsLoading } = useFetch(GetRedeemDetail, "redeem-detail", [], redeemId);
  const {
    data: redeem,
    refetch,
    isLoading,
  } = useFetch(detail?.data?.transactionId && GetGeneratedDetail, "redeem", [], detail?.data?.transactionId);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1500);
    }, 250);
  };

  const handleRedeemReward = async (form, voucherType) => {
    try {
      openLoading();
      toggleRedeemForm();

      await RedeemReward({
        customerID: voucherType === "PPOB" ? form.meterNumber || form.phoneNumber : null,
        refId: redeem.data.refId,
        voucherId: redeem.data.catalogId,
        storeCode: voucherType === "Non PPOB" ? form.storeCode : null,
      });

      let polling;

      const pollRedeemStatus = async () => {
        try {
          const status = await CheckRedeemStatus(redeem.data.refId);
          if (status.data.status === "redeemed") {
            clearInterval(polling);
            closeLoading();
            refetch();
            enqueueSnackbar("Success!", {
              autoHideDuration: 3000,
              anchorOrigin: { vertical: "top", horizontal: "center" },
              content: (key, message) => (
                <SuccessSnackbar id={key} message={message} subMessage="Reward has been redeemed" />
              ),
            });
            if (redeem.data.voucherCategory === "PLN" || redeem.data.voucherType === "Non PPOB") {
              setTimeout(() => {
                toggleVoucherCodeModal();
              }, 1500);
            }
          } else if (status.data.status === "failed") {
            enqueueSnackbar("Failed!", {
              autoHideDuration: 3000,
              anchorOrigin: { vertical: "top", horizontal: "center" },
              content: (key, message) => (
                <ErrorSnackbar
                  id={key}
                  message={message}
                  subMessage="Reward redemption failed. Please try again later."
                />
              ),
            });
            clearInterval(polling);
            closeLoading();
            refetch();
            toggleRedeemForm();
          }
          // if pending, just wait for the next interval
        } catch (err) {
          clearInterval(polling);
          closeLoading();
          refetch();
          handleOpenModalResult("failed", "Something went wrong. Please try again");
          setTimeout(() => {
            toggleRedeemForm();
          }, 2000);
        }
      };

      polling = setInterval(pollRedeemStatus, 3000); // retry every 3 seconds
      await pollRedeemStatus(); // call immediately once

      setInitial(true);
    } catch (error) {
      closeLoading();
      refetch();
      setInitial(true);
      // If error is invalid store code
      if (error?.response?.data?.rc === 5) {
        toggleRedeemForm();
      } else {
        handleOpenModalResult("failed", "Sorry, unable to redeem at the moment. Please try again");
        setTimeout(() => {
          toggleRedeemForm();
        }, 2000);
      }
    }
  };

  useEffect(() => {
    let polling;

    const pollRedeemStatus = async () => {
      try {
        const status = await CheckRedeemStatus(redeem.data.refId);
        if (status.data.status === "redeemed") {
          clearInterval(polling);
          closeLoading();
          refetch();
          enqueueSnackbar("Success!", {
            autoHideDuration: 3000,
            anchorOrigin: { vertical: "top", horizontal: "center" },
            content: (key, message) => <SuccessSnackbar id={key} message={message} subMessage="has been activated" />,
          });

          if (redeem.data.voucherCategory === "PLN" || redeem.data.voucherType === "Non PPOB") {
            setTimeout(() => {
              toggleVoucherCodeModal();
            }, 1500);
          }
        } else if (status.data.status === "failed") {
          clearInterval(polling);
          closeLoading();
          refetch();
        }
        // if still pending, do nothing — wait for next interval
      } catch (err) {
        clearInterval(polling);
        closeLoading();
        refetch();
        handleOpenModalResult("failed", "Something went wrong. Please try again");
      }
    };

    if (redeem?.data?.status === "pending" && !initial) {
      openLoading();
      pollRedeemStatus(); // call once immediately
      polling = setInterval(pollRedeemStatus, 3000); // poll every 3s
    }

    return () => {
      clearInterval(polling); // cleanup on unmount
    };
  }, [redeem?.data?.status, initial]);

  return (
    <div className="flex items-center justify-center bg-white sm:py-6 py-0 h-screen">
      {/* Card container */}
      <div className="flex flex-col h-full pt-4 sm:w-80 w-full sm:rounded-md shadow-md overflow-y-auto overflow-hidden no-scrollbar relative">
        <section style={{ maxWidth: 440 }} className="self-center px-4 flex flex-col gap-2">
          <img src={redeem?.data?.voucherPhoto || voucherDummy} alt={`${redeem?.data?.voucherName}-voucher-img`} />
          <p className="font-semibold text-xl w-full">{redeem?.data?.voucherName}</p>

          <div className="grid grid-cols-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <CalendarBlankIcon weight="fill" className="text-neutral300" size={16} />
                <p className="text-neutral500 text-xs">Expired on</p>
              </div>
              <div className="flex items-center gap-1">
                <TicketIcon weight="fill" className="text-neutral300" size={16} />
                <p className="text-neutral500 text-xs">Voucher Ref ID</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-xs font-medium">{moment(redeem?.data?.validUntil).format("DD MMM YYYY")}</p>

              <div className="flex items-center gap-1">
                <p className="text-xs font-medium">{redeem?.data?.refId?.slice(0, 15) + "..."}</p>
                <CopyIcon
                  className="text-neutral500 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(redeem?.data?.refId)}
                />
              </div>
            </div>
          </div>
        </section>

        <SectionOne
          terms={redeem?.data?.terms}
          description={redeem?.data?.description}
          endDate={redeem?.data?.validUntil}
          howToUse={redeem?.data?.howToRedeem}
          productID={redeem?.data?.catalogId}
          type={redeem?.data?.voucherType}
        />

        <div className="sticky bottom-0 flex flex-col gap-4">
          <div className="absolute right-2 -top-20 flex justify-end">
            <a
              className="rounded-full bg-primary50 p-3 flex items-center justify-center cursor-pointer"
              href="https://api.sprintasia.co.id/"
              target="_blank"
            >
              <img className="h-8 w-8 object-contain" src={konnek} alt="konnek-logo" />
            </a>
          </div>

          <div className="border-t-2 border-neutral20 bg-white py-8 px-6 flex items-center gap-6 w-full">
            {redeem?.data?.status === "redeemed" ? (
              <>
                {!["Pulsa", "Data Package", "Paket Data", "E-wallet"].includes(redeem?.data?.voucherCategory) ? (
                  <PrimaryButton type="full" title="Show Reward Code" onClick={toggleVoucherCodeModal} />
                ) : (
                  <PrimaryButton type="full" isActive={false} title="Reward Redeemed" />
                )}
              </>
            ) : (
              <PrimaryButton type="full" title="Redeem Reward" onClick={toggleRedeemForm} />
            )}
          </div>
        </div>
      </div>

      <VoucherCodeModal isOpen={voucherCodeModalIsOpen} onClose={toggleVoucherCodeModal} reward={redeem?.data} />

      <RedeemFormModal
        isOpen={redeemFormIsOpen}
        onClose={toggleRedeemForm}
        errorReason={redeem?.data?.errorReason}
        voucherCategory={redeem?.data?.voucherCategory}
        voucherType={redeem?.data?.voucherType}
        generatedReward={redeem?.data}
        handleRedeem={handleRedeemReward}
      />

      <LoadingModal isLoading={detailIsLoading || isLoading || loadingIsOpen} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOPen} />
    </div>
  );
};

export default RedeemPage;
