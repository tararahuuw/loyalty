import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer, ModalState } from "sprint-asia-custom-component";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import ParameterInformation from "../../../components/ParameterInformation";
import {
  DeleteParameter,
  GetDetailParameter,
  UpdateParameter,
} from "../../../service/settingparametermanagement/endpoint";
import ModalParameter from "../../../components/modal/ModalParameter";
import DetailActivitySection from "../../../components/DetailActivitySection/DetailActivitySection";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";

const DetailParameter = ({ setTitleHeader, loyaltyId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const {
    isOpen: deleteConfirmationIsOpen,
    close: closeDeleteConfirmation,
    open: openDeleteConfirmation,
  } = useDisclosure(false);
  const { isOpen: editFormIsOpen, toggle: toggleForm, open: openEditForm } = useDisclosure(false);
  const { data: parameterDetail, isLoading } = useFetch(id && GetDetailParameter, "detail-parameter", [], id);

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

  const handleEditParameter = async (form) => {
    try {
      openLoading();
      toggleForm();
      await UpdateParameter({ id, myLoyaltyId: loyaltyId, ...form });
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully edited");
        setTimeout(() => {
          navigate("/loyaltypoint/setting/parameter");
        }, 1500);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to edit parameter data at the moment. Please try again");
    }
  };

  const handleDeleteParameter = async () => {
    try {
      openLoading();
      closeDeleteConfirmation();
      await DeleteParameter(id);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully deleted");
        setTimeout(() => {
          navigate("/loyaltypoint/setting/parameter");
        }, 1500);
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to delete parameter at the moment. Please try again");
    }
  };

  useEffect(() => {
    setTitleHeader("Detail Parameter");
  }, []);
  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          <div className="mb-6">
            <ParameterInformation parameterDetail={parameterDetail?.data} />

            <DetailActivitySection parameterDetail={parameterDetail?.data} />
          </div>
        </div>

        <Footer
          modeLeftButton="danger"
          titleLeftButton={
            <span className="flex items-center gap-2">
              <PiTrash size="24" className="text-white" />
              Delete
            </span>
          }
          titleRightButton={
            <span className="flex items-center gap-2">
              <PiNotePencil size="24" className="text-primary500" />
              Edit
            </span>
          }
          isActiveLeftButton
          isActiveRightButton
          onClickLeftButton={openDeleteConfirmation}
          onClickRightButton={openEditForm}
        />
      </div>

      <ModalState
        title="Confirm Deletion"
        subtitle={
          <span>
            Are you sure you want to delete parameter{" "}
            <span
              className="font-bold"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {parameterDetail?.data?.parameterName}
            </span>
            ? This action cannot be undone.
          </span>
        }
        isOpen={deleteConfirmationIsOpen}
        onClose={closeDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <span className="flex items-center gap-2">
            <PiTrash size="24" className="text-white" />
            Delete Parameter
          </span>
        }
        leftAction={closeDeleteConfirmation}
        rightAction={handleDeleteParameter}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={isLoading || loadingModalIsOpen}
        onClose={() => { }}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

      <ModalParameter
        title="Edit parameter"
        onSubmit={handleEditParameter}
        selectedParameter={parameterDetail?.data}
        setSelectedParameter={() => { }}
        isOpen={editFormIsOpen}
        onClose={toggleForm}
      />
    </>
  );
};

export default DetailParameter;
