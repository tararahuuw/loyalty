import React, { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, DropzoneUploadFile } from "sprint-asia-custom-component";
import * as yup from "yup";
import * as XLSX from "xlsx";
import ProgressBar from "../../shared/ProgressBar";
import DownloadTemplateButton from "../../shared/DownloadTemplateButton";
import templateFileXLSX from "../../../assets/Template Store List.xlsx";
import templateFileCSV from "../../../assets/Template Store List.csv";
import templateFileTXT from "../../../assets/Template Store List.txt";
import { FileText, X } from "@phosphor-icons/react";
import { useFormik } from "formik";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import {
  CreateStoreBulk,
  DownloadStoreFailed,
  ValidateStore,
} from "../../../service/inventoryManagement/endpoint/store";
import ProgressBarFile from "../../shared/ProgressBarFile";
import { useDisclosure } from "prezent/useDisclosure";

const AddBulkStoreModal = ({
  isOpen = false,
  onClose = () => {},
  onOpen = () => {},
  handlePopUpErrorFile,
  loyaltyId,
  reRender,
}) => {
  const [items, setItems] = useState([]);
  const { isOpen: isLoading, open: openIsLoading, close: closeIsLoading } = useDisclosure(false);
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
      filename = "Template Store List.txt";
    } else if (format === "CSV") {
      href = templateFileCSV;
      filename = "Template Store List.csv";
    } else {
      href = templateFileXLSX;
      filename = "Template Store List.xlsx";
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
      storeDocument: "",
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
      storeDocument: yup.mixed().required("File store document is required"),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      handleReadDocument(values.storeDocument);
    },
  });

  const handleReadDocument = async (file) => {
    docFormik.setFieldValue("isLoading", true);
    docFormik.setFieldValue("mode", "loading");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      let stores = [];
      let invalidRows = [];
      let isHeaderValid = false;

      try {
        if (file.name.endsWith(".txt")) {
          // ✅ Parsing TXT
          const text = data.toString();
          const rows = text.split(/\r?\n/).filter((line) => line.trim() !== "");
          const headerRow = rows[0].split(";").map((h) => h.trim());
          const expectedHeader = [
            "StoreID",
            "StoreName",
            "StorePhoneNumber",
            "Province",
            "City/Regencies",
            "District",
            "DetailAddress",
            "PostalCode",
          ];

          // ✅ Cek header
          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);
          const filledRows = rows.slice(1); // skip header

          filledRows.forEach((line, index) => {
            const row = line.split(";"); // pakai delimiter ;
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const store = {
              rowNumber: index + 1,
              code: row[0]?.trim() || "",
              name: row[1]?.trim() || "",
              phoneNumber: "+" + (row[2]?.trim() || ""),
              province: row[3]?.trim() || "",
              city: row[4]?.trim() || "",
              district: row[5]?.trim() || "",
              address: row[6]?.trim() || "",
              postalCode: row[7]?.trim() || "",
              isAutoGenerated: false,
              status: "active",
              loyaltyId: loyaltyId,
            };
            stores.push(store);
          });
        } else {
          // ✅ Parsing Excel
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headerRow = jsonData[0].map((h) => h?.toString().trim());
          const expectedHeader = [
            "Store ID",
            "Store Name",
            "Store Phone Number",
            "Province",
            "City / Regencies",
            "District",
            "Detail Address",
            "Postal Code",
          ];
          // ✅ Cek header
          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);

          const filledRows = jsonData
            .slice(1)
            .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

          filledRows.forEach((row, index) => {
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const store = {
              rowNumber: index + 1,
              code: row[0]?.toString().trim() || "",
              name: row[1]?.toString().trim() || "",
              phoneNumber: "+" + row[2]?.toString().trim() || "",
              province: row[3]?.toString().trim() || "",
              city: row[4]?.toString().trim() || "",
              district: row[5]?.toString().trim() || "",
              address: row[6]?.toString().trim() || "",
              postalCode: row[7]?.toString().trim() || "",
              isAutoGenerated: false,
              status: "active",
              loyaltyId: loyaltyId,
            };
            stores.push(store);
          });
        }

        // ✅ simpan ke formik
        docFormik.setFieldValue("items", stores);
        docFormik.setFieldValue("totalFilledRows", stores.length);

        // progress bar + API call masih sama seperti punyamu
        let progress = 0;
        docFormik.setFieldValue("progress", progress);

        const progressInterval = setInterval(() => {
          if (progress < 95) {
            progress += 1;
            docFormik.setFieldValue("progress", progress);
          }
        }, 1000);

        try {
          const response = await ValidateStore({
            stores,
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
          docFormik.setFieldValue("requestId", response?.requestID);
          setItems(stores);
        } catch (error) {
          clearInterval(progressInterval);
          if (error?.response?.data?.rc === 2) {
            docFormik.setFieldValue("progress", 100);
            docFormik.setFieldValue("mode", "failed");
            docFormik.setFieldValue("requestId", error.response?.data?.requestID);
            docFormik.setFieldValue("total", error.response?.data?.data.Total);
            docFormik.setFieldValue("succeed", error.response?.data?.data.succeed);
            docFormik.setFieldValue("failed", error.response?.data?.data.failed);
            docFormik.setFieldValue("invalidRows", error.response?.data?.data.details || []);
          } else {
            onClose();
            docFormik.resetForm();
            handleOpenModalResult(
              "failed",
              `Sorry, we’re unable to upload store data at the moment. Please try again later.`
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

  const onDropFileStoreDocument = (acceptedFiles) => {
    const file = acceptedFiles[0];

    docFormik.setFieldValue("storeDocument", file);
    docFormik.setFieldValue("mode", "upload");
    docFormik.setFieldValue("nameFile", file?.name);
  };

  const handleCloseModal = () => {
    docFormik.resetForm();
    onClose();
    setItems([]);
  };

  function handleSubmitStore() {
    if (docFormik.values.invalidRows.length === 0) {
      handleSubmitDataStore(docFormik.values.items).then((response) => {
        if (response?.code === 200) {
          reRender();
        }
      });
    } else {
      const codeInvalid = new Set(docFormik.values.invalidRows.map((item) => item.code));
      const rowInvalid = new Set(docFormik.values.invalidRows.map((item) => item.rowNumber));

      const validRow = docFormik.values.items.filter(
        (item) => !codeInvalid.has(item.code) && !rowInvalid.has(item.rowNumber)
      );

      if (validRow.length > 0) {
        handleSubmitDataStore(validRow).then((response) => {
          if (response?.code === 200) {
            handleOpenModalResult(
              "success",
              `Your store data has been successfully uploaded. Out of ${docFormik.values.total} rows, ${docFormik.values.succeed} were uploaded without any issues.`
            );
            reRender();
          }
        });
      }
    }
  }

  async function handleSubmitDataStore(stores) {
    try {
      onClose();
      openIsLoading();
      await CreateStoreBulk({ id: docFormik.values.requestId, body: { stores: stores } });
      closeIsLoading();
      reRender();
      docFormik.resetForm();
      handleOpenModalResult("success", `Bulk upload completed successfully. Your store data is now ready to use.`);
    } catch (error) {
      closeIsLoading();
      handleOpenModalResult("failed", `Sorry, unable to adding store at the moment. Please try again`);
      onOpen();
    }
  }

  async function handleSubmitDownload() {
    try {
      var response = await DownloadStoreFailed({ id: docFormik.values.requestId });
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
        `Sorry, we’re unable to download store data at the moment. Please try again later.`
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
                    <p className="font-semibold text-xl text-black">Add Bulk Store</p>
                  )}
                  {docFormik.values.mode === "loading" && (
                    <p className="font-semibold text-xl text-black">Upload bulk store</p>
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
                            Please upload store data using the provided template file. The required information
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
                                  <div className="font-semibold p-2 text-neutral300 h-full flex items-start">
                                    Store ID
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    <span>
                                      Enter the store ID with Min 3 & Max 50 characters.
                                      <br />
                                      <br />
                                      <span className="font-semibold">Recommended Format:</span>
                                      <br />
                                      STR–[3 First Letters of Company Name]–[5-digit running number].
                                      <br />
                                      <span className="font-semibold">Example:</span> STRSPR–00001.
                                      <br />
                                      <br />
                                      <span className="text-sm font-semibold">Note: </span>
                                      <span className="text-sm italic">
                                        This format is a suggestion. You may create the Store ID based on your internal
                                        structure or requirements
                                      </span>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 text-neutral300 h-full flex items-start">
                                    Store Name
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the store name with Min 3 & Max 100 characters.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 text-neutral300 h-full flex items-start">
                                    Phone Number
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter the phone number with country code, between 8 and 15 digits.
                                  </div>
                                </td>
                              </tr>

                              <tr className="align-top">
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="font-semibold p-2 text-neutral300 h-full flex items-start">
                                    Province
                                  </div>
                                </td>
                                <td className="m-0 p-0 border border-neutral40 align-top">
                                  <div className="p-2 text-neutral300 h-full">
                                    Enter province based on has been registered in the system.
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
                            onDrop={onDropFileStoreDocument}
                            selectedFile={docFormik.values.storeDocument}
                            maxFiles={1}
                            error={docFormik.errors.storeDocument}
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
                          <p className="text-sm text-neutral300">All store data were successfully uploaded. </p>
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
                                      {/* Store Name Column */}
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
                        <PrimaryButton title="Submit" onClick={handleSubmitStore} />
                      </>
                    )}
                    {docFormik.values.mode === "failed" &&
                      ((docFormik.values.succeed / docFormik.values.total) * 100 === 0 ? (
                        <>
                          <OutlineButton title="Cancel" mode="danger" onClick={handleCloseModal} />
                          <div className="mx-3">
                            <OutlineButton title="Download Failed Data" onClick={handleSubmitDownload} />
                          </div>
                          <PrimaryButton title="Submit" onClick={handleSubmitStore} />
                        </>
                      ) : docFormik.values.total === docFormik.values.failed ? (
                        <>
                          <OutlineButton title="Cancel" mode="danger" onClick={handleCloseModal} />
                          <div className="mx-3">
                            <OutlineButton title="Download Failed Data" onClick={handleSubmitDownload} />
                          </div>
                          <PrimaryButton title="Submit" onClick={handleSubmitStore} />
                        </>
                      ) : (
                        <>
                          <OutlineButton title="Cancel" mode="danger" onClick={handleCloseModal} />
                          <div className="mx-3">
                            <OutlineButton title="Download Failed Data" onClick={handleSubmitDownload} />
                          </div>
                          <PrimaryButton title="Submit" onClick={handleSubmitStore} />
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
        rightAction={handleSubmitStore}
      />
    </>
  );
};

export default AddBulkStoreModal;
