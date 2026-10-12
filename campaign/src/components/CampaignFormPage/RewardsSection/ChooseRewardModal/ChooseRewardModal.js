import React, { useState, useEffect, useCallback } from "react";
import _ from "lodash";
import { useFetch } from "prezent/useFetch";
import DatePicker from "prezent/DatePicker";
import Modal from "prezent/Modal";
import FilterDropDown from "prezent/FilterDropDown";
import { XIcon, MagnifyingGlassIcon, InfinityIcon, InfoIcon } from "@phosphor-icons/react";
import { GetAllVoucherCategory, GetAllVoucherNoPagination } from "../../../../service/voucherManagement/endpoint";
import SelectVoucherTable from "./SelectVoucherTable";
import { PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import moment from "moment";

const ChooseRewardModal = ({
  isOpen,
  onClose,
  selectedVouchers,
  setSelectedVouchers,
  balance,
  companyId,
  handleCheckout,
}) => {
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ type: [], category: [] });
  const [selectedOptions, setSelectedOptions] = useState({ type: [], category: [] });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { data: dataCategory } = useFetch(dataFilter.type.length && GetAllVoucherCategory, "categories", [], {
    voucherTypeCode: dataFilter.type,
  });

  const {
    data: vouchers,
    isLoading,
    refetch,
  } = useFetch(GetAllVoucherNoPagination, "catalogs", [startDate, endDate, dataFilter, dataSearch, selectedOptions], {
    companyId,
    dataSearch,
    startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
    endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
    body: dataFilter,
  });

  const quantityChecker = () => {
    return selectedVouchers.some((voucher) => voucher.type === "Non PPOB" && voucher.quantity > voucher.stock);
  };

  useEffect(() => {
    if (vouchers?.data?.length) {
      const updatedVouchers = vouchers.data.map((voucher) => ({
        id: voucher.id,
        type: voucher.type,
        category: voucher.category,
        ownedQuantity: voucher.ownedQty,
        name: voucher.name,
        stock: voucher.stock,
        quantity: 0,
        price: voucher.price,
        pointNeeded: voucher.pointNeeded,
        endDate: voucher.endDate,
        startDate: voucher.startDate,
      }));
      setSelectedVouchers(updatedVouchers);
    } else {
      setSelectedVouchers([]);
    }
  }, [vouchers, isOpen]);

  const dataType = [
    { option: "Digital Voucher", value: "Non PPOB" },
    { option: "PPOB Voucher", value: "PPOB" },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setSelectedOptions(options);
  };

  const handleChangeInput = useCallback(
    _.debounce((value) => {
      setDataSearch(value);
    }, 500),
    []
  );

  const totalRewardsQuantity = selectedVouchers.reduce((sum, reward) => sum + reward.stock, 0);

  const subtotal = selectedVouchers.reduce((sum, voucher) => {
    const qty = voucher.quantity || 0;
    const price = voucher.price || 0;
    return sum + qty * price;
  }, 0);

  const totalQuantity = selectedVouchers.reduce((sum, voucher) => {
    return sum + (voucher.quantity || 0);
  }, 0);

  // Handles reset category filter if user makes changes in type filter
  useEffect(() => {
    const updatedOptions = {
      ...selectedOptions,
      category: [],
    };

    setSelectedFilterOptions(updatedOptions);
  }, [dataFilter.type]);

  useEffect(() => {
    setDataSearch("");
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="relative transform overflow-hidden rounded-lg bg-white text-left transition-all sm:my-8 sm:w-full sm:max-w-6xl">
        <div className="flex justify-between py-3 px-6">
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-xl text-black">Choose Reward</p>
            <div className="flex items-center gap-2">
              <InfoIcon className="text-primary500" />
              <p className="font-medium text-sm">
                The total quantity for all available rewards is {totalRewardsQuantity.toLocaleString("id", "ID")} units.
              </p>
            </div>
          </div>
          <a className="cursor-pointer" onClick={onClose}>
            <XIcon size={24} />
          </a>
        </div>

        <div className="w-full p-4 flex border-t border-b border-neutral30">
          <div className="flex flex-col gap-4 flex-grow">
            <div className="flex items-center z-20">
              <div className="flex-1">
                <div className="border rounded-md border-neutral50 flex items-center px-2">
                  <MagnifyingGlassIcon className="text-neutral300" size={16} />

                  <input
                    className="p-2 rounded-md w-full focus:outline-none focus:border-none text-sm"
                    placeholder="Search by Name"
                    onChange={(e) => handleChangeInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="mx-4">
                <FilterDropDown
                  options={[
                    {
                      menu: "Type",
                      parameter: "type",
                      submenu: dataType,
                      type: "checkbox",
                    },
                    {
                      menu: "Category",
                      parameter: "category",
                      submenu:
                        dataCategory?.data?.map((category) => ({
                          option: category.name,
                          value: category.name,
                        })) || [],
                      type: "checkbox",
                    },
                  ]}
                  dataFilterResult={dataFilter}
                  setDataFilterResult={setSelectedFilterOptions}
                />
              </div>
              <DatePicker
                placeholder="Select Period"
                mode="default"
                value={[startDate, endDate]}
                onChangeRange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                onReset={() => {
                  setStartDate("");
                  setEndDate(null);
                }}
                className="max-w-xs"
              />
            </div>

            <SelectVoucherTable vouchers={selectedVouchers} setVouchers={setSelectedVouchers} isLoading={isLoading} />

            <div className="flex flex-col gap-2 rounded-md bg-primary50 p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Current Balance</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">Rp</p>
                  <InfinityIcon size={20} />
                </div>
              </div>

              <div className="flex flex-col gap-2 py-2 border-t-2 border-b-2 border-dashed border-neutral40">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-neutral300 text-sm">Total Reward Quantity</p>
                  <p className="font-medium text-sm">{totalQuantity.toLocaleString("id", "ID")}</p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-semibold text-base">Total Cost</p>
                  <p className="font-semibold text-base">
                    Rp {(subtotal || 0).toLocaleString("id", "ID")}
                    <span className="text-danger500">*</span>
                  </p>
                </div>
                <p className="text-xs">
                  The total cost is calculated based on the selected rewards and the total quantity purchased.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm">Remaining Balance</p>
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm text-success400">Rp</p>
                  <InfinityIcon size={20} className="text-success400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end w-full p-4 pb-0">
          <OutlineButton title="Cancel" onClick={onClose} />
          <PrimaryButton title="Submit" onClick={() => handleCheckout(refetch)} isActive={!quantityChecker()} />
        </div>
      </div>
    </Modal>
  );
};

export default ChooseRewardModal;
