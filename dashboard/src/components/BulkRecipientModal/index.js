import React, { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import * as yup from "yup";
import templateFileXLSX from "../../assets/file/template_recipient_list.xlsx";
import templateFileCSV from "../../assets/file/template_recipient_list.csv";
import templateFileTSV from "../../assets/file/template_recipient_list.tsv";
import DropzoneUploadFile from "../DropzoneUploadFile";
import ProgressBar from "../ProgressBar";
import * as XLSX from "xlsx";
import ModalButton from "../modalbutton";
import { useFormik } from "formik";
import { PiFileCsv } from "react-icons/pi";

const BulkRecipientModal = ({ isOpen = false, onClose = () => {}, formik, handlePopUpErrorFile }) => {
  const cancelButtonRef = useRef(null);

  function handleBackgroundClick(e) {
    e.stopPropagation();
  }

  const state = useFormik({
    enableReinitialize: true,
    initialValues: {
      recipientDocument: "",
      mode: "upload",
      progress: 0,
      totalFilledRows: 0,
      nameFile: "",
      invalidRows: [],
    },
    validationSchema: yup.object().shape({
      recipientDocument: yup.mixed().required("File recipient document is required"),
    }),
    validateOnChange: true,
    onSubmit: () => {
      handleReadDocument(state.values.recipientDocument);
    },
  });

  const onDropFileRecipientDocument = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const allowedMimeTypes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      "text/csv", // csv
      "text/tab-separated-values", // tsv
    ];

    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedMimeTypes.includes(file.type) || file.size > maxFileSize) {
      handlePopUpErrorFile("Incorrect Format File");
      return;
    } else {
      state.setFieldValue("recipientDocument", file);
      state.setFieldValue("mode", "upload");
      state.setFieldValue("nameFile", file.name);
    }
  };

  const handleReadDocument = (file) => {
    state.setFieldValue("isLoading", true);
    state.setFieldValue("mode", "loading");
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = e.target.result;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const invalidRows = [];
        const recipients = [];

        const filledRows = jsonData
          .slice(1)
          .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));
        const totalFilledRows = filledRows.length;
        state.setFieldValue("totalFilledRows", totalFilledRows);

        filledRows.forEach((row, index) => {
          if (row.includes("PROTECTED")) {
            handlePopUpErrorFile("Protected File");
            return;
          }

          const customerName = row[0];
          const channelWhatsapp = row[1];
          const channelSMS = row[2];
          const channelEmail = row[3];
          const voucherId = row[4];
          let isValidVoucher = false;
          let voucherName = "";

          if (voucherId) {
            formik.values.vouchers.forEach((voucher) => {
              if (voucher.id === voucherId) {
                isValidVoucher = true;
                voucherName = voucher.voucherName;
              }
            });
            if (!isValidVoucher) {
              invalidRows.push({
                recipientName: customerName,
                reasonInvalid: "Voucher ID not found. Please use one from the list selected voucher",
              });
            }
          }

          if (customerName && customerName.length > 25) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Customer name character max 25",
            });
          }
          if (customerName && /[.,]/.test(customerName)) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Customer name cannot contain periods or commas",
            });
          }

          if (channelWhatsapp && !String(channelWhatsapp).startsWith("62")) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Invalid Whatsapp number format",
            });
          }
          if (channelWhatsapp && String(channelWhatsapp).length > 14) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "The Number too long. Max 14 characters",
            });
          }
          if (channelWhatsapp && String(channelWhatsapp).length < 11) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "The number is too short please input min. 11 number",
            });
          }

          if (channelSMS && !String(channelSMS).startsWith("62")) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Invalid SMS number format",
            });
          }
          if (channelSMS && String(channelSMS).length > 14) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "The Number too long. Max 14 characters",
            });
          }
          if (channelSMS && String(channelSMS).length < 11) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "The number is too short please input min. 11 number",
            });
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (channelEmail && !emailRegex.test(channelEmail)) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Wrong email format. please use the right format",
            });
          }

          if (!channelWhatsapp && !channelSMS && !channelEmail) {
            invalidRows.push({
              recipientName: customerName,
              reasonInvalid: "Please choose at least one distribution method.",
            });
          }

          if (isValidVoucher && invalidRows.length === 0) {
            const channels = [];
            if (channelWhatsapp) channels.push("Whatsapp");
            if (channelSMS) channels.push("SMS");
            if (channelEmail) channels.push("Email");

            recipients.push({
              id: voucherId,
              voucherName,
              name: customerName,
              email: channelEmail || "",
              phoneNumber:
                String(channelWhatsapp) !== "undefined"
                  ? String(channelWhatsapp)
                  : String(channelSMS) !== "undefined"
                  ? String(channelSMS)
                  : null,
              channels,
            });
          }

          const progress = Math.round(((index + 1) / totalFilledRows) * 100);
          state.setFieldValue("progress", progress);
        });

        if (invalidRows.length > 0) {
          state.setFieldValue("invalidRows", invalidRows);
          state.setFieldValue("mode", "failed");
        } else {
          formik.setFieldValue("recipients", recipients);
          state.setFieldValue("mode", "success");
        }
      } catch (error) {
        state.setFieldValue("isLoading", false);
        state.setFieldValue("mode", "failed");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDownloadTemplate = (format) => {
    const link = document.createElement("a");
    if (format === "TSV") {
      link.href = templateFileTSV;
    } else if (format === "CSV") {
      link.href = templateFileCSV;
    } else {
      link.href = templateFileXLSX;
    }
    link.download = "Template.xlsx";
    link.click();
  };

  function handleCloseModal() {
    state.resetForm();
    onClose();
  }

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
            <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-all">
              <div className="flex justify-between py-3 px-6">
                {state.values.mode === "upload" && (
                  <p className="font-semibold text-xl text-black">Import to upload recipient</p>
                )}
                {state.values.mode === "loading" && (
                  <p className="font-semibold text-xl text-black">Upload bulk recipient</p>
                )}
                {state.values.mode === "success" && (
                  <p className="font-semibold text-xl text-black">Uploaded successfully</p>
                )}
                {state.values.mode === "failed" && <p className="font-semibold text-xl text-black">Upload Failed</p>}
                <p className="cursor-pointer text-xl" onClick={handleCloseModal}>
                  x
                </p>
              </div>
              <div className="border-t border-neutral30 py-3">
                <div className="px-6">
                  {state.values.mode === "upload" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-neutral300">Do these 3 steps to upload products:</p>
                        <p className="text-sm text-neutral300 my-2">1. Download template.</p>
                        <p className="text-sm text-neutral300 my-2">
                          2. Fill in the recipient list according to the template provisions:
                        </p>
                        <div className="ml-4">
                          <p className="text-sm text-neutral300 my-1">
                            <span className="font-semibold text-neutral500">Customer Name: </span>Enter the name without
                            using commas or periods. Max 25 characters.
                          </p>
                          <p className="text-sm text-neutral300 my-1">
                            <span className="font-semibold text-neutral500">WhatsApp Number: </span>Enter the phone
                            number starting with "62" (Min. 11 - Max. 14 digits).
                          </p>
                          <p className="text-sm text-neutral300 my-1">
                            <span className="font-semibold text-neutral500">SMS Number: </span>Enter the phone number
                            starting with "62" (Min. 11 - Max. 14 digits).
                          </p>
                          <p className="text-sm text-neutral300 my-1">
                            <span className="font-semibold text-neutral500">Email: </span>Enter the email using the
                            format example@domain.com.
                          </p>
                          <p className="text-sm text-neutral300 my-1">
                            <span className="font-semibold text-neutral500">Voucher ID: </span>The voucher ID is
                            available in the voucher selected table/voucher management menu. Copy and paste the provided
                            voucher ID column.
                          </p>
                        </div>
                        <p className="text-sm text-neutral300 my-2">
                          3. Upload the file you have filled in with a maximum size of 5 MB.
                        </p>
                      </div>
                      <div className="my-4">
                        <div className="mb-2">
                          <ModalButton
                            title="Download Template"
                            data={[
                              {
                                title: "XLSX",
                                action: () => handleDownloadTemplate("XLSX"),
                              },
                              {
                                title: "CSV",
                                action: () => handleDownloadTemplate("CSV"),
                              },
                              {
                                title: "TSV",
                                action: () => handleDownloadTemplate("TSV"),
                              },
                            ]}
                            disabled={false}
                            isIconVisible
                          />
                        </div>
                        <DropzoneUploadFile
                          title="Recipient Document"
                          required={true}
                          subtitle="Format File XLSX, CSV, TSV, Maximal File 5 MB"
                          onDrop={onDropFileRecipientDocument}
                          selectedFile={state.values.recipientDocument}
                          maxFiles={1}
                          error={state.errors.recipientDocument}
                        />
                      </div>
                    </>
                  )}
                  {state.values.mode === "loading" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-black font-bold">Data upload is in process</p>
                      </div>
                      <div className="my-4 flex w-full items-center">
                        <PiFileCsv className="w-12 h-12 mr-4 text-neutral50" />
                        <ProgressBar progress={state.values.progress} nameFile={state.values.nameFile} />
                      </div>
                    </>
                  )}
                  {state.values.mode === "success" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-neutral300">Successfully uploaded data recipient!</p>
                      </div>
                      <div className="my-4 flex w-full items-center">
                        <PiFileCsv className="w-12 h-12 mr-4 text-neutral50" />
                        <ProgressBar progress={state.values.progress} nameFile={state.values.nameFile} />
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <th className="m-0 p-0">
                              <div className="py-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                                Total
                              </div>
                            </th>
                            <th className="m-0 p-0">
                              <div className="py-2 flex justify-center border border-t border-b border-neutral40 m-0">
                                Succeed
                              </div>
                            </th>
                            <th className="m-0 p-0">
                              <div className="py-2 flex justify-center border rounded-tr-md border-neutral40 m-0">
                                Failed
                              </div>
                            </th>
                          </thead>
                          <tbody>
                            <td className="m-0 p-0">
                              <div className="py-2 flex justify-center border rounded-bl-md border-neutral40 m-0">
                                {state.values.totalFilledRows}
                              </div>
                            </td>
                            <td className="m-0 p-0">
                              <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                                {state.values.totalFilledRows}
                              </div>
                            </td>
                            <td className="m-0 p-0">
                              <div className="py-2 flex justify-center border rounded-br-md border-neutral40 m-0 text-success500">
                                0
                              </div>
                            </td>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {state.values.mode === "failed" && (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-neutral300">
                          The recipient was successfully uploaded; however, some recipients failed to upload. Please
                          correct your document again, and you can re-upload it.
                        </p>
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="m-0 p-0 w-1/2">
                                <div className="p-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                                  Recipient Name
                                </div>
                              </th>
                              <th className="m-0 p-0 w-1/2">
                                <div className="p-2 flex justify-center border rounded-tr-md border-neutral40 m-0">
                                  Reasons for Failure
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {state.values.invalidRows.map((data, id) => (
                              <tr key={id}>
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === state.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                                    }`}
                                  >
                                    {data.recipientName}
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === state.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                                    }`}
                                  >
                                    {data.reasonInvalid}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {state.values.mode !== "loading" && (
                <div className="border-t border-neutral30 py-3 flex justify-end px-6">
                  {state.values.mode === "upload" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Cancel" onClick={handleCloseModal} />
                      </div>
                      <PrimaryButton title="Submit" onClick={state.handleSubmit} />
                    </>
                  )}
                  {state.values.mode === "success" && <PrimaryButton title="Done" onClick={handleCloseModal} />}
                  {state.values.mode === "failed" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Close" onClick={handleCloseModal} />
                      </div>
                      <PrimaryButton title="Re-upload Data" onClick={() => state.resetForm()} />
                    </>
                  )}
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default BulkRecipientModal;
