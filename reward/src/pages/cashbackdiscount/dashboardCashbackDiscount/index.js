import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Chip, FilterDropdown, PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { PiPercent, PiCurrencyDollar } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import { PiNotePencil, PiEye, PiArrowRight, PiTrash } from "react-icons/pi";
import CashbackDiscountModal from "../../../components/cashbackdiscount/CashbackDiscountModal";
import DetailCashbackDiscountModal from "../../../components/cashbackdiscount/DetailCashbackDiscountModal";
import {
  CreateNewCashback,
  DeleteCashback,
  EditCashback,
  GetAllCashback,
} from "../../../service/voucherManagement/endpoint/cashbackManagement";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const DashboardCashbackDiscount = ({ roleAccess, setTitleHeader, loyaltyId, formik }) => {
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [] });
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Items Name",
    value: "name",
  });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: modalCashbackDiscountIsOpen, toggle: toggleModalCashbackDiscount } = useDisclosure(false);
  const { isOpen: detailModalCashbackDiscountIsOpen, toggle: toggleDetailModalCashbackDiscount } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const [selectedOptions, setSelectedOptions] = useState({ type: [], category: [], priceType: [], status: [] });
  const [selectedCashbackDiscount, setSelectedCashbackDiscount] = useState(null);
  const [selectedCashbackDiscountDetail, setSelectedCashbackDiscountDetail] = useState(null);

  const dataOptions = [{ option: "Items Name", value: "name" }];
  const dataStatus = [
    { option: "Active", value: "Active" },
    { option: "Inactive", value: "Inactive" },
  ];

  const handleOpenEditCashbackDiscount = (row) => {
    toggleModalCashbackDiscount();
    setSelectedCashbackDiscount(row);
  };

  const handleOpenDeleteConfirmation = (row) => {
    setSelectedCashbackDiscount(row);
    openDeleteModal();
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedCashbackDiscount(null);
    closeDeleteModal();
  };

  const handleSubmitCashbackDiscount = async (formValues) => {
    try {
      toggleModalCashbackDiscount();
      toggleLoadingModal();
      var bodyRequest = {
        cashbackPercentage: parseFloat(formValues.cashbackPercentage),
        description: formValues.description,
        name: formValues.name,
        maxAmount: parseFloat(formValues.maxAmount),
        status: formValues.status,
        type: formValues.type,
        validityEnd: formValues.validityEnd,
        validityStart: formValues.validityStart,
      };

      if (selectedCashbackDiscount) {
        await EditCashback(roleAccess, selectedCashbackDiscount.id, bodyRequest);
      } else {
        await CreateNewCashback(roleAccess, bodyRequest);
      }

      toggleLoadingModal();
      setFlagResult("success");
      setDataSubtitleModal(
        selectedCashbackDiscount
          ? "Changes to your cashback reward have been saved."
          : "Your cashback reward has been successfully created."
      );
      toggleResultModal();

      setTimeout(() => {
        toggleResultModal();
        setSelectedCashbackDiscount(null);
        setReRender((prev) => !prev);
      }, 1500);
    } catch (err) {
      toggleLoadingModal();
      setFlagResult("failed");
      setDataSubtitleModal(
        selectedCashbackDiscount
          ? "Changes couldn’t be saved. Please try again later."
          : "There was a problem creating the cashback. Please try again."
      );
      toggleResultModal();

      setTimeout(() => {
        toggleResultModal();
      }, 1500);
    }
  };

  const handleDeleteCashbackDiscount = async () => {
    try {
      closeDeleteModal();
      await DeleteCashback(selectedCashbackDiscount.id);
      setReRender(!reRender);
      handleOpenModalResult("success", `"${selectedCashbackDiscount.name}" has been successfully deleted.`);
      setSelectedCashbackDiscount(null);
    } catch (error) {
      handleOpenModalResult("failed", `We couldn’t delete the cashback. Please try again later.`);
      setSelectedCashbackDiscount(null);
    }
  };

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

  const columns = [
    {
      header: "Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div className="flex">
            <div
              className={`${
                row.type === "Discount" ? "bg-primary50 text-primary500" : "bg-success50 text-success500"
              } rounded-lg w-28 h-full p-4`}
            >
              <div className="flex justify-center">
                {row.type === "Discount" ? (
                  <PiPercent size={20} className="font-semibold" />
                ) : (
                  <PiCurrencyDollar size={20} className="font-semibold" />
                )}
              </div>
              <p className="tex-center font-semibold w-full flex justify-center">{row.type}</p>
            </div>
            <div className="ml-2">
              <p className="font-semibold">{row.name}</p>
              <p>ID: {row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Redeemed",
      assessor: "redeemed",
      Cell: (row) => {
        return <div>{row.redeemed || 0}</div>;
      },
    },
    {
      header: "Validity Period",
      accessor: "validityPeriod",
      Cell: (row) => {
        const start = row?.validityStart ? moment(row.validityStart) : null;
        const end = row?.validityEnd ? moment(row.validityEnd) : null;
        const daysLeft = end ? end.diff(moment(), "days") : null;

        const dangerText = daysLeft !== null && daysLeft <= 7;

        return (
          <div>
            {start && end ? (
              <>
                <div className="flex items-center">
                  <p className={`text-sm mr-1 ${dangerText ? "text-danger500" : ""}`}>{start.format("DD MMM")}</p>
                  <PiArrowRight className={`${dangerText ? "text-danger500" : ""}`} />
                </div>
                <p className={`text-sm ${dangerText ? "text-danger500" : ""}`}>{end.format("DD MMM YYYY HH:ss")}</p>
              </>
            ) : (
              <p className="text-sm">No Period</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return <Chip title={row.status} type={row.status.toLowerCase() === "active" ? "success" : "neutral"} />;
      },
    },
    {
      header: "Action",
      Cell: (row) => {
        return (
          <div
            className="flex"
            onClick={() => {
              setSelectedCashbackDiscount(row);
            }}
          >
            <div onClick={() => handleOpenEditCashbackDiscount(row)}>
              <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <PiTrash
              onClick={openDeleteModal}
              size="24"
              variant="Bold"
              className="text-primary500 cursor-pointer mr-2"
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

  useEffect(() => {
    setTitleHeader("Cashback & Discounts");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex gap-3">
              <SearchDropdown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />
              <FilterDropdown
                options={[
                  {
                    menu: "Status",
                    parameter: "status",
                    submenu: dataStatus,
                    type: "radiobutton",
                  },
                ]}
                dataFilterResult={dataFilter}
                setDataFilterResult={setSelectedFilterOptions}
              />
            </div>

            <PrimaryButton title="+ Cashback & Discount" onClick={toggleModalCashbackDiscount} />
          </div>

          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllCashback}
              queryName="cashback & discount"
              dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
              params={{
                roleAccess,
                dataFilter: dataFilterSearch.value,
                dataSearch,
                body: dataFilter,
              }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(row) => {
                setSelectedCashbackDiscount(row);
                toggleDetailModalCashbackDiscount();
              }}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />

      <CashbackDiscountModal
        title={selectedCashbackDiscount ? "Edit Cashback & Discount" : "Create New Cashback & Discount"}
        subtitle={
          selectedCashbackDiscount
            ? "Update the cashback & discount offer details and settings."
            : "Create a new cashback or discount reward that customers can redeem with their points."
        }
        isOpen={modalCashbackDiscountIsOpen}
        onClose={() => {
          toggleModalCashbackDiscount();
          setSelectedCashbackDiscount(null);
        }}
        initialValues={selectedCashbackDiscount || {}}
        mode={selectedCashbackDiscount ? "edit" : "add"}
        rightAction={handleSubmitCashbackDiscount}
        titleButtonRight={"Submit"}
      />

      <DetailCashbackDiscountModal
        title="Cashback & Discount Details"
        isOpen={detailModalCashbackDiscountIsOpen}
        onClose={() => {
          toggleDetailModalCashbackDiscount();
          setSelectedCashbackDiscountDetail(null);
        }}
        leftAction={handleOpenDeleteConfirmation}
        rightAction={() => toggleModalCashbackDiscount()}
        data={selectedCashbackDiscountDetail}
      />

      <StateModal
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete "${selectedCashbackDiscount?.name}"? This action cannot be undone.`}
        isOpen={deleteModalIsOpen}
        onClose={handleCloseDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <PiTrash />
            <p>Delete Cashback & Discount</p>
          </div>
        }
        leftAction={handleCloseDeleteConfirmation}
        rightAction={handleDeleteCashbackDiscount}
      />
    </>
  );
};

export default DashboardCashbackDiscount;
