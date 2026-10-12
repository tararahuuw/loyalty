import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { TabBar, TextInput, Footer, PrimaryButton } from "sprint-asia-custom-component";
import {
  EditTieringLevel,
  GetAllCriteria,
  GetAllIconsTierLevel,
  GetDetailTierLevel,
} from "../../../service/TieringManagement/endpoint/tieringLevel";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import DropdownTextWithButton from "../../../components/DropdownWithButton";
import ModalChooseIcon from "../../../components/ModalChooseIcon";
import ModalAddCriteria from "../../../components/ModalAddCriteria";
import TierBenefitComponent from "../../../components/TierBenefitComponent";
import { TrashIcon } from "@phosphor-icons/react";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const EditTierLevel = ({ setTitleHeader }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [currentTab, setCurrentTab] = useState("Tier Level");
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: isOpenIcons, toggle: toggleIsOpenIcon } = useDisclosure(false);
  const {
    isOpen: addCriteria,
    toggle: toggleAddCriteria,
    open: openAddCriteria,
    close: closeAddCriteria,
  } = useDisclosure(false);
  const { isOpen: deleteBenefit, open: openDeleteBenefit, close: closeDeleteBenefit } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [reRender, setReRender] = useState(false);
  const [currentIndexBenefit, setCurrentIndexBenefit] = useState(null);
  const { data: criterias } = useFetch(GetAllCriteria, "criteria", [reRender]);
  const { data: tierLevel } = useFetch(id && GetDetailTierLevel, "criteria", [], id);
  const { data: images } = useFetch(GetAllIconsTierLevel, "icons", [reRender]);

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

  const submitEditTierLevel = async (form) => {
    try {
      toggleLoadingModal();
      var bodyReq = {
        id: id,
        tierName: form.name,
        criteriaId: form.criteria,
        criteriaName: form.criteriaName,
        valueFirst: form.valueFirst || 0,
        valueSecond: form.valueType === "multiple" ? form.valueSecond : null,
        icons: form.icons,
        benefit: form.benefit,
      };
      await EditTieringLevel(bodyReq);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Tier level has been successfully updated.");
        setTimeout(() => {
          navigateTo("/prezent/loyalty-setting/engagement/customer/tier-level");
        }, 4000);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Failed to update tier level. Please try again.");
    }
  };

  const handleDeleteData = (indexToRemove) => {
    const updatedBenefits = formik.values.benefit.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue("benefit", updatedBenefits);
    closeDeleteBenefit();
    handleOpenModalResult("success", "Benefit has been successfully deleted from the tier.");
  };

  function handleNavigateToDashboard() {
    navigateTo("/prezent/loyalty-setting/engagement/customer/tier-level");
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: tierLevel?.data.tierName || "",
      criteria: tierLevel?.data.criteriaId || "",
      criteriaName: tierLevel?.data.criteriaName || "",
      valueType: tierLevel?.data.valueType || "",
      icons: tierLevel?.data.icons ||
        images?.data[0] || {
          icons: "",
          id: "",
        },
      valueFirst: tierLevel?.data.valueFirst || "",
      valueSecond: tierLevel?.data.valueSecond || "",
      benefit: tierLevel?.data.benefit || [],
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Tier Name is required"),
      criteria: yup.string().required("Criteria is required"),
      icons: yup
        .object()
        .required("Icons is required")
        .test("not-empty", "Icons is required", (value) => value && Object.keys(value).length > 0),
      valueFirst: yup
        .number()
        .transform((value, originalValue) => {
          return originalValue === "" || isNaN(originalValue) ? null : value;
        })
        .when("criteriaName", (criteriaName, schema) => {
          if (criteriaName[0] === "Amount AND Frequency" || criteriaName[0] === "Amount OR Frequency") {
            return schema.required("Amount is required");
          }
          return schema.required(`${criteriaName} is required`);
        }),

      valueSecond: yup
        .number()
        .transform((value, originalValue) => {
          return originalValue === "" || isNaN(originalValue) ? null : value;
        })
        .when("valueType", {
          is: (value) => value === "multiple",
          then: (schema) => schema.required("Frequency is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
      benefit: yup
        .array()
        .of(
          yup.object({
            benefitTitle: yup.string().required("Benefit Title is required"),
            benefitDescription: yup
              .string()
              .required("Benefit Description is required")
              .max(200, "Benefit Description maximum 200 characters"),
            benefitType: yup.string().required("Benefit Type is required"),
            benefitValue: yup
              .number()
              .transform((value, originalValue) => {
                return originalValue === "" || isNaN(originalValue) ? null : value;
              })
              .required("Benefit Value is required"),
          })
        )
        .optional(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      submitEditTierLevel(values);
    },
  });

  useEffect(() => {
    setTitleHeader("Tier Level");
  }, []);
  return (
    <>
      <div className="sticky top-0 z-10">
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
      <div>
        <div className="bg-neutral20 pt-8 px-8 pb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-black text-lg font-semibold">Edit Tier Setup</p>
            <hr className="text-neutral40 mt-2 mb-4" />
            <div className="flex w-full">
              <div className="w-64 mr-4">
                <div className="border-t-2 border-l-2 border-r-2 border-neutral40 w-full h-48 flex items-center justify-center rounded-t-lg p-2">
                  <img src={formik.values.icons.icons} className="h-36 m-1 w-auto object-cover" />
                </div>
                <div
                  className="border-2 border-neutral40 bg-primary50 text-primary500 text-center cursor-pointer rounded-b-lg"
                  onClick={toggleIsOpenIcon}
                >
                  <p className="text-lg p-2">Change Icon</p>
                </div>
              </div>
              <div className="w-full">
                <div className="w-full flex items-center">
                  <div className="w-1/2 mr-4">
                    <TextInput
                      title="Tier Name"
                      placeholder="Input Tier Name"
                      onChangeInput={(e) => {
                        formik.setFieldValue("name", e.target.value);
                        formik.setFieldTouched("name", true, false);
                      }}
                      footer={
                        (formik.touched.name || formik.submitCount > 0) && formik.errors.name
                          ? formik.errors.name
                          : null
                      }
                      mode={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "white"}
                      isRequired
                      value={formik.values.name}
                    />
                  </div>
                  <div className="w-1/2">
                    <DropdownTextWithButton
                      title="Criteria"
                      placeholder="Select Criteria"
                      options={
                        criterias
                          ? criterias?.data?.map(({ id, criteriaName, valueType }) => ({
                              option: criteriaName,
                              value: id,
                              valueType: valueType,
                            }))
                          : []
                      }
                      onSelect={(e) => {
                        formik.setValues({
                          ...formik.values,
                          criteria: e.data.value,
                          criteriaName: e.data.option,
                          valueType: e.data.valueType,
                        });
                        formik.setFieldTouched("criteria", true, false);
                      }}
                      footer={
                        (formik.touched.criteria || formik.submitCount > 0) && formik.errors.criteria
                          ? formik.errors.criteria
                          : null
                      }
                      mode={
                        (formik.touched.criteria || formik.submitCount > 0) && formik.errors.criteria
                          ? "danger"
                          : "white"
                      }
                      currentOption={formik.values.criteria}
                      titleButton="Add New Criteria"
                      handleClickButton={toggleAddCriteria}
                    />
                  </div>
                </div>
                {formik.values.criteria ? (
                  <div className="w-full flex items-center mt-4">
                    {formik.values.valueType !== "single" ? (
                      <>
                        <div className="w-1/2">
                          <TextInput
                            title="Amount"
                            placeholder="Input Amount"
                            onChangeInput={(e) => {
                              formik.setFieldValue("valueFirst", parseInt(e.target.value, 10));
                              formik.setFieldTouched("valueFirst", true, false);
                            }}
                            type="number"
                            minimum={0}
                            footer={
                              (formik.touched.valueFirst || formik.submitCount > 0) && formik.errors.valueFirst
                                ? formik.errors.valueFirst
                                : "Customer must reach the required value for purchase amount as part of the qualification."
                            }
                            mode={
                              (formik.touched.valueFirst || formik.submitCount > 0) && formik.errors.valueFirst
                                ? "danger"
                                : "white"
                            }
                            isRequired
                            leftAdornment="Rp"
                            value={formik.values.valueFirst}
                          />
                        </div>
                        <div className="w-1/2 ml-4">
                          <TextInput
                            title="Transaction Frequency"
                            placeholder="Input Transaction Frequency"
                            onChangeInput={(e) => {
                              formik.setFieldValue("valueSecond", parseInt(e.target.value, 10));
                              formik.setFieldTouched("valueSecond", true, false);
                            }}
                            minimum={0}
                            type="number"
                            footer={
                              (formik.touched.valueSecond || formik.submitCount > 0) && formik.errors.valueSecond
                                ? formik.errors.valueSecond
                                : "Customer must also reach the required value for transaction frequency as part of the qualification"
                            }
                            mode={
                              (formik.touched.valueSecond || formik.submitCount > 0) && formik.errors.valueSecond
                                ? "danger"
                                : "white"
                            }
                            isRequired
                            value={formik.values.valueSecond}
                          />
                        </div>
                      </>
                    ) : (
                      <div className="w-full">
                        <TextInput
                          title={formik.values.criteriaName}
                          placeholder={`Input ${formik.values.criteriaName}`}
                          onChangeInput={(e) => {
                            formik.setFieldValue("valueFirst", parseInt(e.target.value, 10));
                            formik.setFieldTouched("valueFirst", true, false);
                          }}
                          type="number"
                          minimum={0}
                          footer={
                            (formik.touched.valueFirst || formik.submitCount > 0) && formik.errors.valueFirst
                              ? formik.errors.valueFirst
                              : {
                                  Amount: "Customer qualifies if the purchase amount reaches the required value.",
                                  Deposit: "Customer qualifies if the deposit amount reaches the required value.",
                                  "Distance (M)":
                                    "Customer qualifies if the covered distance in meters reaches the required value.",
                                  "Distance (KM)":
                                    "Customer qualifies if the covered distance in kilometers reaches the required value.",
                                  "Transaction Frequency":
                                    "Customer qualifies if the transaction frequency reaches the required value.",
                                  "Total Referrals":
                                    "Customer qualifies if the number of referrals reaches the required value.",
                                  "Total Saving":
                                    "Customer qualifies if the total saving amount reaches the required value.",
                                }[formik.values.criteriaName] || null
                          }
                          mode={
                            (formik.touched.valueFirst || formik.submitCount > 0) && formik.errors.valueFirst
                              ? "danger"
                              : "white"
                          }
                          leftAdornment={
                            formik.values.criteriaName === "Amount" ||
                            formik.values.criteriaName === "Deposit" ||
                            formik.values.criteriaName === "Total Saving"
                              ? "Rp"
                              : null
                          }
                          isRequired
                          value={formik.values.valueFirst}
                        />
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="w-full mt-8">
              {formik.values.benefit.length < 3 && (
                <div className="flex w-full items-center justify-between">
                  <p className="font-semibold text-black text-lg">Benefit</p>
                  <PrimaryButton
                    title="+ Add Benefit"
                    onClick={() => {
                      formik.setFieldValue("benefit", [
                        ...formik.values.benefit,
                        {
                          id: "",
                          benefitTitle: "",
                          benefitDescription: "",
                          benefitType: "",
                          benefitValue: "",
                        },
                      ]);
                    }}
                  />
                </div>
              )}
              <hr className="text-neutral40 my-2 w-full" />
              {formik.values.benefit.map((benefit, index) => (
                <TierBenefitComponent
                  key={index}
                  formik={formik}
                  currentIndex={index}
                  onDeleteData={() => {
                    openDeleteBenefit();
                    setCurrentIndexBenefit(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClose={() => {}}
        />

        <StateModal
          title={`Delete Benefit?`}
          subtitle={<p>Are you sure you want to delete this benefit from the tier? This action cannot be undone.</p>}
          isOpen={deleteBenefit}
          onClose={closeDeleteBenefit}
          type="danger"
          titleButtonRight={
            <div className="flex items-center gap-1">
              <TrashIcon />
              <p>Delete</p>
            </div>
          }
          leftAction={closeDeleteBenefit}
          rightAction={() => handleDeleteData(currentIndexBenefit)}
        />

        <ModalChooseIcon
          isOpen={isOpenIcons}
          onClose={toggleIsOpenIcon}
          handleSubmitModal={(selectedIcon) => formik.setFieldValue("icons", selectedIcon)}
          currentImage={formik.values.icons}
          images={images}
          setReRender={() => setReRender(!reRender)}
        />

        <ModalAddCriteria
          isOpen={addCriteria}
          onClose={closeAddCriteria}
          onOpen={openAddCriteria}
          setReRender={() => setReRender(!reRender)}
        />

        <Footer
          titleLeftButton="Cancel"
          titleRightButton="Submit"
          modeLeftButton="outline"
          modeRightButton="primary"
          isActiveLeftButton={true}
          isActiveRightButton={true}
          isActive={true}
          onClickLeftButton={handleNavigateToDashboard}
          onClickRightButton={formik.handleSubmit}
        />

        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />
      </div>
    </>
  );
};

export default EditTierLevel;
