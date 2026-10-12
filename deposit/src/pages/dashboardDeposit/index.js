import React, { useEffect, useState } from "react";

import { DownloadSimple, Plus, Wallet } from "@phosphor-icons/react";
import moment from "moment";
import { useFormik } from "formik";
import * as yup from "yup";
import DataTable from "prezent/DataTable";
import DatePicker from "../../components/DatePicker/DatePicker";
import LoadingModal from "prezent/LoadingModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import { PrimaryButton, OutlineButton, SearchDropdown, ModalResult } from "sprint-asia-custom-component";
import ReceiptModal from "../../components/ReceiptModal/ReceiptModal";
import TopUpModal from "../../components/TopUpModal/TopUpModal";
import {
  CreateDeposit,
  DownloadDepositList,
  DownloadPaymentReceipt,
  GetAllClient,
  GetAllDeposit,
  GetAllDivisionByClientId,
} from "../../service/depositManagement/endpoint";
import TopUpConfirmation from "../../components/TopUpConfirmation/TopUpConfirmation";

const DashboardDeposit = ({ roleAccess, setTitleHeader }) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen: receiptIsOpen, toggle: toggleReceipt } = useDisclosure(false);
  const { isOpen: topupModalIsOpen, toggle: toggleTopupModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, toggle: toggleConfirmation } = useDisclosure(false);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Client",
    value: "clientName",
  });
  const { data: clients } = useFetch(GetAllClient, "clients", [], {});

  const dataOptions = [
    { option: "Client", value: "clientName" },
    { option: "Division", value: "divisionName" },
    { option: "Deposit ID", value: "depositId" },
  ];

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

  const handleClickReceipt = (data) => {
    toggleReceipt();
    setSelectedRow(data);
  };

  const handleClickTopUp = async () => {
    // Validate the entire form
    const errors = await formik.validateForm();

    // If there are errors, they will be displayed, and this function will end
    if (Object.keys(errors).length > 0) {
      // Errors are present, so we do not proceed with toggling
      return;
    }

    // If no errors are found, toggle the modals
    toggleConfirmation();
    toggleTopupModal();
  };

  const columns = [
    {
      header: "Activity Data",
      assessor: "activity",
      Cell: (row) => {
        return (
          <div className="flex gap-2">
            <div className="bg-success50 rounded-full p-3 self-start">
              <Wallet className="text-success500" size={18} weight="fill" />
            </div>

            <div className="flex flex-col gap-1">
              <p className="font-semibold text-black text-sm">Balance top up</p>
              <p className="font-normal text-success500 text-xs">+ Rp{row.amount.toLocaleString()}</p>
              <p className="font-normal text-neutral300 text-xs">{row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Division",
      assessor: "division",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.clientName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionId}</p>
          </div>
        );
      },
    },
    {
      header: "Created",
      assessor: "createdAt",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{moment(row.createdAt).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">{`by ${row.createdBy}`}</p>
          </div>
        );
      },
    },
    {
      header: "Payment Method",
      assessor: "payment_method",
      Cell: (row) => {
        return <p className="text-black text-sm">Transfer Manual</p>;
      },
    },
    {
      header: "Receipt",
      assessor: "receipt",
      Cell: (row) => {
        return (
          <>
            {row.paymentReceipt ? (
              <a
                className="font-normal text-sm text-primary500 hover:underline"
                onClick={() => handleClickReceipt(row)}
              >
                See receipt
              </a>
            ) : (
              <p>-</p>
            )}
          </>
        );
      },
    },
  ];

  const handleDownloadDepositList = async () => {
    try {
      toggleLoadingModal();
      const response = await DownloadDepositList(
        roleAccess,
        {
          startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
          endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
        },
        dataFilterSearch.value,
        dataSearch
      );
      // Directly use the blob response for the file download
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Deposit data_${moment().format("DD-MM-YYYY")}.xlsx`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);

      toggleLoadingModal();
      handleOpenModalResult("success", "Deposit list has been successfully downloaded.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry we are unable to download deposit list at the moment. Please try again");
    }
  };

  const handleDownloadPaymentReceipt = async (file, id) => {
    try {
      const fileMimeType = file.split(".")[1];
      toggleLoadingModal();
      const response = await DownloadPaymentReceipt(file);
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Payment Receipt_${id}.${fileMimeType}`;
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);

      toggleLoadingModal();
      handleOpenModalResult("success", "Payment receipt list has been successfully downloaded.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        "Sorry we are unable to download payment receipt list at the moment. Please try again"
      );
    }
  };

  const submitTopUp = async (form, resetForm) => {
    try {
      toggleLoadingModal();
      toggleConfirmation();
      const response = await CreateDeposit(roleAccess, form);
      if (response.code === 200) {
        setReRender(!reRender);
        toggleLoadingModal();
        resetForm();
        setTimeout(() => {
          handleOpenModalResult("success", "Balance Top-Up has been successfully added.");
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to adding Balance Top-Up at the moment. Please try again");
      setTimeout(() => {
        toggleConfirmation();
      }, 1500);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientId: "",
      clientName: "",
      divisionId: "",
      divisionName: "",
      amount: "",
      paymentReceipt: "",
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
      clientName: yup.string().required("client is required"),
      divisionId: yup.string().required("Division is required"),
      divisionName: yup.string().required("Division is required"),
      amount: yup
        .number()
        .required("Balance Top-Up field required")
        .min(10000, "Amount must be at least 10.000")
        .max(1000000000, "Maximum amount 1.000.000.000"),
      paymentReceipt: yup.mixed(),
    }),
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      const formData = new FormData();
      for (let key in values) {
        if (values[key]) {
          formData.append(key, values[key]);
        }
      }
      submitTopUp(formData, resetForm);
    },
  });

  const { data: divisions } = useFetch(formik.values.clientId && GetAllDivisionByClientId, "divisions", [], {
    roleAccess,
    clientId: formik.values.clientId,
  });

  useEffect(() => {
    setTitleHeader("Deposit");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex gap-3 flex-1">
              <div>
                <SearchDropdown
                  options={dataOptions}
                  placeholderSearch="Search Here"
                  filterDropdown={dataFilterSearch}
                  setFilterDropdown={setDataFilterSearch}
                  onEnterPress={setDataSearch}
                />
              </div>

              <DatePicker
                onChangeRange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                value={[startDate, endDate]}
                onReset={() => {
                  setStartDate(moment().subtract(1, "month").format("YYYY-MM-DD"));
                  setEndDate(moment().format("YYYY-MM-DD"));
                }}
                placeholder="Select period"
                mode="dashboard"
                className="max-w-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <OutlineButton
                isIconVisible
                icon={<DownloadSimple />}
                title="Download Data"
                onClick={handleDownloadDepositList}
              />

              <PrimaryButton isIconVisible icon={<Plus />} title="Top-up" onClick={toggleTopupModal} />
            </div>
          </div>

          <DataTable
            columns={columns}
            reRender={reRender}
            service={GetAllDeposit}
            queryName="deposits"
            dependencies={[dataFilterSearch.value, dataSearch, startDate, endDate]}
            params={{
              roleAccess,
              dataFilter: dataFilterSearch.value,
              dataSearch,
              body: {
                startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
                endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
              },
            }}
            options={{ pagination: true }}
            onClickRow={() => { }}
          />
        </div>
      </div>

      <ReceiptModal
        isOpen={receiptIsOpen}
        onClose={toggleReceipt}
        title="Receipt"
        receipt={selectedRow?.paymentReceipt}
        id={selectedRow?.id}
        onClick={handleDownloadPaymentReceipt}
      />

      <TopUpModal
        isOpen={topupModalIsOpen}
        onClose={() => {
          toggleTopupModal();
          formik.resetForm();
          setSelectedRow(null);
        }}
        handleClick={handleClickTopUp}
        title="Top-up"
        clients={clients}
        divisions={divisions}
        formik={formik}
      />

      <TopUpConfirmation
        isOpen={confirmationIsOpen}
        onClose={() => {
          toggleConfirmation();
          toggleTopupModal();
        }}
        formik={formik}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen}
        onClose={toggleLoadingModal}
      />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default DashboardDeposit;
