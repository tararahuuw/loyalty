import React, { Fragment, useRef, useState, useEffect, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { useFetch } from "prezent/useFetch";
import DatePicker from "prezent/DatePicker";
import { X, MagnifyingGlass, Infinity } from "@phosphor-icons/react";
import {
  GetAllVoucherCategory,
  GetAllVoucherNoPagination,
} from "../../../service/voucherManagement/endpoint/voucherManagement";
import SelectVoucherTable from "./SelectVoucherTable";
import { PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import FilterDropDown from "prezent/FilterDropDown";
import moment from "moment";

const VoucherFormModal = ({
  isOpen,
  onClose,
  selectedVouchers,
  setSelectedVouchers,
  balance,
  companyId,
  handleCheckout,
}) => {
  const cancelButtonRef = useRef(null);
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
  } = useFetch(GetAllVoucherNoPagination, "catalogs", [endDate, dataFilter, dataSearch, selectedOptions], {
    companyId,
    dataSearch,
    startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
    endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
    body: dataFilter,
  });

  const handleOnClick = () => {
    handleCheckout(refetch);
  };

  const quantityChecker = () => {
    return selectedVouchers.some((voucher) => voucher.type === "Non PPOB" && voucher.quantity > voucher.stock);
  };

  useEffect(() => {
    if (vouchers?.data?.length) {
      const updatedVouchers = vouchers.data.map((voucher) => ({
        id: voucher.id,
        type: voucher.type,
        category: voucher.category,
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
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative bg-primary300"
        initialFocus={cancelButtonRef}
        onClose={onClose}
        static={true}
        style={{
          zIndex: 1001,
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          />
        </Transition.Child>

        <div className="fixed inset-0 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl">
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Choose Reward</p>
                  <a className="cursor-pointer" onClick={onClose}>
                    <X size={24} />
                  </a>
                </div>

                <div className="w-full p-4 flex border-t border-b border-neutral30">
                  <div className="flex flex-col gap-4 flex-grow">
                    <div className="flex items-center z-20">
                      <div className="flex-1">
                        <div className="border rounded-md border-neutral50 flex items-center px-2">
                          <MagnifyingGlass className="text-neutral300" size={16} />

                          <input
                            className="p-2 rounded-md w-full border-none focus:outline-none focus:border-none text-sm"
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

                    <SelectVoucherTable
                      vouchers={selectedVouchers}
                      setVouchers={setSelectedVouchers}
                      isLoading={isLoading}
                    />

                    <div className="flex flex-col gap-2 rounded-md bg-primary50 p-4">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">Current Balance</p>
                        {/* <p className="font-semibold text-sm">Rp {(balance || 0).toLocaleString("id", "ID")}</p> */}
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">Rp</p>
                          <Infinity size={20} />
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
                        {/* <p className="font-semibold text-sm text-success400">Rp 61.997.000</p> */}
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-success400">Rp</p>
                          <Infinity size={20} className="text-success400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end w-full p-4">
                  <OutlineButton title="Cancel" onClick={onClose} />
                  <PrimaryButton title="Submit" onClick={handleOnClick} isActive={!quantityChecker()} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default VoucherFormModal;
