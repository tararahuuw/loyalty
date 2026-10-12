import React, { useState } from "react";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import { PlusIcon, InfoIcon } from "@phosphor-icons/react";
import moment from "moment";
import ChooseRewardModal from "../ChooseRewardModal/ChooseRewardModal";
import DownloadRewardTable from "./DownloadRewardTable";
import { CheckoutVouchers, CheckVoucherStatus } from "../../../../service/voucherManagement/endpoint";

const RewardListSection = ({
  allRewards = [],
  companyId,
  balance,
  rewards = [],
  rewardUtil,
  openLoading,
  closeLoading,
  handleOpenModalResult,
  refetchVouchers,
  recipients,
  formik,
}) => {
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Reward Name",
    value: "name",
  });
  const [dataSearch, setDataSearch] = useState("");
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const { isOpen: rewardModalIsOpen, close: closeRewardModal, open: openRewardModal } = useDisclosure(false);

  const dataOptions = [{ option: "Reward Name", value: "name" }];

  const columns = [
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-xs">
              {row.type} - {row.category}
            </p>
          </div>
        );
      },
    },
    {
      header: "Stock",
      assessor: "stock",
      Cell: (row) => {
        return (
          <div
            className={
              row.type === "PPOB"
                ? "text-success500"
                : `${row.stock < 50 ? "text-danger500" : "text-success500"} font-medium`
            }
          >
            {row.type === "PPOB" ? "unlimited" : row.stock.toLocaleString()}
          </div>
        );
      },
    },
    {
      header: "Price",
      assessor: "price",
      Cell: (row) => {
        return <div>Rp {row.price.toLocaleString("id", "ID")}</div>;
      },
    },
    {
      header: "Point Needed",
      assessor: "point",
      Cell: (row) => {
        return <div>{row.pointNeeded?.toLocaleString("id", "ID") || 0}</div>;
      },
    },
    {
      header: "Owned QTY",
      assessor: "ownedQuantity",
      Cell: (row) => {
        return <div>{row.ownedQuantity?.toLocaleString("id", "ID") || 0}</div>;
      },
    },
    {
      header: "Validity Period",
      assessor: "validityStartDate",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-medium">{moment(row.startDate).format("DD MMM YYYY")}</p>
            <p className="font-normal text-neutral80 text-xs">Until {moment(row.endDate).format("DD MMM YYYY")}</p>
          </div>
        );
      },
    },
  ];

  const totalRewardsQuantity = rewards.reduce((sum, reward) => sum + reward.ownedQuantity, 0);

  const downloadedRewards = rewards.filter((reward) => reward.quantity > 0);
  const totalDownloadedRewardsQuantity = downloadedRewards.reduce((sum, reward) => sum + reward.quantity, 0);

  const handleCheckout = async (refetchCatalogs) => {
    try {
      openLoading();
      closeRewardModal();
      const response = await CheckoutVouchers({
        data: selectedVouchers
          .filter((voucher) => voucher.quantity)
          .map((voucher) => ({
            id: voucher.id,
            qty: voucher.quantity,
            type: voucher.type,
          })),
      });

      let polling;

      const pollPurchaseStatus = async () => {
        try {
          const status = await CheckVoucherStatus(response.data.transactionId);

          if (status.data.status === "success") {
            clearInterval(polling);
            refetchCatalogs();

            if (rewardUtil !== "download") {
              refetchVouchers();
            } else {
              const prevRewards = formik.values.rewards; // get current value
              const updated = [...prevRewards];

              selectedVouchers.forEach((catalogItem) => {
                const existingIndex = updated.findIndex((reward) => reward.id === catalogItem.id);

                if (existingIndex !== -1) {
                  // reward already exists -> merge ownedQuantity
                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    ownedQuantity: (updated[existingIndex].ownedQuantity || 0) + (catalogItem.quantity || 0),
                  };
                } else {
                  // reward does not exist -> add it
                  updated.push({
                    ...catalogItem,
                    ownedQuantity: catalogItem.quantity || 0,
                  });
                }
              });

              formik.setFieldValue("rewards", updated);
            }

            closeLoading();
            handleOpenModalResult("success", "Reward purchase completed successfully.");
          } else if (status.data.status === "failed") {
            clearInterval(polling);
            closeLoading();
            handleOpenModalResult("failed", "Reward purchase failed. Please try again later.");
          }
        } catch (error) {
          clearInterval(polling);
          closeLoading();
          handleOpenModalResult("failed", "Reward purchase failed. Please try again later.");
        }
      };

      polling = setInterval(pollPurchaseStatus, 3000);
      await pollPurchaseStatus();
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Reward purchase failed. Please try again later.");
    }
  };

  const error = formik.errors.rewards && formik.submitCount;

  return (
    <div className={`flex flex-col gap-3 ${error ? "bg-danger50" : "bg-neutral20"} rounded-lg p-6 flex-1`}>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold leading-6 text-left">Reward List</p>

        <div className="flex flex-col gap-2">
          {error ? (
            <div className="flex items-center gap-1">
              <InfoIcon size={16} className="text-danger500" />
              <p className="text-danger500 text-xs">{formik.errors.rewards}</p>
            </div>
          ) : null}

          <div className="flex justify-between items-center w-full">
            <SearchDropdown
              options={dataOptions}
              placeholderSearch="Search Here"
              filterDropdown={dataFilterSearch}
              setFilterDropdown={setDataFilterSearch}
              onEnterPress={setDataSearch}
            />

            <div className="min-w-max">
              <PrimaryButton
                type="full"
                title={
                  <div className="flex gap-2 items-center">
                    <PlusIcon size={20} />
                    Add Reward
                  </div>
                }
                onClick={openRewardModal}
              />
            </div>
          </div>
        </div>

        <ChooseRewardModal
          companyId={companyId}
          isOpen={rewardModalIsOpen}
          onClose={closeRewardModal}
          selectedVouchers={selectedVouchers}
          recipients={recipients}
          setSelectedVouchers={setSelectedVouchers}
          balance={balance}
          handleCheckout={handleCheckout}
        />

        <div className="flex flex-col">
          {rewardUtil !== "download" ? (
            <DataTable
              columns={columns}
              staticData={allRewards
                .map((reward) => ({
                  id: reward.id,
                  name: reward.name,
                  type: reward.type,
                  category: reward.category,
                  price: reward.price,
                  stock: reward.stock,
                  pointNeeded: reward.pointNeeded,
                  ownedQuantity: reward.ownedQty,
                  startDate: reward.startDate,
                  endDate: reward.endDate,
                }))
                .filter((reward) => reward.name?.toLowerCase().includes(dataSearch.toLowerCase()))}
              options={{ pagination: false }}
              searchKeyword={dataSearch}
              onClickRow={() => {}}
            />
          ) : (
            <DownloadRewardTable
              formik={formik}
              isLoading={false}
              vouchers={rewards.filter((reward) => reward.name?.toLowerCase().includes(dataSearch.toLowerCase()))}
            />
          )}

          <div className="border border-t-0 rounded-b-md border-neutral40 p-2 flex flex-col gap-2">
            <div className="flex flex-col bg-primary50 rounded-xl px-4 py-2 items-end gap-2">
              <div className="flex gap-20">
                <p className="font-semibold">TOTAL OWNED QTY ({rewards.length.toLocaleString("id", "ID")} REWARD)</p>
                <p className="font-semibold">{totalRewardsQuantity.toLocaleString("id", "ID")}</p>
              </div>
              {rewardUtil === "download" && (
                <div className="flex gap-20">
                  <p className="font-semibold">
                    TOTAL DOWNLOADED QTY ({downloadedRewards.length.toLocaleString("id", "ID")} REWARD)
                  </p>
                  <p className="font-semibold">{totalDownloadedRewardsQuantity.toLocaleString("id", "ID")}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardListSection;
