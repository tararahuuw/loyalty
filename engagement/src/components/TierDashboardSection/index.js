import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { PrimaryButton, OutlineButton, TextInput, DropdownText, Switch } from "sprint-asia-custom-component";
import moment from "moment";
import { useDisclosure } from "prezent/useDisclosure";
import EmptyState from "../../assets/Empty_State.png";
import {
  PiCertificateFill,
  PiCakeFill,
  PiHandCoinsFill,
  PiStarFill,
  PiCrownSimple,
  PiMedal,
  PiArrowUpRight,
  PiUsers,
  PiGift,
  PiShield,
  PiPlus,
  PiInfo,
  PiWarning,
  PiWarningFill,
  PiDotsSix,
  PiNotePencil,
  PiTrash,
  PiTrendDown,
  PiDotsSixVertical,
  PiCheck,
  PiX,
  PiXFill,
  PiPercentFill,
  PiLockSimple,
  PiGif,
} from "react-icons/pi";
import TierLevelComponent from "../TierLevelComponent";
import ModalInformationTier from "../ModalInformationTier";
import ModalCreateTier from "../ModalCreateTier";
import { useFetch } from "prezent/useFetch";
import {
  CreateIconTier,
  CreateTierLevelFormData,
  DeleteTierLevel,
  GetAllIconsTierLevel,
  UpdateTierLevelFormData,
} from "../../service/TieringManagement/endpoint/tieringLevel";
import TierBenefitComponent from "../TierBenefitComponent";
import UploadImageBox from "../UploadImageBox";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const TierDashboardSection = ({ roleAccess, setTitleHeader, loyaltyId, tierData, reRenderPage }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const {
    isOpen: isOpenModalInformationTier,
    open: openIsOpenModalInformationTier,
    close: closeIsOpenModalInformationTier,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalAddTier,
    open: openIsOpenModalAddTier,
    close: closeIsOpenModalAddTier,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalDeleteTier,
    open: openIsOpenModalDeleteTier,
    close: closeIsOpenModalDeleteTier,
  } = useDisclosure(false);
  const [currentTier, setCurrentTier] = useState(null);
  const [flagResult, setFlagResult] = useState("success");

  async function UpdateTierLevel(values) {
    try {
      toggleLoadingModal();
      const formData = new FormData();
      const payload = {
        tiers: [
          {
            name: values.name,
            status: values.status ? "Active" : "Inactive",
            level: values.level,
            progressionType: values.progressionType,
            minSpend: values.minSpend,
            minTransactions: values.minTransactions,
            icon: values.icon,
            position: values.position,
            benefits: values.benefits.map((value, index) => ({
              type: value.benefitType,
              value:
                value.benefitType === "Priority Support"
                  ? "0"
                  : value.benefitType === "Custom Benefit"
                  ? "0"
                  : value.benefitValue,
              title: value.benefitTitle,
              description: value.benefitDescription,
              level: index,
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
      await UpdateTierLevelFormData(loyaltyId, values.id, formData);
      toggleLoadingModal();
      handleOpenModalResult("success", "Tier has been successfully edited.");
      reRenderPage();
    } catch (err) {
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to edited tier at the moment. Please refresh the page and try again"
      );
    }
  }

  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);

  function validateTierOrder(tiers) {
    const errors = [];

    for (let i = 1; i < tiers.length; i++) {
      const current = tiers[i];
      const previous = tiers[i - 1];

      // Cek minSpend
      if (current.minSpend <= previous.minSpend) {
        errors.push({
          id: current.id,
          name: current.name,
          minSpend: current.minSpend,
          suggestSpend: previous.minSpend + 500000,
          errorComparedTo: previous.id,
          type: "minSpend",
          titleMessageName: current.name,
          titleMessageError: `Minimum spend (${current.minSpend}) should be higher than ${previous.name} (${previous.minSpend})`,
          titleMessageAdvice: `Adjust minimum spend to at least (${previous.minSpend + 500000})`,
        });
      }

      // Cek minTransactions
      if (current.minTransactions <= previous.minTransactions) {
        errors.push({
          id: current.id,
          name: current.name,
          minTransactions: current.minTransactions,
          suggestTransaction: previous.minTransactions + 5,
          errorComparedTo: previous.id,
          type: "minTransactions",
          titleMessageName: current.name,
          titleMessageError: `Minimum frequency (${current.minTransactions}) should be higher than ${previous.name} (${previous.minTransactions})`,
          titleMessageAdvice: `Adjust minimum frequency to at least (${previous.minTransactions + 5})`,
        });
      }
    }

    return errors;
  }

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1500);
    }, 250);
  }

  function handleDeleteTier(value) {
    openIsOpenModalDeleteTier();
    setCurrentTier(value);
  }

  function handleEditTier(values) {
    const updatedTiers = formik.values.tiers.map((tier) => ({
      ...tier,
      isEdited: tier.id === values.id,
    }));
    formik.setFieldValue("tiers", updatedTiers);
    formikEditing.setFieldValue("id", values.id);
    formikEditing.setFieldValue("name", values.name);
    formikEditing.setFieldValue("level", values.position);
    formikEditing.setFieldValue("icon", values.icon);
    formikEditing.setFieldValue("progressionType", values.progressionType);
    formikEditing.setFieldValue("minSpend", values.minSpend);
    formikEditing.setFieldValue("minTransactions", values.minTransactions);
    const updatedBenefits = values.benefits.map((benefit) => ({
      ...benefit,
      benefitType: benefit.type,
      benefitTypeError: "",
      benefitValue: benefit.value,
      benefitValueError: "",
      benefitTitle: benefit.title,
      benefitTitleError: "",
      benefitDescription: benefit.description,
      benefitDescriptionError: "",
    }));
    formikEditing.setFieldValue("benefits", updatedBenefits);
    formikEditing.setFieldValue("status", values.status === "Active");
  }

  function handleCancelEdit() {
    const updatedTiers = formik.values.tiers.map((tier) => ({
      ...tier,
      isEdited: false,
    }));
    formik.setFieldValue("tiers", updatedTiers);
  }

  function handleUpdateEdit() {
    if (formikEditing.values.benefits.length > 0) {
      const benefitsValid = validateBenefits();
      if (benefitsValid) {
        handleSubmitTierLevelOnBoarding();
      }
    }
  }

  async function handleDeleteTierLevel() {
    try {
      toggleLoadingModal();
      await DeleteTierLevel(currentTier.id, loyaltyId);
      toggleLoadingModal();
      closeIsOpenModalDeleteTier();
      handleOpenModalResult("success", "Tier level has been successfully deleted");
      reRenderPage();
    } catch (error) {
      toggleLoadingModal();
      closeIsOpenModalDeleteTier();
      if (error?.response?.data?.rc === 409) {
        handleOpenModalResult("failed", "Cannot delete tier that is currently used in active campaigns.");
      } else if (error?.response?.data?.rc === 2) {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to delete tier at the moment. Please refresh the page and try again"
        );
      }
    }
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

  function handleSubmitTierLevelOnBoarding() {
    UpdateTierLevel(formikEditing.values);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      totalTiers: tierData?.totalTier || 0,
      activeTiers: tierData?.totalActiveTier || 0,
      totalCustomers: tierData?.totalCustomer || 0,
      totalBenefits: tierData?.totalBenefit || 0,
      tierDefault: tierData?.tierDefault || true,
      tierIcons: [],
      tiers: (tierData?.tiers || []).map((tier) => ({
        ...tier,
        isEdited: false,
      })),
      tiersStatic: (tierData?.tiers || []).map((tier) => ({
        ...tier,
        isEdited: false,
      })),
      tierErrors: tierData?.tierErrors || [],
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  const formikEditing = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: "",
      name: "",
      icon: "",
      level: 1,
      progressionType: "",
      minSpend: "",
      minTransactions: "",
      benefits: [],
      tierIcons: [],
      status: false,
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
  });

  const validateBenefits = () => {
    let isValid = true; // ✅ Awalnya true

    const updatedBenefits = formikEditing.values.benefits.map((benefit) => {
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

    formikEditing.setFieldValue("benefits", updatedBenefits);
    return isValid;
  };

  const handleDeleteData = (indexToRemove) => {
    const updatedBenefits = formikEditing.values.benefits.filter((_, index) => index !== indexToRemove);
    formikEditing.setFieldValue("benefits", updatedBenefits);
  };

  function handleApplyChanges() {
    const updatedTiers = formik.values.tiers.map((tier) => {
      // Cari semua error untuk tier ini
      const relatedErrors = formik.values.tierErrors.filter((err) => err.id === tier.id);

      let updatedTier = { ...tier };

      relatedErrors.forEach((error) => {
        if (error.type === "minSpend") {
          updatedTier.minSpend = error.suggestSpend;
        } else if (error.type === "minTransactions") {
          updatedTier.minTransactions = error.suggestTransaction;
        }
      });

      return updatedTier;
    });

    formik.setFieldValue("tiers", updatedTiers);
    formik.setFieldValue("tierErrors", []);
  }

  async function handleAutoFix(value) {
    const currentId = value.id;

    // 1. Hitung apakah masih ada error lain dengan id yang sama (selain error yang sedang difix)
    const remainingErrors = formik.values.tierErrors.filter((err) => err.id === currentId && err.type !== value.type);

    // 2. Update local tier value
    const updatedTiers = formik.values.tiers.map((tier) => {
      if (tier.id !== currentId) return tier;

      const updatedTier = { ...tier };

      if (value.type === "minSpend") {
        updatedTier.minSpend = value.suggestSpend;
      } else if (value.type === "minTransactions") {
        updatedTier.minTransactions = value.suggestTransaction;
      }

      return updatedTier;
    });

    // 3. Hapus error yang sudah difix dari tierErrors
    const updatedErrors = formik.values.tierErrors.filter((err) => !(err.id === currentId && err.type === value.type));

    // 4. Set formik fields
    formik.setFieldValue("tiers", updatedTiers);
    formik.setFieldValue("tierErrors", updatedErrors);

    // 5. Jika TIDAK ADA error lain untuk ID ini, maka panggil backend
    if (remainingErrors.length === 0) {
      // Ambil data tier yang udah diupdate
      const fixedTier = updatedTiers.find((tier) => tier.id === currentId);

      try {
        const formData = new FormData();
        const payload = {
          tiers: [
            {
              name: fixedTier.name,
              status: fixedTier.status ? "Active" : "Inactive",
              level: fixedTier.level,
              progressionType: fixedTier.progressionType,
              minSpend: fixedTier.minSpend,
              minTransactions: fixedTier.minTransactions,
              icon: fixedTier.icon,
              position: fixedTier.position,
              benefits: fixedTier.benefits.map((value, index) => ({
                type: value.type,
                value: value.type === "Priority Support" ? "0" : value.type === "Custom Benefit" ? "0" : value.value,
                title: value.title,
                description: value.description,
                level: index,
                unit:
                  value.type === "Percentage Discount"
                    ? "%"
                    : value.type === "Points Multiplier"
                    ? "x"
                    : value.type === "Priority Support"
                    ? "0"
                    : value.type === "Cashback Rewards"
                    ? "%"
                    : value.type === "Birthday Bonus"
                    ? "point"
                    : value.type === "Custom Benefit"
                    ? "0"
                    : "0",
              })),
            },
          ],
        };
        appendFormData(formData, payload);
        await UpdateTierLevelFormData(loyaltyId, currentId, formData);
        reRenderPage();
      } catch (error) {
        console.error("❌ Failed to update tier to backend", error);
      }
    }
  }

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

    formikEditing.setFieldValue("benefits", [...formikEditing.values.benefits, newBenefit]);
  }

  async function handleGetAllIcons() {
    try {
      var response = await GetAllIconsTierLevel();
      formikEditing.setFieldValue("tierIcons", response.data);
    } catch (err) {
      console.log(err);
    }
  }

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

  useEffect(() => {
    reRenderPage();
    handleGetAllIcons();
  }, []);

  useEffect(() => {
    validateTierOrder(formik.values.tiers);
  }, [formik.values.tiers]);

  return (
    <>
      <div className="w-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-lg py-5 px-6 border-2 border-neutral40 mt-3 flex">
              <PiMedal size={24} className="text-primary500 mr-2" />
              <div>
                <p className="text-neutral100">Total Tiers</p>
                <p className="font-semibold text-lg">{formik.values.totalTiers}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg py-5 px-6 border-2 border-neutral40 mt-3 flex">
              <PiArrowUpRight size={24} className="text-secondary600 mr-2" />
              <div>
                <p className="text-neutral100">Active Tiers</p>
                <p className="font-semibold text-lg">{formik.values.activeTiers}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg py-5 px-6 border-2 border-neutral40 mt-3 flex">
              <PiUsers size={24} className="text-info400 mr-2" />
              <div>
                <p className="text-neutral100">Total Customers</p>
                <p className="font-semibold text-lg">{formik.values.totalCustomers}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg py-5 px-6 border-2 border-neutral40 mt-3 flex">
              <PiGift size={24} className="text-warning600 mr-2" />
              <div>
                <p className="text-neutral100">Total Benefits</p>
                <p className="font-semibold text-lg">{formik.values.totalBenefits}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="bg-success50 rounded-lg py-5 px-6 mt-3 flex">
              <PiShield size={36} className="text-success500 mr-2" />
              <div>
                <p className="font-semibold text-lg">Default Tier Active</p>
                <p className="text-neutral100">
                  Bronze serves as the fallback tier for all customers. It cannot be deleted or have non-zero minimum
                  requirements.
                </p>
              </div>
            </div>
            <div className="bg-primary50 rounded-lg py-5 px-6 mt-3 flex">
              <PiUsers size={36} className="text-primary500 mr-2" />
              <div>
                <p className="font-semibold text-lg">Customer Placement</p>
                <p className="text-neutral100">
                  New customers automatically placed in lowest qualifying tier. Re-evaluation runs after transactions.
                </p>
              </div>
            </div>
          </div>
          <div className="flex my-8">
            <div className="mr-2">
              <PrimaryButton
                title={
                  <div className="flex items-center">
                    <PiPlus className="mr-2" />
                    <p>Add new tier</p>
                  </div>
                }
                onClick={openIsOpenModalAddTier}
              />
            </div>
            <OutlineButton
              title={
                <div className="flex items-center">
                  <PiInfo className="mr-2" />
                  <p>Show Setup Guide</p>
                </div>
              }
              onClick={openIsOpenModalInformationTier}
            />
          </div>
          <div className="w-full flex items-center bg-white p-4 rounded-lg">
            <PiInfo size={24} />
            <p className="ml-2">
              Read!{" "}
              <a href="/" className="text-primary500 underline">
                Tier Management Rules & Customer Placement Logic
              </a>
            </p>
          </div>
          <div className="my-4">
            <p className="font-semibold text-lg">Tier Levels ({formik.values.totalTiers})</p>
            <hr className="text-neutral40 my-2" />
            {formik.values.tierErrors.length > 0 && (
              <div className="bg-danger50 border border-danger500 p-4 rounded-lg mt-4">
                <p className="text-danger500 flex items-center">
                  <PiWarningFill className="mr-2" size={24} /> Tier Order Validation Issues
                </p>
                <div>
                  {formik.values.tierErrors.map((value, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg border-2 border-neutral40 flex justify-between p-4 my-2"
                    >
                      <div>
                        <p>{value.titleMessageName}</p>
                        <p className="text-sm">{value.titleMessageError}</p>
                        <p className="text-warning700 text-sm">{value.titleMessageAdvice}</p>
                      </div>
                      <OutlineButton title="Auto Fix" onClick={() => handleAutoFix(value)} />
                    </div>
                  ))}
                </div>
                <div className="flex items-center py-2">
                  <div className="mr-2">
                    <PrimaryButton
                      title={
                        <div className="flex items-center text-white">
                          <PiCheck className="mr-2" /> Apply Changes
                        </div>
                      }
                      onClick={handleApplyChanges}
                    />
                  </div>
                  <OutlineButton
                    title={
                      <div className="flex items-center text-primary500">
                        <PiX className="mr-2" /> Cancel Reorder
                      </div>
                    }
                    onClick={() => {
                      formik.setFieldValue("tiers", formik.values.tiersStatic);
                      formik.setFieldValue("tierErrors", []);
                    }}
                  />
                </div>
              </div>
            )}
            {formik.values.tiers.length > 0 && (
              <>
                <div className="border-2 border-neutral40 bg-neutral20 rounded-lg py-4 px-8 my-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={`${process.env.REACT_APP_TIER_LEVEL_URL}api/v1/tiers/icons/${formik.values.tiers[0].icon}`}
                        className="w-12 h-12"
                      />
                      <p className="px-2">{formik.values.tiers[0]?.name}</p>
                      <p className="rounded-full py-2 px-4 text-primary500 bg-primary50">
                        {formik.values.tiers[0].status}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <PiUsers className="text-neutral80" />
                      <p className="text-neutral80 mx-2">{formik.values.tiers[0]?.totalCustomers} Customers</p>
                      {formik.values.tiers[0].isEdited === false ? (
                        <>
                          <PiLockSimple className="text-neutral80" />
                          <PiNotePencil
                            className="text-primary500 ml-2 cursor-pointer"
                            onClick={() => handleEditTier(formik.values.tiers[0])}
                          />
                        </>
                      ) : (
                        <>
                          <div className="mr-2">
                            <OutlineButton title="Cancel" onClick={handleCancelEdit} />
                          </div>
                          <PrimaryButton title="Update" isActive={true} onClick={handleUpdateEdit} />
                        </>
                      )}
                    </div>
                  </div>
                  {formik.values.tiers[0].isEdited === false ? (
                    <>
                      <div className="grid grid-cols-3 gap-4 my-4">
                        <div>
                          <p>Tier Progression Criteria</p>
                          <p className="font-semibold">{formik.values.tiers[0].progressionType}</p>
                        </div>
                        {formik.values.tiers[0].minSpend !== null && (
                          <div>
                            <p>Minimum Spend (Rp)</p>
                            <p className="font-semibold">
                              Rp {formik.values.tiers[0].minSpend.toLocaleString("id")}{" "}
                              <span className="text-neutral80 font-normal">(Default)</span>
                            </p>
                          </div>
                        )}
                        {formik.values.tiers[0].minTransactions !== null && (
                          <div>
                            <p>Minimum Frequency</p>
                            <p className="font-semibold">
                              {formik.values.tiers[0].minTransactions.toLocaleString("id")} transaction{" "}
                              <span className="text-neutral80 font-normal">(Default)</span>
                            </p>
                          </div>
                        )}
                      </div>
                      <hr className="text-neutral40 my-2" />
                      <div className="my-4">
                        <div className="flex items-center">
                          <PiGift className="text-primary500" />
                          <p className="font-semibold ml-2">Tier Benefits ({formik.values.tiers[0].benefits.length})</p>
                        </div>
                        {formik.values.tiers[0].benefits.map((value, index) => (
                          <div className="border-2 border-neutral40 rounded-lg my-2" key={index}>
                            <div className="px-4 my-2 flex items-center">
                              {value.type === "Percentage Discount" ? (
                                <PiPercentFill size={24} className="text-primary500 mr-2" />
                              ) : value.type === "Points Multiplier" ? (
                                <PiXFill size={24} className="text-primary500 mr-2" />
                              ) : value.type === "Priority Support" ? (
                                <PiCertificateFill size={24} className="text-primary500 mr-2" />
                              ) : value.type === "Cashback Rewards" ? (
                                <PiHandCoinsFill size={24} className="text-success500 mr-2" />
                              ) : value.type === "Birthday Bonus" ? (
                                <PiCakeFill size={24} className="text-danger500 mr-2" />
                              ) : value.type === "Custom Benefit" ? (
                                <PiStarFill size={24} className="text-warning500 mr-2" />
                              ) : null}
                              <div className="ml-2">
                                <div className="flex items-center">
                                  <p className="font-semibold mr-2">{value.title}</p>
                                  <p className="rounded-full bg-primary50 text-primary500 py-1 px-2">
                                    {value.value}
                                    {value.type === "Percentage Discount"
                                      ? "%"
                                      : value.type === "Points Multiplier"
                                      ? "x"
                                      : value.type === "Priority Support"
                                      ? ""
                                      : value.type === "Cashback Rewards"
                                      ? "%"
                                      : value.type === "Birthday Bonus"
                                      ? " point"
                                      : value.type === "Custom Benefit"
                                      ? ""
                                      : null}
                                  </p>
                                </div>
                                <p>{value.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-success50 py-2 px-4 flex rounded-lg">
                        <PiShield size={20} className="text-success500" />
                        <div className="ml-2">
                          <p className="font-semibold">Default tier protection</p>
                          <p>
                            This tier serves as the fallback for all customers. It cannot be deleted, deactivated, or
                            have non-zero minimum requirements.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-neutral500 mt-4 justify-between text-sm">
                        <p>Created: {moment(formik.values.tiers[0].createdAt).format("YYYY-MM-DD")}</p>
                        <p>Modified: {moment(formik.values.tiers[0].updatedAt).format("YYYY-MM-DD")}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 mt-2">
                        <p className="font-semibold">Basic Information</p>
                        <hr className="text-neutral40 mb-4" />

                        <TextInput
                          title="Tier Name"
                          placeholder="Input Tier Name"
                          onChangeInput={(e) => {
                            formikEditing.setFieldValue("name", e.target.value);
                            formikEditing.setFieldTouched("name", true, false);
                          }}
                          footer={
                            (formikEditing.touched.name || formikEditing.submitCount > 0) && formikEditing.errors.name
                              ? formikEditing.errors.name
                              : null
                          }
                          mode={
                            (formikEditing.touched.name || formikEditing.submitCount > 0) && formikEditing.errors.name
                              ? "danger"
                              : "default"
                          }
                          isRequired
                          value={formikEditing.values.name}
                        />
                        <p className="mt-4 mb-2 text-sm">Tier Icon</p>
                        <div className="grid grid-cols-12 gap-4">
                          {formikEditing.values.tierIcons.length > 0 &&
                            formikEditing.values.tierIcons.map((value) => (
                              <div
                                className={`${
                                  formikEditing.values.icon === value.fileName
                                    ? "border-4 border-primary50 rounded-xl"
                                    : ""
                                }`}
                              >
                                <div
                                  className={`${
                                    formikEditing.values.icon === value.fileName
                                      ? "border-2 border-primary500"
                                      : "border border-neutral40"
                                  } rounded-lg cursor-pointer w-full h-full`}
                                  onClick={() => formikEditing.setFieldValue("icon", value.fileName)}
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
                            { option: "Spend Only", value: "Spend Only" },
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
                            formikEditing.setFieldValue("progressionType", e.value);
                            formikEditing.setFieldTouched("progressionType", true, false);
                          }}
                          footer={
                            formikEditing.values.progressionType === "Spend Only"
                              ? "Customer must reach the minimum spend amount to qualify for this tier."
                              : formikEditing.values.progressionType === "Frequency Only"
                              ? "Customer must complete the minimum number of transactions to qualify for this tier."
                              : formikEditing.values.progressionType === "Spend AND Frequency"
                              ? "Customer must meet BOTH minimum spend and transaction frequency requirements."
                              : formikEditing.values.progressionType === "Spend OR Frequency"
                              ? "Customer must meet EITHER minimum spend OR transaction frequency requirement."
                              : null
                          }
                          currentOption={formikEditing.values.progressionType}
                        />

                        <div className="flex items-center justify-between mt-4">
                          {formikEditing.values.progressionType !== "Frequency Only" && (
                            <TextInput
                              title="Minimum Spend"
                              placeholder="Input Min. Spend"
                              onChangeInput={(e) => {
                                formikEditing.setFieldValue("minSpend", e.target.value);
                                formikEditing.setFieldTouched("minSpend", true, false);
                              }}
                              type="number"
                              minimum={0}
                              footer={
                                (formikEditing.touched.minSpend || formikEditing.submitCount > 0) &&
                                formikEditing.errors.minSpend
                                  ? formikEditing.errors.minSpend
                                  : null
                              }
                              mode={
                                (formikEditing.touched.minSpend || formikEditing.submitCount > 0) &&
                                formikEditing.errors.minSpend
                                  ? "danger"
                                  : "default"
                              }
                              isRequired
                              value={formikEditing.values.minSpend}
                              leftAdornment={<p className="text-sm">Rp</p>}
                            />
                          )}
                          {formikEditing.values.progressionType !== "Spend Only" && (
                            <div className="ml-4 w-full">
                              <TextInput
                                title="Minimum Frequency"
                                placeholder="Input Min. Frequency"
                                type="number"
                                onChangeInput={(e) => {
                                  formikEditing.setFieldValue("minTransactions", e.target.value);
                                  formikEditing.setFieldTouched("minTransactions", true, false);
                                }}
                                minimum={0}
                                footer={
                                  (formikEditing.touched.minTransactions || formikEditing.submitCount > 0) &&
                                  formikEditing.errors.minTransactions
                                    ? formikEditing.errors.minTransactions
                                    : null
                                }
                                mode={
                                  (formikEditing.touched.minTransactions || formikEditing.submitCount > 0) &&
                                  formikEditing.errors.minTransactions
                                    ? "danger"
                                    : "default"
                                }
                                isRequired
                                value={formikEditing.values.minTransactions}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="text-neutral80 my-8" />

                        <div className="my-4">
                          <div className="flex items-center">
                            <PiGift className="text-primary500" />
                            <p className="font-semibold ml-2">Tier Benefits ({formikEditing.values.benefits.length})</p>
                          </div>
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
                          {formikEditing.values.benefits.length === 0 ? (
                            <div className="text-center w-full rounded-lg border-2 border-neutral40 p-4">
                              <div className="w-full flex justify-center">
                                <img src={EmptyState} />
                              </div>
                              <p className="font-semibold">No benefits added yet</p>
                              <p className="text-neutral300">Add benefits to make this tier attractive to customers</p>
                            </div>
                          ) : (
                            formikEditing.values.benefits.map((benefit, index) => (
                              <TierBenefitComponent
                                key={index}
                                formik={formikEditing}
                                currentIndex={index}
                                onDeleteData={() => handleDeleteData(index)}
                              />
                            ))
                          )}
                        </div>

                        <div className="flex items-center mt-4">
                          <Switch
                            isEdit={true}
                            checked={formikEditing.values.status}
                            onChange={() => formikEditing.setFieldValue("status", !formikEditing.values.status)}
                          />
                          <p className="ml-2">Activate Tier</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {formik.values.tiers.slice(1).map((tier, index) => (
                  <TierLevelComponent
                    data={tier}
                    formikEditing={formikEditing}
                    handleDeleteTier={() => handleDeleteTier(tier)}
                    handleEditTier={() => handleEditTier(tier)}
                    handleCancelEdit={handleCancelEdit}
                    handleUpdateEdit={handleUpdateEdit}
                    handleUploadImage={handleUploadImage}
                    nameTierBefore={formik.values.tiers[index].name}
                    isError={formik.values.tierErrors.some((error) => error.id === tier.id)}
                  />
                ))}
              </>
            )}
          </div>
        </div>
        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClick={() => {}}
        />
        <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />
        <StateModal
          title="Do you want to inactive?"
          subtitle="Are you sure you want to inactive tier downgrade?"
          isOpen={confirmationModalIsOpen}
          onClose={toggleConfirmationModal}
          type="default"
          titleButtonLeft="Cancel"
          titleButtonRight="Inactive"
          leftAction={toggleConfirmationModal}
          rightAction={() => {
            toggleConfirmationModal();
            handleChangeTierSetting();
            formik.setFieldValue("tierDowngrade", !formik.values.tierDowngrade);
          }}
        />
        <StateModal
          title="Do you want to delete?"
          subtitle={`Are you sure you want to delete ${currentTier?.name}? All Customers in this tier will be moved to the lowest tier`}
          isOpen={isOpenModalDeleteTier}
          onClose={closeIsOpenModalDeleteTier}
          type="danger"
          titleButtonRight="Delete"
          titleButtonLeft="Cancel"
          leftAction={closeIsOpenModalDeleteTier}
          rightAction={handleDeleteTierLevel}
        />
        <ModalInformationTier isOpen={isOpenModalInformationTier} onClose={closeIsOpenModalInformationTier} />
        <ModalCreateTier
          isOpen={isOpenModalAddTier}
          onClose={closeIsOpenModalAddTier}
          loyaltyId={loyaltyId}
          totalTierLevel={formik.values.totalTiers}
          reRenderPage={reRenderPage}
        />
      </div>
    </>
  );
};

export default TierDashboardSection;
