import React, { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, SearchDropdown, FilterDropdown } from "sprint-asia-custom-component";
import moment from "moment";
import CustomTable from "./CustomTable";
import { GetAllVoucher, GetAllVoucherCategory } from "../../service/voucherManagement/endpoint";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import DatePicker from "../../components/DatePicker/DatePicker.js";

const AddVoucherPointRules = ({ isOpen = false, onClose = () => {}, roleAccess, formik }) => {
  const cancelButtonRef = useRef(null);
  const [reRender, setReRender] = useState(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [validationAllVoucher, setValidationAllVoucher] = useState(false);
  const [dataFilter, setDataFilter] = useState({ type: [], category: [] });
  const [selectedOptions, setSelectedOptions] = useState({ type: [], category: [] });
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Voucher name",
    value: "name",
  });
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const { data: dataCategory } = useFetch(dataFilter.type.length && GetAllVoucherCategory, "categories", [], {
    voucherTypeCode: dataFilter.type,
  });

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  const dataOptions = [
    {
      option: "Voucher Name",
      value: "name",
    },
    {
      option: "Voucher ID",
      value: "id",
    },
  ];

  const dataType = [
    { option: "Digital Voucher", value: "1" },
    { option: "PPOB Voucher", value: "2" },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
    setSelectedOptions(options);
  };

  const [voucherList, setVoucherList] = useState([]);
  const [voucherRawData, setVoucherRawData] = useState([]);
  const [checkedVoucher, setCheckedVoucher] = useState([]);

  function handleAddVoucherPointRules() {
    formik.setFieldValue("vouchers", checkedVoucher);
    handleCloseModal();
  }

  const handleGetDataVoucher = async () => {
    toggleLoadingModal();
    try {
      const params = {
        roleAccess,
        dataFilter: dataFilterSearch.value,
        dataSearch,
        dates: endDate
          ? {
              startDate: moment(startDate).format("YYYY-MM-DD"),
              endDate: moment(endDate).format("YYYY-MM-DD"),
            }
          : null,
        startDateCampaign: formik.values.startDate,
        divisionId: formik.values.divisionId,
        body: dataFilter,
      };
      const response = await GetAllVoucher(params);
      toggleLoadingModal();

      if (response.data) {
        const updatedVoucherList = response.data.map((voucher) => ({
          ...voucher,
          checked:
            formik.values.existingVouchers.some((existingVoucher) => existingVoucher.id === voucher.id) ||
            formik.values.vouchers.some((v) => v.id === voucher.id) ||
            checkedVoucher.some((v) => v.id === voucher.id),
          existingVoucher: formik.values.existingVouchers.some((existingVoucher) => existingVoucher.id === voucher.id),
        }));

        if (!dataSearch && !startDate && !endDate && dataFilter.type.length === 0 && dataFilter.category.length === 0) {
          setVoucherRawData(updatedVoucherList);
        }
        setVoucherList(updatedVoucherList);
      } else {
        setVoucherRawData([]);
        setVoucherList([]);
      }
    } catch (error) {
      toggleLoadingModal();
      console.error("Error:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectAll(false);
      setCheckedVoucher(formik.values.existingVouchers);
      setVoucherRawData(
        voucherRawData?.map((row) => ({
          ...row,
          checked: formik.values.existingVouchers.some((voucher) => voucher.id === row.id) || false,
        }))
      );
      setVoucherList(
        voucherList?.map((row) => ({
          ...row,
          checked: formik.values.existingVouchers.some((voucher) => voucher.id === row.id) || false,
        }))
      );
    } else {
      setSelectAll(true);
      setCheckedVoucher(voucherRawData?.map((row) => ({ ...row, checked: true })));
      setVoucherRawData(voucherRawData?.map((row) => ({ ...row, checked: true })));
      setVoucherList(voucherList?.map((row) => ({ ...row, checked: true })));
    }
  };

  const handleCheckboxChange = (index) => {
    const updatedVouchersRawData = voucherRawData?.map((row, i) => {
      if (row.id === index) {
        if (row.checked === true) {
          setSelectAll(false);
        }
        return {
          ...row,
          checked: !row.checked,
        };
      }
      return row;
    });
    const updatedVouchersList = voucherList?.map((row, i) => {
      if (row.id === index) {
        if (row.checked === true) {
          setSelectAll(false);
        }
        return {
          ...row,
          checked: !row.checked,
        };
      }
      return row;
    });
    setVoucherRawData(updatedVouchersRawData);
    setVoucherList(updatedVouchersList);

    let mergeCheckVoucher = [...formik.values.existingVouchers];
    const filteredVouchers = updatedVouchersRawData.filter((row) => row.checked && !row.existingVoucher);
    mergeCheckVoucher = [...mergeCheckVoucher, ...filteredVouchers];
    setCheckedVoucher(mergeCheckVoucher);
  };

  function handleCloseModal() {
    onClose();
    setCheckedVoucher([]);
    setVoucherList([]);
  }

  function handleValidationVoucher() {
    let valid = true;

    if (checkedVoucher.length > 0) {
      // Code validation date will disable button
      // valid = checkedVoucher.every((row) => {
      //     const expiryDate = row.validityEndDate;
      //     const parsedExpiryDate = moment(expiryDate, "YYYY-MM-DD HH:mm:ss Z");
      //     const isExpiringIn50Days = parsedExpiryDate.diff(formik.values.startDate, "days") <= 50;
      //     if (row.existingVoucher) {
      //         return true;
      //     }
      //     return !isExpiringIn50Days;
      // });

      valid = true;
    } else {
      valid = false;
    }

    setValidationAllVoucher(valid);
  }

  useEffect(() => {
    if (isOpen && voucherRawData.length > 0) {
      const updatedVouchers = voucherRawData.map((row) => ({
        ...row,
        checked:
          formik.values.existingVouchers.some((voucher) => voucher.id === row.id) ||
          formik.values.vouchers.some((voucher) => voucher.id === row.id),
        existingVoucher: formik.values.existingVouchers.some((voucher) => voucher.id === row.id),
      }));

      setCheckedVoucher(formik.values.vouchers);
      setVoucherRawData(updatedVouchers);
      setVoucherList(updatedVouchers);

      setDataSearch("");
      setDataFilter({ type: [], category: [] });
      setStartDate(null);
      setEndDate(null);
    }
  }, [isOpen]);

  useEffect(() => {
    handleValidationVoucher();

    if (voucherRawData.length > 0) {
      setSelectAll(checkedVoucher.length == voucherRawData.length);
    }
  }, [checkedVoucher]);

  // Handles reset category filter if user makes changes in type filter
  useEffect(() => {
    const updatedOptions = {
      ...selectedOptions,
      category: [],
    };

    setSelectedFilterOptions(updatedOptions);
  }, [dataFilter.type]);

  useEffect(() => {
    handleGetDataVoucher();
  }, [formik.values.startDate, formik.values.type, endDate, dataFilter, dataSearch]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={() => isOpen}
        static={false}
        style={{ zIndex: 1001 }}
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
          <div className="fixed inset-0 bg-black bg-opacity-25" onClick={handleBackgroundClick} />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="min-h-screen flex items-center justify-center">
            <Dialog.Panel
              className="relative h-4/5 w-full bg-white rounded-lg shadow-xl transition-all flex flex-col"
              style={{ maxWidth: "1000px" }}
            >
              <div className="flex justify-between py-3 px-6">
                <p className="font-semibold text-xl text-black">Add Voucher</p>
                <p className="cursor-pointer text-xl" onClick={handleCloseModal}>
                  x
                </p>
              </div>
              <div className="w-full p-4 flex border-t border-b border-neutral30">
                <div className="flex-grow">
                  <div className="flex items-center">
                    <div>
                      <SearchDropdown
                        options={dataOptions}
                        placeholderSearch="Search Here"
                        filterDropdown={dataFilterSearch}
                        setFilterDropdown={setDataFilterSearch}
                        filterSearch={dataSearch}
                        onEnterPress={setDataSearch}
                      />
                    </div>
                    <div className="mx-4">
                      <FilterDropdown
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
                                option: category.voucher_category_name,
                                value: category.voucher_category_code,
                              })) || [],
                            type: "checkbox",
                          },
                        ]}
                        dataFilterResult={dataFilter}
                        setDataFilterResult={setSelectedFilterOptions}
                      />
                    </div>
                    <div>
                      <DatePicker
                        placeholder="Select Validity Period"
                        mode={"default"}
                        value={[startDate, endDate]}
                        onChangeRange={(start, end) => {
                          setStartDate(start);
                          setEndDate(end);
                        }}
                        onReset={() => {
                          setStartDate("");
                          setEndDate(null);
                        }}
                      />
                    </div>
                  </div>
                  <CustomTable
                    voucher={voucherList || []}
                    selectAll={selectAll}
                    validityStartDate={formik.values.startDate}
                    handleSelectAll={handleSelectAll}
                    handleCheckboxChange={handleCheckboxChange}
                    isLoading={loadingModalIsOpen}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div
                  className={`${
                    checkedVoucher.length > 0 ? "text-white bg-primary500" : "text-neutral300 bg-neutral30"
                  } py-1 px-2 rounded-md ml-4`}
                >
                  <p className="text-sm">{checkedVoucher.length} product selected</p>
                </div>
                <div className="px-4 flex flex-row-reverse">
                  <div className="my-3">
                    <div className="ml-2">
                      <PrimaryButton
                        title="Submit"
                        type="wrap"
                        size="large"
                        onClick={handleAddVoucherPointRules}
                        isActive={validationAllVoucher}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <OutlineButton title="Cancel" type="full" size="large" onClick={handleCloseModal} />
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default AddVoucherPointRules;
