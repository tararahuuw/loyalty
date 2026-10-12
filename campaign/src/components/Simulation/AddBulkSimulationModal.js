import React, { useState } from "react";
import { PrimaryButton, OutlineButton, DropzoneUploadFile, DropdownText } from "sprint-asia-custom-component";
import * as yup from "yup";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import StateModal from "prezent/StateModal";
import * as XLSX from "xlsx";
import DownloadTemplateButton from "./DownloadTemplateButton";
import { FileTextIcon, XIcon } from "@phosphor-icons/react";
import { useFormik } from "formik";
import ProgressBar from "../ProgressBar";
import { useDisclosure } from "prezent/useDisclosure";
import moment from "moment";
import {
  CreateBulkSimulation,
  DownloadSimulationFailed,
  ValidateSimulations,
  DownloadTemplate,
} from "../../service/pointrulesmanagement/endpoint";
import ProgressBarFile from "./ProgressBarFile";
import Modal from "prezent/Modal";

const AddBulkSimulationModal = ({
  isOpen = false,
  onClose = () => {},
  onOpen = () => {},
  handlePopUpErrorFile,
  reRender,
  formik,
  campaigns = [],
  campaignId,
  handleSetCampaignId,
}) => {
  const { isOpen: isLoading, close: closeIsLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, close: closeConfirmationIsOpen } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");

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
      transactionDocument: "",
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
      campaignId: campaignId || "",
      isValidHeader: false,
    },
    validationSchema: yup.object().shape({
      transactionDocument: yup.mixed().required("Please complete this required field to continue."),
      campaignId: yup.string().required("Please complete this required field to continue."),
    }),
    validateOnChange: true,
    onSubmit: (values) => {
      handleReadDocument(values.transactionDocument);
    },
  });

  const handleReadDocument = async (file) => {
    docFormik.setFieldValue("isLoading", true);
    docFormik.setFieldValue("mode", "loading");

    const reader = new FileReader();

    reader.onload = async (e) => {
      const data = e.target.result;
      let transactions = [];
      let isHeaderValid = false;

      try {
        if (file.name.endsWith(".txt")) {
          // ✅ Parsing TXT
          const text = data.toString();
          const rows = text.split(/\r?\n/).filter((line) => line.trim() !== "");
          const headers = rows[0].split(";").map((h) => h?.toString().trim() || "");
          const filledRows = rows.slice(1);
          const headerRow = rows[0].split(";").map((h) => h.trim());
          const selectedCampaign = campaigns?.data?.find((c) => c.id === docFormik.values.campaignId);

          const pointParameters = selectedCampaign?.campaignPointActive?.pointParameters;
          const earningPointMethod = selectedCampaign?.campaignPointActive?.earningPointMethod === "segmented";
          const parameterNames =
            Array.isArray(pointParameters) && pointParameters.length > 0
              ? pointParameters
                  .map((p) => p.settingParameterName)
                  .filter((name) => name?.trim().toLowerCase() !== "date time")
              : [];

          const expectedHeader = [
            "Customer",
            "Phone Number",
            "Email",
            "Transaction Date",
            ...parameterNames,
            ...(earningPointMethod ? ["Tier Level"] : []),
          ];

          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);

          filledRows.forEach((line) => {
            const row = line.split(";");
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const transaction = headers.map((header, colIdx) => {
              let value = row[colIdx]?.toString().trim() || "";

              // 🔑 khusus kolom Phone Number
              if (header.toLowerCase() === "phone number" && value && !value.startsWith("+")) {
                value = `+${value}`;
              }

              return value;
            });

            transactions.push(transaction);
          });
        } else {
          // ✅ Parsing Excel / CSV
          const workbook = XLSX.read(data, { type: "array", cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const headers = jsonData[0].map((h) => h?.toString().trim() || "");
          const headerRow = jsonData[0].map((h) => h?.toString().trim());

          const selectedCampaign = campaigns?.data?.find((c) => c.id === docFormik.values.campaignId);

          const pointParameters = selectedCampaign?.campaignPointActive?.pointParameters;
          const earningPointMethod = selectedCampaign?.campaignPointActive?.earningPointMethod === "segmented";
          const parameterNames =
            Array.isArray(pointParameters) && pointParameters.length > 0
              ? pointParameters
                  .map((p) => p.settingParameterName)
                  .filter((name) => name?.trim().toLowerCase() !== "date time")
              : [];

          const expectedHeader = [
            "Customer",
            "Phone Number",
            "Email",
            "Transaction Date",
            ...parameterNames,
            ...(earningPointMethod ? ["Tier Level"] : []),
          ];

          isHeaderValid = expectedHeader.every((header, i) => headerRow[i] === header);

          const filledRows = jsonData
            .slice(1)
            .filter((row) => row.some((cell) => cell !== null && cell !== undefined && cell !== ""));

          filledRows.forEach((row) => {
            if (row.includes("PROTECTED")) {
              handlePopUpErrorFile("Protected File");
              return;
            }

            const transaction = headers.map((header, colIdx) => {
              let value = row[colIdx];

              // 🕓 Jika cell berupa Date object, ubah jadi string dd-mm-yyyy hh:mm
              if (value instanceof Date) {
                // ⏰ Tambahkan 1 menit khusus untuk file .xlsx
                if (file.name.endsWith(".xlsx")) {
                  value.setMinutes(value.getMinutes() + 1);
                }

                const day = String(value.getDate()).padStart(2, "0");
                const month = String(value.getMonth() + 1).padStart(2, "0");
                const year = value.getFullYear();
                const hours = String(value.getHours()).padStart(2, "0");
                const minutes = String(value.getMinutes()).padStart(2, "0");
                value = `${day}-${month}-${year} ${hours}:${minutes}`;
              } else {
                value = value?.toString().trim() || "";
              }

              // 🔑 khusus kolom Phone Number
              if (header.toLowerCase() === "phone number" && value && !value.startsWith("+")) {
                value = `+${value}`;
              }

              return value;
            });

            transactions.push(transaction);
          });
        }

        // ✅ simpan ke formik
        docFormik.setFieldValue("items", transactions);
        docFormik.setFieldValue("totalFilledRows", transactions.length);

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
          const response = await ValidateSimulations({
            transactions,
            isValidHeader: isHeaderValid,
            campaignId: docFormik.values.campaignId,
            fileType: file.name.endsWith(".txt")
              ? "txt"
              : file.name.endsWith(".csv")
              ? "csv"
              : file.name.endsWith(".xlsx")
              ? "xlsx"
              : "csv",
          });

          clearInterval(progressInterval);
          docFormik.setFieldValue("progress", 100);
          docFormik.setFieldValue("mode", "success");
          docFormik.setFieldValue("requestId", response?.requestId);
        } catch (error) {
          clearInterval(progressInterval);
          if (error?.response?.data?.rc === 2 || error?.response?.data?.rc === 400) {
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
            handleOpenModalResult("failed", `Failed to upload bulk customer transactions data. Please try again.`);
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
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const onDropFiletransactionDocument = (acceptedFiles) => {
    const file = acceptedFiles[0];

    docFormik.setFieldValue("transactionDocument", file);
    docFormik.setFieldValue("mode", "upload");
    docFormik.setFieldValue("nameFile", file?.name);
  };

  const handleCloseModal = () => {
    docFormik.resetForm();
    onClose();
  };

  function handleSubmitTransaction() {
    if (docFormik.values.invalidRows.length === 0) {
      var response = handleSubmitDataTransaction(docFormik.values.items);
      if (response.code === 200) {
        handleOpenModalResult("success", "Bulk simulation data has been successfully uploaded.");
        reRender();
      }
    } else {
      const rowInvalid = new Set(docFormik.values.invalidRows.map((r) => r.rowNumber - 1));
      const validRow = docFormik.values.items.filter((_, idx) => !rowInvalid.has(idx));

      if (validRow.length > 0) {
        var response = handleSubmitDataTransaction(validRow);
        if (response.code === 200) {
          handleOpenModalResult(
            "success",
            `Your transaction data has been successfully uploaded. Out of ${docFormik.values.total} rows, ${docFormik.values.succeed} were uploaded without any issues.`
          );
          reRender();
        }
      }
    }
    handleCloseModal();
    closeIsLoading();
  }

  async function handleSubmitDataTransaction(transactions) {
    try {
      onClose();
      await CreateBulkSimulation({
        transactions: transactions,
        campaignId: docFormik.values.campaignId,
        isValidHeader: docFormik.values.isValidHeader,
        fileType: docFormik.values.transactionDocument.name.endsWith(".txt")
          ? "txt"
          : docFormik.values.transactionDocument.name.endsWith(".csv")
          ? "csv"
          : docFormik.values.transactionDocument.name.endsWith(".xlsx")
          ? "xlsx"
          : "csv",
      });
      handleSetCampaignId(docFormik.values.campaignId);
      reRender();
      docFormik.resetForm();
      handleOpenModalResult("success", `Bulk simulation data has been successfully uploaded.`);
    } catch (error) {
      handleOpenModalResult("failed", `Failed to upload bulk simulation data. Please try again.`);
      onOpen();
    }
  }

  async function handleSubmitDownload() {
    try {
      var response = await DownloadSimulationFailed({ id: docFormik.values.requestId });
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
      handleOpenModalResult("failed", `Failed to download bulk simulation data. Please try again.`);
      setTimeout(() => {
        onOpen();
      }, 1500);
    }
  }

  async function handleTemplateDownload(type) {
    try {
      var response = await DownloadTemplate({ campaignId: docFormik.values.campaignId, fileType: type });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `Format_Add_Bulk_Simulations`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
    } catch (error) {
      onClose();
      handleOpenModalResult("failed", `Failed to download bulk simulation data. Please try again.`);
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
      <Modal open={isOpen} onClose={handleCloseModal}>
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl transition-all">
          <div className="flex justify-between py-3 px-6 items-center">
            {docFormik.values.mode === "upload" && (
              <p className="font-semibold text-xl text-black">Add Bulk Simulation</p>
            )}
            {docFormik.values.mode === "loading" && (
              <p className="font-semibold text-xl text-black">Upload Bulk Simulation</p>
            )}
            {docFormik.values.mode === "success" && (
              <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
            )}
            {docFormik.values.mode === "failed" && (
              <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
            )}

            <a className="cursor-pointer" onClick={handleCloseModal}>
              <XIcon size={24} />
            </a>
          </div>
          <div className="border-t border-neutral30 py-3 overflow-y-auto max-h-96">
            <div className="px-6">
              {docFormik.values.mode === "upload" && (
                <>
                  <div className="mb-2">
                    <p className="text-neutral300 mb-4">
                      Please choose an existing campaign, then upload the customer transaction data using the provided
                      template. Make sure all required fields are filled.
                    </p>
                    <div className="mb-4">
                      <DropdownText
                        title="Campaign"
                        placeholder="Choose Campaign"
                        options={campaigns?.map(
                          ({ name, id, startDate, endDate }) =>
                            ({
                              option: `${name} - ${moment(startDate).format("DD MMM YYYY, HH.mm")} - ${moment(
                                endDate
                              ).format("DD MMM YYYY, HH.mm")}`,
                              value: id,
                            } || [])
                        )}
                        isRequired
                        onSelect={(e) => {
                          docFormik.setFieldValue("campaignId", e.value);
                          docFormik.setFieldTouched("campaignId", true, false);
                        }}
                        footer={
                          (docFormik.touched.campaignId || docFormik.submitCount > 0) && docFormik.errors.campaignId
                            ? docFormik.errors.campaignId
                            : null
                        }
                        mode={
                          (docFormik.touched.campaignId || docFormik.submitCount > 0) && docFormik.errors.campaignId
                            ? "danger"
                            : "white"
                        }
                        currentOption={docFormik.values.campaignId}
                      />
                    </div>
                    <table className="w-full">
                      <thead className="bg-white text-sm">
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
                        <tr>
                          <td className="m-0 p-0">
                            <div className="font-semibold p-2 w-48 h-24 pb-8 justify-left flex flex-col border border-neutral40 m-0 text-neutral300">
                              Customer Name
                            </div>
                          </td>
                          <td className="m-0 p-0">
                            <div className="p-2 h-24 justify-left border border-neutral40 m-0 text-neutral300">
                              Enter the full name without commas (,) or periods (.), between 3 and 100 characters.
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="m-0 p-0">
                            <div className="font-semibold p-2 w-48 h-24 justify-left flex-col border border-neutral40 m-0 text-neutral300">
                              Phone Number
                            </div>
                          </td>
                          <td className="m-0 p-0">
                            <div className="p-2 h-24 justify-left border border-neutral40 m-0 text-neutral300">
                              Enter the phone number with country code, between 8 and 15 digits, used for WhatsApp and
                              SMS notifications.
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="m-0 p-0">
                            <div className="font-semibold p-2 w-48 h-24 justify-left flex-col border border-neutral40 m-0 text-neutral300">
                              Email
                            </div>
                          </td>
                          <td className="m-0 p-0">
                            <div className="p-2 h-24 justify-left border border-neutral40 m-0 text-neutral300">
                              Enter a valid email address in the format johndoe@example.com, used for email
                              notifications.
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="m-0 p-0">
                            <div className="font-semibold p-2 w-48 h-24 justify-left flex-col border border-neutral40 m-0 text-neutral300">
                              Transaction Date
                            </div>
                          </td>
                          <td className="m-0 p-0">
                            <div className="p-2 h-24 justify-left border border-neutral40 m-0 text-neutral300">
                              Enter the transaction date in DD-MM-YYYY HH:mm (24-hour format), e.g., 21-08-2025 14:35,
                              used to record and manage transactions.
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-4">
                      <p>
                        <span className="font-bold text-neutral300">Note:</span> Besides the fields shown in the table,
                        the template contains additional header columns used in the campaign.
                      </p>
                    </div>
                  </div>
                  <div className="my-6">
                    <div className="mb-4">
                      <DownloadTemplateButton
                        title="Download Template"
                        data={[
                          {
                            title: "TXT",
                            action: () => handleTemplateDownload("txt"),
                          },
                          {
                            title: "CSV",
                            action: () => handleTemplateDownload("csv"),
                          },
                          {
                            title: "XLSX",
                            action: () => handleTemplateDownload("xlsx"),
                          },
                        ]}
                        disabled={docFormik.values.campaignId ? false : true}
                        isIconVisible
                      />
                    </div>
                    <DropzoneUploadFile
                      title="Upload Document"
                      required={true}
                      subtitle="Format File TXT, CSV, XLSX"
                      onDrop={onDropFiletransactionDocument}
                      selectedFile={docFormik.values.transactionDocument}
                      maxFiles={1}
                      error={docFormik.errors.transactionDocument}
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
                    <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
                    <ProgressBar progress={docFormik.values.progress} nameFile={docFormik.values.nameFile} />
                  </div>
                </>
              )}
              {docFormik.values.mode === "success" && (
                <>
                  <div className="mb-2">
                    <p className="text-sm text-neutral300">All transaction data were successfully uploaded. </p>
                  </div>
                  <div className="my-4 flex w-full items-center">
                    <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
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
                          You are about to submit <span className="font-semibold">{docFormik.values.succeed}</span>{" "}
                          valid entries and download <span className="font-semibold">{docFormik.values.failed}</span>{" "}
                          failed entries. Do you want to continue?
                        </>
                      )}
                    </p>
                  </div>
                  <div className="my-4 flex w-full items-center">
                    <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
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
                                {/* Transaction Name Column */}
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
                                    className={`p-2 h-full flex justify-start ${
                                      id === docFormik.values.failed - 1 ? "rounded-br-md" : ""
                                    }`}
                                  >
                                    {data.errors?.length > 0 ? data.errors.join(", ") : "Unknown error"}
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
                  <PrimaryButton title="Submit" onClick={handleSubmitTransaction} />
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
                    <PrimaryButton title="Submit" onClick={handleSubmitTransaction} />
                  </>
                ))}
            </div>
          )}
        </div>
      </Modal>

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
        rightAction={handleSubmitTransaction}
      />
    </>
  );
};

export default AddBulkSimulationModal;
