import React, { useState } from "react";
import { PrimaryButton, OutlineButton } from "sprint-asia-custom-component";
import * as yup from "yup";
import templateFileXLSX from "../../assets/file/Template Recipient.xlsx";
import templateFileCSV from "../../assets/file/Template Recipient.csv";
import templateFileTXT from "../../assets/file/Template Recipient.txt";
import DropzoneUploadFile from "../DropzoneUploadFile";
import ProgressBar from "../ProgressBar";
import * as XLSX from "xlsx";
import ModalButton from "../modalbutton";
import { useFormik } from "formik";
import { FileTextIcon, XIcon } from "@phosphor-icons/react";
import DangerButton from "../CampaignFormPage/DraftModal/DangerButton";
import Modal from "prezent/Modal";

const BulkRecipientModal = ({
  formik,
  isOpen = false,
  onClose = () => {},
  rewards,
  channels,
  handlePopUpErrorFile,
  method,
}) => {
  const [assignedRecipients, setAssignedRecipients] = useState([]);

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
      "text/plain", // txt
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

    if (file.name.endsWith(".txt")) {
      reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split(/\r?\n/).filter((line) => line.trim() !== "");

        // Skip header (first row)
        const filledRows = lines.slice(1).map((line) => line.split(";"));
        const totalFilledRows = filledRows.length;
        state.setFieldValue("totalFilledRows", totalFilledRows);

        const invalidRows = [];
        const tempRecipients = [];

        filledRows.forEach((row, index) => {
          const recipientName = row[0]?.trim();
          const phoneNumber = row[1]?.trim();
          const email = row[2]?.trim();

          const rowErrors = [];

          if (recipientName && /[.,]/.test(recipientName)) {
            rowErrors.push("Recipient name cannot contain periods or commas");
          }

          if (phoneNumber && !String(phoneNumber).startsWith("62")) {
            rowErrors.push("Invalid phone number number format");
          }
          if (phoneNumber && String(phoneNumber).length > 15) {
            rowErrors.push("The phone number too long. Max 15 characters");
          }
          if (phoneNumber && String(phoneNumber).length < 8) {
            rowErrors.push("The phone number is too short please input min. 8 number");
          }

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (email && !emailRegex.test(email)) {
            rowErrors.push("Invalid email format.");
          }

          if (!recipientName) {
            rowErrors.push("Name is required");
          }

          if (!phoneNumber) {
            rowErrors.push("Phone number is required");
          }

          if (!email) {
            rowErrors.push("Email is required");
          }

          if (!phoneNumber && !email) {
            rowErrors.push("Please choose at least one distribution method.");
          }

          if (rowErrors.length > 0) {
            invalidRows.push({
              recipientName,
              phoneNumber,
              email,
              reasonInvalid: rowErrors.join(", "),
              row: index + 1,
            });
          } else {
            tempRecipients.push({
              id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
              recipientName,
              phoneNumber: phoneNumber ? `+${phoneNumber}` : "",
              email: email || "",
              distribution: channels,
              reward: null,
              rewardId: null,
              quantity: method === "random" ? 1 : 0,
            });
          }

          const progress = Math.round(((index + 1) / totalFilledRows) * 100);
          state.setFieldValue("progress", progress);
        });

        setAssignedRecipients(tempRecipients);

        if (invalidRows.length > 0 && tempRecipients.length > 0) {
          state.setFieldValue("invalidRows", invalidRows);
          state.setFieldValue("mode", "partial_success");
        } else if (invalidRows.length === 0 && tempRecipients.length > 0) {
          state.setFieldValue("mode", "success");
        } else if (invalidRows.length > 0 && tempRecipients.length === 0) {
          state.setFieldValue("invalidRows", invalidRows);
          state.setFieldValue("mode", "failed");
        } else {
          state.setFieldValue("mode", "failed");
        }
      };

      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const data = e.target.result;

        try {
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          const invalidRows = [];
          const tempRecipients = [];

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

            const recipientName = row[0];
            const phoneNumber = row[1];
            const email = row[2] ? row[2].replace(/;/g, "").trim() : "";

            const rowErrors = [];

            if (recipientName && /[.,]/.test(recipientName)) {
              rowErrors.push("Recipient name cannot contain periods or commas");
            }

            if (phoneNumber && !String(phoneNumber).startsWith("62")) {
              rowErrors.push("Invalid phone number number format");
            }
            if (phoneNumber && String(phoneNumber).length > 15) {
              rowErrors.push("The phone number too long. Max 15 characters");
            }
            if (phoneNumber && String(phoneNumber).length < 8) {
              rowErrors.push("The phone number is too short please input min. 8 number");
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailRegex.test(email)) {
              rowErrors.push("Invalid email format.");
            }

            if (!recipientName) {
              rowErrors.push("Name is required");
            }

            if (!phoneNumber) {
              rowErrors.push("Phone number is required");
            }

            if (!email) {
              rowErrors.push("Email is required");
            }

            if (!phoneNumber && !email) {
              rowErrors.push("Please choose at least one distribution method.");
            }

            if (rowErrors.length > 0) {
              invalidRows.push({
                recipientName,
                phoneNumber,
                email,
                reasonInvalid: rowErrors.join(", "),
                row: index + 1,
              });
            } else {
              tempRecipients.push({
                id: crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2),
                recipientName,
                phoneNumber: phoneNumber ? `+${phoneNumber}` : "",
                email: email || "",
                distribution: channels,
                reward: null, // reward assigned later
                rewardId: null,
                quantity: method === "random" ? 1 : 0,
              });
            }

            const progress = Math.round(((index + 1) / totalFilledRows) * 100);
            state.setFieldValue("progress", progress);
          });

          // ✅ store recipients without rewards for later assignment
          setAssignedRecipients(tempRecipients);

          if (invalidRows.length > 0 && tempRecipients.length > 0) {
            state.setFieldValue("invalidRows", invalidRows);
            state.setFieldValue("mode", "partial_success");
          } else if (invalidRows.length === 0 && tempRecipients.length > 0) {
            state.setFieldValue("mode", "success");
          } else if (invalidRows.length > 0 && tempRecipients.length === 0) {
            state.setFieldValue("invalidRows", invalidRows);
            state.setFieldValue("mode", "failed");
          } else {
            state.setFieldValue("mode", "failed");
          }
        } catch (error) {
          state.setFieldValue("isLoading", false);
          state.setFieldValue("mode", "failed");
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownloadTemplate = async (format) => {
    let href = "";
    let filename = "";

    if (format === "TXT") {
      const response = await fetch(templateFileTXT);
      const text = await response.text();

      const blob = new Blob([text], { type: "text/plain" });
      href = URL.createObjectURL(blob);
      filename = "Template Recipient.txt";
    } else if (format === "CSV") {
      href = templateFileCSV;
      filename = "Template Recipient.csv";
    } else {
      href = templateFileXLSX;
      filename = "Template Recipient.xlsx";
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

  const handleCloseModal = () => {
    state.resetForm();
    onClose();
    setAssignedRecipients([]);
  };

  const handleDownloadFailedData = () => {
    const failedRecipients = state.values.invalidRows;

    if (!failedRecipients || failedRecipients.length === 0) {
      return;
    }

    if (state.values.recipientDocument?.type === "text/csv") {
      // 1. Build TXT rows
      const rows = ["Recipient Name;Phone Number;Email;Reason for Failure"];

      failedRecipients.forEach((failed) => {
        const reason = `"${failed.reasonInvalid || ""}"`;

        // keep only non-empty fields, always append reason last
        const row = [failed.recipientName || "", failed.phoneNumber || "", failed.email || "", reason]
          .filter((cell) => cell && cell.trim() !== "")
          .join(";");

        rows.push(row);
      });

      // 2. Convert to text
      const txtContent = rows.join("\n");

      // 3. Download as TXT
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
      saveAs(blob, "failed_recipients.txt");
    } else if (state.values.recipientDocument?.type === "text/plain") {
      let txtContent = "Recipient Name;Phone Number;Email;Reason for Failure\n";

      failedRecipients.forEach((failed) => {
        const row = [];

        // Conditionally add phone & email only if present
        if (failed.recipientName) row.push(failed.recipientName);
        if (failed.phoneNumber) row.push(failed.phoneNumber);
        if (failed.email) row.push(failed.email);

        // Always add reason
        const reason = `"${(failed.reasonInvalid || "").replace(/,/g, ";")}"`;

        row.push(reason);

        // Join the row with ;
        txtContent += row.join(";") + "\n";
      });

      // Download as TXT
      const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });
      saveAs(blob, "failed_recipients.txt");
    } else {
      // Excel fallback
      const rows = failedRecipients.map((failed) => ({
        "Recipient Name": failed.recipientName || "",
        "Phone Number": failed.phoneNumber || "",
        Email: failed.email || "",
        "Reason for Failure": failed.reasonInvalid || "",
      }));

      const worksheet = XLSX.utils.json_to_sheet(rows, {
        header: ["Recipient Name", "Phone Number", "Email", "Reason for Failure"],
      });

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Data");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const data = new Blob([excelBuffer], { type: "application/octet-stream" });

      saveAs(data, "failed_recipients.xlsx");
    }
  };

  const handleSubmit = () => {
    const currentRecipients = formik.values.recipients || [];

    if (method === "random") {
      // Work with a local copy of rewards so we can safely mutate quantities
      let rewardsCopy = [...formik.values.rewards];

      const updatedRecipients = assignedRecipients.map((recipient) => {
        // Filter rewards that are available (Non PPOB = ownedQuantity > 0)
        const availableRewards = rewardsCopy.filter((r) => r.ownedQuantity > 0);

        if (availableRewards.length === 0) {
          return null; // no reward left
        }

        // Pick one at random
        const randomIndex = Math.floor(Math.random() * availableRewards.length);
        const chosenReward = availableRewards[randomIndex];

        // Decrement ownedQuantity only if it's Non PPOB
        rewardsCopy = rewardsCopy.map((r) =>
          r.id === chosenReward.id ? { ...r, ownedQuantity: r.ownedQuantity - 1 } : r,
        );

        return {
          ...recipient,
          reward: chosenReward.name,
          rewardId: chosenReward.id,
        };
      });

      // Keep only valid recipients (those that got a reward)
      const validRecipients = updatedRecipients.filter((r) => r !== null);

      // ✅ Update recipients in Formik
      formik.setFieldValue("recipients", [...validRecipients, ...currentRecipients]);

      // ✅ Update rewards in Formik
      formik.setFieldValue("rewards", rewardsCopy);
    } else if (method === "specific") {
      // ✅ Directly update Formik recipients with assignedRecipients
      formik.setFieldValue("recipients", [...assignedRecipients, ...currentRecipients]);
    }

    handleCloseModal();
  };

  const totalRewards = rewards.reduce((sum, reward) => sum + reward.ownedQuantity, 0);
  const rewardDifference = assignedRecipients.length - totalRewards;

  return (
    <Modal open={isOpen} onClose={handleCloseModal}>
      <div
        className="relative bg-white rounded-lg shadow-xl transition-all"
        style={{
          width: 670,
        }}
      >
        <div className="flex justify-between py-3 px-6">
          {state.values.mode === "upload" && <p className="font-semibold text-xl text-black">Add Bulk Recipients</p>}
          {state.values.mode === "loading" && (
            <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
          )}
          {(state.values.mode === "success" ||
            state.values.mode === "failed" ||
            state.values.mode === "partial_success") && (
            <p className="font-semibold text-xl text-black">Upload Validation Summary</p>
          )}
          <p className="cursor-pointer text-xl" onClick={handleCloseModal}>
            <XIcon />
          </p>
        </div>
        <div className="border-t border-neutral30 py-3">
          <div className="px-6">
            {state.values.mode === "upload" && (
              <>
                <div className="mb-2 flex flex-col gap-2">
                  <p className="text-sm text-neutral300">
                    Please upload recipient data using the provided template file. The required information includes:
                  </p>

                  <div className="w-full">
                    <table className="w-full table-fixed border-collapse">
                      <thead>
                        <tr>
                          <th className="w-1/3 border bg-primary50 border-neutral40 rounded-tl-md p-2 text-center">
                            Column Header
                          </th>
                          <th className="w-1/2 border bg-primary50 border-neutral40 rounded-tr-md p-2 text-center">
                            Description
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                          <td className="w-1/3 border font-medium border-neutral40 rounded-bl-md p-2 text-left">
                            Recipient Name
                          </td>
                          <td className="w-1/2 border border-neutral40 p-2 text-left">
                            Enter the full name without commas (,) or periods (.), between 3 and 100 characters.
                          </td>
                        </tr>
                        <tr>
                          <td className="w-1/3 border font-medium border-neutral40 rounded-bl-md p-2 text-left">
                            Phone Number
                          </td>
                          <td className="w-1/2 border border-neutral40 p-2 text-left">
                            Enter the phone number with country code, between 8 and 15 digits, used for WhatsApp and SMS
                            notifications.
                          </td>
                        </tr>
                        <tr>
                          <td className="w-1/3 border font-medium border-neutral40 rounded-bl-md p-2 text-left">
                            Email
                          </td>
                          <td className="w-1/2 border border-neutral40 p-2 text-left">
                            Enter a valid email address in the format johndoe@example.com, used for email notifications
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="my-4">
                  <div className="mb-2">
                    <ModalButton
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
                    title="Recipient Document"
                    required={true}
                    subtitle="Format File TXT, CSV, XLSX"
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
                  <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
                  <ProgressBar progress={state.values.progress} nameFile={state.values.nameFile} />
                </div>
              </>
            )}

            {state.values.mode === "success" && (
              <div className="flex flex-col gap-2">
                <div>
                  {rewardDifference !== 0 ? (
                    <>
                      <p className="text-base font-semibold text-neutral300">
                        {rewardDifference < 0 ? "Extra Rewards Available" : "Data Mismatch"}
                      </p>
                      <div className="text-sm">
                        {rewardDifference < 0 ? (
                          <>
                            <span className="font-semibold">
                              {assignedRecipients.length.toLocaleString("id", "ID")}
                            </span>
                            <span> recipients uploaded, but </span>
                            <span className="font-semibold">{totalRewards.toLocaleString("id", "ID")}</span>
                            <span> rewards available. </span>
                            <span className="font-semibold">
                              {Math.abs(rewardDifference).toLocaleString("id", "ID")}
                            </span>
                            <span> reward will remain unused. Do you want to continue?</span>
                          </>
                        ) : (
                          <>
                            <span className="font-semibold">
                              {assignedRecipients.length.toLocaleString("id", "ID")}
                            </span>
                            <span> recipients uploaded, but </span>
                            <span className="font-semibold">{totalRewards.toLocaleString("id", "ID")}</span>
                            <span> rewards available. Please check your recipient data or rewards.</span>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-neutral300">All recipient data were successfully uploaded.</p>
                  )}
                </div>
                <div className="my-4 flex w-full items-center">
                  <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
                  <ProgressBar type="success" progress={state.values.progress} nameFile={state.values.nameFile} />
                </div>
                <div className="w-full">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="m-0 p-0 w-1/3">
                          <div className="py-2 flex justify-center border rounded-tl-md border-neutral40 m-0">
                            Reward
                          </div>
                        </th>
                        <th className="m-0 p-0 w-1/3">
                          <div className="py-2 flex justify-center border border-t border-b border-neutral40 m-0">
                            {rewardDifference !== 0 ? "Recipient" : "Succeed"}
                          </div>
                        </th>
                        <th className="m-0 p-0 w-1/3">
                          <div className="py-2 flex justify-center border rounded-tr-md border-neutral40 m-0">
                            {rewardDifference !== 0 ? "Difference" : "Failed"}
                          </div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <td className="m-0 p-0 w-1/3">
                          <div className="py-2 flex justify-center border rounded-bl-md border-neutral40 m-0">
                            {state.values.totalFilledRows.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0 w-1/3">
                          <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                            {rewardDifference !== 0
                              ? assignedRecipients.length.toLocaleString("id", "ID")
                              : state.values.totalFilledRows.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0 w-1/3">
                          <div
                            className={`py-2 flex justify-center border rounded-br-md border-neutral40 m-0 ${
                              rewardDifference !== 0 ? "text-danger500" : "text-success500"
                            }`}
                          >
                            {rewardDifference !== 0
                              ? rewardDifference < 0
                                ? rewardDifference.toLocaleString("id", "ID")
                                : rewardDifference > 0
                                  ? -rewardDifference.toLocaleString("id", "ID")
                                  : state.values.totalFilledRows.toLocaleString("id", "ID")
                              : 0}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {state.values.mode === "partial_success" && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-base font-semibold text-neutral300">Some entries are invalid</p>
                  <p className="text-sm">
                    You are about to submit {assignedRecipients.length.toLocaleString("id", "ID")} valid entries and
                    download {state.values.invalidRows.length.toLocaleString("id", "ID")} failed entries. Do you want to
                    continue?
                  </p>
                </div>

                <div className="my-4 flex w-full items-center">
                  <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
                  <ProgressBar
                    type="partial"
                    progress={Math.ceil(
                      (assignedRecipients.length / (assignedRecipients.length + state.values.invalidRows.length)) * 100,
                    )}
                    nameFile={state.values.nameFile}
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
                            {state.values.totalFilledRows.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0">
                          <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                            {assignedRecipients.length.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0">
                          <div className="py-2 flex justify-center border rounded-br-md border-neutral40 m-0 text-danger500">
                            {state.values.invalidRows.length.toLocaleString("id", "ID")}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                      {(state.values.invalidRows || []).map((data, id) => (
                        <tr key={id}>
                          <td className="m-0 p-0 border border-neutral40">
                            <div
                              className={`p-2 h-full flex justify-start ${
                                id === state.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                              }`}
                            >
                              Row {data.row}
                            </div>
                          </td>

                          <td className="m-0 p-0 border border-neutral40">
                            <div
                              className={`p-2 h-full flex justify-start ${
                                id === state.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                              }`}
                            >
                              {data.reasonInvalid || "Unknown error"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {state.values.mode === "failed" && (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-base font-semibold text-neutral300">
                    All entries in your uploaded file are invalid
                  </p>
                  <p className="text-sm">
                    {state.values.invalidRows.length.toLocaleString("id", "ID")} entries could not be submitted. Please
                    review the following errors and upload again.
                  </p>
                </div>
                <div className="my-4 flex w-full items-center">
                  <FileTextIcon className="w-12 h-12 mr-4 text-neutral50" />
                  <ProgressBar type="failed" progress={100} nameFile={state.values.nameFile} />
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
                            {state.values.totalFilledRows.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0">
                          <div className="py-2 flex justify-center border border-neutral40 m-0 text-success500">
                            {assignedRecipients.length.toLocaleString("id", "ID")}
                          </div>
                        </td>
                        <td className="m-0 p-0">
                          <div className="py-2 flex justify-center border rounded-br-md border-neutral40 m-0 text-danger500">
                            {state.values.invalidRows.length.toLocaleString("id", "ID")}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
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
                      {(state.values.invalidRows || []).map((data, id) => (
                        <tr key={id}>
                          <td className="m-0 p-0 border border-neutral40">
                            <div
                              className={`p-2 h-full flex justify-start ${
                                id === state.values.invalidRows.length - 1 ? "rounded-bl-md" : ""
                              }`}
                            >
                              Row {data.row}
                            </div>
                          </td>

                          <td className="m-0 p-0 border border-neutral40">
                            <div
                              className={`p-2 h-full flex justify-start ${
                                id === state.values.invalidRows.length - 1 ? "rounded-br-md" : ""
                              }`}
                            >
                              {data.reasonInvalid || "Unknown error"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {state.values.mode !== "loading" && (
          <div className="border-t border-neutral30 py-3 flex gap-3 justify-end px-6">
            {state.values.mode === "upload" && (
              <>
                <DangerButton variant="outlined" title="Cancel" onClick={handleCloseModal} />

                <PrimaryButton title="Submit" onClick={state.handleSubmit} />
              </>
            )}

            {state.values.mode === "success" && (
              <>
                <DangerButton variant="outlined" title="Cancel" onClick={handleCloseModal} />

                <PrimaryButton title="Submit" onClick={handleSubmit} />
              </>
            )}

            {state.values.mode === "partial_success" && (
              <>
                <DangerButton variant="outlined" title="Cancel" onClick={handleCloseModal} />

                <OutlineButton title="Download Failed Data" onClick={handleDownloadFailedData} />

                <PrimaryButton title="Submit" onClick={handleSubmit} />
              </>
            )}

            {state.values.mode === "failed" && (
              <>
                <DangerButton variant="outlined" title="Close" onClick={handleCloseModal} />

                <OutlineButton title="Download Failed Data" onClick={handleDownloadFailedData} />

                <PrimaryButton title="Submit" onClick={handleSubmit} />
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BulkRecipientModal;
