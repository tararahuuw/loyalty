import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useFormik } from "formik";
import * as yup from "yup";

import { ModalLoading, ModalResult, Footer, ModalState } from "sprint-asia-custom-component";

import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import StatusSection from "../../../components/IntegrationForm/StatusSection/StatusSection";
import ClientInformationSection from "../../../components/IntegrationForm/ClientInformationSection/ClientInformationSection";
import IntegrationInformationSection from "../../../components/IntegrationForm/IntegrationInformationSection/IntegrationInformationSection";
import {
  GetAllClient,
  GetAllDivisionByClientId,
  GetIntegrationById,
  EditIntegration as EditIntegrationService,
  GetDivisionById,
  GetClientById,
  ApproveIpAddress,
  GetAllIpAddress,
} from "../../../service/settingmanagement/endpoint";

import { isIP, isURL } from "../../../utils";

const EditIntegration = ({ roleAccess, setTitleHeader, clientId, divisionId }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isChecked, setIsChecked] = useState(true);
  const [ipAddresses, setIpAddresses] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDivision, setSelectedDivision] = useState("");
  const [divisionIsChanged, setDivisionIsChanged] = useState(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, toggle: toggleConfirmation } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [divisionIdFromIntegration, setDivisionIdFromIntegration] = useState("");
  const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
  const { data: divisionClient } = useFetch(GetAllClient, "divisionClient", [], { roleAccess });
  const { data } = useFetch(GetIntegrationById, "integration", [], { roleAccess, integrationId: id });
  useEffect(() => {
    if (data?.data?.division_id) {
      setDivisionIdFromIntegration(data.data.division_id);
    }
  }, [data]);

  const { data: integrationAddresses, refetch } = useFetch(
    GetAllIpAddress,
    "ipAddresses",
    [],
    divisionIdFromIntegration
      ? {
        roleAccess,
        integrationId: id || integrationId,
        clientId: clientId,
        divisionId: divisionIdFromIntegration,
      }
      : null
  );

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

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  };

  const handleNavigateToIntegrationDashboard = () => {
    navigateTo("/prezent/setting/integration");
  };

  const submitIntegration = async (form) => {
    try {
      toggleLoadingModal();
      const response = await EditIntegrationService(roleAccess, form);
      if (response.code === 200) {
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", "Integration has been successfully editted");
          setTimeout(() => {
            handleNavigateToIntegrationDashboard();
          }, 1500);
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to create integration at the moment. Please try again");
    }
  };

  const approveOrRejectIpAddress = async (data) => {
    try {
      toggleLoadingModal();
      const response = await ApproveIpAddress(roleAccess, data);
      if (response.code === 200) {
        refetch();
        toggleLoadingModal();
        setTimeout(() => {
          handleOpenModalResult("success", `Integration has been successfully ${data.status.toLowerCase()}`);
        }, 250);
      }
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        `Sorry, we are unable to ${data.status === "Approved" ? "approve" : "reject"
        } integration at the moment. Please try again`
      );
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientId: data?.data?.client_id || "",
      divisionId: data?.data?.division_id || "",
      urlCallback: data?.data?.url_callback || "",
      description: data?.data?.description || "",
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
      divisionId: yup.string().required("Division is required"),
      urlCallback: yup
        .string()
        .required("URL Callback is required")
        .test("isURL", "URL Callback must a valid URL.", (value) => isURL(value)),
      description: yup.string().required("Description is required").max(100, "100 characters maximum"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (values) => {
      submitIntegration({
        id: id,
        status: isChecked,
        clientId: values.clientId,
        divisionId: values.divisionId,
        urlCallback: values.urlCallback,
        description: values.description,
        ipAddress: ipAddresses.map((address) => address.ipAddress),
      });
    },
  });

  const ipFormik = useFormik({
    initialValues: {
      ipAddress: "",
    },
    validationSchema: yup.object().shape({
      ipAddress: yup.string().test("isIP", "Must be a valid IPv4 or IPv6 address", (value) => isIP(value)),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: (value, { resetForm }) => {
      setIpAddresses((prevIP) => {
        return [...prevIP, value];
      });
      resetForm();
    },
  });

  const { data: divisions } = useFetch(
      roleAccess === "System Administrator" && formik.values.clientId ? GetAllDivisionByClientId : null,
      "divisions",
      [],
      {
        roleAccess,
        clientId: formik.values.clientId,
      }
    );

  const { data: client } = useFetch(data?.data?.client_id && GetClientById, "client", [], {
    clientId: data?.data?.client_id,
  });

  const { data: division } = useFetch(data?.data?.division_id && GetDivisionById, "division", [], {
    divisionId: data?.data?.division_id,
  });

  const handleCancelButton = () => {
    if (formik.dirty) {
      toggleCancelModal();
    } else {
      handleNavigateToIntegrationDashboard();
    }
  };

  const handleConfirmConfirmationModal = () => {
    if (!divisionIsChanged) {
      formik.setFieldValue("clientId", selectedClient);
    }
    formik.setFieldValue("divisionId", selectedDivision);
    formik.setFieldValue("urlCallback", "");
    formik.setFieldValue("description", "");
    setSelectedClient("");
    setSelectedDivision("");
    setIpAddresses([]);
    toggleConfirmation();
    setDivisionIsChanged(false);
  };

  useEffect(() => {
    if (integrationAddresses?.data?.length) {
      const transformedArray = integrationAddresses?.data?.map((item) => ({
        id: item.id,
        ipAddress: item.ip_address,
        status: item.status,
        reason: item.reason,
      }));
      setIpAddresses(transformedArray);
    } else {
      setIpAddresses([]);
    }
  }, [integrationAddresses?.data]);

  useEffect(() => {
    setIsChecked(data?.data?.status);
  }, [data?.data?.status]);

  useEffect(() => {
    setTitleHeader("Edit Integration");
  }, []);
  return (
    <>
      <div>
        <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
          {roleAccess !== "Client Administrator" && roleAccess !== "Client Support" && (
            <StatusSection handleToggle={handleToggle} isChecked={isChecked} />
          )}

          {roleAccess !== "Client Support" && (
            <ClientInformationSection
              formik={formik}
              clients={clients}
              currentClient={client}
              divisions={roleAccess === 'System Administrator' ? divisions : divisionClient}
              currentDivision={division}
              ipAddresses={ipAddresses}
              toggleConfirmation={toggleConfirmation}
              setSelectedClient={setSelectedClient}
              setSelectedDivision={setSelectedDivision}
              setDivisionIsChanged={setDivisionIsChanged}
              roleAccess={roleAccess}
            />
          )}
          <IntegrationInformationSection
            data={data}
            formik={formik}
            ipFormik={ipFormik}
            ipAddresses={ipAddresses}
            setIpAddresses={setIpAddresses}
            onClickHandler={approveOrRejectIpAddress}
            isChecked={isChecked}
            refetch={refetch}
            roleAccess={roleAccess}
          />
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
      </div>

      <ModalState
        title="Confirmation"
        subtitle={`Are you sure you want to change the ${divisionIsChanged ? "division" : "client"
          } ? However, your action would be to remove your data input`}
        isOpen={confirmationIsOpen}
        onClose={toggleConfirmation}
        titleButtonRight="Yes, sure"
        leftAction={toggleConfirmation}
        rightAction={handleConfirmConfirmationModal}
      />

      <ModalState
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={cancelModalIsOpen}
        onClose={toggleCancelModal}
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={toggleCancelModal}
        rightAction={handleNavigateToIntegrationDashboard}
      />

      <ModalResult
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={toggleResultModal}
      />
    </>
  );
};

export default EditIntegration;
