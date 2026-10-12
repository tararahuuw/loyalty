import React, { useState, Fragment } from "react";
import ReactDOMServer from "react-dom/server";

import { Dialog, Transition } from "@headlessui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import TextArea from "prezent/TextArea";
import { Chip, DangerButton, Description, OutlineButton } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { Tooltip } from "react-tooltip";
import { useDisclosure } from "prezent/useDisclosure";
import { Info, X } from "@phosphor-icons/react";

const InformationSection = ({ ipAddresses, roleAccess, description, url, onClickHandler }) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const { toggle: toggleRejectModal, isOpen: rejectModalIsOpen } = useDisclosure(false);

  const handleOpenRejectConfirmation = (row) => {
    toggleRejectModal();
    setSelectedRow(row);
  };

  const handleCloseRejectConfirmation = () => {
    toggleRejectModal();
    setSelectedRow(null);
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
    onSubmit: (values) => {
      onClickHandler({
        id: selectedRow.id,
        status: "Rejected",
        reason: values.reason,
      });
      handleCloseRejectConfirmation();
    },
  });

  const columns = [
    {
      header: "IP Address",
      assessor: "ip_address",
      tdStyle: { width: roleAccess === "Client Administrator" || roleAccess === "Client Support" ? "90%" : "33.3%" },
      Cell: (row) => {
        return <p className="font-normal text-black text-sm">{row.ipAddress}</p>;
      },
    },
    {
      header: "Status",
      tdStyle: { width: roleAccess === "Client Administrator" || roleAccess === "Client Support" ? "10%" : "33.3%" },
      Cell: (row) => {
        return (
          <div className="flex flex-row items-center gap-2">
            <Chip
              title={row.status === "waiting_for_approval" ? "Waiting for Approval" : row.status}
              type={row.status === "Approved" ? "success" : row.status === "Rejected" ? "danger" : "primary"}
            />

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
    (roleAccess === "System Administrator" || roleAccess === "Ops Administrator") && {
      header: "Action",
      tdStyle: { width: "33.3%" },
      Cell: (row) => {
        const { status } = row;

        if (status !== "Approved" && status !== "Rejected") {
          return (
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
          );
        }

        return "-";
      },
    },
  ];
  return (
    <>
      <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
        <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
          Integration Information
        </div>

        <Description title="URL" value={url} />

        <div className="rounded-lg border border-neutral30 overflow-hidden">
          <DataTable columns={columns} staticData={ipAddresses} options={{ pagination: true }} onClickRow={() => {}} />
        </div>

        <Description title="Description" value={description} />
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
                    onChange={(e) => reasonFormik.setFieldValue("reason", e.target.value)}
                    footer={reasonFormik.errors.reason}
                    isRequired
                    mode={reasonFormik.errors.reason ? "danger" : "default"}
                    value={reasonFormik.values.reason}
                    lengthChecker={false}
                  />

                  <div className="flex flex-row justify-end gap-2">
                    <OutlineButton title="Cancel" size="large" onClick={handleCloseRejectConfirmation} />

                    <DangerButton
                      title="Reject"
                      size="large"
                      isActive={reasonFormik.values.reason}
                      onClick={reasonFormik.handleSubmit}
                    />
                  </div>
                </div>
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default InformationSection;
