import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "prezent/DataTable";
import { TabBar, PrimaryButton, Alert, DropdownText, OutlineButton } from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { DownloadPoints, GetAllPoints, GetLatestPointCampaign } from "../../service/CustomerManagement/endpoint";
import { useFormik } from "formik";
import { useFetch } from "prezent/useFetch";
import CustomDateTimePicker from "prezent/CustomDateTimePicker";
import { GetAllCampaign } from "../../service/CampaignManagement/endpoint";
import FilterDropdownMixed from "prezent/FilterDropdownMixed";
import AddBulkPointModal from "../../components/points/AddBulkPointModal";
import { DownloadSimpleIcon } from "@phosphor-icons/react";
import ResultModal from "prezent/ResultModal";

const DashboardPoints = ({ roleAccess, setTitleHeader, userInfo }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;
  const navigateTo = useNavigate();
  const parentRef = useRef(null);
  const [points, setPoints] = useState();
  const [reRender, setReRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("Points");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [currentData, setCurrentData] = useState({
    "Customer Name": "",
    "Phone Number": "",
    Email: "",
    Point: "",
  });
  const {
    isOpen: addBulkPointIsOpen,
    toggle: toggleAddBulkPoint,
    close: closeAddBulkPoint,
    open: openAddBulkPoint,
  } = useDisclosure(false);
  const { isOpen: loadingIsOpen, toggle: toggleIsLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { data: latestCampaign } = useFetch(GetLatestPointCampaign, "campaign", [reRender], {});
  const { data: campaigns } = useFetch(GetAllCampaign, "campaign", [userInfo], { companyId });

  const filterOptions = [
    { id: "Customer Name", label: "Name", type: "string" },
    { id: "Phone Number", label: "Phone Number", type: "string" },
    { id: "Email", label: "Email", type: "string" },
    { id: "Point", label: "Point", type: "string" },
  ];

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

  const columns = [
    {
      header: "Customer Name",
      assessor: "Customer Name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.customerName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      assessor: "Phone Number",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.phoneNumber || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "Email",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.email || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Point",
      assessor: "Point",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.point ? row.point.toLocaleString("id") : 0}</p>
          </div>
        );
      },
    },
    {
      header: "Upload Date",
      assessor: "Upload Date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{moment(row.createdAt).format("DD MMM YYYY, HH.mm")}</p>
          </div>
        );
      },
    },
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      startDate: "",
      endDate: "",
      isEndDate: false,
      isIncludeTime: false,
      campaignId: latestCampaign?.data?.id,
    },
    validateOnChange: true,
  });

  const handleDownloadPoints = async () => {
    try {
      toggleIsLoading();
      const response = await DownloadPoints({
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
      link.download = `point-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleIsLoading();
      handleOpenModalResult("success", `Point data downloaded successfully.`);
    } catch (error) {
      toggleIsLoading();
      handleOpenModalResult("failed", `Failed to download Point data. Please try again.`);
    }
  };

  useEffect(() => {
    setTitleHeader("Points");
  }, []);

  useEffect(() => {
    formik.setFieldValue("campaignId", latestCampaign?.data?.id);
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
                This menu allows manual uploading of <span className="font-semibold">customer points</span> without API
                integration. Customer data can be uploaded to ensure points are recorded and managed
                <br />
                accurately within the platform.
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
                    ?.filter((item) => item?.campaignPointActive?.pointProcessing === "upload point")
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

          <PrimaryButton onClick={toggleAddBulkPoint} title="+ Upload" className="ml-4 shrink-0" />
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
                isActive={points?.data?.length || false}
                onClick={handleDownloadPoints}
              />
            </div>
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={formik.values.campaignId && GetAllPoints}
              queryName={"points"}
              dependencies={[currentData, formik.values.campaignId, formik.values.startDate, formik.values.endDate]}
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
              getResponse={setPoints}
            />
          </div>
        </div>

        <AddBulkPointModal
          isOpen={addBulkPointIsOpen}
          onClose={closeAddBulkPoint}
          handlePopUpErrorFile={() => {}}
          onOpen={openAddBulkPoint}
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

export default DashboardPoints;
