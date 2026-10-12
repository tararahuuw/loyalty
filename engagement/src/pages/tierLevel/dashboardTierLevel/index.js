import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  TabBar,
  OutlineButton,
  PrimaryButton,
  SearchDropdown,
  DropdownText,
  Switch,
  EmptyData,
  Chip,
} from "sprint-asia-custom-component";
import TierLevelCard from "../../../components/tierLevelCard";
import { PiNotePencil } from "react-icons/pi";
import ToolTip from "prezent/ToolTip";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import * as yup from "yup";
import {
  DeleteTierLevel,
  GetAllTierLevel,
  ChangeStatusTierLevel,
  ChangeTierConfiguration,
  GetTierConfig,
} from "../../../service/TieringManagement/endpoint/tieringLevel";
import { Trash } from "@phosphor-icons/react";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const DashboardTierLevel = ({ setTitleHeader }) => {
  const roleAccess = JSON.parse(localStorage.getItem("accessGroupName"));
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const [currentTab, setCurrentTab] = useState("Tier Level");
  const [dataSearch, setDataSearch] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Tier Name",
    value: "name",
  });
  const [reRender, setReRender] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [currentTier, setCurrentTier] = useState(null);
  const {
    isOpen: isOpenModalDeleteTier,
    open: openIsOpenModalDeleteTier,
    close: closeIsOpenModalDeleteTier,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalChangeTier,
    open: openIsOpenModalChangeTier,
    close: closeIsOpenModalChangeTier,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalConfiguration,
    open: openIsOpenModalConfiguration,
    close: closeIsOpenModalConfiguration,
  } = useDisclosure(false);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 3500);
    }, 250);
  };

  function handleNavigateToAddTierLevel() {
    navigateTo(`/prezent/loyalty-setting/engagement/customer/tier-level/add`);
  }

  function handleNavigateToEditTierLevel(id) {
    navigateTo(`/prezent/loyalty-setting/engagement/customer/tier-level/edit/${id}`);
  }

  const dataOptions = [{ option: "Tier Name", value: "name" }];
  const navigateTo = useNavigate();

  const handleEditById = (id) => {
    handleNavigateToEditTierLevel(id);
  };

  function handleDeleteTier(value) {
    setCurrentTier(value);
    openIsOpenModalDeleteTier();
  }
  function handleChangeTier(value) {
    setCurrentTier(value);
    openIsOpenModalChangeTier();
  }

  async function handleDeleteById(id) {
    try {
      closeIsOpenModalDeleteTier();
      toggleLoadingModal();
      await DeleteTierLevel(id);
      toggleLoadingModal();
      handleOpenModalResult(
        "success",
        `Tier level has been successfully deleted. All customers have been moved to the lowest tier.`
      );
      setReRender(!reRender);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Failed to delete the tier level. Please try again");
    }
  }

  async function handleChangeStatusTier(item) {
    try {
      closeIsOpenModalChangeTier();
      toggleLoadingModal();
      await ChangeStatusTierLevel(item.id, { status: !item.status });
      toggleLoadingModal();
      handleOpenModalResult(
        "success",
        `${
          !item.status === true
            ? "Tier level has been successfully activated. Eligible customers can now receive benefits and accumulate points from this tier."
            : "Tier level has been successfully deactivated. All affected customers will no longer receive benefits or accumulate points from this tier."
        }`
      );
      setReRender(!reRender);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        `${
          !item.status === true
            ? "Failed to activate tier level. Please try again."
            : "Failed to deactivate tier level. Please try again."
        }`
      );
    }
  }

  async function handleEditConfiguration() {
    try {
      closeIsOpenModalConfiguration();
      toggleLoadingModal();
      await ChangeTierConfiguration({
        status: formik.values.status,
        evaluationPeriod: formik.values.evaluationPeriod || 0,
      });
      toggleLoadingModal();
      if (formik.values.bucketStatus === false && formik.values.status === true) {
        handleOpenModalResult(
          "success",
          `Tier configuration has been successfully activated. Customer activity will now be reviewed during the evaluation period, and their tier may change based on the results.`
        );
      } else if (formik.values.bucketStatus === true && formik.values.status === false) {
        handleOpenModalResult(
          "success",
          `Tier configuration has been successfully deactivated. All customers will retain their current tier regardless of activity during the evaluation period.`
        );
      } else if (
        formik.values.bucketStatus === true &&
        formik.values.status === true &&
        formik.values.bucketEvaluationPeriod !== formik.values.evaluationPeriod
      ) {
        handleOpenModalResult(
          "success",
          `Tier Configuration has been successfully updated. All affected customers will have their benefits and point accumulation adjusted according to the new evaluation period.`
        );
      } else {
        handleOpenModalResult("success", `Tier configuration has been successfully saved.`);
      }
      setIsEdit(false);
      setReRender(!reRender);
    } catch (error) {
      toggleLoadingModal();
      if (formik.values.bucketStatus === false && formik.values.status === true) {
        handleOpenModalResult("failed", `Failed to activate tier configuration. Please try again.`);
      } else if (formik.values.bucketStatus === true && formik.values.status === false) {
        handleOpenModalResult("failed", `Failed to deactivate tier configuration. Please try again.`);
      } else if (
        formik.values.bucketStatus === true &&
        formik.values.status === true &&
        formik.values.bucketEvaluationPeriod !== formik.values.evaluationPeriod
      ) {
        handleOpenModalResult("failed", `Failed to update tier configuration. Please try again.`);
      } else {
        handleOpenModalResult("failed", `Failed to update tier configuration. Please try again.`);
      }
    }
  }

  const { data: tierLevel } = useFetch(GetAllTierLevel, "tier level", [reRender], {
    dataFilter: dataFilterSearch.value,
    dataSearch: dataSearch,
  });
  const { data: tierConfig } = useFetch(GetTierConfig, "tier config", [reRender]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      status: tierConfig?.data?.status || false,
      bucketStatus: tierConfig?.data?.status || false,
      evaluationPeriod: tierConfig?.data?.evaluationPeriod === 0 ? "" : tierConfig?.data?.evaluationPeriod,
      bucketEvaluationPeriod: tierConfig?.data?.evaluationPeriod === 0 ? "" : tierConfig?.data?.evaluationPeriod,
      tiers: tierLevel?.data || [],
    },
    validationSchema: yup.object().shape({
      evaluationPeriod: yup.string().when("status", {
        is: true,
        then: (schema) => schema.required("Evaluation period is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (values.bucketStatus === values.status && values.bucketEvaluationPeriod === values.evaluationPeriod) {
        setIsEdit(false);
      } else {
        openIsOpenModalConfiguration();
      }
    },
  });

  const allowedRoles = ["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"];

  useEffect(() => {
    setTitleHeader("Tier Level");
  }, []);

  useEffect(() => {
    setIsEdit(false);
  }, [tierLevel]);

  useEffect(() => {
    formik.setFieldValue("status", tierConfig?.data?.status);
    formik.setFieldValue("bucketStatus", tierConfig?.data?.status);
    formik.setFieldValue("evaluationPeriod", tierConfig?.data?.evaluationPeriod);
    formik.setFieldValue("bucketEvaluationPeriod", tierConfig?.data?.evaluationPeriod);
  }, [tierConfig]);

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
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div>
              <SearchDropdown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />
            </div>
            {allowedRoles.includes(roleAccess) && (
              <PrimaryButton title="+ Add Tier Level" onClick={handleNavigateToAddTierLevel} />
            )}
          </div>
        </div>

        {formik.values.tiers.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md grid grid-cols-3 gap-4 mt-4 p-4 items-stretch">
            {formik.values.tiers.map((item, index) => (
              <TierLevelCard
                roleAccess={roleAccess}
                key={index}
                item={item}
                handleEditById={handleEditById}
                handleDeleteTier={handleDeleteTier}
                handleChangeTier={handleChangeTier}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md mt-4 p-4 flex items-center justify-center w-full">
            <EmptyData />
          </div>
        )}
        {formik.values.tiers.length > 0 && (
          <div className="bg-primary50 rounded-lg p-4 mt-4">
            <div className="flex justify-between">
              <div className="flex items-center">
                <p className="font-semibold mr-2">Tier Configuration</p>
                <ToolTip
                  message={
                    <p>
                      Defines the downgrade condition based on
                      <br />
                      customer activity within the evaluation period. If
                      <br />
                      disabled, customers retain the highest tier they
                      <br />
                      have achieved.
                    </p>
                  }
                />
                {isEdit ? (
                  <div className="ml-2 flex items-center">
                    <Switch
                      checked={formik.values.status}
                      onChange={() => formik.setFieldValue("status", !formik.values.status)}
                      isEdit={true}
                    />
                  </div>
                ) : (
                  <div className="ml-2 flex items-center">
                    <Chip
                      title={formik.values.status ? "Active" : "Inactive"}
                      type={formik.values.status ? "success" : "neutral"}
                    />
                  </div>
                )}
              </div>
              {isEdit ? (
                <div className="flex items-center">
                  <OutlineButton
                    mode="danger"
                    title="Cancel"
                    onClick={() => {
                      formik.setFieldValue("status", formik.values.bucketStatus);
                      formik.setFieldValue("evaluationPeriod", formik.values.bucketEvaluationPeriod);
                      setIsEdit(false);
                    }}
                  />
                  <div className="ml-2">
                    <PrimaryButton title="Save" onClick={formik.handleSubmit} />
                  </div>
                </div>
              ) : (
                allowedRoles.includes(roleAccess) && (
                  <OutlineButton
                    title={
                      <div className="flex items-center">
                        <PiNotePencil className="text-primary500" />
                        <p className="ml-2 text-primary500">Edit</p>
                      </div>
                    }
                    onClick={() => setIsEdit(true)}
                  />
                )
              )}
            </div>

            <div className="bg-white border border-primary500 rounded-lg mt-2 w-full p-4">
              {isEdit ? (
                <DropdownText
                  title="Evaluation Period"
                  placeholder="Choose Period"
                  options={[
                    { option: "1 Month", value: 1 },
                    { option: "2 Months", value: 2 },
                    { option: "3 Months", value: 3 },
                    { option: "4 Months", value: 4 },
                    { option: "6 Months", value: 6 },
                    { option: "1 Year", value: 12 },
                  ]}
                  isRequired
                  onSelect={(e) => {
                    formik.setFieldValue("evaluationPeriod", e.value);
                    formik.setFieldTouched("evaluationPeriod", true, false);
                  }}
                  footer={
                    (formik.touched.evaluationPeriod || formik.submitCount > 0) && formik.errors.evaluationPeriod
                      ? formik.errors.evaluationPeriod
                      : "Defines the timeframe used to measure customer activity based on tier level criteria for tier qualification."
                  }
                  mode={
                    (formik.touched.evaluationPeriod || formik.submitCount > 0) && formik.errors.evaluationPeriod
                      ? "danger"
                      : "white"
                  }
                  currentOption={formik.values.evaluationPeriod}
                />
              ) : formik.values.status === false ? (
                <p className="text-md text-neutral300">You haven’t activate this feature.</p>
              ) : (
                <div>
                  <p className="text-black">
                    Evaluation Period <span className="text-danger500">*</span>
                  </p>
                  <p className="my-2 font-semibold text-black">
                    {formik.values.evaluationPeriod === 12 ? "1 Year" : `${formik.values.evaluationPeriod} Month`}
                  </p>
                  <p className="text-neutral300">
                    Customers will be automatically downgraded if they don't meet the tier requirements within the
                    selected evaluation period.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClose={() => {}}
        />
        <StateModal
          title="Delete Tier Level?"
          subtitle={
            <p>
              Are you sure you want to delete this tier level? This action cannot be undone.
              <br />
              <span className="font-semibold">Note: </span>All customers in this tier will be moved to the lower tier.
            </p>
          }
          isOpen={isOpenModalDeleteTier}
          onClose={closeIsOpenModalDeleteTier}
          type="danger"
          titleButtonRight={
            <div className="flex items-center gap-2">
              <Trash />
              <p>Delete</p>
            </div>
          }
          titleButtonLeft="Cancel"
          leftAction={closeIsOpenModalDeleteTier}
          rightAction={() => handleDeleteById(currentTier?.id)}
        />
        <StateModal
          title={`${currentTier?.status ? "Deactivate" : "Activate"} This Tier?`}
          subtitle={
            <p>
              {currentTier?.status
                ? "This action will deactivate the tier and affect all customers currently assigned to it. They will no longer receive any benefits or earn points associated with this tier."
                : "This action will activate the tier and make it available to all eligible customers. They will start receiving benefits and earning points associated with this tier."}
              <br />
              <br />
              Are you sure you want to continue?
            </p>
          }
          isOpen={isOpenModalChangeTier}
          onClose={closeIsOpenModalChangeTier}
          type="danger"
          titleButtonRight={`Yes, ${currentTier?.status ? "Deactivate" : "Activate"}`}
          titleButtonLeft="Cancel"
          leftAction={closeIsOpenModalChangeTier}
          rightAction={() => handleChangeStatusTier(currentTier)}
        />
        <StateModal
          title={
            formik.values.bucketStatus === false && formik.values.status === true ? (
              <p>Activate Tier Configuration?</p>
            ) : formik.values.bucketStatus === true && formik.values.status === false ? (
              <p>Deactivate Tier Configuration?</p>
            ) : (
              <p>Edit Tier Configuration</p>
            )
          }
          subtitle={
            formik.values.bucketStatus === false && formik.values.status === true ? (
              <p>
                This action will activate the tier configuration and apply downgrade evaluation based on customer
                activity within the evaluation period. Customers who do not fulfill the requirements may be moved to a
                lower tier.<br></br>
                <br></br>Are you sure you want to continue?
              </p>
            ) : formik.values.bucketStatus === true && formik.values.status === false ? (
              <p>
                This action will deactivate the tier configuration and stop applying downgrade rules to customers. All
                customers will retain their current tier regardless of activity during the evaluation period.<br></br>
                <br></br>Are you sure you want to continue?
              </p>
            ) : (
              <p>
                This action will change the tier duration from{" "}
                <span className="font-semibold">
                  {formik.values.bucketEvaluationPeriod === 12
                    ? "1 Year"
                    : `${formik.values.bucketEvaluationPeriod} Months`}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {formik.values.evaluationPeriod === 12 ? "1 Year" : `${formik.values.evaluationPeriod} Months`}
                </span>{" "}
                and affect all customers currently assigned to this tier. Their tier evaluation will be recalculated
                based on the new duration.<br></br>
                <br></br>Are you sure you want to continue?
              </p>
            )
          }
          isOpen={isOpenModalConfiguration}
          onClose={closeIsOpenModalConfiguration}
          type={formik.values.bucketStatus === true && formik.values.status === false ? "danger" : "default"}
          titleButtonRight={
            formik.values.bucketStatus === false && formik.values.status === true ? (
              <p>Yes, Activate</p>
            ) : formik.values.bucketStatus === true && formik.values.status === false ? (
              <p>Yes, Deactivate</p>
            ) : (
              <p className="px-4">Yes</p>
            )
          }
          titleButtonLeft="Cancel"
          leftAction={closeIsOpenModalConfiguration}
          rightAction={() => handleEditConfiguration()}
        />
        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
      </div>
    </>
  );
};

export default DashboardTierLevel;
