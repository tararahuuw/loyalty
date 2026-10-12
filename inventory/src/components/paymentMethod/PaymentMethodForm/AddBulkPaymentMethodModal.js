import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, DropzoneUploadFile } from "sprint-asia-custom-component";
import * as yup from "yup";
import * as XLSX from "xlsx";
import ProgressBar from "../../shared/ProgressBar";
import DownloadTemplateButton from "../../shared/DownloadTemplateButton";
import templateFileXLSX from "../../../assets/template_payment_method.xlsx";
import templateFileCSV from "../../../assets/template_payment_method.csv";
import templateFileTSV from "../../../assets/template_payment_method.tsv";
import { FileCsv, X } from "@phosphor-icons/react";
import { useFormik } from "formik";
import { useDisclosure } from "prezent/useDisclosure";
import { ValidatePaymentMethod } from "../../../service/inventoryManagement/endpoint/paymentMethod";
import ConfirmationModal from "../../shared/ConfirmationModal";

const AddBulkPaymentMethodModal = ({
  isOpen = false,
  onClose = () => {},
  formik,
  handlePopUpErrorFile,
  onSubmit,
  onSubmitSuccess,
  onSubmitFailed,
  existingPaymentMethods = [],
  loyaltyId,
  onOpenConfirmSubmit,
}) => {
  const [items, setItems] = useState([]);
  const cancelButtonRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const { isOpen: deleteSubmitIsOpen, open: openSubmitModal, close: closeSubmitModal } = useDisclosure(false);
  const [isSubmitWithDownload, setIsSubmitWithDownload] = useState(false);
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false);

  const openConfirmationModal = () => setConfirmationModalIsOpen(true);
  const closeConfirmationModal = () => setConfirmationModalIsOpen(false);

  const handleCancelClick = () => {
    openConfirmationModal();
  };

  const handleConfirmCancel = () => {
    closeConfirmationModal();
    onClose();
  };

  const handleBackCancel = () => {
    closeConfirmationModal();
  };

  const handleOpenSubmitConfirmation = () => {
    if (onOpenConfirmSubmit) {
      onOpenConfirmSubmit({
        totalSuccessRows: docFormik.values.totalSuccessRows,
        totalFailedRows: docFormik.values.totalFailedRows,
        items: [...items],
      });
    }
  };

  const handleCloseSubmitConfirmation = () => {
    setSelectedRow(null);
    closeSubmitModal();
  };

  const handleDownloadTemplate = (format) => {
    const link = document.createElement("a");
    let href = "";
    let filename = "";

    if (format === "TSV") {
      href = templateFileTSV;
      filename = "Template payment method.tsv";
    } else if (format === "CSV") {
      href = templateFileCSV;
      filename = "Template payment method.csv";
    } else {
      href = templateFileXLSX;
      filename = "Template payment method.xlsx";
    }

    link.href = href;
    link.download = filename;
    link.click();
  };

  const docFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      paymentMethodDocument: "",
      mode: "upload",
      progress: 0,
      totalFilledRows: 0,
      totalSuccessRows: 0,
      totalFailedRows: 0,
      nameFile: "",
      invalidRows: [],
    },
    validationSchema: yup.object().shape({
      paymentMethodDocument: yup.mixed().required("File payment method document is required"),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      handleReadDocument(values.paymentMethodDocument);
    },
  });

  const handleReadDocument = async (file) => {
    docFormik.setFieldValue("isLoading", true);
    docFormik.setFieldValue("mode", "loading");
    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;

      try {
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const paymentMethods = [];
        const invalidRows = [];
        const existingPaymentID = new Set(existingPaymentMethods.map((p) => p.paymentID));

        const filledRows = jsonData
          .slice(1)
          .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

        const totalFilledRows = filledRows.length;
        docFormik.setFieldValue("totalFilledRows", totalFilledRows);

        filledRows.forEach((row, index) => {
          if (row.includes("PROTECTED")) {
            handlePopUpErrorFile("Protected File");
            return;
          }

          const paymentMethod = {
            loyaltyID: loyaltyId,
            paymentID: row[0]?.toString().trim() || "",
            paymentName: row[1]?.toString().trim() || "",
            status: row[2]?.toString().trim() || "",
          };

          if (existingPaymentID.has(paymentMethod.paymentID)) {
            invalidRows.push({
              name: paymentMethod.paymentName || "Unnamed Payment Method",
              errors: [`Payment ID "${paymentMethod.paymentID}" already exists`],
            });
          } else {
            paymentMethods.push(paymentMethod);
          }
        });

        if (invalidRows.length > 0) {
          docFormik.setFieldValue("invalidRows", invalidRows);
          docFormik.setFieldValue("mode", "failed");
          return;
        }

        if (invalidRows.length > 0) {
          docFormik.setFieldValue("invalidRows", invalidRows);
          docFormik.setFieldValue("mode", "failed");
          return;
        }

        try {
          await ValidatePaymentMethod({ paymentMethods });

          const successRows = paymentMethods.length;
          const failedRows = invalidRows.length;

          setItems(paymentMethods);

          docFormik.setFieldValue("totalSuccessRows", successRows);
          docFormik.setFieldValue("totalFailedRows", failedRows);

          let progress = docFormik.values.progress;
          const incrementProgress = () => {
            if (progress < 100) {
              progress += 1;
              docFormik.setFieldValue("progress", progress);
              setTimeout(incrementProgress, 10);
            } else {
              const mode =
                successRows > 0 && failedRows === 0
                  ? "success"
                  : successRows > 0 && failedRows > 0
                  ? "partial_success"
                  : "failed";
              docFormik.setFieldValue("mode", mode);
            }
          };
          incrementProgress();
        } catch (error) {
          const data = error.response?.data?.data || {};
          const { succeed = 0, failed = 0, details = [] } = data;
          const successRows = data.succeed;
          const failedRows = data.failed;

          setItems(paymentMethods);

          docFormik.setFieldValue("totalSuccessRows", successRows);
          docFormik.setFieldValue("totalFailedRows", failedRows);
          docFormik.setFieldValue(
            "invalidRows",
            Array.isArray(details)
              ? details.map((d) => ({
                  name: d.row || "Unknown Row",
                  errors: d.reason || ["Unknown reason"],
                }))
              : []
          );
          const mode =
            succeed > 0 && failed === 0 ? "success" : succeed === 0 && failed > 0 ? "failed" : "partial_success";
          docFormik.setFieldValue("mode", mode);
        }
      } catch (error) {
        docFormik.setFieldValue("isLoading", false);
        docFormik.setFieldValue("mode", "failed");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const onDropFileStoreDocument = (acceptedFiles) => {
    const file = acceptedFiles[0];

    docFormik.setFieldValue("paymentMethodDocument", file);
    docFormik.setFieldValue("mode", "upload");
    docFormik.setFieldValue("nameFile", file?.name);
  };

  const handleCloseModal = () => {
    docFormik.resetForm();
    onClose();
    setItems([]);
    setIsSubmitWithDownload(false);
  };

  const handleSubmit = () => {
    if (docFormik.values.mode === "success") {
      if (onSubmitSuccess) {
        onSubmitSuccess(items, docFormik.resetForm);
      }
      handleCloseModal();
    } else if (docFormik.values.mode === "partial_success" && isSubmitWithDownload) {
      if (onSubmitFailed) {
        onSubmitFailed(items, docFormik.resetForm);
      }
      handleCloseModal();
    } else if (docFormik.values.mode === "failed") {
      if (onSubmitFailed) {
        onSubmitFailed(items, docFormik.resetForm);
      }
      handleCloseModal();
    }
  };

  const handleSubmitFromConfirmation = () => {
    if (onSubmitFailed) {
      onSubmitFailed([...items], () => {
        docFormik.resetForm();
        setItems([]);
      });
    }
    handleCloseModal();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 overflow-y-auto z-50"
        initialFocus={cancelButtonRef}
        onClose={handleCloseModal}
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
            <Dialog.Panel className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-all">
              {["success", "partial_success", "failed", "upload", "loading"].includes(docFormik.values.mode) && (
                <div className="flex justify-between py-3 px-6 items-center">
                  <p className="font-semibold text-xl text-black">
                    {docFormik.values.mode === "upload"
                      ? "Import to upload payment method"
                      : docFormik.values.mode === "loading"
                      ? "Upload bulk payment method"
                      : docFormik.values.mode === "success" || docFormik.values.mode === "partial_success"
                      ? "Upload successful"
                      : "Upload failed"}
                  </p>
                  <a className="cursor-pointer" onClick={handleCloseModal}>
                    <X size={24} />
                  </a>
                </div>
              )}
              <div className="border-t border-neutral30 py-3">
                <div className="px-6">
                  {docFormik.values.mode === "upload" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-neutral300">Do these 3 steps to upload payment method:</p>
                        <p className="text-sm text-neutral300 my-2">1. Download template.</p>
                        <p className="text-sm text-neutral300 my-2">
                          2. Fill in the payment method data according to the template provision
                        </p>
                        <p className="text-sm text-neutral300 my-2">
                          3. Upload the file you have filled in with a maximum size of 5 MB.
                        </p>
                      </div>
                      <div className="my-4">
                        <div className="mb-2">
                          <DownloadTemplateButton
                            title="Download Template"
                            data={[
                              {
                                title: "TSV",
                                action: () => handleDownloadTemplate("TSV"),
                              },
                              {
                                title: "CSV",
                                action: () => handleDownloadTemplate("CSV"),
                              },
                              {
                                title: "XLSX",
                                action: () => handleDownloadTemplate("XLSX"),
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
                          onDrop={onDropFileStoreDocument}
                          selectedFile={docFormik.values.paymentMethodDocument}
                          maxFiles={1}
                          error={docFormik.errors.paymentMethodDocument}
                          acceptExcel
                        />
                      </div>
                    </>
                  )}
                  {docFormik.values.mode === "loading" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-black font-bold">Data upload is in process</p>
                      </div>
                      <div className="my-4 flex w-full items-center">
                        <FileCsv className="w-12 h-12 mr-4 text-neutral50" />
                        <ProgressBar progress={docFormik.values.progress} nameFile={docFormik.values.nameFile} />
                      </div>
                    </>
                  )}
                  {docFormik.values.mode === "success" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-neutral300">All payment method data were successfully uploaded.</p>
                      </div>
                      <div className="my-4 flex w-full items-center">
                        <FileCsv className="w-12 h-12 mr-4 text-neutral50" />
                        <ProgressBar progress={docFormik.values.progress} nameFile={docFormik.values.nameFile} />
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr>
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
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td className="m-0 p-0">
                                <div className="py-2 flex justify-center border rounded-bl-md border-neutral40 m-0">
                                  {docFormik.values.totalFilledRows}
                                </div>
                              </td>
                              <td className="m-0 p-0">
                                <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                                  {docFormik.values.totalFilledRows}
                                </div>
                              </td>
                              <td className="m-0 p-0">
                                <div className="py-2 flex justify-center border rounded-br-md border-neutral40 m-0 text-success500">
                                  0
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {docFormik.values.mode === "partial_success" && (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-neutral300">
                          The payment method was uploaded successfully. However, some rows failed due to data issues.
                          Please download the failed data correct the errors, and re-upload only the fixed rows.
                        </p>
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="m-0 p-0 w-1/2">
                                <div className="p-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                                  Position
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
                            {(docFormik.values.invalidRows || []).map((data, id) => (
                              <tr key={id}>
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                                    }`}
                                  >
                                    {data.name || "Unnamed Store"}
                                  </div>
                                </td>

                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                                    }`}
                                  >
                                    {data.errors?.length > 0 ? data.errors.join(", ") : "Unknown error"}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                  {docFormik.values.mode === "failed" && (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-neutral300">
                          The payment method was uploaded successfully. However, some rows failed due to data issues.
                          Please download the failed data correct the errors, and re-upload only the fixed rows.
                        </p>
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="m-0 p-0 w-1/2">
                                <div className="p-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                                  Position
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
                            {(docFormik.values.invalidRows || []).map((data, id) => (
                              <tr key={id}>
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                                    }`}
                                  >
                                    {data.name || "Unnamed Store"}
                                  </div>
                                </td>

                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                                    }`}
                                  >
                                    {data.errors?.length > 0 ? data.errors.join(", ") : "Unknown error"}
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
              {docFormik.values.mode !== "loading" && (
                <div className="border-t border-neutral30 py-3 flex justify-end px-6">
                  {docFormik.values.mode === "upload" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Cancel" onClick={handleCancelClick} />
                      </div>
                      <PrimaryButton title="Submit" onClick={docFormik.handleSubmit} />
                    </>
                  )}

                  {docFormik.values.mode === "success" && <PrimaryButton title="Submit" onClick={handleSubmit} />}

                  {docFormik.values.mode === "partial_success" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Cancel" onClick={handleCancelClick} />
                      </div>
                      <PrimaryButton title="Submit & Download" onClick={handleOpenSubmitConfirmation} />
                    </>
                  )}

                  {docFormik.values.mode === "failed" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Close" onClick={handleCloseModal} />
                      </div>
                      <PrimaryButton title="Download Failed Data" onClick={handleSubmit} />
                    </>
                  )}
                </div>
              )}

              <ConfirmationModal
                isOpen={confirmationModalIsOpen}
                onClick={handleConfirmCancel}
                onClose={handleBackCancel}
                title="Do you want to cancel?"
                subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
              />
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default AddBulkPaymentMethodModal;
