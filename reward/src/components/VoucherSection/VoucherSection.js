import React, { useEffect, useState } from "react";

import moment from "moment";
import { Plus, DownloadSimple } from "@phosphor-icons/react";
import { Chip, PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import {
  CheckoutVouchers,
  DownloadVouchers,
  GetAllVoucher,
  GetAllVoucherCategory,
} from "../../service/voucherManagement/endpoint/voucherManagement";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import VoucherFormModal from "../../components/VoucherForm/VoucherFormModal/VoucherForm";
import VoucherModal from "../../components/VoucherModal/VoucherModal";
import SearchDropDown from "prezent/SearchDropDown";
import FilterDropDown from "prezent/FilterDropDown";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const VoucherSection = ({ balance, companyId }) => {
  const [vouchers, setVouchers] = useState();
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ type: [], category: [], status: [] });
  const [selectedOptions, setSelectedOptions] = useState({ type: [], category: [], status: [] });
  const [selectedVoucherId, setSelectedVoucherId] = useState("");
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Voucher Name",
    value: "name",
  });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: voucherDetailIsOpen, toggle: toggleVoucherDetail } = useDisclosure(false);
  const { isOpen: formIsOpen, close: closeForm, open: openForm } = useDisclosure(false);

  const dataOptions = [
    { option: "Voucher Name", value: "name" },
    { option: "Price", value: "price" },
  ];
  const dataType = [
    { option: "Digital Voucher", value: "Non PPOB" },
    { option: "PPOB Voucher", value: "PPOB" },
  ];
  const { data: dataCategory } = useFetch(dataFilter.type.length && GetAllVoucherCategory, "categories", [], {
    voucherTypeCode: dataFilter.type,
  });

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  };

  const handleOpenVoucherDetail = (id) => {
    setSelectedVoucherId(id);
    toggleVoucherDetail();
  };

  const handleCloseVoucherDetail = () => {
    setSelectedVoucherId("");
    toggleVoucherDetail();
  };

  const columns = [
    {
      header: "Name",
      assessor: "name",
      tdStyle: { width: "20%" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-xs">
              {row.type} - {row.category}
            </p>
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
      header: "Point Required",
      assessor: "point",
      Cell: (row) => {
        return <div>{row.pointNeeded.toLocaleString("id", "ID")}</div>;
      },
    },
    {
      header: "Stock",
      assessor: "stock",
      Cell: (row) => {
        return (
          <div className={`${row.ownedQty < 50 ? "text-danger500" : "text-success500"} font-medium`}>
            {row.ownedQty?.toLocaleString() || 0}
          </div>
        );
      },
    },
    {
      header: "Validity Period",
      assessor: "validityStartDate",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0">
              {moment(row.startDate).format("DD MMM YYYY")} - {moment(row.endDate).format("DD MMM YYYY")}
            </p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <div>
            <Chip
              title={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              type={row.status === "active" ? "success" : row.status === "failed" ? "danger" : "neutral"}
            />
          </div>
        );
      },
    },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
    setSelectedOptions(options);
  };

  const handleCloseCheckoutForm = () => {
    closeForm();
    setSelectedVouchers([]);
  };

  const handleCheckout = async (refetchCatalog) => {
    try {
      openLoading();
      closeForm();
      await CheckoutVouchers({
        data: selectedVouchers
          .filter((voucher) => voucher.quantity)
          .map((voucher) => ({
            id: voucher.id,
            qty: voucher.quantity,
            type: voucher.type,
          })),
      });
      refetchCatalog();
      setReRender(!reRender);
      closeLoading();
      handleOpenModalResult("success", "Voucher has been successfully purchased.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Failed to purchase voucher. Please try again.");
    }
  };

  const handleDownloadVouchers = async () => {
    try {
      openLoading();
      const response = await DownloadVouchers({
        companyId,
        dataFilter: dataFilterSearch.value,
        dataSearch,
        status: dataFilter.status[0] || "",
        body: {
          type: dataFilter.type,
          category: dataFilter.category,
        },
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `voucher-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      closeLoading();
      handleOpenModalResult("success", `Voucher data downloaded successfully.`);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", `Failed to download Voucher data. Please try again.`);
    }
  };

  // Handles reset category filter if user makes changes in type filter
  useEffect(() => {
    const updatedOptions = {
      ...selectedOptions,
      category: [],
    };

    setSelectedFilterOptions(updatedOptions);
  }, [dataFilter.type]);
  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex items-center gap-2">
              <SearchDropDown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />

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
                  {
                    menu: "Status",
                    parameter: "status",
                    submenu: [
                      { option: "Active", value: "active" },
                      { option: "Pending", value: "pending" },
                      { option: "Inactive", value: "inactive" },
                    ],
                    type: "radiobutton",
                  },
                ]}
                dataFilterResult={dataFilter}
                setDataFilterResult={setSelectedFilterOptions}
              />

              <OutlineButton
                title={
                  <div className="flex items-center gap-1">
                    <DownloadSimple />
                    <p>Download</p>
                  </div>
                }
                isActive={vouchers?.data?.length || false}
                onClick={handleDownloadVouchers}
              />
            </div>

            <PrimaryButton
              title={
                <div className="flex gap-2 items-center">
                  <Plus size={20} />
                  Add Voucher
                </div>
              }
              onClick={openForm}
            />
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllVoucher}
              queryName="vouchers"
              dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
              params={{
                companyId,
                dataFilter: dataFilterSearch.value,
                dataSearch,
                status: dataFilter.status[0] || "",
                body: {
                  type: dataFilter.type,
                  category: dataFilter.category,
                },
              }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(id) => handleOpenVoucherDetail(id)}
              getResponse={setVouchers}
            />
          </div>
        </div>
      </div>

      <VoucherFormModal
        companyId={companyId}
        isOpen={formIsOpen}
        onClose={handleCloseCheckoutForm}
        selectedVouchers={selectedVouchers}
        balance={balance}
        setSelectedVouchers={setSelectedVouchers}
        handleCheckout={handleCheckout}
      />

      <VoucherModal voucherId={selectedVoucherId} isOpen={voucherDetailIsOpen} onClose={handleCloseVoucherDetail} />

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default VoucherSection;
