import React, { useState, useEffect } from "react";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
    Footer,
    ModalState,
    ModalLoading,
    ModalResult,
} from "sprint-asia-custom-component";
import BasicInformationSection from "../../../components/BasicInformationSection";
import { useDisclosure } from "prezent/useDisclosure";
import ParameterInformation from "../../../components/ParameterInformation";
import { UpdateParameter } from "../../../service/settingparametermanagement/endpoint";

const EditParameter = ({ roleAccess, clientId, setTitleHeader }) => {
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
    const [flagResult, setFlagResult] = useState("success");
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [localParameters, setLocalParameters] = useState([]);
    const { id } = useParams();
    const [reRender, setReRender] = useState(false);
    const [selectedClientId, setSelectedClientId] = useState("");

    const navigateTo = useNavigate();

    function handleNavigateToDashboardParameter() {
        navigateTo("/prezent/setting/parameter");
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

    const handleClientIdChange = (newClientId) => {
        setSelectedClientId(newClientId);
        formik.setFieldValue("clientId", newClientId);
    };

    const prepareDataForBackend = (parameters) => {
        return parameters.map(param => {
            if (param.id?.includes("-")) {
                const { id, ...newParam } = param;
                return newParam;
            }
            return param;
        });
    };

    const getCleanedParametersForSubmit = (params) => {
        return params.filter(param => {
            const isDefault = param.settingParameterId === "";
            return !isDefault;
        });
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            clientId: "",
            parameter: localParameters,
        },
        validationSchema: yup.object().shape({
            clientId: yup
                .string()
        }),
        onSubmit: async (values) => {
            try {
                const filteredParameters = getCleanedParametersForSubmit(localParameters);
                const cleanedParameters = prepareDataForBackend(filteredParameters);

                const requestBody = {
                    id: id,
                    clientId: values.clientId || selectedClientId,
                    parameter: cleanedParameters,
                };

                toggleLoadingModal(true);

                await UpdateParameter({ id: id, body: requestBody });
                setReRender(!reRender);
                toggleLoadingModal(false);
                handleOpenModalResult("success", "Parameter has been successfully edited.");
                setTimeout(() => {
                    handleNavigateToDashboardParameter();
                }, 1500);
            } catch (error) {
                handleOpenModalResult("failed", "Sorry, unable to edit parameter at the moment. Please try again");
            } finally {
                toggleLoadingModal();
            }
        },
    });

    useEffect(() => {
        setTitleHeader("Edit Parameter");
    }, []);

    return (
        <>
            <div className='flex-1 h-full overflow-y-auto bg-neutral20'>
                <div className='py-6 px-8 mb-16'>
                    <div className="mb-6">
                        <BasicInformationSection
                            roleAccess={roleAccess}
                            formik={formik}
                            isEdit={true}
                            onClientIdChange={handleClientIdChange}
                        />
                        <ParameterInformation
                            roleAccess={roleAccess}
                            formik={formik}
                            setLocalParameters={setLocalParameters}
                            localParameters={localParameters}
                            isDetail={false}
                            isEdit={true}
                            isEditLocalParameter={true}
                            idLocal={true}
                        />

                    </div>
                </div>
                <Footer
                    titleLeftButton='Cancel'
                    titleRightButton='Submit'
                    modeLeftButton="outline"
                    modeRightButton="primary"
                    isActiveLeftButton={true}
                    isActiveRightButton={true}
                    onClickLeftButton={toggleCancelModal}
                    onClickRightButton={formik.handleSubmit}
                />
                <ModalState
                    title="Do you want to cancel?"
                    subtitle={"The information you filled in has not been saved and will be lost if you cancel this process."}
                    isOpen={cancelModalIsOpen}
                    onClose={toggleCancelModal}
                    type='default'
                    titleButtonLeft='Back'
                    titleButtonRight='Cancel'
                    leftAction={toggleCancelModal}
                    rightAction={() => {
                        handleNavigateToDashboardParameter()
                    }}
                />
                <ModalLoading
                    title="Loading..."
                    subtitle="Please wait a moment"
                    isOpen={loadingModalIsOpen}
                    onClose={() => {}}
                />
                <ModalResult
                    subtitle={dataSubtitleModal}
                    type={flagResult}
                    isOpen={isModalOpenResult}
                />
            </div>

        </>
    );
};

export default EditParameter;