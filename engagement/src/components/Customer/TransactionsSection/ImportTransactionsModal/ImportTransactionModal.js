import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, DropzoneUploadFile } from "sprint-asia-custom-component";
import * as yup from "yup";
import * as XLSX from "xlsx";
import ProgressBar from "../../../ProgressBar/ProgressBar";
import DownloadTemplateButton from "../../../DownloadTemplateButton/DownloadTemplateButton";
// import templateFileXLSX from "../../../../assets/template_transaction_list.xlsx";
// import templateFileCSV from "../../../../assets/template_transaction_list.csv";
// import templateFileTSV from "../../../../assets/template_transaction_list.tsv";
import { FileCsv, X } from "@phosphor-icons/react";
import { useFormik } from "formik";

const ImportTransactionsModal = ({ isOpen = false, onClose = () => {}, formik, onSubmit }) => {
  const [items, setItems] = useState([]);
  const cancelButtonRef = useRef(null);
  const handleDownloadTemplate = (format) => {
    const link = document.createElement("a");
    let href = "";
    let filename = "";

    // if (format === "TSV") {
    //   href = templateFileTSV;
    //   filename = "Template inventory transaction.tsv";
    // } else if (format === "CSV") {
    //   href = templateFileCSV;
    //   filename = "Template inventory transaction.csv";
    // } else {
    //   href = templateFileXLSX;
    //   filename = "Template inventory transaction.xlsx";
    // }

    link.href = href;
    link.download = filename;
    link.click();
  };

  const docFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      transactionsDocument: "",
      mode: "upload",
      progress: 0,
      totalFilledRows: 0,
      nameFile: "",
      invalidRows: [],
    },
    validationSchema: yup.object().shape({
      transactionsDocument: yup.mixed().required("File transaction document is required"),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      handleReadDocument(values.transactionsDocument);
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

        const points = [];

        const filledRows = jsonData
          .slice(1)
          .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

        const totalFilledRows = filledRows.length;
        docFormik.setFieldValue("totalFilledRows", totalFilledRows);

        let invalidRows = [];

        const campaignRegex = /^[A-Za-z0-9_-]{5,30}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const priceRegex = /^\d+$/;
        const nameRegex = /^[A-Za-z]+$/;
        const productRegex = /^[A-Za-z0-9& -]+$/;

        filledRows.forEach((row, index) => {
          const campaignName = row[0]?.toString().trim() || "";
          const name = row[1]?.toString().trim() || "";
          const email = row[2]?.toString().trim() || "";
          const product = row[3]?.toString().trim() || "";
          const price = row[4]?.toString().trim() || "";
          const store = row[5]?.toString().trim() || "";

          // Campaign name is required
          if (!campaignName) {
            invalidRows.push({
              campaignName: campaignName || "Unknown",
              index: index + 2,
              error: "Campaign name required.",
            });
            return;
          }

          // Email validation rules
          if (!campaignRegex.test(campaignName)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error:
                "Invalid loyalty name. Use 5-30 characters: letters, numbers, dash (-), and underscore (_). No spaces or special characters like @, #, $, etc.",
            });
            return;
          }

          // Name is required
          if (!name) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Name is required.",
            });
            return;
          }

          // Name validation
          if (!nameRegex.test(name)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Name must consist only string.",
            });
            return;
          }

          // Email is required
          if (!email) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Email is required. Ensure all points have a name.",
            });
            return;
          }

          // Email validation
          if (!emailRegex.test(email)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Please use correct email format.",
            });
            return;
          }

          // Product is required
          if (!product) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Product is required.",
            });
            return;
          }

          // Product validation
          if (!productRegex.test(product)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Invalid product name: letters, numbers, dash (-) and (&)",
            });
            return;
          }

          // Price is required
          if (!price) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Price is required.",
            });
            return;
          }

          // Point validation
          if (!priceRegex.test(price)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Price must be a number.",
            });
          }

          // Product is required
          if (!store) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Store is required.",
            });
            return;
          }

          // Product validation
          if (!productRegex.test(store)) {
            invalidRows.push({
              campaignName,
              index: index + 2,
              error: "Invalid store name: letters, numbers, dash (-) and (&)",
            });
            return;
          }

          points.push({ campaignName, name, email, product, price, store });
        });

        if (invalidRows.length > 0) {
          docFormik.setFieldValue("invalidRows", invalidRows);
          docFormik.setFieldValue("mode", "failed");
        } else {
          setItems(points);

          let progress = docFormik.values.progress;
          const incrementProgress = () => {
            if (progress < 100) {
              progress += 1;
              docFormik.setFieldValue("progress", progress);
              setTimeout(incrementProgress, 10);
            } else {
              docFormik.setFieldValue("mode", "success");
            }
          };
          incrementProgress();
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

    docFormik.setFieldValue("transactionsDocument", file);
    docFormik.setFieldValue("mode", "upload");
    docFormik.setFieldValue("nameFile", file?.email);
  };

  const handleCloseModal = () => {
    docFormik.resetForm();
    onClose();
    setItems([]);
  };

  const handleSubmit = () => {
    if (formik) {
      formik.setFieldValue("transactions", [...items, ...formik.values.transactions]);
    } else {
      onSubmit(items, docFormik.resetForm);
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
              <div className="flex justify-between py-3 px-6 items-center">
                {docFormik.values.mode === "upload" && (
                  <p className="font-semibold text-xl text-black">Import to upload transaction</p>
                )}
                {docFormik.values.mode === "loading" && (
                  <p className="font-semibold text-xl text-black">Upload bulk transaction</p>
                )}
                {docFormik.values.mode === "success" && (
                  <p className="font-semibold text-xl text-black">Uploaded successfully</p>
                )}
                {docFormik.values.mode === "failed" && (
                  <p className="font-semibold text-xl text-black">Upload Failed</p>
                )}

                <a className="cursor-pointer" onClick={handleCloseModal}>
                  <X size={24} />
                </a>
              </div>
              <div className="border-t border-neutral30 py-3">
                <div className="px-6">
                  {docFormik.values.mode === "upload" && (
                    <>
                      <div className="mb-2">
                        <p className="text-sm text-neutral300">Do these 3 steps to upload points:</p>
                        <p className="text-sm text-neutral300 my-2">1. Download template.</p>
                        <p className="text-sm text-neutral300 my-2">
                          2. Fill in the transaction data according to the template provision
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
                          title="Upload Document"
                          required={true}
                          subtitle="Format File XLSX, CSV, TSV, Maximal File 5 MB"
                          onDrop={onDropFileStoreDocument}
                          selectedFile={docFormik.values.transactionsDocument}
                          maxFiles={1}
                          error={docFormik.errors.transactionsDocument}
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
                        <p className="text-sm text-neutral300">Successfully uploaded data transaction!</p>
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
                  {docFormik.values.mode === "failed" && (
                    <>
                      <div className="mb-4">
                        <p className="text-sm text-neutral300">
                          The transaction was successfully uploaded; however, some points failed to upload. Please
                          correct your document again, and you can re-upload it.
                        </p>
                      </div>
                      <div className="w-full">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="m-0 p-0 w-1/2">
                                <div className="p-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                                  Campaign Name
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
                            {docFormik.values.invalidRows.map((data, id) => (
                              <tr key={id}>
                                {/* Campaign Name Column */}
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                                    }`}
                                  >
                                    {data.campaignName || `Row number ${data.index}`}
                                  </div>
                                </td>

                                {/* Reasons for Failure Column */}
                                <td className="m-0 p-0 border border-neutral40">
                                  <div
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                                    }`}
                                  >
                                    {data.error}
                                    {/* {data.errors?.length > 0 ? data.errors.join(", ") : "Unknown error"} */}
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
                        <OutlineButton title="Cancel" onClick={handleCloseModal} />
                      </div>
                      <PrimaryButton title="Submit" onClick={docFormik.handleSubmit} />
                    </>
                  )}
                  {docFormik.values.mode === "success" && <PrimaryButton title="Done" onClick={handleSubmit} />}
                  {docFormik.values.mode === "failed" && (
                    <>
                      <div className="mr-3">
                        <OutlineButton title="Close" onClick={handleCloseModal} />
                      </div>
                      <PrimaryButton title="Re-upload Data" onClick={() => docFormik.resetForm()} />
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

export default ImportTransactionsModal;
