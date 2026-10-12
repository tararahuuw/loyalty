import React, { useCallback, useEffect, useState } from "react";
import { PrimaryButton, ModalResult } from "sprint-asia-custom-component";
import { Plus } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import MyLoyaltyFormModal from "../../components/MyLoyaltyForm/MyLoyaltyFormModal";
import { useFormik } from "formik";
import * as yup from "yup";
import MyLoyaltyCard from "../../components/MyLoyaltyCard/MyLoyaltyCard";
import ResultModal from "../../components/MyLoyaltyForm/ResultModal";
import {
  CheckProjectValidity,
  CreateLoyalty,
  DeleteLoyalty,
  EditLoyalty,
  GetAllLoyalty,
  ToggleStatusLoyalty,
} from "../../service/myLoyaltyManagement/endpoint";
import LoadingModal from "prezent/LoadingModal";
import _ from "lodash";

const DashboardMyLoyalty = ({ userInfo, setTitleHeader, refetchLoyalties }) => {
  const [selectedLoyalty, setSelectedLoyalty] = useState(null);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [input, setInput] = useState("");
  const { isOpen, toggle } = useDisclosure();
  const { isOpen: resultIsOpen, close: closeResult, open: openResult } = useDisclosure();
  const { isOpen: loadingIsOpen, close: closeLoading, open: openLoading } = useDisclosure();
  const { data: loyalties, isLoading } = useFetch(GetAllLoyalty, "loyalties", [], {});
  const { data: validity, isLoading: validationIsLoading } = useFetch(
    input && CheckProjectValidity,
    "validity",
    [input],
    {
      projectName: input,
    }
  );

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResult();
      setTimeout(() => {
        closeResult();
      }, 3500);
    }, 250);
  };

  const handleCreateLoyalty = async (form) => {
    try {
      toggle();
      openLoading();
      await CreateLoyalty(form);
      closeLoading();
      refetchLoyalties();
      setTimeout(() => {
        handleOpenModalResult("success", "Loyalty Program has been successfully created");
      }, 250);
    } catch (error) {
      closeLoading();
      toggle();
      handleOpenModalResult("failed", "Sorry, unable to adding loyalty at the moment. Please try again");
    }
  };

  const handleEditLoyalty = async (form) => {
    try {
      toggle();
      openLoading();
      await EditLoyalty(form);
      closeLoading();
      setSelectedLoyalty(null);
      refetchLoyalties();
      setTimeout(() => {
        handleOpenModalResult("success", "Loyalty Program has been successfully edited");
      }, 250);
    } catch (error) {
      closeLoading();
      toggle();
      handleOpenModalResult("failed", "Sorry, unable to edit loyalty at the moment. Please try again");
    }
  };

  const handleToggleLoyaltyStatus = async (id) => {
    try {
      openLoading();
      await ToggleStatusLoyalty(id);
      closeLoading();
      setSelectedLoyalty(null);
      refetchLoyalties();
      setTimeout(() => {
        handleOpenModalResult("success", "Loyalty Program has been successfully edited");
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to edit loyalty at the moment. Please try again");
    }
  };

  const handleDeleteLoyalty = async (id) => {
    try {
      openLoading();
      const response = await DeleteLoyalty(id);
      closeLoading();
      setSelectedLoyalty(null);
      refetchLoyalties();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          `The loyalty program ${response.data.projectName} has been permanently deleted.`
        );
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to delete loyalty at the moment. Please try again");
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectName: selectedLoyalty?.projectName || "",
      description: selectedLoyalty?.description || "",
      logo: selectedLoyalty?.logoURL || "",
      landingPageURL: selectedLoyalty?.landingPageURL || "",
    },
    validationSchema: yup.object().shape({
      projectName: yup.string().required("Project name is required"),
      description: yup.string().required("Descsription is required"),
      logo: yup
        .mixed()
        .required("Program logo is required")
        .test("fileSize", "File exceeded size limit", (value) => {
          if (typeof value === "string") return true;

          return value && value.size <= 5 * 1024 * 1024;
        }),
      landingPageURL: yup.string().required("Url is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      const formData = new FormData();
      if (selectedLoyalty?.id) {
        formData.append("id", selectedLoyalty.id);
      }

      for (let key in values) {
        // append id if in edit mode

        if (key === "logo") {
          if (typeof values[key] !== "string") {
            formData.append(key, values[key]);
          }
        } else {
          formData.append(key, values[key]);
        }
      }
      if (selectedLoyalty) {
        handleEditLoyalty(formData);
      } else {
        handleCreateLoyalty(formData);
      }
    },
  });

  const handleChangeProjectName = useCallback(
    _.debounce((value) => {
      setInput(value);
    }, 500),
    []
  );

  const onClickEdit = (data) => {
    toggle();
    setSelectedLoyalty(data);
  };

  useEffect(() => {
    if (validity && !validity?.data) {
      formik.setFieldError("landingPageURL", "Project name is invalid please use a different name");
    }
  }, [validity]);

  useEffect(() => {
    formik.setFieldValue(
      "landingPageURL",
      process.env.NODE_ENV === "development"
        ? `http://localhost:3001/${formik.values.projectName.toLowerCase().trim().replace(/\s+/g, "-")}`
        : `https://stagpwa-prezent.sandeza.id/${formik.values.projectName.toLowerCase().trim().replace(/\s+/g, "-")}`
    );
  }, [formik.values.projectName]);

  useEffect(() => {
    setTitleHeader("My Loyalty");
  }, []);
  return (
    <div className="mt-8 px-8 mb-16 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p>
          Create and manage loyalty programs with custom branding and auto-generated landing pages for customer
          registration.
        </p>

        <PrimaryButton
          title={
            <div className="flex items-center gap-1">
              <Plus />
              <p>Add Loyalty Program</p>
            </div>
          }
          onClick={toggle}
        />
      </div>

      {loyalties?.data?.length ? (
        <>
          <div className="flex gap-4 items-center">
            <div className="border border-neutral80 rounded-lg flex flex-col items-center justify-center w-full py-10">
              <p className="text-info500">{loyalties.data.length}</p>
              <p>Total Programs</p>
            </div>

            <div className="border border-neutral80 rounded-lg flex flex-col items-center justify-center w-full py-10">
              <p className="text-secondary500">{loyalties.data.filter((item) => item.status === "Active").length}</p>
              <p>Active Programs</p>
            </div>
          </div>
        </>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        {loyalties?.data?.length
          ? loyalties.data.map((loyalty) => (
              <MyLoyaltyCard
                key={loyalty.id}
                description={loyalty.description}
                id={loyalty.id}
                logoURL={loyalty.logoURL}
                projectName={loyalty.projectName}
                landingPageURL={loyalty.landingPageURL}
                createdDate={loyalty.createdAt}
                status={loyalty.status}
                onClickEdit={onClickEdit}
                onClickToggle={handleToggleLoyaltyStatus}
                onClickDelete={handleDeleteLoyalty}
              />
            ))
          : null}
      </div>

      <MyLoyaltyFormModal
        formik={formik}
        handleClick={formik.handleSubmit}
        onChange={handleChangeProjectName}
        isOpen={isOpen}
        onClose={() => {
          toggle();
          setSelectedLoyalty(null);
        }}
        validating={validationIsLoading}
        disabled={selectedLoyalty?.id}
      />

      <ModalResult isOpen={resultIsOpen} onClose={closeResult} subtitle={dataSubtitleModal} type={flagResult} />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingIsOpen || isLoading}
        onClose={() => {}}
      />
    </div>
  );
};

export default DashboardMyLoyalty;
