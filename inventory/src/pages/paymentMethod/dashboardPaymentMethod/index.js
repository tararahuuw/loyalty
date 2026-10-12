import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import DataTable from "prezent/DataTable";
import { OutlineButton, Switch } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import {
  DownloadPaymentMethods,
  EditPaymentMethod,
  GetAllPaymentMethodSummaries,
} from "../../../service/inventoryManagement/endpoint/paymentMethod";
import moment from "moment";
import { DownloadSimpleIcon } from "@phosphor-icons/react";

const DashboardPaymentMethod = ({ setTitleHeader, companyId }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const [paymentMethods, setPaymentMethods] = useState();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [reRender, setReRender] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const {
    isOpen: isEditPaymentMethod,
    toggle: toggleEditPaymentMethod,
    close: closeEditPaymentMethod,
  } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);

  const filterOptions = [
    {
      id: "paymentType",
      label: "Payment Method Type",
      type: "checkbox",
      options: [
        { label: "Debit Card", value: "Debit Card" },
        { label: "Credit Card", value: "Credit Card" },
        { label: "E-Wallet", value: "E-Wallet" },
        { label: "Mobile/Internet Banking", value: "Mobile/Internet Banking" },
        { label: "Bank (Traditional)", value: "Bank (Traditional)" },
        { label: "QR Code Payments", value: "QR Code Payments" },
        { label: "Payment Gateway", value: "Payment Gateway" },
        { label: "Cash-Based", value: "Cash-Based" },
        { label: "BNPL (PayLater)", value: "BNPL (PayLater)" },
        { label: "Carrier Billing", value: "Carrier Billing" },
        { label: "Utility/Bill Payment App", value: "Utility/Bill Payment App" },
        { label: "Prepaid/E-Money Card", value: "Prepaid/E-Money Card" },
        { label: "Virtual Account (VA)", value: "Virtual Account (VA)" },
        { label: "Others", value: "Others" },
      ],
    },
    {
      id: "paymentName",
      label: "Payment Method Name",
      type: "string",
    },
    {
      id: "paymentCode",
      label: "Payment Method Code",
      type: "string",
    },
    {
      id: "status",
      label: "Status",
      type: "checkbox",
      options: [
        { label: "Active", value: "Active" },
        { label: "Inactive", value: "Inactive" },
      ],
    },
  ];
  const [currentData, setCurrentData] = useState({
    paymentType: [],
    paymentName: "",
    paymentCode: "",
    status: [],
  });

  const parentRef = useRef(null);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1500);
    }, 250);
  };

  async function handleChangeStatus() {
    try {
      toggleEditPaymentMethod();
      toggleLoadingModal();
      await EditPaymentMethod(roleAccess, selectedRow.id, {
        id: selectedRow.id,
        loyaltyID: companyId,
        paymentID: selectedRow.paymentID,
        paymentName: selectedRow.paymentName,
        status: selectedRow.status === "Active" ? "Inactive" : "Active",
      });
      handleOpenModalResult(
        "success",
        `${
          selectedRow.status === "Active"
            ? `${selectedRow.paymentName} has been successfully deactivated. This method is no longer available for transactions.`
            : `${selectedRow.paymentName} has been successfully activated and is now available for transactions.`
        }`,
      );
      setReRender(!reRender);
    } catch (error) {
      handleOpenModalResult(
        "failed",
        `${
          selectedRow.status === "Active"
            ? `Failed to deactive ${selectedRow.paymentName}. Please try again.`
            : `Failed to active ${selectedRow.paymentName}. Please try again.`
        }`,
      );
    } finally {
      toggleLoadingModal();
    }
  }

  const columns = [
    {
      header: "Payment Method Type",
      accessor: "paymentType",
      Cell: (row) => <p className="font-medium text-black text-sm">{row.paymentType}</p>,
    },
    {
      header: "Payment Method Name",
      accessor: "paymentName",
      Cell: (row) => <p className="font-medium text-black text-sm">{row.paymentName}</p>,
    },
    {
      header: "Payment Method Code",
      accessor: "paymentCode",
      Cell: (row) => <p className="font-medium text-black text-sm">{row.paymentCode}</p>,
    },
    {
      header: "Status",
      accessor: "status",
      Cell: (row) => (
        <div className={`cursor-pointer flex justify-end items-center mr-8`}>
          <Switch
            checked={row.status === "Active"}
            onChange={() => {
              setSelectedRow(row);
              toggleEditPaymentMethod();
            }}
            isEdit={
              roleAccess === "Client Admin - Loyalty" ||
              roleAccess === "Client Loyalty" ||
              roleAccess === "Client WhatsApp - Loyalty"
            }
          />
        </div>
      ),
    },
  ];

  const handleDownloadPaymentMethods = async () => {
    try {
      toggleLoadingModal();
      const response = await DownloadPaymentMethods({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `payment_method-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleLoadingModal();
      handleOpenModalResult("success", `Payment Method data downloaded successfully.`);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", `Failed to download Payment Method data. Please try again.`);
    }
  };

  useEffect(() => {
    setTitleHeader("Payment Method");
  }, []);

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
      <div className="bg-white rounded-lg shadow-md h-full">
        <div className="flex justify-between items-center w-full py-3 px-4">
          <div className="flex items-center gap-2">
            <FilterDropdownMixed
              parentRef={parentRef}
              filterOptions={filterOptions}
              currentData={currentData}
              setCurrentData={setCurrentData}
            />

            <OutlineButton
              title={
                <div className="flex items-center gap-1">
                  <DownloadSimpleIcon />
                  <p>Download</p>
                </div>
              }
              isActive={paymentMethods?.data?.length || false}
              onClick={handleDownloadPaymentMethods}
            />
          </div>
        </div>

        <div className="drop-shadow">
          <DataTable
            columns={columns}
            reRender={reRender}
            service={GetAllPaymentMethodSummaries}
            queryName="payment-method-summaries"
            dependencies={[currentData]}
            params={{ filter: currentData }}
            searchKeyword={`${JSON.stringify(currentData)}`}
            options={{ pagination: true }}
            onClickRow={() => {}}
            getResponse={setPaymentMethods}
          />
        </div>
      </div>

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen}
        onClose={toggleLoadingModal}
      />

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />

      <StateModal
        title={`${selectedRow?.status === "Active" ? "Deactivate" : "Activate"} Payment Method`}
        subtitle={
          <p>
            This action will
            {selectedRow?.status === "Active" ? " deactivate " : " activate "}
            <span className="font-semibold">{selectedRow?.paymentName}.</span>
            {selectedRow?.status === "Active"
              ? " Once deactivated, transactions using this payment method will no longer be accepted."
              : " Once activated, it will be available for transactions."}
          </p>
        }
        isOpen={isEditPaymentMethod}
        onClose={closeEditPaymentMethod}
        titleButtonRight={<p className="px-4">Yes</p>}
        leftAction={closeEditPaymentMethod}
        rightAction={handleChangeStatus}
      />
    </div>
  );
};

export default DashboardPaymentMethod;
