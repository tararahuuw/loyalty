import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  DropzoneUploadFile,
  TextInput,
  Switch,
  Footer,
  ModalState,
  ModalLoading,
  ModalResult,
  DropdownText,
  PrimaryButton,
  SearchDropdown,
  DropzoneUploadPhoto,
  DropdownPhone
} from "sprint-asia-custom-component";
import TextInputMask from "prezent/TextInputMask";
import { PatchClient, FetchClientFile, GetClientById } from "../../../service/usermanagement/endpoint/client";
import {
  GetAllBank,
  GetAllCity,
  GetAllIndustry,
  GetAllDistrict,
  GetAllProvince,
} from "../../../service/usermanagement/endpoint";
import { useDisclosure } from "prezent/useDisclosure";
import { GetAllDivisionByClientID } from "../../../service/usermanagement/endpoint/division";
import DataTable from "prezent/DataTable";
import { useFetch } from "prezent/useFetch";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import _ from "lodash";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { customList } from "country-codes-list";

const EditClient = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
  const { isOpen: deleteDivisionModalIsOpen, toggle: toggleDeleteDivisionModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [isChecked, setIsChecked] = useState(0);
  const [dataCurrentID, setDataCurrentID] = useState();
  const { data, isError, isLoading } = useFetch(id && GetClientById, "client", [], { roleAccess, id });
  const {
    data: cooperationAgreement,
    isError: cooperationAgreementIsError,
    isLoading: cooperationAgreementLoading,
  } = useFetch(data?.data?.cooperationAgreement && FetchClientFile, "cooperationAgreement", [], {
    file: data?.data?.cooperationAgreement,
  });
  const {
    data: nomerIndukBerusaha,
    isError: nomerIndukBerusahaIsError,
    isLoading: nomerIndukBerusahaLoading,
  } = useFetch(data?.data?.nomorIndukBerusaha && FetchClientFile, "nomerIndukBerusaha", [], {
    file: data?.data?.nomorIndukBerusaha,
  });
  const {
    data: kartuTandaPendudukCeo,
    isError: kartuTandaPendudukCeoIsError,
    isLoading: kartuTandaPendudukCeoLoading,
  } = useFetch(data?.data?.kartuTandaPendudukCEO && FetchClientFile, "kartuTandaPendudukCeo", [], {
    file: data?.data?.kartuTandaPendudukCEO,
  });
  const {
    data: softCopyNpwp,
    isError: softCopyNpwpIsError,
    isLoading: softCopyNpwpLoading,
  } = useFetch(data?.data?.softCopyNPWP && FetchClientFile, "softCopyNpwp", [], {
    file: data?.data?.softCopyNPWP,
  });
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Client",
    value: "client",
  });
  const [reRender, setReRender] = useState(false);
  const dataOptions = [
    {
      option: "Division",
      value: "name",
    },
    {
      option: "PIC",
      value: "picName",
    },
    {
      option: "Email",
      value: "picEmail",
    },
  ];

  const columns = [
    {
      header: "Division Data",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-sm">{row.id}</p>
          </div>
        );
      },
    },
    {
      header: "PIC",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="font-normal text-neutral300 text-sm">{row.picPosition}</p>
          </div>
        );
      },
    },
    {
      header: "Contact",
      assessor: "contact",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picEmail}</p>
            <p className="font-normal text-neutral300 text-sm">{row.picPhoneNumber}</p>
          </div>
        );
      },
    },
    {
      header: "Type",
      assessor: "billingType",
    },
    {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div onClick={() => handleNavigateToEditDivision(row.id)}>
              <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <div onClick={() => handleDeleteDataTable(row.id)}>
              <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          </div>
        );
      },
    },
  ];

  const onDropFileCorporateAgreement = useCallback((acceptedFiles) => {
    formik.setFieldValue("cooperationAgreement", acceptedFiles[0]);
    formik.setFieldTouched("cooperationAgreement", true, false);
  }, []);

  const onDropFilenomerIndukBerusaha = useCallback((acceptedFiles) => {
    formik.setFieldValue("nomerIndukBerusaha", acceptedFiles[0]);
    formik.setFieldTouched("nomerIndukBerusaha", true, false);
  }, []);

  const onDropFileKTP = useCallback((acceptedFiles) => {
    formik.setFieldValue("kartuTandaPendudukCeo", acceptedFiles[0]);
    formik.setFieldTouched("kartuTandaPendudukCeo", true, false);
  }, []);

  const onDropFileTaxRegistration = useCallback((acceptedFiles) => {
    formik.setFieldValue("softCopyNpwp", acceptedFiles[0]);
    formik.setFieldTouched("softCopyNpwp", true, false);
  }, []);

  const onDropFileClientLogo = useCallback((acceptedFiles) => {
    formik.setFieldValue("clientLogo", acceptedFiles[0]);
    formik.setFieldTouched("clientLogo", true, false);
  }, []);

  const navigateTo = useNavigate();

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

  function handleNavigateToDashboardClient() {
    navigateTo("/prezent/account/client");
  }

  function handleNavigateToEditDivision(idDivision) {
    navigateTo(`/prezent/account/division/edit/${idDivision}`);
  }

  function handleNavigateToAddDivision() {
    navigateTo(`/prezent/account/division/add/${id}`);
  }

  function handleNavigateDetailDivision(idDivision) {
    navigateTo(`/prezent/detail-division/${idDivision}`);
  }

  const keywordSearchHandler = useCallback(
    _.debounce((value) => {
      setDataSearch(value.toLocaleLowerCase());
    }, 500),
    []
  );

  function handleDeleteDataTable(index) {
    setDataCurrentID(index);
    toggleDeleteDivisionModal();
  }

  const handleToggle = () => {
    setIsChecked((prevState) => {
      if (prevState === 0) {
        return 1;
      } else {
        return 0;
      }
    });
  };

  const submitEditClient = async (values) => {
    try {
      toggleLoadingModal();
      const formData = new FormData();
      const formattedPhoneNumber = `${formik.values.dropdownCountry.option}${formik.values.picPhoneNumber}`;
      var logoClient = null;
      if (typeof formik.values.clientLogo === "string") {
        const parts = formik.values.clientLogo.split("/");
        const fileName = parts[parts.length - 1];
        logoClient = await FetchClientFile({ file: fileName });
      } else {
        logoClient = formik.values.clientLogo;
      }
      for (let key in values) {
        if (key === "clientLogo") {
          formData.append("clientLogo", logoClient);
        } else if (key === "picPhoneNumber") {
          formData.append("picPhoneNumber", formattedPhoneNumber);
        } else {
          formData.append(key, values[key]);
        }
      }
      if (roleAccess !== "Client Administrator") {
        formData.append("status", isChecked);
      }
      await PatchClient(roleAccess, formData);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          "Successfully edited client!"
        );
        setTimeout(() => {
          handleNavigateToDashboardClient();
        }, 1500);
      }, 250);
    } catch (error) {
      if (error?.response?.data?.code === 409) {
        if (error.response.data.data === "Failed to parse phone number phone number is not valid") {
          formik.setFieldError(
            "picPhoneNumber",
            "Phone number is not valid"
          );
        }
        toggleLoadingModal();
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to edited client at the moment. Please refresh the page and try again"
        );
      }
    }
  };

  async function handleDeleteDivision() {
    try {
      toggleLoadingModal();
      toggleDeleteDivisionModal();
      await DeleteDivision(roleAccess, dataCurrentID);
      toggleLoadingModal();
      setReRender(!reRender);
      handleOpenModalResult("success", "Division has been successfully removed.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Division has been failed deleted.");
    }
  }

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
      id: id || "",
      clientName: data?.data.name || "",
      industry: data?.data.industry || "",
      picName: data?.data.picName || "",
      picEmail: data?.data.picEmail || "",
      picPhoneNumber: picPhoneNumber || "",
      dropdownCountry: detectedCountry || {
        option: "+62",
        value: "id",
        label: "Indonesia",
      },
      provinceCode: data?.data.provinceCode || "",
      cityCode: data?.data.cityCode || "",
      districtCode: data?.data.districtCode || "",
      detailAddress: data?.data.detailAddress || "",
      postalCode: data?.data.postalCode || "",
      bankName: data?.data.bankName || "",
      accountName: data?.data.accountName || "",
      accountNumber: data?.data.accountNumber || "",
      taxRegistrationNumber: data?.data.taxRegistrationNumber || "",
      cooperationAgreement: cooperationAgreement || null,
      nomerIndukBerusaha: nomerIndukBerusaha || null,
      kartuTandaPendudukCeo: kartuTandaPendudukCeo || null,
      softCopyNpwp: softCopyNpwp || null,
      clientLogo: data?.data.clientLogo || null,
    },
    validationSchema: yup.object().shape({
      clientName: yup
        .string()
        .matches(/^[a-zA-Z0-9. ]+$/, "Client name must only contain alphanumeric characters, dots, and spaces")
        .min(5, "Client name must be between 5 and 100 characters long")
        .max(100, "Client name must be between 5 and 100 characters long")
        .required("Client name is required"),
      industry: yup.string().required("Industry is required"),
      picName: yup
        .string()
        .min(10, "PIC name must be between 10 and 50 characters long")
        .max(50, "PIC name must be between 10 and 50 characters long")
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
        .required("Detail address is required"),
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
      cooperationAgreement: yup.mixed().required("File Corporate Agrement (PKS) is required"),
      nomerIndukBerusaha: yup.mixed().required("File Nomor Induk Berusaha (NIB) is required"),
      kartuTandaPendudukCeo: yup.mixed().required("File CEO Identity Card (KTP) is required"),
      softCopyNpwp: yup.mixed().required("File Tax Registration Number is required"),
      clientLogo: yup.mixed().required("Client Logo is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      submitEditClient(values);
    },
  });

  const { data: industries } = useFetch(GetAllIndustry, "industries", [formik.values.industry], {});
  const { data: banks } = useFetch(GetAllBank, "banks", [formik.values.bankName], {});
  const { data: provinces } = useFetch(GetAllProvince, "provinces", [formik.values.provinceCode], {});
  const { data: cities } = useFetch(formik.values.provinceCode && GetAllCity, "cities", [], formik.values.provinceCode);
  const { data: districts } = useFetch(
    formik.values.cityCode && GetAllDistrict,
    "districts",
    [],
    formik.values.cityCode
  );

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
    if (
      isError ||
      cooperationAgreementIsError ||
      nomerIndukBerusahaIsError ||
      kartuTandaPendudukCeoIsError ||
      softCopyNpwpIsError
    ) {
      handleOpenModalResult("failed", "Oops! There was an error load the client data. Please try again.");
    }
  }, [
    isError,
    cooperationAgreementIsError,
    nomerIndukBerusahaIsError,
    kartuTandaPendudukCeoIsError,
    softCopyNpwpIsError,
  ]);

  useEffect(() => {
    setTitleHeader("Edit Client");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          {roleAccess !== "Client Administrator" && (
            <div className="bg-white rounded-lg py-5 px-6 shadow-md mb-6">
              <p className="font-semibold text-black text-lg">Status</p>
              <hr className="text-neutral30" />
              <div className="flex justify-between py-4">
                <div>
                  <p className="font-semibold text-black text-sm">Activate Your Client</p>
                  <p className="text-neutral300 text-sm">
                    However, when you switch off the toggle, your client enters an inactive and All transactions are
                    paused.
                  </p>
                </div>
                <Switch onChange={handleToggle} checked={isChecked} isEdit={true} />
              </div>
            </div>
          )}
          <div className="bg-white rounded-lg py-5 px-6 shadow-md">
            <div className="mb-2">
              <p className="font-semibold text-black text-lg">Basic Information</p>
              <hr className="text-neutral30" />
              <div className="flex justify-between py-4">
                <div class="grid grid-cols-3 gap-4 w-full">
                  <TextInput
                    title="Client Name"
                    placeholder="Input Client Name"
                    onChangeInput={(e) => {
                      formik.setFieldValue("clientName", e.target.value);
                      formik.setFieldTouched("clientName", true, false);
                    }}
                    footer={(formik.touched.clientName || formik.submitCount > 0) && formik.errors.clientName ? formik.errors.clientName : null}
                    mode={(formik.touched.clientName || formik.submitCount > 0) && formik.errors.clientName ? "danger" : "default"}
                    isRequired
                    value={formik.values.clientName}
                  />
                  <DropdownText
                    title="Industry"
                    placeholder="Select Industry"
                    options={industries?.data?.map(({ name }) => ({
                      option: name,
                      value: name,
                    }))}
                    isRequired
                    onSelect={(e) => {
                      formik.setFieldValue("industry", e.value);
                      formik.setFieldTouched("industry", true, false);
                    }}
                    footer={(formik.touched.industry || formik.submitCount > 0) && formik.errors.industry ? formik.errors.industry : null}
                    mode={(formik.touched.industry || formik.submitCount > 0) && formik.errors.industry ? "danger" : "default"}
                    currentOption={formik.values.industry}
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-black text-lg">PIC Information</p>
              <hr className="text-neutral30" />
              <div className="flex justify-between py-4">
                <div class="grid grid-cols-3 gap-4 w-full">
                  <TextInput
                    title="PIC Name"
                    placeholder="Input PIC Name"
                    onChangeInput={(e) => {
                      formik.setFieldValue("picName", e.target.value);
                      formik.setFieldTouched("picName", true, false);
                    }}
                    footer={(formik.touched.picName || formik.submitCount > 0) && formik.errors.picName ? formik.errors.picName : null}
                    mode={(formik.touched.picName || formik.submitCount > 0) && formik.errors.picName ? "danger" : "default"}
                    isRequired
                    value={formik.values.picName}
                  />
                  <TextInput
                    title="PIC Email"
                    placeholder="Input PIC Email"
                    onChangeInput={(e) => {
                      formik.setFieldValue("picEmail", e.target.value);
                      formik.setFieldTouched("picEmail", true, false);
                    }}
                    footer={(formik.touched.picEmail || formik.submitCount > 0) && formik.errors.picEmail ? formik.errors.picEmail : null}
                    mode={(formik.touched.picEmail || formik.submitCount > 0) && formik.errors.picEmail ? "danger" : "default"}
                    isRequired
                    value={formik.values.picEmail}
                  />
                  <DropdownPhone
                    title="PIC Phone Number"
                    placeholder="Input Phone Number"
                    dropdownCountry={formik.values.dropdownCountry}
                    setDropdownCountry={(val) => {
                      formik.setFieldValue("dropdownCountry", val);
                    }}
                    value={formik.values.picPhoneNumber}
                    onChangeInput={(e) => {
                      formik.setFieldValue("picPhoneNumber", e.target.value);
                      formik.setFieldTouched("picPhoneNumber", true, false);
                    }}
                    footer={
                      (formik.touched.picPhoneNumber || formik.submitCount > 0) &&
                        formik.errors.picPhoneNumber
                        ? formik.errors.picPhoneNumber
                        : null
                    }
                    mode={
                      (formik.touched.picPhoneNumber || formik.submitCount > 0) &&
                        formik.errors.picPhoneNumber
                        ? "danger"
                        : "default"
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-black text-lg mt-4">Address Information</p>
              <hr className="text-neutral30 mb-4" />
              <div class="grid grid-cols-3 gap-4 w-full">
                <DropdownText
                  title="Province"
                  placeholder="Select Province"
                  options={provinces?.data?.map(({ name, code }) => ({
                    option: name,
                    value: code,
                  }))}
                  isRequired
                  onSelect={(e) => {
                    formik.setValues({
                      ...formik.values,
                      provinceCode: e.value,
                      cityCode: "",
                      districtCode: "",
                    });
                    formik.setFieldTouched("provinceCode", true, false);
                  }}
                  footer={(formik.touched.provinceCode || formik.submitCount > 0) && formik.errors.provinceCode ? formik.errors.provinceCode : null}
                  mode={(formik.touched.provinceCode || formik.submitCount > 0) && formik.errors.provinceCode ? "danger" : "default"}
                  currentOption={formik.values.provinceCode}
                />
                <DropdownText
                  title="City"
                  placeholder="Select City"
                  options={cities?.data?.map(({ name, code }) => ({
                    option: name,
                    value: code,
                  }))}
                  isRequired
                  onSelect={(e) => {
                    formik.setValues({
                      ...formik.values,
                      cityCode: e.value,
                      districtCode: "",
                    });
                    formik.setFieldTouched("cityCode", true, false);
                  }}
                  footer={(formik.touched.cityCode || formik.submitCount > 0) && formik.errors.cityCode ? formik.errors.cityCode : null}
                  mode={(formik.touched.cityCode || formik.submitCount > 0) && formik.errors.cityCode ? "danger" : "default"}
                  currentOption={formik.values.cityCode}
                />
                <DropdownText
                  title="District"
                  placeholder="Select District"
                  options={districts?.data?.map(({ name, code }) => ({
                    option: name,
                    value: code,
                  }))}
                  isRequired
                  onSelect={(e) => {
                    formik.setFieldValue("districtCode", e.value);
                    formik.setFieldTouched("districtCode", true, false);
                  }}
                  footer={(formik.touched.districtCode || formik.submitCount > 0) && formik.errors.districtCode ? formik.errors.districtCode : null}
                  mode={(formik.touched.districtCode || formik.submitCount > 0) && formik.errors.districtCode ? "danger" : "default"}
                  currentOption={formik.values.districtCode}
                />
              </div>
              <div class="grid grid-cols-3 gap-4 mt-6">
                <div className="col-span-2">
                  <TextInput
                    title="Detail Address"
                    placeholder="Input Detail Address"
                    onChangeInput={(e) => {
                      formik.setFieldValue("detailAddress", e.target.value);
                      formik.setFieldTouched("detailAddress", true, false);
                    }}
                    footer={(formik.touched.detailAddress || formik.submitCount > 0) && formik.errors.detailAddress ? formik.errors.detailAddress : null}
                    mode={(formik.touched.detailAddress || formik.submitCount > 0) && formik.errors.detailAddress ? "danger" : "default"}
                    isRequired
                    value={formik.values.detailAddress}
                  />
                </div>
                <div className="col-span-1">
                  <TextInput
                    title="Postal Code"
                    placeholder="Input Postal Code"
                    onChangeInput={(e) => {
                      formik.setFieldValue("postalCode", e.target.value);
                      formik.setFieldTouched("postalCode", true, false);
                    }}
                    footer={(formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode ? formik.errors.postalCode : null}
                    mode={(formik.touched.postalCode || formik.submitCount > 0) && formik.errors.postalCode ? "danger" : "default"}
                    type="number"
                    isRequired
                    value={formik.values.postalCode}
                  />
                </div>
              </div>
            </div>
            <div className="mb-2">
              <p className="font-semibold text-black text-lg mt-4">Address Information</p>
              <hr className="text-neutral30" />
              <div className="flex justify-between py-4">
                <div class="grid grid-cols-3 gap-4 w-full">
                  <DropdownText
                    title="Bank Name"
                    placeholder="Select Bank Name"
                    options={banks?.data?.map(({ name }) => ({
                      option: name,
                      value: name,
                    }))}
                    isRequired
                    onSelect={(e) => {
                      formik.setFieldValue("bankName", e.value);
                      formik.setFieldTouched("bankName", true, false);
                    }}
                    footer={(formik.touched.bankName || formik.submitCount > 0) && formik.errors.bankName ? formik.errors.bankName : null}
                    mode={(formik.touched.bankName || formik.submitCount > 0) && formik.errors.bankName ? "danger" : "default"}
                    currentOption={formik.values.bankName}
                  />
                  <TextInput
                    title="Account Name"
                    placeholder="Input Account Name"
                    onChangeInput={(e) => {
                      formik.setFieldValue("accountName", e.target.value);
                      formik.setFieldTouched("accountName", true, false);
                    }}
                    footer={(formik.touched.accountName || formik.submitCount > 0) && formik.errors.accountName ? formik.errors.accountName : null}
                    mode={(formik.touched.accountName || formik.submitCount > 0) && formik.errors.accountName ? "danger" : "default"}
                    isRequired
                    value={formik.values.accountName}
                  />
                  <TextInput
                    title="Account Number"
                    placeholder="Input Account Number"
                    onChangeInput={(e) => {
                      formik.setFieldValue("accountNumber", e.target.value);
                      formik.setFieldTouched("accountNumber", true, false);
                    }}
                    footer={(formik.touched.accountNumber || formik.submitCount > 0) && formik.errors.accountNumber ? formik.errors.accountNumber : null}
                    mode={(formik.touched.accountNumber || formik.submitCount > 0) && formik.errors.accountNumber ? "danger" : "default"}
                    type="number"
                    isRequired
                    value={formik.values.accountNumber}
                  />
                  <TextInputMask
                    title="Tax Registration Number"
                    placeholder="Input Tax Registration Number"
                    type="number"
                    onChange={(e) => {
                      const cleanedValue = e.target.value.replace(/_/g, "");
                      formik.setFieldValue("taxRegistrationNumber", cleanedValue);
                      formik.setFieldTouched("taxRegistrationNumber", true, false);
                    }}
                    footer={(formik.touched.taxRegistrationNumber || formik.submitCount > 0) && formik.errors.taxRegistrationNumber ? formik.errors.taxRegistrationNumber : null}
                    mode={(formik.touched.taxRegistrationNumber || formik.submitCount > 0) && formik.errors.taxRegistrationNumber ? "danger" : "default"}
                    isRequired
                    value={formik.values.taxRegistrationNumber}
                  />
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold text-black text-lg mt-4">Document & Photo</p>
              <hr className="text-neutral30" />
              <div className="flex justify-between py-4">
                <div class="grid grid-cols-3 gap-4 w-full">
                  <DropzoneUploadFile
                    title="Corporate Agrement (PKS)"
                    required={true}
                    subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
                    onDrop={onDropFileCorporateAgreement}
                    selectedFile={formik.values.cooperationAgreement}
                    maxFiles={1}
                    error={(formik.touched.cooperationAgreement || formik.submitCount > 0) && formik.errors.cooperationAgreement ? formik.errors.cooperationAgreement : null}
                  />
                  <DropzoneUploadFile
                    title="Nomor Induk Berusaha (NIB)"
                    required={true}
                    subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
                    onDrop={onDropFilenomerIndukBerusaha}
                    selectedFile={formik.values.nomerIndukBerusaha}
                    maxFiles={1}
                    error={(formik.touched.nomerIndukBerusaha || formik.submitCount > 0) && formik.errors.nomerIndukBerusaha ? formik.errors.nomerIndukBerusaha : null}
                  />
                  <DropzoneUploadFile
                    title="CEO Identity Card (KTP)"
                    required={true}
                    subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
                    onDrop={onDropFileKTP}
                    selectedFile={formik.values.kartuTandaPendudukCeo}
                    maxFiles={1}
                    error={(formik.touched.kartuTandaPendudukCeo || formik.submitCount > 0) && formik.errors.kartuTandaPendudukCeo ? formik.errors.kartuTandaPendudukCeo : null}
                  />
                  <DropzoneUploadFile
                    title="Tax Registration Number"
                    required={true}
                    subtitle="Accepts PDF, JPEG, JPG. Max size 5 MB"
                    onDrop={onDropFileTaxRegistration}
                    selectedFile={formik.values.softCopyNpwp}
                    maxFiles={1}
                    error={(formik.touched.softCopyNpwp || formik.submitCount > 0) && formik.errors.softCopyNpwp ? formik.errors.softCopyNpwp : null}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-6">
            <p className="text-black text-lg font-semibold">Client Logo</p>
            <div className="h-px bg-neutral30 mt-2 mb-4"></div>
            <div>
              <DropzoneUploadPhoto
                onDrop={onDropFileClientLogo}
                selectedFile={formik.values.clientLogo}
                title="Upload a photos with minimum resolution 300 x 300 px and maximum 5000 x 5000 px."
                subtitle="Format File PNG, JPEG, or JPG, Maximal File 5 MB"
                required={true}
                error={(formik.touched.clientLogo || formik.submitCount > 0) && formik.errors.clientLogo ? formik.errors.clientLogo : null}
              />
            </div>
          </div>
          <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-6">
            <p className="text-black text-lg font-semibold">Division</p>
            <div className="h-px bg-neutral30 mt-2 mb-4"></div>
            <div>
              <div className="flex justify-between items-center w-full pb-3">
                <div>
                  <SearchDropdown
                    options={dataOptions}
                    placeholderSearch="Search Here"
                    filterDropdown={dataFilterSearch}
                    setFilterDropdown={setDataFilterSearch}
                    filterSearch={dataSearch}
                    setFilterSearch={keywordSearchHandler}
                    onEnterPress={() => { }}
                  />
                </div>
                <PrimaryButton title="+ Add Division" onClick={handleNavigateToAddDivision} />
              </div>
              <div className="drop-shadow">
                <DataTable
                  columns={columns}
                  reRender={reRender}
                  service={GetAllDivisionByClientID}
                  queryName="divisions"
                  dependencies={[id, dataFilterSearch.value, dataSearch]}
                  params={{ id, dataFilter: dataFilterSearch.value, dataSearch }}
                  options={{ pagination: true }}
                  searchKeyword={dataSearch}
                  onClickRow={(id) => handleNavigateDetailDivision(id)}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer
          titleLeftButton="Cancel"
          titleRightButton="Submit"
          modeLeftButton="outline"
          modeRightButton="primary"
          isActiveLeftButton={true}
          isActiveRightButton={true}
          isActive={!nomerIndukBerusahaLoading && !kartuTandaPendudukCeoLoading && !softCopyNpwpLoading && !cooperationAgreementLoading}
          onClickLeftButton={toggleCancelModal}
          onClickRightButton={formik.handleSubmit}
        />
        <ModalState
          title="Do you want to cancel?"
          subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
          isOpen={cancelModalIsOpen}
          onClose={toggleCancelModal}
          type="default"
          titleButtonLeft="Back"
          titleButtonRight="Cancel"
          leftAction={toggleCancelModal}
          rightAction={handleNavigateToDashboardClient}
        />
        <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isLoading || loadingModalIsOpen} onClose={() => { }} />
        <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
        <ModalState
          title="Delete Division"
          subtitle="Are you sure you want to delete this Division?"
          isOpen={deleteDivisionModalIsOpen}
          onClose={toggleDeleteDivisionModal}
          type="danger"
          titleButtonRight="Delete"
          leftAction={toggleDeleteDivisionModal}
          rightAction={handleDeleteDivision}
        />
      </div>
    </>
  );
};

export default EditClient;
