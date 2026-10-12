import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "prezent/DataTable";
import { TabBar, PrimaryButton, Alert, DropdownText, OutlineButton } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import {
  DownloadTransactions,
  GetAllTransactions,
  GetLatestTransactionsCampaign,
} from "../../service/CustomerManagement/endpoint";
import AddBulkTransactionModal from "../../components/transactions/AddBulkTransactionModal";
import ProductCell from "../../components/TransactionTable/ProductCell";
import { useFormik } from "formik";
import { useFetch } from "prezent/useFetch";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import { GetAllCampaign } from "../../service/CampaignManagement/endpoint";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import ResultModal from "prezent/ResultModal";

const DashboardTransactions = ({ roleAccess, setTitleHeader, userInfo }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;
  const navigateTo = useNavigate();
  const parentRef = useRef(null);
  const [transactions, setTransactions] = useState();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [reRender, setReRender] = useState(false);
  const [reRenderTimer, setReRenderTimer] = useState(false);
  const [openRows, setOpenRows] = useState({});
  const [currentTab, setCurrentTab] = useState("Transactions");
  const {
    isOpen: addBulkTransactionIsOpen,
    toggle: toggleAddBulkTransaction,
    close: closeAddBulkTransaction,
    open: openAddBulkTransaction,
  } = useDisclosure(false);
  const { isOpen: loadingIsOpen, toggle: toggleIsLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { data: latestCampaign } = useFetch(GetLatestTransactionsCampaign, "campaign", [reRender], {});
  const { data: campaigns } = useFetch(GetAllCampaign, "campaign", [userInfo], { companyId });

  const buildDataOptions = (campaignId, campaigns) => {
    const baseOptions = [
      { id: "Customer Name", label: "Customer Name", type: "string" },
      { id: "Phone Number", label: "Phone Number", type: "string" },
      { id: "Email", label: "Email", type: "string" },
      { id: "Transaction Date", label: "Transaction Date", type: "date" },
    ];

    const endOptions = [{ id: "Point", label: "Point", type: "string" }];

    let options = [];

    if (!campaignId) {
      options = [...baseOptions, ...endOptions];
    } else {
      const campaign = campaigns?.data?.find((c) => c.id === campaignId);
      const pointParameters = campaign?.campaignPointActive?.pointParameters || [];

      // Filter agar "Date Time" tidak ikut masuk
      const filteredParameters = pointParameters.filter((param) => param.settingParameterName !== "Date Time");

      const dynamicOptions = filteredParameters.map((param) => ({
        id: param.settingParameterName,
        label: param.settingParameterName,
        type:
          param.settingParameterType === "option"
            ? "dropdown"
            : param.settingParameterType === "date"
              ? "date"
              : "string",
        options: param.settingParameterType === "option" ? param.options : [],
      }));

      options = [...baseOptions, ...dynamicOptions, ...endOptions];
    }

    // build initialValues sesuai type
    const initialValues = {};
    options.forEach((opt) => {
      if (opt.type === "date") {
        initialValues[opt.id] = { startDate: "", endDate: "" };
      } else if (opt.type === "dropdown") {
        initialValues[opt.id] = "";
      } else {
        initialValues[opt.id] = "";
      }
    });

    return {
      options,
      initialValues,
    };
  };

  const handleToggleRowOpen = (rowId) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowId]: true,
    }));
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startDate: "",
      endDate: "",
      isEndDate: false,
      isIncludeTime: false,
      campaignId: latestCampaign?.data?.id || "",
    },
    validateOnChange: true,
  });

  const buildColumns = (campaignId, campaigns, openRows, handleToggleRowOpen) => {
    const baseColumns = [
      {
        header: "Customer Name",
        assessor: "Customer Name",
        Cell: (row) => (
          <div>
            <p className="text-neutral300 text-sm">{row.value[0]}</p>
          </div>
        ),
      },
      {
        header: "Phone Number",
        assessor: "Phone Number",
        Cell: (row) => (
          <div>
            <p className="text-neutral300 text-sm">{row.value[1]}</p>
          </div>
        ),
      },
      {
        header: "Email",
        assessor: "Email",
        Cell: (row) => (
          <div>
            <p className="text-neutral300 text-sm">{row.value[2]}</p>
          </div>
        ),
      },
      {
        header: "Transaction Date",
        assessor: "Transaction Date",
        Cell: (row) => (
          <div>
            <p className="text-neutral300 text-sm">
              {row.value[3] ? moment(row.value[3]).format("DD MMM YYYY, HH.mm") : "-"}
            </p>
          </div>
        ),
      },
    ];

    const endColumns = [
      {
        header: "Point",
        assessor: "Point",
        Cell: (row) => (
          <div>
            <p
              className={`text-sm ${
                row.value[row.value.length - 2] === -1 ? "italic text-neutral80" : "text-neutral300"
              }`}
            >
              {row.value[row.value.length - 2] !== -1
                ? row.value[row.value.length - 2].toLocaleString("id")
                : "Calculating"}
            </p>
          </div>
        ),
      },
      {
        header: "Upload Date",
        assessor: "Upload Date",
        Cell: (row) => (
          <div>
            <p className="text-neutral300 text-sm">
              {row.value[row.value.length - 1]
                ? moment(row.value[row.value.length - 1]).format("DD MMM YYYY, HH.mm")
                : "-"}
            </p>
          </div>
        ),
      },
    ];

    if (!campaignId) {
      return [...baseColumns, ...endColumns];
    }

    const selectedCampaign = campaigns?.data?.find((c) => c.id === formik.values.campaignId);

    const pointParameters = selectedCampaign?.campaignPointActive?.pointParameters || [];

    let dynamicColumns = [];

    pointParameters.forEach((param, index) => {
      if (param.settingParameterName === "Spend Amount") {
        dynamicColumns.push({
          header: "Amount",
          tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
          Cell: (row) => {
            const rowId = `${row.value[0] + row.value[1] + row.value[2] + row.value[3]}`;
            return (
              <ProductCell
                row={row.value[index + 4]}
                isOpen={openRows[rowId]}
                onOpen={() => handleToggleRowOpen(rowId)}
              />
            );
          },
        });
      } else if (param.settingParameterName === "Store") {
        dynamicColumns.push({
          header: "Store",
          assessor: "Store",
          Cell: (row) => (
            <div>
              <p className="text-black text-sm">{row.value[index + 4].storeName || "-"}</p>
              <p className="text-neutral300 text-sm">{row.value[index + 4].storeCode || "-"}</p>
            </div>
          ),
        });
      } else if (param.settingParameterName === "Total Saving (Rp)") {
        dynamicColumns.push({
          header: "Total Saving (Rp)",
          assessor: "Total Saving (Rp)",
          Cell: (row) => (
            <div>
              <p className="text-black text-sm">
                {row.value[index + 4] ? parseInt(row.value[index + 4]).toLocaleString("id") : "0"}
              </p>
            </div>
          ),
        });
      } else if (param.settingParameterName === "Date Time") {
        // Do Nothing
      } else {
        dynamicColumns.push({
          header: param.settingParameterName,
          assessor: param.settingParameterName,
          Cell: (row) => (
            <div>
              <p className="text-black text-sm">{row.value[index + 4] || "-"}</p>
            </div>
          ),
        });
      }
    });

    return [...baseColumns, ...dynamicColumns, ...endColumns];
  };

  const columns = buildColumns(formik.values.campaignId, campaigns, openRows, handleToggleRowOpen);
  const { options: filterOptions, initialValues } = buildDataOptions(formik.values.campaignId, campaigns);

  const [currentData, setCurrentData] = useState(initialValues);

  const handleDownloadTransactions = async () => {
    try {
      toggleIsLoading();
      const response = await DownloadTransactions({
        filters: currentData,
        campaignId: formik.values.campaignId,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `transaction-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleIsLoading();
      handleOpenModalResult("success", `Transaction data downloaded successfully.`);
    } catch (error) {
      toggleIsLoading();
      handleOpenModalResult("failed", `Failed to download Transaction data. Please try again.`);
    }
  };

  useEffect(() => {
    setTitleHeader("Transactions");
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReRenderTimer((prev) => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    formik.setFieldValue("campaignId", latestCampaign?.data?.id || "");
  }, [reRender]);

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
        <div className="mb-4">
          <Alert
            subtitle={
              <p>
                This menu allows manual uploading of <span className="font-semibold">customer transactions</span> once a{" "}
                <span className="font-semibold">campaign</span> has been created. Uploaded{" "}
                <span className="font-semibold">transactions</span> are matched with the campaign’s defined parameters
                so the system can correctly accumulate customer points.
              </p>
            }
          />
        </div>
        <div className="mt-4 rounded-lg flex items-center justify-between bg-white p-4 shadow-sm mb-4">
          <div className="flex items-center flex-1">
            <p className="flex items-center mr-4 whitespace-nowrap">
              Campaign <span className="text-danger500 mx-2">*</span> :
            </p>
            <div className="w-1/2">
              <DropdownText
                title={null}
                placeholder="Select Campaign"
                options={
                  campaigns?.data
                    ?.filter((item) => item?.campaignPointActive?.pointProcessing === "upload transaction")
                    .map(({ name, id, startDate, endDate }) => ({
                      option: `${name} - ${moment(startDate).format(
                        "DD MMM YYYY, HH.mm",
                      )} - ${moment(endDate).format("DD MMM YYYY, HH.mm")}`,
                      value: id,
                    })) || []
                }
                isRequired
                onSelect={(e) => {
                  formik.setFieldValue("campaignId", e.value);
                }}
                currentOption={formik.values.campaignId}
                mode="white"
                className="w-full"
              />
            </div>
          </div>

          <PrimaryButton onClick={toggleAddBulkTransaction} title="+ Upload" className="ml-4 shrink-0" />
        </div>

        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex items-center gap-2">
              <div>
                <FilterDropdownMixed
                  parentRef={parentRef}
                  filterOptions={filterOptions}
                  currentData={currentData}
                  setCurrentData={setCurrentData}
                />
              </div>

              <CustomDateTimePicker
                parentRef={parentRef}
                placeholder="Select Upload Date"
                value={[
                  formik.values.startDate,
                  formik.values.endDate,
                  formik.values.isEndDate,
                  formik.values.isIncludeTime,
                ]}
                onChange={(startDate, endDate, isEndDate, isIncludeTime) => {
                  formik.setFieldValue(
                    `startDate`,
                    startDate
                      ? moment.utc(startDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD")
                      : null,
                  );
                  formik.setFieldValue(
                    `endDate`,
                    endDate ? moment.utc(endDate).format(isIncludeTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD") : null,
                  );
                  formik.setFieldValue(`isEndDate`, isEndDate);
                  formik.setFieldValue(`isIncludeTime`, isIncludeTime);
                }}
              />

              <OutlineButton
                title={
                  <div className="flex items-center gap-1">
                    <DownloadSimpleIcon />
                    <p>Download</p>
                  </div>
                }
                isActive={transactions?.data?.length || false}
                onClick={handleDownloadTransactions}
              />
            </div>
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={formik.values.campaignId && GetAllTransactions}
              queryName={"transactions"}
              dependencies={[
                currentData,
                formik.values.campaignId,
                formik.values.startDate,
                formik.values.endDate,
                reRenderTimer,
              ]}
              params={{
                filters: currentData,
                campaignId: formik.values.campaignId,
                startDate: formik.values.startDate,
                endDate: formik.values.endDate,
              }}
              searchKeyword={`${JSON.stringify(currentData)}-${formik.values.campaignId}-${formik.values.startDate || ""}-${formik.values.endDate || ""}`}
              options={{ pagination: true }}
              onClickRow={() => {}}
              loadingIndicator={loadingIsOpen}
              getResponse={setTransactions}
            />
          </div>
        </div>

        <AddBulkTransactionModal
          isOpen={addBulkTransactionIsOpen}
          onClose={closeAddBulkTransaction}
          handlePopUpErrorFile={() => {}}
          onOpen={openAddBulkTransaction}
          reRender={() => setReRender(!reRender)}
          campaigns={campaigns || []}
          formik={formik}
        />

        <ResultModal
          subtitle={dataSubtitleModal}
          type={flagResult}
          isOpen={resultModalIsOpen}
          onClose={closeResultModal}
        />
      </div>
    </>
  );
};

export default DashboardTransactions;
