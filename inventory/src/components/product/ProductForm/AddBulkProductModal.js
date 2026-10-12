import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  PrimaryButton,
  OutlineButton,
  DropzoneUploadFile,
} from "sprint-asia-custom-component";
import * as yup from "yup";
import * as XLSX from "xlsx";
import ProgressBar from "../../shared/ProgressBar";
import DownloadTemplateButton from "../../shared/DownloadTemplateButton";
import templateFileXLSX from "../../../assets/Template Product List.xlsx";
import templateFileCSV from "../../../assets/Template Product List.csv";
import templateFileTXT from "../../../assets/Template Product List.txt";
import { FileText, X } from "@phosphor-icons/react";
import { useFormik } from "formik";
import {
  CreateProductBulk,
  DownloadProductFailed,
  ValidateProducts,
} from "../../../service/inventoryManagement/endpoint/product";
import ProgressBarFile from "../../shared/ProgressBarFile";
import { useDisclosure } from "prezent/useDisclosure";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const AddBulkProductModal = ({
  isOpen = false,
  onClose = () => {},
  onOpen = () => {},
  handlePopUpErrorFile,
  reRender,
}) => {
  const [items, setItems] = useState([]);
  const {
    isOpen: isLoading,
    toggle: toggleIsLoading,
    open: openIsLoading,
    close: closeIsLoading,
  } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const {
    isOpen: confirmationIsOpen,
    open: openConfirmationIsOpen,
    close: closeConfirmationIsOpen,
  } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const cancelButtonRef = useRef(null);

  const handleDownloadTemplate = async (format) => {
    let href = "";
    let filename = "";

    if (format === "TXT") {
      const response = await fetch(templateFileTXT);
      const text = await response.text();

      const blob = new Blob([text], { type: "text/plain" });
      href = URL.createObjectURL(blob);
      filename = "Template Product List.txt";
    } else if (format === "CSV") {
      href = templateFileCSV;
      filename = "Template Product List.csv";
    } else {
      href = templateFileXLSX;
      filename = "Template Product List.xlsx";
    }

    const link = document.createElement("a");
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (format === "TXT") {
      URL.revokeObjectURL(href); // cleanup blob
    }
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

  const docFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productDocument: "",
      mode: "upload",
      progress: 0,
      totalFilledRows: 0,
      nameFile: "",
      invalidRows: [],
      total: 0,
      succeed: 0,
      failed: 0,
      requestId: 0,
      items: [],
      requestId: 0,
      isValidHeader: false,
    },
    validationSchema: yup.object().shape({
      productDocument: yup.mixed().required("File product document is required"),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      handleReadDocument(values.productDocument);
    },
  });

  const handleReadDocument = async (file) => {
    docFormik.setFieldValue("isLoading", true);
    docFormik.setFieldValue("mode", "loading");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      let products = [];
      let isHeaderValid = false;

      try {
        if (file.name.endsWith(".txt")) {
          // ✅ Parsing TXT
          const text = data.toString();
          const rows = text.split(/\r?\n/).filter((line) => line.trim() !== "");
          const filledRows = rows.slice(1); // skip header
          const headerRow = rows[0].split(";").map((h) => h.trim());
          const expectedHeader = [
            "Category (Level 1-5)",
            "Brand",
            "Product Name",
            "Master SKU",
            "Specification 1",
            "Specification 2",
            "SKU",
            "Price",
          ];

          // ✅ Cek header
          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);

          filledRows.forEach((line, index) => {
            const row = line.split(";"); // pakai delimiter ;
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const normalizeSKU = (value) => {
              if (!value) return "";
              return value.trim().replace(/\s+/g, "").toUpperCase();
            };

            const product = {
              rowNumber: index + 1,
              category: row[0]?.trim() || "",
              brand: row[1]?.trim() || "",
              productName: row[2]?.trim() || "",
              masterSKU: normalizeSKU(row[3]),
              specificationsFirst: row[4]?.trim() || "",
              specificationsSecond: row[5]?.trim() || "",
              sku: normalizeSKU(row[6]),
              price: row[7]?.trim() || "",
            };

            products.push(product);
          });
        } else {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headerRow = jsonData[0].map((h) => h?.toString().trim());
          const expectedHeader = [
            "Category (Level 1-5)",
            "Brand",
            "Product Name",
            "Master SKU",
            "Specification 1",
            "Specification 2",
            "SKU",
            "Price",
          ];
          // ✅ Cek header
          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);
          docFormik.setFieldValue("isValidHeader", isHeaderValid)

          const filledRows = jsonData
            .slice(1)
            .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

          filledRows.forEach((row, index) => {
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const product = {
              rowNumber: index + 1,
              category: row[0]?.toString().trim() || "",
              brand: row[1]?.toString().trim() || "",
              productName: row[2]?.toString().trim() || "",
              masterSKU: row[3]?.toString().trim() || "",
              specificationsFirst: row[4]?.toString().trim() || "",
              specificationsSecond: row[5]?.toString().trim() || "",
              sku: row[6]?.toString().trim() || "",
              price: row[7]?.toString().trim() || "",
            };
            products.push(product);
          });
        }

        // ✅ simpan ke formik
        docFormik.setFieldValue("items", products);
        docFormik.setFieldValue("totalFilledRows", products.length);

        // progress bar + API call
        let progress = 0;
        docFormik.setFieldValue("progress", progress);

        const progressInterval = setInterval(() => {
          if (progress < 95) {
            progress += 1;
            docFormik.setFieldValue("progress", progress);
          }
        }, 1000);

        try {
          const response = await ValidateProducts({
            products,
            isValidHeader: isHeaderValid,
            fileType: docFormik.values.nameFile.endsWith(".txt")
              ? "txt"
              : docFormik.values.nameFile.endsWith(".csv")
              ? "csv"
              : docFormik.values.nameFile.endsWith(".xlsx")
              ? "xlsx"
              : "csv",
          });

          clearInterval(progressInterval);
          docFormik.setFieldValue("progress", 100);
          docFormik.setFieldValue("mode", "success");
          docFormik.setFieldValue("requestId", response?.requestId);
          setItems(products);
        } catch (error) {
          clearInterval(progressInterval);
          if (error?.response?.data?.rc === 2) {
            docFormik.setFieldValue("progress", 100);
            docFormik.setFieldValue("mode", "failed");
            docFormik.setFieldValue("requestId", error.response?.data?.requestId);
            docFormik.setFieldValue("total", error.response?.data?.data.total);
            docFormik.setFieldValue("succeed", error.response?.data?.data.succeed);
            docFormik.setFieldValue("failed", error.response?.data?.data.failed);
            docFormik.setFieldValue("invalidRows", error.response?.data?.data.details || []);
          } else {
            onClose();
            docFormik.resetForm();
            handleOpenModalResult(
              "failed",
              `Failed to upload bulk product data. Please try again.`
            );
            setTimeout(() => {
              onOpen();
            }, 2000);
          }
        }
      } catch (error) {
        docFormik.setFieldValue("isLoading", false);
        docFormik.setFieldValue("mode", "failed");
      }
    };

    // pilih metode read sesuai format
    if (file.name.endsWith(".txt")) {
      reader.readAsText(file); // txt
    } else {
      reader.readAsArrayBuffer(file); // excel
    }
  };

  const onDropFileproductDocument = (acceptedFiles) => {
    const file = acceptedFiles[0];

    docFormik.setFieldValue("productDocument", file);
    docFormik.setFieldValue("mode", "upload");
    docFormik.setFieldValue("nameFile", file?.name);
  };

  const handleCloseModal = () => {
    docFormik.resetForm();
    onClose();
    setItems([]);
  };

  function handleSubmitProduct() {
    if (docFormik.values.invalidRows.length === 0) {
      var response = handleSubmitDataProduct(docFormik.values.items);
      if (response?.code === 200) {
        handleOpenModalResult("success", "Bulk product data has been successfully uploaded.");
        reRender();
      }
    } else {
      const rowInvalid = new Set(docFormik.values.invalidRows.map((item) => item.rowNumber));
      const validRow = docFormik.values.items.filter((item) => !rowInvalid.has(item?.rowNumber));

      if (validRow.length > 0) {
        handleSubmitDataProduct(validRow).then((response) => {
          if (response?.code === 200) {
            handleOpenModalResult(
              "success",
              `Bulk product data has been successfully uploaded.`
            );
            reRender();
          }
        });
      }
    }
  }

  async function handleSubmitDataProduct(products) {
    try {
      onClose();
      openIsLoading();
      await CreateProductBulk({
        products: products,
        isValidHeader: docFormik.values.isValidHeader,
        fileType: docFormik.values.nameFile.endsWith(".txt")
          ? "txt"
          : docFormik.values.nameFile.endsWith(".csv")
          ? "csv"
          : docFormik.values.nameFile.endsWith(".xlsx")
          ? "xlsx"
          : "csv",
      });
      closeIsLoading();
      reRender();
      docFormik.resetForm();
      handleOpenModalResult("success", `Bulk product data has been successfully uploaded.`);
    } catch (error) {
      closeIsLoading();
      handleOpenModalResult("failed", `Failed to upload bulk product data. Please try again.`);
      setTimeout(() => {
        onOpen();
      }, 2000);
    }
  }

  async function handleSubmitDownload() {
    try {
      var response = await DownloadProductFailed({ id: docFormik.values.requestId });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${docFormik.values.nameFile}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      onClose();
      handleOpenModalResult(
        "failed",
        `Failed to upload bulk product data. Please try again.`
      );
      setTimeout(() => {
        onOpen();
      }, 1500);
    }
  }

  function handleCloseConfirmationModal() {
    closeConfirmationIsOpen();
    onOpen();
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
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
                    <p className="font-semibold text-xl text-black">Add Bulk Product</p>
                  )}
                  {docFormik.values.mode === "loading" && (
                    <p className="font-semibold text-xl text-black">Upload bulk product</p>
                  )}
                  {docFormik.values.mode === "success" && (
                    <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
                  )}
                  {docFormik.values.mode === "failed" && (
                    <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
                  )}

                  <a className="cursor-pointer" onClick={handleCloseModal}>
                    <X size={24} />
                  </a>
                </div>
                <div className="border-t border-neutral30 py-3 overflow-y-auto max-h-96">
                  <div className="px-6">
                    {docFormik.values.mode === "upload" && (
                      <>
                        <div className="mb-2">
                          <p className="text-lg text-neutral300 font-normal mb-4">
                            Please upload product data using the provided template file. The required information
                            includes:
                          </p>
                          <table className="w-full">
                            <thead className="bg-primary50 bg-white text-sm">
                              <tr>
                                <th className="m-0 p-0 bg-white">
                                  <div className="font-semibold bg-primary50 rounded-tl-lg p-2 w-48 justify-left flex flex-col border-r border-neutral40 m-0 text-black">
                                    Column Header
                                  </div>
                                </th>
                                <th className="m-0 p-0 bg-white">
                                  <div className="font-semibold bg-primary50 rounded-tr-lg p-2 justify-left flex flex-col border-l border-neutral40 m-0 text-black">
                                    Description
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Category Level 1 - 5
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the full category path separated by hyphens (-).{" "}
                                    <span className="font-semibold">Use 1–5 levels registered in the system. </span>
                                    Example:{" "}
                                    <span className="italic">
                                      Fashion – Men – Clothing - Tops – Thermal
                                    </span>
                                    .
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Brand
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the brand name as registered in the system, 1–50 characters. Example:{" "}
                                    <span className="italic">Sandeza</span>.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Product Name
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the product name, 1–100 characters. Example:{" "}
                                    <span className="italic">Men – Thermal Inner Long Sleeve Black S</span>.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Master SKU
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    <span>
                                      Enter the unique family SKU, 3–20 characters. Use uppercase letters, numbers, and
                                      a hyphen (-).
                                      <br />
                                      <br />
                                      <span className="font-semibold">Recommended Format:</span>
                                      <br />
                                      PRD–[3 First Letters of Company Name]–[5-digit running number].
                                      <br />
                                      <span className="font-semibold">Example:</span> PRDSPR–00001.
                                      <br />
                                      <br />
                                      <span className="text-sm font-semibold">Note: </span>
                                      <span className="text-sm italic">
                                        This format is a suggestion. You may create the Master SKU according to your
                                        product identification system.
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Specification 1
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the first product attribute (e.g., Color). Must match data registered in the
                                    system. Example: <span className="italic">BLACK</span>.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Specification 2
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the second product attribute (e.g., Size). Must match data registered in the
                                    system. Example: S.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    SKU
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the unique variant SKU combining product + specifications, 5–50 characters.
                                    Example: <span className="italic">PRDSPR-00001-BLACK-S</span>.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top rounded-bl-md">
                                  <div className="font-semibold p-2 w-48 text-neutral300 h-full flex items-start">
                                    Price
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top rounded-br-md">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the product price as a whole number (1–20 digits). Example:{" "}
                                    <span className="italic">120000</span>.
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="my-6">
                          <div className="mb-4">
                            <DownloadTemplateButton
                              title="Download Template"
                              data={[
                                {
                                  title: "TXT",
                                  action: () => handleDownloadTemplate("TXT"),
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
                            subtitle="Format File TXT, CSV, XLSX"
                            onDrop={onDropFileproductDocument}
                            selectedFile={docFormik.values.productDocument}
                            maxFiles={1}
                            error={docFormik.errors.productDocument}
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
                          <FileText className="w-12 h-12 mr-4 text-neutral50" />
                          <ProgressBar progress={docFormik.values.progress} nameFile={docFormik.values.nameFile} />
                        </div>
                      </>
                    )}
                    {docFormik.values.mode === "success" && (
                      <>
                        <div className="mb-2">
                          <p className="text-sm text-neutral300">All product data were successfully uploaded. </p>
                        </div>
                        <div className="my-4 flex w-full items-center">
                          <FileText className="w-12 h-12 mr-4 text-neutral50" />
                          <ProgressBarFile
                            totalData={
                              docFormik.values.failed === 0 || docFormik.values.failed === docFormik.values.total
                                ? 100
                                : (docFormik.values.succeed / docFormik.values.total) * 100
                            }
                            progress={(docFormik.values.succeed / docFormik.values.total) * 100}
                            nameFile={docFormik.values.nameFile}
                          />
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
                        <div className="mb-2">
                          <p className="text-neutral300 font-semibold">
                            {docFormik.values.total === docFormik.values.failed
                              ? "All entries in your uploaded file are invalid"
                              : "Some entries are incomplete or invalid"}
                          </p>
                          <p className="text-sm text-neutral300 mt-2">
                            {docFormik.values.total === docFormik.values.failed ? (
                              <>
                                <span className="font-semibold">{docFormik.values.total}</span> entries could not be
                                submitted. Please review the following errors and upload again.
                              </>
                            ) : (
                              <>
                                You are about to submit{" "}
                                <span className="font-semibold">{docFormik.values.succeed}</span> valid entries and
                                download <span className="font-semibold">{docFormik.values.failed}</span> failed
                                entries. Do you want to continue?
                              </>
                            )}
                          </p>
                        </div>
                        <div className="my-4 flex w-full items-center">
                          <FileText className="w-12 h-12 mr-4 text-neutral50" />
                          <ProgressBarFile
                            totalData={
                              docFormik.values.failed === 0 || docFormik.values.failed === docFormik.values.total
                                ? 100
                                : (docFormik.values.succeed / docFormik.values.total) * 100
                            }
                            progress={(docFormik.values.succeed / docFormik.values.total) * 100}
                            nameFile={docFormik.values.nameFile}
                          />
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
                                    {docFormik.values.total}
                                  </div>
                                </td>
                                <td className="m-0 p-0">
                                  <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                                    {docFormik.values.succeed}
                                  </div>
                                </td>
                                <td className="m-0 p-0">
                                  <div className="py-2 flex justify-center border rounded-br-md border-neutral40 m-0 text-danger500">
                                    {docFormik.values.failed}
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          {(docFormik.values.failed > 0 && docFormik.values.invalidRows.length) > 0 && (
                            <table className="w-full mt-4">
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
                                {docFormik.values.failed > 0 &&
                                  docFormik.values.invalidRows.map((data, id) => (
                                    <tr key={id}>
                                      {/* Product Name Column */}
                                      <td className="m-0 p-0 border border-neutral40">
                                        <div
                                          className={`p-2 h-full flex justify-start ${
                                            id === docFormik.values.failed - 1 ? "rounded-bl-md" : ""
                                          }`}
                                        >
                                          Row {data.rowNumber || "Not Found"}
                                        </div>
                                      </td>

                                      {/* Reasons for Failure Column */}
                                      <td className="m-0 p-0 border border-neutral40">
                                        <div
                                          className={`p-2 h-full flex flex-col justify-start ${
                                            id === docFormik.values.failed - 1 ? "rounded-br-md" : ""
                                          }`}
                                        >
                                          {data.errors?.length > 0 ? (
                                            data.errors.map((err, index) => <div key={index}>- {err}</div>)
                                          ) : (
                                            <div>Unknown error</div>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          )}
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
                    {docFormik.values.mode === "success" && (
                      <>
                        <div className="mr-3">
                          <OutlineButton mode="danger" title="Cancel" onClick={handleCloseModal} />
                        </div>
                        <PrimaryButton title="Submit" onClick={handleSubmitProduct} />
                      </>
                    )}
                    {docFormik.values.mode === "failed" &&
                      (docFormik.values.total === docFormik.values.failed ? (
                        <>
                          <OutlineButton title="Cancel" mode="danger" onClick={handleCloseModal} />
                          <div className="mx-3">
                            <OutlineButton title="Download Failed Data" onClick={handleSubmitDownload} />
                          </div>
                        </>
                      ) : (
                        <>
                          <OutlineButton title="Cancel" mode="danger" onClick={handleCloseModal} />
                          <div className="mx-3">
                            <OutlineButton title="Download Failed Data" onClick={handleSubmitDownload} />
                          </div>
                          <PrimaryButton title="Submit" onClick={handleSubmitProduct} />
                        </>
                      ))}
                  </div>
                )}
              </Dialog.Panel>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} onClose={() => {}} />
      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />
      <StateModal
        title="Do you want to cancel?"
        subtitle={
          <p>
            You are about to proceed with submitting <b>{docFormik.values.succeed}</b> data entries and downloading{" "}
            <b>{docFormik.values.failed}</b> entries marked as Failed. <br></br>
            <br></br>Are you sure you want to continue?
          </p>
        }
        isOpen={confirmationIsOpen}
        onClose={handleCloseConfirmationModal}
        titleButtonLeft="Back"
        titleButtonRight="Yes, Continue"
        leftAction={handleCloseConfirmationModal}
        rightAction={handleSubmitProduct}
      />
    </>
  );
};

export default AddBulkProductModal;
