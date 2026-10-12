import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import { ModalState, Footer, ModalLoading, ModalResult, TextInput, Switch } from "sprint-asia-custom-component";
import { GetAllBank, GetAllCity, GetAllDistrict, GetAllProvince } from "../../../service/usermanagement/endpoint";
import {
  FetchDivisionFile,
  GetAllClient,
  GetDivisionById,
  EditDivision as PatchDivision,
} from "../../../service/usermanagement/endpoint/division";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import SwitchStatus from "../../../components/Division/DivisionForm/SwitchStatus/SwitchStatus";
import DivisionInformation from "../../../components/Division/DivisionForm/DivisionInformation/DivisionInformation";
import AddressInformation from "../../../components/Division/DivisionForm/AddressInformation/AddressInformation";
import BillingInformation from "../../../components/Division/DivisionForm/BillingInformation/BillingInformation";
import UploadDocument from "../../../components/Division/DivisionForm/UploadDocument/UploadDocument";
import { PiCoins } from "react-icons/pi";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { customList } from "country-codes-list";

const EditDivision = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [isChecked, setIsChecked] = useState(1);
  const [projectBrief, setProjectBrief] = useState(null);
  const [projectBriefIsLoading, setProjectBriefIsLoading] = useState(false);
  const [optionalDocument1, setOptionalDocument1] = useState(null);
  const [document1IsLoading, setDocument1IsLoading] = useState(false);
  const [optionalDocument2, setOptionalDocument2] = useState(null);
  const [document2IsLoading, setDocument2IsLoading] = useState(false);
  const [fileError, setFileError] = useState(null);

  const onDropProjectBrief = useCallback((acceptedFiles) => {
    formik.setFieldValue("projectBrief", acceptedFiles[0]);
  }, []);

  const onDropFile1 = useCallback((acceptedFiles) => {
    formik.setFieldValue("optionalDocument1", acceptedFiles[0]);
  }, []);

  const onDropFile2 = useCallback((acceptedFiles) => {
    formik.setFieldValue("optionalDocument2", acceptedFiles[0]);
  }, []);

  const navigateTo = useNavigate();

  const handleToggle = () => {
    // Toggle the checked state
    setIsChecked((prevState) => {
      if (prevState === 0) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 3500);
    }, 250);
  }

  function handleNavigateToAddClient() {
    navigateTo("/prezent/account/client/add");
  }

  function handleNavigateToDashboardDivision() {
    navigateTo("/prezent/account/division");
  }

  const { data, isError, isLoading } = useFetch(id && GetDivisionById, "division", [], { roleAccess, id });

  // Fetch manual file project brief
  useEffect(() => {
    if (!data?.data?.projectBrief) return;

    const fetchProjectBrief = async () => {
      setProjectBriefIsLoading(true);
      try {
        const file = await FetchDivisionFile({ file: data.data.projectBrief });
        setProjectBrief(file);
      } catch (error) {
        console.error("Error fetching project brief:", error);
        setFileError("Error fetching project brief");
      } finally {
        setProjectBriefIsLoading(false);
      }
    };

    fetchProjectBrief();
  }, [data?.data?.projectBrief]);

  // Fetch manual file optional document 1
  useEffect(() => {
    if (!data?.data?.optionalDocument1) return;

    const fetchOptionalDocument1 = async () => {
      setDocument1IsLoading(true);
      try {
        const file = await FetchDivisionFile({ file: data.data.optionalDocument1 });
        setOptionalDocument1(file);
      } catch (error) {
        console.error("Error fetching optional document 1:", error);
        setFileError("Error fetching optional document 1");
      } finally {
        setDocument1IsLoading(false);
      }
    };

    fetchOptionalDocument1();
  }, [data?.data?.optionalDocument1]);

  // Fetch manual file optional document 1
  useEffect(() => {
    if (!data?.data?.optionalDocument2) return;

    const fetchOptionalDocument2 = async () => {
      setDocument2IsLoading(true);
      try {
        const file = await FetchDivisionFile({ file: data.data.optionalDocument2 });
        setOptionalDocument2(file);
      } catch (error) {
        console.error("Error fetching optional document 2:", error);
        setFileError("Error fetching optional document 2");
      } finally {
        setDocument2IsLoading(false);
      }
    };

    fetchOptionalDocument2();
  }, [data?.data?.optionalDocument2]);

  const { data: clients, isLoading: clientIsLoading } = useFetch(GetAllClient, "clients", [], { roleAccess });

  const submitEditDivision = async (form) => {
    try {
      toggleLoadingModal();
      const fullPhoneNumber = `${formik.values.dropdownCountry.option}${formik.values.picPhoneNumber}`;
      form.set("picPhoneNumber", fullPhoneNumber);
      const response = await PatchDivision(roleAccess, form);
      if (response.code === 200) {
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Changes have been successfully saved.");
          setTimeout(() => {
            handleNavigateToDashboardDivision();
          }, 4000);
        }, 250);
      } else {
        toggleLoadingModal();
        handleOpenModalResult(
          "failed",
          "Sorry, the division cannot be edited at the moment because there is an active campaign. Changing it may impact ongoing transactions."
        );
      }
    } catch (error) {
      if (error && error.response && error.response.data.code === 409) {
        toggleLoadingModal();
        handleOpenModalResult(
          "failed",
          "Sorry, the division cannot be edited at the moment because there is an active campaign. Changing it may impact ongoing transactions."
        );
      } else {
        toggleLoadingModal();
        handleOpenModalResult("failed", "Sorry, unable to adding Division at the moment. Please try again");
      }
    }
  };

  const detectCountryFromPhone = (phoneNumber) => {
    if (!phoneNumber) return null;

    const phoneData = parsePhoneNumberFromString(phoneNumber);
    if (!phoneData || !phoneData.countryCallingCode || !phoneData.country) {
      return null;
    }

    const list = Object.entries(
      customList("countryCode", "{countryNameEn} +{countryCallingCode}")
    ).map(([code, label]) => {
      const [countryName, callingCode] = label.split(" +");
      return {
        option: `+${callingCode}`,
        value: code.toLowerCase(),
        label: countryName,
      };
    });

    const match = list.find(
      (item) =>
        item.option === `+${phoneData.countryCallingCode}` &&
        item.value === phoneData.country.toLowerCase()
    );

    return match || {
      option: `+${phoneData.countryCallingCode}`,
      value: phoneData.country.toLowerCase(),
      label: phoneData.country || "Unknown",
    };
  };

  const fullPhone = data?.data.picPhoneNumber || "";
  const detectedCountry = detectCountryFromPhone(fullPhone);
  const picPhoneNumber = fullPhone.replace(`+${detectedCountry?.option.replace("+", "")}`, "");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientId: data?.data?.clientId || "",
      divisionName: data?.data?.name || "",
      picName: data?.data?.picName || "",
      picEmail: data?.data?.picEmail || "",
      gender: data?.data?.picGender || "",
      position: data?.data?.picPosition || "",
      picPhoneNumber: picPhoneNumber || "",
      dropdownCountry: detectedCountry || {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
      provinceCode: data?.data?.provinceCode || "",
      cityCode: data?.data?.cityCode || "",
      districtCode: data?.data?.districtCode || "",
      detailAddress: data?.data?.detailAddress || "",
      postalCode: data?.data?.postalCode || "",
      bankName: data?.data?.bankName || "",
      accountName: data?.data?.accountName || "",
      accountNumber: data?.data?.accountNumber || "",
      taxRegistrationNumber: data?.data?.taxRegistrationNumber || "",
      billingType: data?.data?.billingType || roleAccess === "Client Administrator" ? "Prepaid" : "",
      adminFee: data?.data?.adminFee || "",
      limitAmount: data?.data?.limitAmount || "",
      projectBrief: projectBrief || "",
      optionalDocument1: optionalDocument1 || "",
      optionalDocument2: optionalDocument2 || "",
      rewardCatalog: 1,
      burningRolePoint: data?.data?.burningRolePoint || 0,
      burningRoleRupiah: data?.data?.burningRoleRupiah || 0,
      deductFromTransaction: Number(data?.data?.deductFromTransaction) || 0,
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
      divisionName: yup
        .string()
        .matches(/^[a-zA-Z0-9. ]+$/, "Division name must only contain alphanumeric characters, dots, and spaces")
        .min(5, "Division name must be between 5 and 50 characters long")
        .max(50, "Division name must be between 5 and 50 characters long")
        .required("Division name is required"),
      picName: yup
        .string()
        .min(10, "PIC name must be between 10 and 50 characters long")
        .max(50, "PIC name must be between 10 and 50 characters long")
        .matches(/^[a-zA-Z0-9\s]+$/, "PIC name must only contain alphanumeric characters")
        .required("PIC name is required"),
      picEmail: yup
        .string()
        .min(10, "PIC email must be between 10 and 50 characters long")
        .max(50, "PIC email must be between 10 and 50 characters long")
        .test("no-spaces", "PIC email cannot contain spaces", (value) => !/\s/.test(value))
        .matches(
          /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
          "Please use a valid email format"
        )
        .required("PIC email is required"),
      gender: yup.string().required("Gender is required"),
      position: yup
        .string()
        .matches(/^[a-zA-Z0-9 ]+$/, "PIC position must only contain alphanumeric characters")
        .min(10, "PIC position must be between 10 and 50 characters long")
        .max(50, "PIC position must be between 10 and 50 characters long")
        .required("Position is required"),
      picPhoneNumber: yup
        .string()
        .required("PIC phone number is required")
        .test(
          'is-valid-length',
          'Phone number length is not valid',
          function (value) {
            if (!value) return false;
            const cleaned = value.replace(/\D/g, '');
            return cleaned.length >= 6 && cleaned.length <= 15;
          }
        ),
      provinceCode: yup.string().required("Province is required"),
      cityCode: yup.string().required("City is required"),
      districtCode: yup.string().required("District is required"),
      detailAddress: yup
        .string()
        .matches(/^[a-zA-Z0-9.,/ ]+$/, "Detail address must only contain alphanumeric characters, dots, and spaces")
        .min(10, "Detail address must be between 10 and 500 characters long")
        .max(500, "Detail address must be between 10 and 500 characters long")
        .required("Address is required"),
      postalCode: yup
        .string()
        .matches(/^\d+$/, "Postal code must be numeric")
        .min(5, "Postal code must be contains 5 character")
        .max(5, "Postal code must be contains 5 character")
        .required("Postal code is required"),
      bankName: yup.string().required("Bank is required"),
      accountName: yup
        .string()
        .min(5, "Account name must be between 5 and 50 characters long")
        .max(50, "Account name must be between 5 and 50 characters long")
        .matches(/^[a-zA-Z0-9\s]+$/, "Account name must only contain alphanumeric characters")
        .required("Account name is required"),
      accountNumber: yup
        .string()
        .matches(/^\d+$/, "Account number must be numeric")
        .min(5, "Account number must be between 5 and 50 characters long")
        .max(50, "Account number must be between 5 and 50 characters long")
        .required("Account number is required"),
      taxRegistrationNumber: yup
        .string()
        .test(
          "is-15-or-16-digits",
          "Tax registration number must contain 15 or 16 digits",
          (value) => value && [15, 16].includes(value.replace(/\D/g, "").length)
        )
        .required("Tax registration number is required"),
      billingType: yup.string().required("Billing type is required"),
      burningRolePoint: yup
        .number()
        .min(1, "Burning point minimum 1 point")
        .max(1000000000, "Burning point maximum 1.000.000.000")
        .required("Burning point is required"),
      burningRoleRupiah: yup
        .number()
        .min(1, "Burning rupiah minimum 1 rupiah")
        .max(1000000000, "Burning rupiah maximum 1.000.000.000")
        .required("Burning rupiah is required"),
      adminFee: yup
        .number()
        .min(0, "Admin fee must be between 0 and 100")
        .max(100, "Admin fee must be between 0 and 100"),
      limitAmount: yup.number().when("billingType", {
        is: (value) => value === "Postpaid",
        then: () =>
          yup
            .number()
            .min(0, "Limit amount must be between 0 and 1.000.000.000")
            .max(1000000000, "Limit amount must be between 0 and 1.000.000.000")
            .required("Limit amount is required for postpaid billing"),
        otherwise: () => yup.number().notRequired(),
      }),
      projectBrief: yup.mixed().required("Project brief is required"),
      optionalDocument1: yup.mixed(),
      optionalDocument2: yup.mixed(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const formData = new FormData();
      for (let key in values) {
        if (key !== "optionalDocument1" && key !== "optionalDocument2") {
          formData.append(key, values[key]);
        } else {
          if (values[key]) {
            formData.append(key, values[key]);
          }
        }
      }
      formData.append("id", id);
      roleAccess !== "Client Administrator" && formData.append("status", isChecked);

      submitEditDivision(formData);
    },
  });

  const { data: banks } = useFetch(GetAllBank, "banks", [formik.values.bankName], {});
  const { data: provinces } = useFetch(GetAllProvince, "provinces", [formik.values.provinceCode], {});
  const { data: cities } = useFetch(formik.values.provinceCode && GetAllCity, "cities", [], formik.values.provinceCode);
  const { data: districts } = useFetch(
    formik.values.cityCode && GetAllDistrict,
    "districts",
    [],
    formik.values.cityCode
  );

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      handleNavigateToDashboardDivision();
    }
  };

  useEffect(() => {
    if (data?.data?.id) {
      setIsChecked(() => {
        if (data?.data?.status === "Active") {
          return 1;
        } else {
          return 0;
        }
      });
    }
  }, [data?.data]);

  useEffect(() => {
    if (isError || fileError) {
      handleOpenModalResult("failed", "Oops! There was an error load the division data. Please try again.");
    }
  }, [isError, fileError]);

  useEffect(() => {
    setTitleHeader("Edit Division");
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 bg-neutral20 p-8 mb-16">
        {roleAccess !== "Client Administrator" && <SwitchStatus handleToggle={handleToggle} isChecked={isChecked} />}

        <form className="flex flex-col gap-7 bg-white rounded-lg border border-neutral40 shadow-md p-6">
          <DivisionInformation formik={formik} clients={clients} mode={"Edit"} />

          <AddressInformation formik={formik} provinces={provinces} cities={cities} districts={districts} />

          <BillingInformation formik={formik} banks={banks} roleAccess={roleAccess} />

          <UploadDocument
            formik={formik}
            onDropProjectBrief={onDropProjectBrief}
            onDropFile1={onDropFile1}
            onDropFile2={onDropFile2}
          />
        </form>

        {/* {
          roleAccess === "System Administrator" &&
          <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6">
            <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Rewards catalog</div>
            <div className="flex flex-col gap-1">
              <div className="flex">
                <Switch 
                  onChange={() => {
                    if (formik.values.rewardCatalog === 1) {
                      formik.setFieldValue("rewardCatalog", 0)
                    }
                    else {
                      formik.setFieldValue("rewardCatalog", 1)
                    }
                  }} 
                  checked={formik.values.rewardCatalog} 
                  isEdit 
                />
                <div className="ml-2">
                  <p className="text-black font-semibold text-base">Enable Rewards Catalog</p>
                  <p className="text-neutral500 font-normal text-sm">
                    Activate the rewards catalog to allow customers to redeem their loyalty points for available rewards. Disable if you do not wish to use the rewards catalog feature for this rule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        } */}

        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6">
          <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
            Modify the burning rule
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <p className="text-black font-semibold text-base">Burning point configuration</p>
              <p className="text-neutral500 font-normal text-sm">
                Define how customers earn loyalty points when they make purchases. Set rules based on the amount spent,
                and decide whether points are given in a proportionally amount. Adjust these settings to match your
                loyalty program and ensure customers are rewarded as expected.
              </p>
            </div>
            <div className="text-sm text-neutral500 flex items-center my-8">
              <p className="mr-2 whitespace-nowrap">For every</p>
              <div className="w-full">
                <TextInput
                  title={null}
                  placeholder="Input point"
                  onChangeInput={(e) => {
                    formik.setFieldValue("burningRolePoint", e.target.value);
                    formik.setFieldTouched("burningRolePoint", true, false);
                  }}
                  footer={(formik.touched.burningRolePoint || formik.submitCount > 0) && formik.errors.burningRolePoint ? formik.errors.burningRolePoint : null}
                  mode={(formik.touched.burningRolePoint || formik.submitCount > 0) && formik.errors.burningRolePoint ? "danger" : "default"}
                  leftAdornment={<PiCoins />}
                  type="number"
                  minimum={1}
                  isRequired={false}
                  value={formik.values.burningRolePoint}
                />
              </div>
              <p className="mx-2 whitespace-nowrap">Point earned, is equivalent to</p>
              <div className="w-full">
                <TextInput
                  title={null}
                  placeholder="Input rupiah"
                  onChangeInput={(e) => {
                    formik.setFieldValue("burningRoleRupiah", e.target.value);
                    formik.setFieldTouched("burningRoleRupiah", true, false);
                  }}
                  footer={(formik.touched.burningRoleRupiah || formik.submitCount > 0) && formik.errors.burningRoleRupiah ? formik.errors.burningRoleRupiah : null}
                  mode={(formik.touched.burningRoleRupiah || formik.submitCount > 0) && formik.errors.burningRoleRupiah ? "danger" : "default"}
                  leftAdornment={<p className="text-xs pl-1">Rp</p>}
                  type="number"
                  minimum={1}
                  isRequired={false}
                  value={formik.values.burningRoleRupiah}
                />
              </div>
              <p className="ml-2 whitespace-nowrap">In product rewards</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6 mb-4">
          <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Reward Money</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-start">
              <input
                type="checkbox"
                checked={formik.values.deductFromTransaction}
                onChange={() => {
                  if (formik.values.deductFromTransaction === 1) {
                    formik.setFieldValue("deductFromTransaction", 0);
                  } else {
                    formik.setFieldValue("deductFromTransaction", 1);
                  }
                }}
                className="mt-1"
              />
              <div className="ml-2">
                <p className="text-black font-semibold text-base">Deduct from Transaction</p>
                <p className="text-neutral500 font-normal text-sm">
                  When enabled, the amount used for redemption will be directly deducted from the customer's total
                  transaction. If disabled, customers can only redeem points for reward products without reducing their
                  total transaction amount.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={handleCancelButton}
        onClickRightButton={formik.handleSubmit}
      />

      <ModalLoading
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={
          isLoading ||
          clientIsLoading ||
          loadingModalIsOpen ||
          projectBriefIsLoading ||
          document1IsLoading ||
          document2IsLoading
        }
        onClose={() => { }}
      />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <ModalState
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationModalIsOpen}
        onClose={toggleConfirmationModal}
        type="default"
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleConfirmationModal}
        rightAction={handleNavigateToDashboardDivision}
      />
    </div>
  );
};

export default EditDivision;
