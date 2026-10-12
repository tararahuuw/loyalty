import React, { Fragment, useRef, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { PrimaryButton, OutlineButton, TextInput, DropdownText, Switch } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "prezent/useDisclosure";
import { PiPlus } from "react-icons/pi";
import TierBenefitComponent from "../TierBenefitComponent";
import EmptyState from "../../assets/Empty_State.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  CreateIconTier,
  CreateTierLevelFormData,
  GetAllIconsTierLevel,
} from "../../service/TieringManagement/endpoint/tieringLevel";
import UploadImageBox from "../UploadImageBox";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const ModalCreateTier = ({ isOpen = false, onClose = () => {}, onOpen, loyaltyId, reRenderPage, totalTierLevel }) => {
  const cancelButtonRef = useRef(null);

  const {
    isOpen: isLoading,
    open: openIsLoading,
    close: closeIsLoading,
    toggle: toggleIsLoading,
  } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const {
    isOpen: confirmationIsOpen,
    open: openConfirmationIsOpen,
    close: closeConfirmationIsOpen,
  } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const initialTasks = [
    { id: "task-1", content: "Learn React" },
    { id: "task-2", content: "Build a project" },
    { id: "task-3", content: "Deploy to Netlify" },
  ];
  const [tasks, setTasks] = useState(initialTasks);
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newTasks = Array.from(tasks);
    const [movedItem] = newTasks.splice(result.source.index, 1);
    newTasks.splice(result.destination.index, 0, movedItem);
    setTasks(newTasks);
  };
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: "",
      icon: "",
      progressionType: "",
      minSpend: "",
      minTransactions: "",
      isActive: true,
      benefits: [],
      tierIcons: [],
    },
    validationSchema: yup.object().shape({
      name: yup
        .string()
        .matches(/^[a-zA-Z0-9. ]+$/, "Tier name must only contain alphanumeric characters, dots, and spaces")
        .min(5, "Tier name must be between 5 and 100 characters long")
        .max(100, "Tier name must be between 5 and 100 characters long")
        .required("Tier name is required"),
      icon: yup.string().required("Icon is required"),
      progressionType: yup.string().required("Tier Progression Criteria is required"),
      minSpend: yup
        .number()
        .typeError("Minimum Spend must be a number")
        .when("progressionType", {
          is: (val) => val === "Spend Only" || val === "Spend OR Frequency" || val === "Spend AND Frequency",
          then: (schema) =>
            schema.min(0, "Minimum Spend must be greater than 0 rupiah").required("Minimum Spend is required"),
          otherwise: (schema) => schema.notRequired(),
        }),

      minTransactions: yup
        .number()
        .typeError("Minimum Transaction must be a number")
        .when("progressionType", {
          is: (val) => val === "Frequency Only" || val === "Spend OR Frequency" || val === "Spend AND Frequency",
          then: (schema) =>
            schema
              .min(0, "Minimum Transaction must be greater than 0 transaction")
              .required("Minimum Transaction is required"),
          otherwise: (schema) => schema.notRequired(),
        }),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      if (values.benefits.length > 0) {
        const benefitsValid = validateBenefits();
        if (benefitsValid) {
          handleSubmitTierLevelOnBoarding(values);
        }
      }
    },
  });

  function handleCloseModal() {
    onClose();
    formik.resetForm();
  }

  const appendFormData = (formData, data, parentKey = "") => {
    if (data === null || data === undefined) return;

    if (typeof data === "object" && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        const value = data[key];
        const newKey = parentKey ? (Array.isArray(data) ? `${parentKey}[${key}]` : `${parentKey}.${key}`) : key;
        appendFormData(formData, value, newKey);
      });
    } else {
      formData.append(parentKey, data);
    }
  };

  const validateBenefits = () => {
    let isValid = true; // ✅ Awalnya true

    const updatedBenefits = formik.values.benefits.map((benefit) => {
      const errors = {
        ...benefit,
        benefitTitleError: "",
        benefitDescriptionError: "",
        benefitTypeError: "",
        benefitValueError: "",
      };

      if (!benefit.benefitTitle?.trim()) {
        errors.benefitTitleError = "Benefit Title is required";
        isValid = false; // ❌ Ada error
      }

      if (!benefit.benefitDescription?.trim()) {
        errors.benefitDescriptionError = "Benefit Description is required";
        isValid = false;
      }

      if (!benefit.benefitType?.trim()) {
        errors.benefitTypeError = "Benefit Type is required";
        isValid = false;
      }

      const allowedEmptyTypes = ["Custom Benefit", "Priority Support"];
      if (!benefit.benefitValue?.toString().trim() && !allowedEmptyTypes.includes(benefit.benefitType)) {
        errors.benefitValueError = "Benefit Value is required";
        isValid = false;
      }

      return errors;
    });

    formik.setFieldValue("benefits", updatedBenefits);
    return isValid;
  };

  async function handleSubmitTierLevelOnBoarding() {
    try {
      toggleIsLoading();
      const formData = new FormData();
      const payload = {
        tiers: [
          {
            name: formik.values.name,
            status: formik.values.isActive ? "Active" : "Inactive",
            level: totalTierLevel + 1,
            progressionType: formik.values.progressionType,
            minSpend: formik.values.minSpend,
            minTransactions: formik.values.minTransactions,
            icon: formik.values.icon,
            benefits: formik.values.benefits.map((value, index) => ({
              type: value.benefitType,
              value:
                value.benefitType === "Priority Support"
                  ? "0"
                  : value.benefitType === "Custom Benefit"
                  ? "0"
                  : value.benefitValue,
              title: value.benefitTitle,
              description: value.benefitDescription,
              level: index + 1,
              unit:
                value.benefitType === "Percentage Discount"
                  ? "%"
                  : value.benefitType === "Points Multiplier"
                  ? "x"
                  : value.benefitType === "Priority Support"
                  ? "0"
                  : value.benefitType === "Cashback Rewards"
                  ? "%"
                  : value.benefitType === "Birthday Bonus"
                  ? "point"
                  : value.benefitType === "Custom Benefit"
                  ? "0"
                  : "0",
            })),
          },
        ],
      };
      appendFormData(formData, payload);
      await CreateTierLevelFormData(loyaltyId, formData);
      toggleIsLoading();
      onClose();
      handleOpenModalResult("success", "Tier has been successfully added.");
      formik.resetForm();
      reRenderPage();
    } catch (error) {
      handleOpenModalResult("failed", `Sorry, unable to added tier at the moment. Please try again`);
      closeIsLoading();
      onOpen();
    }
  }

  async function handleGetAllIcons() {
    try {
      var response = await GetAllIconsTierLevel();
      formik.setFieldValue("tierIcons", response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (isOpen) {
      handleGetAllIcons();
    }
  }, [isOpen]);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1000);
    }, 250);
  };

  function handleAddBenefit() {
    const newBenefit = {
      benefitType: "",
      benefitTypeError: "",
      benefitValue: "",
      benefitValueError: "",
      benefitTitle: "",
      benefitTitleError: "",
      benefitDescription: "",
      benefitDescriptionError: "",
    };

    formik.setFieldValue("benefits", [...formik.values.benefits, newBenefit]);
  }

  const handleDeleteData = (indexToRemove) => {
    const updatedBenefits = formik.values.benefits.filter((_, index) => index !== indexToRemove);
    formik.setFieldValue("benefits", updatedBenefits);
  };

  async function handleUploadImage(file) {
    try {
      const formDataImage = new FormData();
      formDataImage.append("icon", file);
      await CreateIconTier(loyaltyId, formDataImage);
      handleGetAllIcons();
    } catch (e) {
      handleOpenModalResult("failed", `Sorry, unable to icon tier at the moment. Please try again`);
    }
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-y-auto z-10"
          initialFocus={cancelButtonRef}
          onClose={() => {}}
        >
          <div className="min-h-screen flex items-center justify-center px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
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
              <Dialog.Panel className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-3xl">
                <div className="flex justify-between py-3 px-6">
                  <p className="font-semibold text-xl text-black">Create New Tier Level</p>
                  <p className="cursor-pointer text-xl" onClick={handleCloseModal}>
                    ×
                  </p>
                </div>
                <div className="border-t border-b border-neutral30 py-4 px-6">
                  <div className="mb-4">
                    <p className="font-semibold">Basic Information</p>
                    <hr className="text-neutral40 mb-4" />
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
                      mode={
                        (formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"
                      }
                      isRequired
                      value={formik.values.name}
                    />
                    <p className="mt-4 mb-2 text-sm">
                      Tier Icon<span className="text-danger500 ml-1">*</span>
                    </p>
                    <div className="grid grid-cols-10 gap-4">
                      {formik.values.tierIcons.length > 0 &&
                        formik.values.tierIcons.map((value) => (
                          <div
                            className={`${
                              formik.values.icon === value.fileName ? "border-4 border-primary50 rounded-xl" : ""
                            }`}
                          >
                            <div
                              className={`${
                                formik.values.icon === value.fileName
                                  ? "border-2 border-primary500"
                                  : "border border-neutral40"
                              } rounded-lg cursor-pointer w-full h-full`}
                              onClick={() => formik.setFieldValue("icon", value.fileName)}
                            >
                              <img
                                src={`${process.env.REACT_APP_TIER_LEVEL_URL}api/v1/tiers/icons/${value.fileName}`}
                                className="rounded-lg w-full h-full"
                              />
                            </div>
                          </div>
                        ))}
                      <div className="w-full h-full flex">
                        <UploadImageBox UploadImage={handleUploadImage} />
                      </div>
                    </div>
                    <p className="font-semibold mt-4">Tier Requirements</p>
                    <hr className="text-neutral40 mb-4" />
                    <DropdownText
                      title="Tier Progression Criteria"
                      placeholder="Select Tier Progression Criteria"
                      options={[
                        {
                          option: "Spend Only",
                          value: "Spend Only",
                        },
                        {
                          option: "Frequency Only",
                          value: "Frequency Only",
                        },
                        {
                          option: "Spend AND Frequency",
                          value: "Spend AND Frequency",
                        },
                        {
                          option: "Spend OR Frequency",
                          value: "Spend OR Frequency",
                        },
                      ]}
                      isRequired
                      onSelect={(e) => {
                        formik.setFieldValue("progressionType", e.value);
                        formik.setFieldTouched("progressionType", true, false);
                      }}
                      footer={
                        (formik.touched.progressionType || formik.submitCount > 0) && formik.errors.progressionType
                          ? formik.errors.progressionType
                          : formik.values.progressionType === "Spend Only"
                          ? "Customer must reach the minimum spend amount to qualify for this tier."
                          : formik.values.progressionType === "Frequency Only"
                          ? "Customer must complete the minimum number of transactions to qualify for this tier."
                          : formik.values.progressionType === "Spend AND Frequency"
                          ? "Customer must complete the minimCustomer must meet BOTH minimum spend and transaction frequency requirements.um number of transactions to qualify for this tier."
                          : formik.values.progressionType === "Spend OR Frequency"
                          ? "Customer must meet EITHER minimum spend OR transaction frequency requirement."
                          : null
                      }
                      mode={
                        (formik.touched.progressionType || formik.submitCount > 0) && formik.errors.progressionType
                          ? "danger"
                          : "default"
                      }
                      currentOption={formik.values.progressionType}
                    />
                    <div className="flex items-center justify-between mt-4">
                      {formik.values.progressionType !== "Frequency Only" && (
                        <TextInput
                          title="Minimum Spend"
                          placeholder="Input Min. Spend"
                          onChangeInput={(e) => {
                            formik.setFieldValue("minSpend", e.target.value);
                            formik.setFieldTouched("minSpend", true, false);
                          }}
                          minimum={0}
                          footer={
                            (formik.touched.minSpend || formik.submitCount > 0) && formik.errors.minSpend
                              ? formik.errors.minSpend
                              : null
                          }
                          mode={
                            (formik.touched.minSpend || formik.submitCount > 0) && formik.errors.minSpend
                              ? "danger"
                              : "default"
                          }
                          isRequired
                          type="number"
                          value={formik.values.minSpend}
                          leftAdornment={<p className="text-sm">Rp</p>}
                        />
                      )}
                      {formik.values.progressionType !== "Spend Only" && (
                        <div className={`${formik.values.progressionType === "Frequency Only" ? "" : "ml-4"} w-full`}>
                          <TextInput
                            title="Minimum Frequency"
                            placeholder="Input Min. Frequency"
                            onChangeInput={(e) => {
                              formik.setFieldValue("minTransactions", e.target.value);
                              formik.setFieldTouched("minTransactions", true, false);
                            }}
                            minimum={0}
                            footer={
                              (formik.touched.minTransactions || formik.submitCount > 0) &&
                              formik.errors.minTransactions
                                ? formik.errors.minTransactions
                                : null
                            }
                            mode={
                              (formik.touched.minTransactions || formik.submitCount > 0) &&
                              formik.errors.minTransactions
                                ? "danger"
                                : "default"
                            }
                            isRequired
                            type="number"
                            value={formik.values.minTransactions}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between my-4">
                      <p className="font-semibold">Tier Benefits</p>
                      <OutlineButton
                        title={
                          <div className="flex items-center text-primary500">
                            <PiPlus /> Add Benefit
                          </div>
                        }
                        onClick={handleAddBenefit}
                      />
                    </div>
                    <hr className="text-neutral40" />
                    <div className="mt-4">
                      {formik.values.benefits.length === 0 ? (
                        <div className="text-center w-full rounded-lg border-2 border-neutral40 p-4">
                          <div className="w-full flex justify-center">
                            <img src={EmptyState} />
                          </div>
                          <p className="font-semibold">No benefits added yet</p>
                          <p className="text-neutral300">Add benefits to make this tier attractive to customers</p>
                        </div>
                      ) : (
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="taskList">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} className="no-scrollbar">
                                {formik.values.benefits.map((task, index) => (
                                  <Draggable key={task.id} draggableId={task.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <TierBenefitComponent
                                          onDeleteData={() => handleDeleteData(index)}
                                          formik={formik}
                                          currentIndex={index}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      )}
                    </div>
                    <div className="flex items-center mt-4">
                      <Switch
                        isEdit={true}
                        checked={formik.values.isActive}
                        onChange={() => formik.setFieldValue("isActive", !formik.values.isActive)}
                      />
                      <p className="ml-2">Activate Tier</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 sm:flex sm:flex-row-reverse py-4">
                  <div className="sm:ml-2 mb-2 sm:mb-0">
                    <PrimaryButton title={"Create Tier"} type="wrap" onClick={formik.handleSubmit} />
                  </div>
                  <div>
                    <OutlineButton title={"Cancel"} type="full" onClick={handleCloseModal} />
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} onClose={() => {}} />
      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />
    </>
  );
};

export default ModalCreateTier;
