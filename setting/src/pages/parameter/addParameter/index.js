import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { Footer, ModalState, ModalResult, ModalLoading } from "sprint-asia-custom-component";
import LoadingModal from "prezent/LoadingModal";
import BasicInformationSection from "../../../components/BasicInformationSection";
import { useDisclosure } from "prezent/useDisclosure";
import ParameterInformation from "../../../components/ParameterInformation";
import { CreateNewParameter } from "../../../service/settingparametermanagement/endpoint";

const AddParameter = ({ roleAccess, clientId, setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [localParameters, setLocalParameters] = useState([]);
  const [reRender, setReRender] = useState(false);

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

  function handleNavigateToDashboardParameter() {
    navigateTo("/prezent/setting/parameter");
  }

  function handleNavigateToDashboardAddParameter() {
    navigateTo(`/prezent/setting/parameter`);
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      clientId: "",
      parameter: localParameters,
    },
    validationSchema: yup.object().shape({
      clientId: yup.string().required("Client is required"),
    }),
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      try {
        const requestBody = {
          clientId: values.clientId,
          parameter: localParameters,
        };

        toggleLoadingModal(true);
        await CreateNewParameter({ body: requestBody });
        setReRender(!reRender);
        toggleLoadingModal(false);
        handleOpenModalResult("success", "Your parameter data has been successfully added.");
        setTimeout(() => {
          handleNavigateToDashboardParameter();
        }, 1500);
      } catch (error) {
        toggleLoadingModal(false);
        handleOpenModalResult("failed", "Sorry, unable to adding parameter at the moment. Please try again");
      }
    },
  });

  useEffect(() => {
    setTitleHeader("Add Parameter");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          <div className="mb-6">
            <BasicInformationSection roleAccess={roleAccess} formik={formik} dropdownEdit={true} isAdd={true} />
            <ParameterInformation
              roleAccess={roleAccess}
              formik={formik}
              setLocalParameters={setLocalParameters}
              localParameters={localParameters}
              clientId={clientId}
              isDetail={false}
              isAdd={false}
              idLocal={false}
            />
          </div>
        </div>
        <Footer
          titleLeftButton="Cancel"
          titleRightButton="Submit"
          modeLeftButton="outline"
          modeRightButton="primary"
          isActiveLeftButton={true}
          isActiveRightButton={true}
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
          rightAction={handleNavigateToDashboardAddParameter}
        />

        <ModalLoading
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClose={() => {}}
        />

        <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
      </div>
    </>
  );
};

export default AddParameter;
