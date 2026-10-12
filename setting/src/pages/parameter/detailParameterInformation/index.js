import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, ModalLoading, ModalState, ModalResult } from "sprint-asia-custom-component";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import ParameterInformationDetail from "../../../components/ParameterInformationDetail";
import { DeleteParameterInformation, GetDetailParameterInformation, UpdateParameterInformation } from "../../../service/settingparametermanagement/endpoint";
import { formatDate } from "../../../utils"
import ModalParameter from "../../../components/modal/ModalParameter";
import LoadingModal from "prezent/LoadingModal";

const DetailParameterInformation = ({ setTitleHeader, formik }) => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [dataCurrentID, setDataCurrentID] = useState();
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [flagResult, setFlagResult] = useState("success");
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: editModalParameterInformationIsOpen, toggle: toggleEditModalParameterInformation } = useDisclosure(false);
    const { isOpen: deleteModalParameterInformationIsOpen, toggle: toggleDeleteModalParameterInformation } = useDisclosure(false);
    const [parameterName, setParameterName] = useState("");
    const [dataParameter, setDataParameter] = useState([]);

    useEffect(() => {
        setTitleHeader("Detail Parameter");
        FetchDetailParameterInformation();
    }, []);

    const [reRender, setReRender] = useState(false);

    const navigateTo = useNavigate();

    function handleNavigateToDashboardParameterInformation() {
        navigateTo(`/prezent/setting/parameter`);
    }

    const FetchDetailParameterInformation = async () => {
        try {
            toggleLoadingModal();
            const response = await GetDetailParameterInformation({ id });
            setData(response.data);
            setParameterName(response.data.parameterName);
        } catch (error) {
            console.error("Error fetching detail parameter:", error);
        } finally {
            toggleLoadingModal();
        }
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

    function handleEditDataParameterInformationModal(selectedData) {
        setDataParameter(selectedData)
        toggleEditModalParameterInformation();
    }

    function handleCloseModalEditParameterInformation() {
        toggleEditModalParameterInformation(false);
    }

    function handleDeleteDataParameterInformation(index) {
        toggleDeleteModalParameterInformation()
        setDataCurrentID(index);
    }

    function handleCloseModalDeleteParameterInformation() {
        toggleDeleteModalParameterInformation(false);
    }

    function handleCloseModalDelete() {
        setModalDelete(false);
    }

    async function handleEditParameterInformation(values, dataCurrentID) {
        try {
            const editParameter = {
                id: dataCurrentID,
                parameterName: values.parameterName,
                type: values.type.toLowerCase(),
            };

            if (values.type === "Status") {
                editParameter.status = values.status.map(item => ({
                    status: item.value
                }));
            }

            toggleLoadingModal(true);
            handleCloseModalEditParameterInformation();
            await UpdateParameterInformation({ body: editParameter });
            setReRender(!reRender);
            toggleLoadingModal(false);
            handleOpenModalResult("success", "Parameter data has been successfully edited.");
            setTimeout(() => {
                handleNavigateToDashboardParameterInformation();
            }, 1500);
        } catch (error) {
            toggleLoadingModal(false);
            handleOpenModalResult("failed", "Sorry, unable to edit parameter at the moment. Please try again");
        }
    };

    async function handleDeleteParameterInformation() {
        try {
            toggleLoadingModal(true);
            handleCloseModalDeleteParameterInformation();
            await DeleteParameterInformation(dataCurrentID);
            setReRender(!reRender);
            toggleLoadingModal(false);
            handleOpenModalResult("success", "Parameter has been successfully deleted.");
            setTimeout(() => {
                handleNavigateToDashboardParameterInformation();
            }, 1500);
        } catch (error) {
            toggleLoadingModal(false);
            handleOpenModalResult("failed", "Sorry, unable to delete parameter at the moment. Please try again");
        }
    }

    return (
        <>
            <div className='flex-1 h-full overflow-y-auto bg-neutral20'>
                <div className='py-6 px-8 mb-16'>
                    <div className="mb-6">
                        <div className="container mx-auto p-4">
                            {data && (
                                <>
                                    <ParameterInformationDetail
                                        type="parameter"
                                        title="Parameter Information"
                                        keyName={data.parameterName}
                                        statusType={data.type}
                                        statuses={Array.isArray(data.status) ? data.status : ['-']}
                                    />

                                    <ParameterInformationDetail
                                        type="activity"
                                        title="Detail Activity"
                                        createdBy={{ name: data.createdByName, date: formatDate(data.createdAt) }}
                                        lastEditedBy={{ name: data.updatedByName ? data.updatedByName : data.createdByName, date: formatDate(data.updatedAt) || "-" }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <Footer
                    modeLeftButton="danger"
                    titleLeftButton={
                        <div className="flex items-center gap-2">
                            <PiTrash size="24" className="text-white" />
                            Delete
                        </div>
                    }
                    titleRightButton={
                        <div className="flex items-center gap-2">
                            <PiNotePencil size="24" className="text-primary500" />
                            Edit
                        </div>
                    }
                    isActiveLeftButton
                    isActiveRightButton
                    onClickLeftButton={() => handleDeleteDataParameterInformation(id)}
                    onClickRightButton={() => handleEditDataParameterInformationModal(data)}
                />
            </div>

            <ModalParameter
                title="Edit Parameter"
                subtitle=""
                formik={formik}
                isOpen={editModalParameterInformationIsOpen}
                onClose={toggleEditModalParameterInformation}
                type="default"
                titleButtonRight="Submit"
                titleButtonLeft="Cancel"
                leftAction={toggleEditModalParameterInformation}
                rightAction={(values) => handleEditParameterInformation(values, dataParameter.id)}
                addition="input"
                mode="edit"
                initialValues={dataParameter}
            />

            <ModalState
                title="Confirm Deletion"
                subtitle={`Are you sure you want to delete the Parameter: ${parameterName}? This action cannot be undone.`}
                isOpen={deleteModalParameterInformationIsOpen}
                onClose={toggleDeleteModalParameterInformation}
                type="danger"
                titleButtonRight="Delete"
                leftAction={toggleDeleteModalParameterInformation}
                rightAction={handleDeleteParameterInformation}
            />

            <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

            <LoadingModal
                title="Loading..."
                subtitle="Please wait a moment"
                isOpen={loadingModalIsOpen}
                onClose={() => {}}
            />
        </>
    );
};

export default DetailParameterInformation;
