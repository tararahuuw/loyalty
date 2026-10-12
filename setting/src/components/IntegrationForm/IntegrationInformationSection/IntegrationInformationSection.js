import React, { useState, Fragment } from "react";
import ReactDOMServer from "react-dom/server";
import { PrimaryButton, TextInput, Chip, DangerButton, OutlineButton } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { Dialog, Transition } from "@headlessui/react";
import DataTable from "prezent/DataTable";
import TextArea from "prezent/TextArea";
import { Info, Trash, X } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import { DeleteIpAddress } from "../../../service/settingmanagement/endpoint";
import { Tooltip } from "react-tooltip";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const IntegrationInformationSection = ({
  data,
  formik,
  ipFormik,
  ipAddresses,
  setIpAddresses,
  onClickHandler,
  refetch,
  roleAccess,
  isChecked,
}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { toggle: toggleRejectModal, isOpen: rejectModalIsOpen } = useDisclosure(false);
  const { toggle: toggleDeleteModal, isOpen: deleteModalIsOpen } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);

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

  const handleOpenRejectConfirmation = (row) => {
    toggleRejectModal();
    setSelectedRow(row);
  };

  const handleCloseRejectConfirmation = () => {
    toggleRejectModal();
    setSelectedRow(null);
  };

  const handleOpenDeleteModal = (row) => {
    toggleDeleteModal();
    setSelectedRow(row);
  };

  const handleCloseDeleteModal = () => {
    toggleDeleteModal();
    setSelectedRow(null);
  };

  const handleDeleteIntegration = async () => {
    try {
      toggleLoadingModal();
      await DeleteIpAddress(roleAccess, selectedRow.id, isChecked);
      refetch();
      handleCloseDeleteModal();
      toggleLoadingModal();
      handleOpenModalResult("success", "Integration has been successfully deleted.");
    } catch (error) {
      handleCloseDeleteModal();
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to delete integration at the moment. Please try again");
    }
  };

  const reasonFormik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: yup.object().shape({
      reason: yup
        .string()
        .min(10, "10 characters minimum")
        .max(30, "30 characters maximum")
        .required("Reason is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      onClickHandler({
        id: selectedRow.id,
        status: "Rejected",
        reason: values.reason,
      });
      handleCloseRejectConfirmation();
    },
  });

  const addIpHandler = (value) => {
    if (!ipAddresses.find((item) => item.ipAddress === value)) {
      ipFormik.handleSubmit();
    } else {
      ipFormik.setFieldError("ipAddress", "This IP address has already been registered. Please input a different one.");
    }
  };

  const removeIpHandler = (selectedIp) => {
    const filteredIpAddresses = ipAddresses.filter((item) => item.ipAddress !== selectedIp);
    setIpAddresses(filteredIpAddresses);
  };

  const columns = [
    {
      header: "IP Address",
      assessor: "ip_address",
      Cell: (row) => {
        return <p className="font-normal text-black text-sm">{row.ipAddress}</p>;
      },
    },
    data && {
      header: "Status",
      Cell: (row) => {
        return (
          <div className="flex flex-row items-center gap-2">
            {row.status && (
              <Chip
                title={row.status === "waiting_for_approval" ? "Waiting for Approval" : row.status}
                type={row.status === "Approved" ? "success" : row.status === "Rejected" ? "danger" : "primary"}
              />
            )}
            {row.reason && row.status === "Rejected" && (
              <>
                <a
                  data-tooltip-id="my-tooltip"
                  data-tooltip-place="top"
                  data-tooltip-html={ReactDOMServer.renderToStaticMarkup(
                    <div className="p-1">
                      <p className="text-white">{row.reason}</p>
                    </div>
                  )}
                >
                  <Info className="text-neutral700" />
                </a>

                <Tooltip
                  id="my-tooltip"
                  style={{ borderRadius: 8, background: "black", width: "320px", paddingTop: 16, paddingBottom: 16 }}
                />
              </>
            )}
          </div>
        );
      },
    },
    roleAccess === "System Administrator" && {
      header: "Action",
      tdStyle: { width: "10%" },
      Cell: (row) => {
        return (
          <div className="flex flex-row items-center gap-1">
            {data && row.status === "waiting_for_approval" && (
              <div className="flex flex-row items-center gap-1">
                <OutlineButton mode="danger" title="Reject" onClick={() => handleOpenRejectConfirmation(row)} />

                <OutlineButton
                  title="Approve"
                  onClick={() =>
                    onClickHandler({
                      id: row.id,
                      status: "Approved",
                      reason: "",
                    })
                  }
                />
              </div>
            )}

            <a
              onClick={() => {
                removeIpHandler(row.ipAddress);
              }}
            >
              <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Integration Information
        </div>

        <TextInput
          title="URL Callback"
          placeholder="Input URL"
          onChangeInput={(e) => {
            formik.setFieldValue("urlCallback", e.target.value);
            formik.setFieldTouched("urlCallback", true, false);
          }}
          footer={
            (formik.touched.urlCallback || formik.submitCount > 0) && formik.errors.urlCallback
              ? formik.errors.urlCallback
              : null
          }
          mode={
            (formik.touched.urlCallback || formik.submitCount > 0) && formik.errors.urlCallback ? "danger" : "default"
          }
          isRequired
          value={formik.values.urlCallback}
          className="max-w-sm"
        />

        <div className="flex flex-row gap-2">
          <TextInput
            title="IP Address"
            placeholder="Input IP"
            onChangeInput={(e) => {
              ipFormik.setFieldValue("ipAddress", e.target.value);
              ipFormik.setFieldTouched("ipAddress", true, false);
            }}
            footer={
              (ipFormik.touched.ipAddress || ipFormik.submitCount > 0) && ipFormik.errors.ipAddress
                ? ipFormik.errors.ipAddress
                : null
            }
            mode={
              (ipFormik.touched.ipAddress || ipFormik.submitCount > 0) && ipFormik.errors.ipAddress
                ? "danger"
                : "default"
            }
            isRequired
            value={ipFormik.values.ipAddress}
            className="flex-1"
          />

          <div className="flex items-end">
            <PrimaryButton
              title="Add IP"
              isActive
              onClick={(e) => {
                addIpHandler(ipFormik.values.ipAddress);
                e.preventDefault();
              }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-neutral30 overflow-hidden">
          <DataTable columns={columns} staticData={ipAddresses} onClickRow={() => {}} options={{ pagination: true }} />
        </div>

        <TextArea
          title="Description"
          placeholder="Input Description"
          onChange={(e) => {
            formik.setFieldValue("description", e.target.value);
            formik.setFieldTouched("description", true, false);
          }}
          footer={
            (formik.touched.description || formik.submitCount > 0) && formik.errors.description
              ? formik.errors.description
              : null
          }
          mode={
            (formik.touched.description || formik.submitCount > 0) && formik.errors.description ? "danger" : "default"
          }
          value={formik.values.description}
          lengthChecker={false}
          isRequired
        />
      </div>

      <Transition.Root show={rejectModalIsOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-10"
          onClose={handleCloseRejectConfirmation}
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
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={(e) => e.stopPropagation()} />
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
              <Dialog.Panel className="relative w-full max-w-lg bg-white rounded-lg shadow-xl transition-all sm:w-full sm:max-w-lg">
                <div className="px-6 pb-6">
                  <div className="flex justify-between py-3">
                    <p className="font-semibold text-xl text-black">Reject Integration</p>
                    <p className="cursor-pointer text-xl" onClick={handleCloseRejectConfirmation}>
                      <X />
                    </p>
                  </div>

                  <TextArea
                    title="What caused you to reject the verification for this integration?"
                    placeholder="Input reason"
                    onChange={(e) => {
                      reasonFormik.setFieldValue("reason", e.target.value);
                      reasonFormik.setFieldTouched("reason", true, false);
                    }}
                    footer={
                      (reasonFormik.touched.reason || reasonFormik.submitCount > 0) && reasonFormik.errors.reason
                        ? reasonFormik.errors.reason
                        : null
                    }
                    mode={
                      (reasonFormik.touched.reason || reasonFormik.submitCount > 0) && reasonFormik.errors.reason
                        ? "danger"
                        : "default"
                    }
                    isRequired
                    value={reasonFormik.values.reason}
                    lengthChecker={false}
                  />

                  <div className="flex flex-row justify-end gap-2">
                    <OutlineButton title="Cancel" size="large" isActive onClick={handleCloseRejectConfirmation} />

                    <DangerButton title="Reject" size="large" isActive onClick={reasonFormik.handleSubmit} />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <StateModal
        title="Delete Integration?"
        subtitle="Are you sure you want to delete this integration?"
        isOpen={deleteModalIsOpen}
        onClose={handleCloseDeleteModal}
        type="danger"
        titleButtonRight="Delete"
        leftAction={handleCloseDeleteModal}
        rightAction={handleDeleteIntegration}
      />

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default IntegrationInformationSection;
