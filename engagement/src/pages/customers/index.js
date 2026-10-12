import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import DataTable from "prezent/DataTable";
import { Chip, TabBar, PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import { DotsThreeVertical, DownloadSimpleIcon } from "@phosphor-icons/react";
import { useFetch } from "prezent/useFetch";
import ToolTip from "prezent/ToolTip";
import { useDisclosure } from "prezent/useDisclosure";
import {
  GetAllCustomers,
  DeleteCustomer,
  GetCustomerConfiguration,
  ChangeCustomerConfiguration,
  EditCustomer,
  CreateCustomer,
  SuspendCustomer,
  DownloadCustomers,
} from "../../service/CustomerManagement/endpoint";
import AddSingleCustomerModal from "../../components/customers/AddSingleCustomerModal";
import AddBulkCustomerModal from "../../components/customers/AddBulkCustomerModal";
import AddButton from "../../components/shared/AddButton";
import RadioButtonComponent from "../../components/RadioButtonComponent/RadioButtonComponent";
import { GetAllTierLevel } from "../../service/TieringManagement/endpoint/tieringLevel";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import { useRef } from "react";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import moment from "moment";

const DashboardCustomers = ({ setTitleHeader }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const navigateTo = useNavigate();
  const [customers, setCustomers] = useState();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [reRender, setReRender] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, toggle: toggleConfirmation } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const { isOpen: suspendModalIsOpen, open: openSuspendModal, close: closeSuspendModal } = useDisclosure(false);
  const {
    isOpen: addBulkCustomerIsOpen,
    toggle: toggleAddBulkCustomer,
    close: closeAddBulkCustomer,
    open: openAddBulkCustomer,
  } = useDisclosure(false);
  const { isOpen: addSingleCustomerIsOpen, toggle: toggleSingleCustomer } = useDisclosure(false);
  const { isOpen: isLoadingModal, open: openIsLoadingModal, close: closeIsLoadingModal } = useDisclosure(false);

  const [currentTab, setCurrentTab] = useState("Customers");
  const filterOptions = [
    { id: "customerName", label: "Customer Name", type: "string" },
    { id: "phoneNumber", label: "Phone Number", type: "string" },
    { id: "email", label: "Email", type: "string" },
    { id: "tierLevel", label: "Tier Level", type: "string" },
  ];
  const [currentData, setCurrentData] = useState({
    customerName: "",
    phoneNumber: "",
    email: "",
    tierLevel: "",
  });
  const parentRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState(null);

  const open = Boolean(menuPosition);

  const handleOpen = useCallback((event, row) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom,
      left: rect.left - 80,
    });
    setSelectedRow(row);
    event.stopPropagation();
  }, []);

  const handleClose = useCallback(() => {
    setMenuPosition(null);
    setSelectedRow(null);
  }, []);

  const { data: customerConfiguration } = useFetch(GetCustomerConfiguration, "customerConfiguration", [reRender], null);
  const { data: tiers } = useFetch(GetAllTierLevel, "tiers", [reRender], { dataFilter: "", dataSearch: "" });
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      inputMethod: customerConfiguration?.data?.inputMethod || "",
      redeemVerification: customerConfiguration?.data?.redeemVerification || "",
    },
    validationSchema: yup.object().shape({
      inputMethod: yup.string().required("Input Method is required"),
      redeemVerification: yup.string().required("Redeem Verification is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      handleSubmitCustomerConfiguration(values);
    },
  });

  const handleDeleteCustomer = async () => {
    try {
      closeDeleteModal();
      openIsLoadingModal();
      await DeleteCustomer(selectedRow.id);
      setReRender(!reRender);
      setSelectedRow(null);
      closeIsLoadingModal();
      handleOpenModalResult("success", "Customer data has been successfully deleted.");
    } catch (error) {
      handleOpenModalResult("failed", "Failed to delete customer data. Please try again.");
      closeIsLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleSuspendCustomer = async () => {
    try {
      closeSuspendModal();
      openIsLoadingModal();
      await SuspendCustomer(selectedRow.id, { status: selectedRow.status === "Active" ? "Suspended" : "Active" });
      setReRender(!reRender);
      setSelectedRow(null);
      closeIsLoadingModal();
      handleOpenModalResult(
        "success",
        `Customer has been successfully ${selectedRow.status === "Active" ? "suspended" : "unsuspended"}.`,
      );
    } catch (error) {
      handleOpenModalResult(
        "failed",
        `Failed to ${selectedRow.status === "Active" ? "suspend" : "unsuspend"} customer. Please try again.`,
      );
      closeIsLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleOpenEditCustomer = (row) => {
    toggleSingleCustomer();
    setSelectedRow(row);
  };

  const handleOpenDeleteConfirmation = (row) => {
    setSelectedRow(row);
    openDeleteModal();
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedRow(null);
    closeDeleteModal();
  };

  const handleOpenSuspendConfirmation = (row) => {
    setSelectedRow(row);
    openSuspendModal();
  };

  const handleCloseSuspendConfirmation = () => {
    closeSuspendModal();
  };

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

  async function handleSubmitCustomerConfiguration(values) {
    try {
      openIsLoadingModal();
      var bodyRequest = {
        inputMethod: values.inputMethod,
        redeemVerification: values.redeemVerification,
      };
      await ChangeCustomerConfiguration(bodyRequest);
      setReRender(!reRender);
      closeIsLoadingModal();
      setIsEdit(false);
      handleOpenModalResult("success", `Customer Configuration has been successfully set`);
    } catch (error) {
      handleOpenModalResult("failed", `Sorry, unable to change customer configuration at the moment. Please try again`);
      closeIsLoadingModal();
    }
  }

  const handleSubmitCustomer = async (form) => {
    try {
      openIsLoadingModal();
      var bodyRequest = {
        customerName: form.customerName,
        phoneNumber: form.phoneNumber,
        email: form.email,
        tierName: form.tierLevel,
      };
      if (selectedRow) {
        await EditCustomer(selectedRow.id, bodyRequest);
      } else {
        await CreateCustomer({ customers: [bodyRequest] });
      }
      setSelectedRow(null);
      setReRender(!reRender);
      closeIsLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", `Customer data has been successfully ${selectedRow ? "updated" : "added"}.`);
      }, 250);
    } catch (error) {
      handleOpenModalResult("failed", `Failed to ${selectedRow ? "update" : "add"} customer data. Please try again.`);
      closeIsLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleDownloadCustomers = async () => {
    try {
      openIsLoadingModal();
      const response = await DownloadCustomers({ filter: currentData });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `customer-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      closeIsLoadingModal();
      handleOpenModalResult("success", `Customer data downloaded successfully.`);
    } catch (error) {
      closeIsLoadingModal();
      handleOpenModalResult("failed", `Failed to download Customer data. Please try again.`);
    }
  };

  const allowedRoles = ["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"];

  const columns = [
    {
      header: "Customer Name",
      assessor: "Customer Name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-medium text-black text-sm">{row.customerName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      assessor: "Phone Number",
      Cell: (row) => {
        return (
          <div>
            <p className="font-medium text-black text-sm">{row.phoneNumber || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "Email",
      Cell: (row) => {
        return (
          <div>
            <p className="font-medium text-black text-sm">{row.email || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Tier Level",
      assessor: "Tier Level",
      Cell: (row) => {
        return (
          <div>
            {row.tierName ? (
              <p className="font-medium text-black text-sm">{row.tierName}</p>
            ) : row.tierName === "" && row.tierId ? (
              <p className="font-medium text-black text-sm">{"-"}</p>
            ) : (
              <p className="font-medium text-neutral80 italic text-sm">{"Calculating"}</p>
            )}
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <Chip
            title={row.status}
            type={
              row.status.toLowerCase() === "active"
                ? "success"
                : row.status.toLowerCase() === "suspended"
                  ? "warning"
                  : "neutral"
            }
          />
        );
      },
    },
    allowedRoles.includes(roleAccess) && {
      header: "Action",
      Cell: (row) => (
        <>
          <button onClick={(e) => handleOpen(e, row)} className="p-2 hover:bg-neutral20 rounded-full">
            <DotsThreeVertical size={24} />
          </button>

          {open && selectedRow?.id === row.id && (
            <>
              <div className="top-0 right-0 left-0 bottom-0 fixed z-40" onClick={handleClose} />
              <div
                className="fixed z-50 bg-white border border-neutral40 rounded-md shadow-md flex flex-col p-2"
                style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
              >
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                  onClick={() => handleOpenSuspendConfirmation(row)}
                >
                  {row.status === "Active" ? "Suspend" : "Unsuspend"}
                </a>
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md"
                  onClick={() => handleOpenEditCustomer(row)}
                >
                  Edit
                </a>
                <a
                  className="cursor-pointer hover:bg-neutral20 px-4 py-2 rounded-md text-danger500"
                  onClick={() => handleOpenDeleteConfirmation(row)}
                >
                  Delete
                </a>
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    setTitleHeader("Customer");
  }, []);

  useEffect(() => {
    if (formik.values.inputMethod) {
      formik.setFieldValue("redeemVerification", "no require");
    }
  }, [formik.values.inputMethod]);
  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Tier Level", "Customers", "Transactions", "Points"]}
          dataValue={["Tier Level", "Customers", "Transactions", "Points"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => {
            setCurrentTab(tab);
            if (tab === "Tier Level") {
              navigateTo("/prezent/loyalty-setting/engagement/customer/tier-level");
            }
            if (tab === "Customers") {
              navigateTo("/prezent/loyalty-setting/engagement/customer/customers");
            } else if (tab === "Transactions") {
              navigateTo("/prezent/loyalty-setting/engagement/customer/transactions");
            } else if (tab === "Points") {
              navigateTo("/prezent/loyalty-setting/engagement/customer/points");
            }
          }}
        />
      </div>
      <div
        className="flex-1 overflow-y-auto bg-neutral20 pb-6 pt-16 px-8"
        style={{ minHeight: "calc(100dvh - 165px)" }}
      >
        <div className="bg-primary50 rounded-lg shadow-md h-full p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="mr-2 text-lg">Customer Configuration</p>
              <ToolTip message="Defines how customer data is provided and how reward redemptions are verified. This ensures the system processes customer activities accurately and applies the configuration." />
            </div>
          </div>
          <div className={`${isEdit ? "border border-primary500" : ""} bg-white rounded-lg mt-4 p-4`}>
            <p className="text-sm font-medium">Data Input Method</p>
            {!isEdit && customerConfiguration?.data?.inputMethod && (
              <p className="text-sm font-semibold my-1">
                {customerConfiguration?.data?.inputMethod === "API" ? "API" : "Upload"}
              </p>
            )}
            <p className="text-sm text-neutral300">
              {isEdit ? (
                "Choose how customer data will be provided to the system."
              ) : customerConfiguration?.data?.inputMethod === "API" ? (
                <span>
                  Automatically sync customer data from your system through API integration.{" "}
                  <a
                    className="text-primary500 cursor-pointer font-medium"
                    href="https://api.sprintasia.co.id/"
                    target="_blank"
                  >
                    See Developer Page
                  </a>{" "}
                  for setup.
                </span>
              ) : customerConfiguration?.data?.inputMethod === "no require" ? (
                <span>
                  Upload your Customer list manually using the{" "}
                  <a className="text-black font-medium">Add Customer button</a> below.
                </span>
              ) : (
                "You haven’t set this feature."
              )}
            </p>
            {isEdit && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <RadioButtonComponent
                  onChange={(e) => formik.setFieldValue("inputMethod", e.target.value)}
                  checked={formik.values.inputMethod === "API"}
                  value="API"
                  title="API"
                  description={
                    <span>
                      Automatically sync customer data from your system through API integration.{" "}
                      <a
                        className="text-primary500 cursor-pointer font-medium"
                        href="https://api.sprintasia.co.id/"
                        target="_blank"
                      >
                        See Developer Page
                      </a>{" "}
                      for setup.
                    </span>
                  }
                />
                <RadioButtonComponent
                  onChange={(e) => formik.setFieldValue("inputMethod", e.target.value)}
                  checked={formik.values.inputMethod === "Upload"}
                  value="Upload"
                  title="Upload"
                  description={
                    <span>
                      Upload your customer list manually using the{" "}
                      <a className="text-black font-medium">Add Customer button</a> below.
                    </span>
                  }
                />
              </div>
            )}
          </div>
          <div className={`${isEdit ? "border border-primary500" : ""} bg-white rounded-lg mt-2 p-4`}>
            <p className="text-sm font-medium">Redeem Verification</p>
            {!isEdit && customerConfiguration?.data?.redeemVerification && (
              <p className="text-sm font-semibold my-1">
                {customerConfiguration?.data?.redeemVerification === "require"
                  ? "Require Registration"
                  : "No Require Registration"}
              </p>
            )}
            <p className="text-sm text-neutral300">
              {isEdit
                ? "Define how customers will be verified when accessing rewards."
                : customerConfiguration?.data?.redeemVerification === "require"
                  ? "Customer must register via system and log in using their email or phone number and password."
                  : customerConfiguration?.data?.redeemVerification === "no require"
                    ? "Define how customers will be verified when accessing rewards."
                    : "You haven’t set this feature."}
            </p>
            {isEdit && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <RadioButtonComponent
                  onChange={(e) => formik.setFieldValue("redeemVerification", e.target.value)}
                  checked={formik.values.redeemVerification === "no require"}
                  value="no require"
                  title="No Require Registration"
                  description="Customer are verified based on their email or phone number. No password or registration required."
                />
                <RadioButtonComponent
                  onChange={(e) => formik.setFieldValue("redeemVerification", e.target.value)}
                  checked={formik.values.redeemVerification === "require"}
                  value="require"
                  disable={formik.values.inputMethod === "API"}
                  title="Require Registration"
                  description="Customers must register via system and log in using their email or phone number and password."
                />
              </div>
            )}
          </div>
          {isEdit ? (
            <div className="flex items-center justify-end mt-4">
              <OutlineButton title="Cancel" onClick={() => setIsEdit(false)} />
              <div className="ml-2">
                <PrimaryButton title="Save" onClick={formik.handleSubmit} />
              </div>
            </div>
          ) : (
            allowedRoles.includes(roleAccess) && (
              <div className="flex items-center justify-end mt-4">
                <OutlineButton onClick={() => setIsEdit(true)} title="Edit" />
              </div>
            )
          )}
        </div>
        {customerConfiguration?.data?.inputMethod === "Upload" && (
          <div className="bg-white rounded-lg shadow-md h-full mt-8">
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
                  isActive={customers?.data?.length || false}
                  onClick={handleDownloadCustomers}
                />
              </div>
              {allowedRoles.includes(roleAccess) && (
                <AddButton
                  addBulkHandler={toggleAddBulkCustomer}
                  addSingleHandler={toggleSingleCustomer}
                  title="Add Customer"
                />
              )}
            </div>
            <div className="drop-shadow">
              <DataTable
                columns={columns}
                reRender={reRender}
                service={GetAllCustomers}
                queryName={"customer"}
                dependencies={[currentData]}
                params={{ filter: currentData }}
                searchKeyword={`${JSON.stringify(currentData)}`}
                options={{ pagination: true }}
                onClickRow={() => {}}
                getResponse={setCustomers}
              />
            </div>
          </div>
        )}

        <ResultModal
          subtitle={dataSubtitleModal}
          type={flagResult}
          isOpen={resultModalIsOpen}
          onClose={closeResultModal}
        />

        <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoadingModal} onClose={() => {}} />

        <StateModal
          title="Do you want to cancel?"
          subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
          isOpen={confirmationIsOpen}
          onClose={toggleConfirmation}
          titleButtonLeft="Back"
          titleButtonRight="Cancel"
          leftAction={toggleConfirmation}
          rightAction={toggleConfirmation}
        />

        <StateModal
          title="Confirm Deletion"
          subtitle={
            <p>Are you sure you want to delete this Customer data? This action is permanent and cannot be undone.</p>
          }
          isOpen={deleteModalIsOpen}
          onClose={handleCloseDeleteConfirmation}
          titleButtonRight={"Yes, Delete"}
          leftAction={handleCloseDeleteConfirmation}
          rightAction={handleDeleteCustomer}
        />
        <StateModal
          title={`${selectedRow?.status === "Active" ? "Suspend" : "Unsuspend"} Customer`}
          subtitle={
            <p>
              {selectedRow?.status === "Active"
                ? "Are you sure you want to suspend this customer?"
                : "Are you sure you want to unsuspend this customer? They will regain access to their account and be able to participate in campaigns and point transactions."}
            </p>
          }
          isOpen={suspendModalIsOpen}
          onClose={handleCloseSuspendConfirmation}
          titleButtonRight={`Yes, ${selectedRow?.status === "Active" ? "Suspend" : "Unsuspend"}`}
          leftAction={handleCloseSuspendConfirmation}
          rightAction={handleSuspendCustomer}
        />

        <AddSingleCustomerModal
          isOpen={addSingleCustomerIsOpen}
          onClose={() => {
            toggleSingleCustomer();
            if (!selectedRow) {
              setSelectedRow(null);
            }
          }}
          selectedCustomer={selectedRow}
          setSelectedCustomer={setSelectedRow}
          handleSubmitCustomer={handleSubmitCustomer}
          tiers={tiers?.data}
        />

        <AddBulkCustomerModal
          isOpen={addBulkCustomerIsOpen}
          onClose={closeAddBulkCustomer}
          handlePopUpErrorFile={() => {}}
          onOpen={openAddBulkCustomer}
          reRender={() => setReRender(!reRender)}
        />
      </div>
    </>
  );
};

export default DashboardCustomers;
