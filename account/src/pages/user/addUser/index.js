import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import {
  Alert,
  ModalState,
  TextInput,
  Footer,
  DropdownText,
  ModalLoading,
  ModalResult,
  DropdownPhone
} from "sprint-asia-custom-component";
import { GetAllRoleBySystemAdministration } from "../../../service/usermanagement/endpoint";
import { useFetch } from "prezent/useFetch";
import { CreateNewUser, GetAllClient } from "../../../service/usermanagement/endpoint/user";
import { GetAllDivisionByClientId } from "../../../service/usermanagement/endpoint/division";
import SwitchStatus from "../../../components/User/UserForm/SwitchStatus/SwitchStatus";
import { useDisclosure } from "prezent/useDisclosure";

const AddUser = ({ roleAccess, setTitleHeader }) => {
  const navigateTo = useNavigate();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: confirmationModalIsOpen, toggle: toggleConfirmationModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const { data: clients, isLoading: clientIsLoading } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: roles, isLoading: roleIsLoading } = useFetch(GetAllRoleBySystemAdministration, "roles", [], {
    roleAccess,
  });

  const handleToggle = () => {
    // Toggle the checked state
    setIsChecked((prevState) => {
      if (!prevState) {
        return true;
      } else {
        return false;
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
      }, 1000);
    }, 250);
  }

  function handleNavigateToAddClient() {
    navigateTo("/prezent/account/client/add");
  }

  function handleNavigateToAddDivision() {
    navigateTo("/prezent/account/division/add");
  }

  function handleNavigateToDashboardUser() {
    navigateTo("/prezent/account/user");
  }

  const submitNewUser = async (form) => {
    try {
      toggleLoadingModal();
      const fullPhoneNumber = `${formik.values.dropdownCountry.option}${formik.values.phoneNumber}`;
      form.phoneNumber = fullPhoneNumber;
      if (roleAccess !== "Client Administrator") {
        await CreateNewUser(roleAccess, { ...form, isActive: isChecked });
      } else {
        await CreateNewUser(roleAccess, form);
      }
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          "Successfully added user Role! Please check the user's email to set a password"
        );
        setTimeout(() => {
          handleNavigateToDashboardUser();
        }, 1500);
      }, 250);
    } catch (error) {
      if (error?.response?.data?.code === 409) {
        const fieldError = error?.response?.data?.data?.split(" ")[0];
        if (fieldError === "Email") {
          formik.setFieldError("email", "Email already registered");
        } else if (fieldError === "Phone") {
          formik.setFieldError("phoneNumber", "Phone number already registered");
        }
      }
      console.log("error submit client", error)
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to added user at the moment. Please refresh the page and try again"
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      roleId: "",
      divisionId: null,
      clientId: null,
      fullName: "",
      email: "",
      phoneNumber: "",
      dropdownCountry: {
        option: "+62",
        value: "id",
        label: "Indonesia"
      },
    },
    validationSchema: yup.object().shape({
      roleId: yup.string().required("Role is required"),
      divisionId: yup.string().nullable(),
      clientId: yup.string().nullable(),
      fullName: yup
        .string()
        .min(10, "Full name must be between 10 and 20 characters long")
        .max(20, "Full name must be between 10 and 20 characters long")
        .required("Full name is required")
        .test("no-numbers", "Full name must contain alphabets", (value) => !/\d/.test(value))
        .test(
          "no-special-chars",
          "Full name must contain alphabets",
          (value) => !/[@#%$^&*(){}\[\];'".,?!+=-]/.test(value)
        ),
      email: yup
        .string()
        .min(10, "Email must be between 10 and 50 characters long")
        .max(50, "Email must be between 10 and 50 characters long")
        .test("no-spaces", "PIC email cannot contain spaces", (value) => !/\s/.test(value))
        .matches(
          /^[a-zA-Z0-9](?!.*\.\.)[a-zA-Z0-9._%+-]*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/,
          "Please use a valid email format"
        )
        .required("Email is required"),
      phoneNumber: yup
        .string()
        .required("Phone number is required")
        .test(
          'is-valid-length',
          'Phone number length is not valid',
          function (value) {
            if (!value) return false;
            const cleaned = value.replace(/\D/g, '');
            return cleaned.length >= 6 && cleaned.length <= 15;
          }
        ),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      submitNewUser(values);
    },
  });

  const { data: divisions, isLoading: divisionIsLoading } = useFetch(
    formik.values.clientId && GetAllDivisionByClientId,
    "divisions",
    [],
    {
      clientId: formik.values.clientId,
    }
  );

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleConfirmationModal();
    } else {
      handleNavigateToDashboardUser();
    }
  };

  useEffect(() => {
    setTitleHeader("Add User");
  }, []);
  return (
    <div>
      <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
        <Alert
          title="Client & Division Reminder"
          subtitle="Please ensure you have created the appropriate Client and division for the user before proceeding."
          titleLeftButton="Add Client"
          titleRightButton="Add Division"
          onClickLeftButton={handleNavigateToAddClient}
          onClickRightButton={handleNavigateToAddDivision}
        />

        {roleAccess !== "Client Administrator" && <SwitchStatus handleToggle={handleToggle} isChecked={isChecked} />}

        <form className="flex flex-col gap-7 bg-white rounded-lg border border-neutral40 shadow-md p-6">
          <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
            User Information
          </div>

          <div className="grid grid-cols-3 gap-6">
            <TextInput
              title="Full Name"
              placeholder="Input Full Name"
              value={formik.values.fullName}
              isRequired
              onChangeInput={(e) => {
                formik.setFieldValue("fullName", e.target.value);
                formik.setFieldTouched("fullName", true, false);
              }}
              footer={(formik.touched.fullName || formik.submitCount > 0) && formik.errors.fullName ? formik.errors.fullName : null}
              mode={(formik.touched.fullName || formik.submitCount > 0) && formik.errors.fullName ? "danger" : "default"}
            />
            <TextInput
              title="Email"
              placeholder="Input Email"
              value={formik.values.email}
              isRequired
              onChangeInput={(e) => {
                formik.setFieldValue("email", e.target.value);
                formik.setFieldTouched("email", true, false);
              }}
              footer={(formik.touched.email || formik.submitCount > 0) && formik.errors.email ? formik.errors.email : null}
              mode={(formik.touched.email || formik.submitCount > 0) && formik.errors.email ? "danger" : "default"}
            />
            <DropdownPhone
              title="Phone Number"
              placeholder="Input Phone Number"
              dropdownCountry={formik.values.dropdownCountry}
              setDropdownCountry={(val) => {
                formik.setFieldValue("dropdownCountry", val);
              }}
              value={formik.values.phoneNumber}
              onChangeInput={(e) => {
                formik.setFieldValue("phoneNumber", e.target.value);
                formik.setFieldTouched("phoneNumber", true, false);
              }}
              footer={
                (formik.touched.phoneNumber || formik.submitCount > 0) &&
                  formik.errors.phoneNumber
                  ? formik.errors.phoneNumber
                  : null
              }
              mode={
                (formik.touched.phoneNumber || formik.submitCount > 0) &&
                  formik.errors.phoneNumber
                  ? "danger"
                  : "default"
              }
            />
            <DropdownText
              title="Client"
              placeholder="Select Client"
              options={clients?.data?.map(({ name, id }) => ({
                option: name,
                value: id,
              }))}
              isRequired={false}
              currentOption={formik.values.clientId}
              onSelect={(e) => {
                formik.setFieldValue("clientId", e.value);
                formik.setFieldTouched("clientId", true, false);
              }}
              footer={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? formik.errors.clientId : null}
              mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}
            />

            <DropdownText
              title="Division"
              placeholder="Select Division"
              options={divisions?.data?.map(({ name, id }) => ({
                option: name,
                value: id,
              }))}
              isRequired={false}
              currentOption={formik.values.divisionId}
              onSelect={(e) => {
                formik.setFieldValue("divisionId", e.value);
                formik.setFieldTouched("divisionId", true, false);
              }}
              footer={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? formik.errors.divisionId : null}
              mode={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? "danger" : "default"}
            />

            <DropdownText
              title="Role"
              placeholder="Select Role"
              options={roles?.data?.map(({ name, id }) => ({
                option: name,
                value: id,
              }))}
              isRequired
              currentOption={formik.values.roleId}
              onSelect={(e) => {
                formik.setFieldValue("roleId", e.value);
                formik.setFieldTouched("roleId", true, false);
              }}
              footer={(formik.touched.roleId || formik.submitCount > 0) && formik.errors.roleId ? formik.errors.roleId : null}
              mode={(formik.touched.roleId || formik.submitCount > 0) && formik.errors.roleId ? "danger" : "default"}
            />
          </div>
        </form>
      </div>

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        isActive
        onClickLeftButton={handleCancelButton}
        onClickRightButton={formik.handleSubmit}
      />

      <ModalState
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationModalIsOpen}
        onClose={toggleConfirmationModal}
        type="default"
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleConfirmationModal}
        rightAction={handleNavigateToDashboardUser}
      />
      <ModalLoading
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingModalIsOpen || clientIsLoading || roleIsLoading || divisionIsLoading}
        onClose={() => { }}
      />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
    </div>
  );
};

export default AddUser;
