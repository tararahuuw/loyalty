import React, { useEffect, useState } from "react";
import { Alert, EmptyData, PrimaryButton, ModalResult, ModalState } from "sprint-asia-custom-component";
import { Plus, Trash } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import {
  DeleteLoyalty,
  GetAllLoyalty,
  ToggleStatusLoyalty,
} from "../../service/programmanagement/endpoint";
import LoadingModal from "prezent/LoadingModal";
import _ from "lodash";
import MyLoyaltyCard from "./MyLoyaltyCard/MyLoyaltyCard";
import MyLoyaltyFormModal from "./MyLoyaltyForm/MyLoyaltyFormModal";

const ProgramSection = ({ setTitleHeader, roleAccess }) => {
  const [selectedLoyalty, setSelectedLoyalty] = useState(null);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const { isOpen, toggle } = useDisclosure();
  const { isOpen: IsOpenDelete, toggle: toggleDelete } = useDisclosure();
  const { isOpen: IsOpenStatus, toggle: toggleStatus } = useDisclosure();
  const { isOpen: loadingIsOpen, close: closeLoading, open: openLoading } = useDisclosure();
  const { data: loyalties, isLoading, refetch } = useFetch(GetAllLoyalty, "loyalties", [], {});

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

  const handleToggleLoyaltyStatus = async (id) => {
    try {
      openLoading();
      toggleStatus()
      await ToggleStatusLoyalty(id);
      refetch();
      closeLoading();
      setSelectedLoyalty(null);
      setTimeout(() => {
        handleOpenModalResult("success", selectedLoyalty?.status ? "Program has been successfully deactivated. It is now unavailable within the platform." : "Program has been successfully activated. It is now available within the platform.");
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", selectedLoyalty?.status ? "Failed to deactivate program. Please try again." : "Failed to activate program. Please try again.");
    }
  };

  const handleDeleteLoyalty = async (id) => {
    try {
      openLoading();
      toggleDelete()
      const response = await DeleteLoyalty(id);
      closeLoading();
      refetch();
      setSelectedLoyalty(null);
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          `Program has been successfully deleted and removed from the platform. The associated landing page URL is no longer accessible.`
        );
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Failed to delete program. Please try again.");
    }
  };

  const onClickEdit = (data) => {
    toggle();
    setSelectedLoyalty(data);
  };

  useEffect(() => {
    setTitleHeader("Program");
  }, []);
  return (
    <div className="mt-8 px-8 mb-16 flex flex-col gap-4">
      <Alert
        subtitle={
          <p>This menu allows the creation and management of <span className="font-semibold">loyalty programs</span> with custom branding. <span className="font-semibold">Auto-generated landing pages</span> support seamless customer enrollment and engagement within the platform.</p>
        }
      />
      <div className="flex gap-4 items-center">
        <div className="border border-neutral40 bg-white rounded-lg flex flex-col items-center justify-center w-full py-10">
          <p className="text-info500">{loyalties?.data?.length ? loyalties?.data?.length.toLocaleString("id") : 0}</p>
          <p>Total Programs</p>
        </div>

        <div className="border border-neutral40 bg-white rounded-lg flex flex-col items-center justify-center w-full py-10">
          <p className="text-secondary500">{loyalties?.data ? loyalties?.data?.filter(item => item.status === true).length.toLocaleString("id") : 0}</p>
          <p>Active Programs</p>
        </div>
      </div>

      <div className="bg-white border border-neutral40 rounded-lg p-4">
        <div className="flex justify-end items-center mb-4">
          <PrimaryButton
            title={
              <div className="flex items-center gap-1">
                <Plus />
                <p>Add Program</p>
              </div>
            }
            onClick={toggle}
          />
        </div>
        {loyalties?.data?.length
          ?
          <div className="grid grid-cols-3 gap-4">
            {
              loyalties.data.map((loyalty) => (
                <MyLoyaltyCard
                  item={loyalty}
                  handleEditById={() => onClickEdit(loyalty)}
                  handleDelete={() => {
                    setSelectedLoyalty(loyalty)
                    toggleDelete()
                  }}
                  handleChangeStatus={() => {
                    setSelectedLoyalty(loyalty)
                    toggleStatus()
                  }}
                  roleAccess={roleAccess}
                />
              ))
            }
          </div>
          :
          <div className="flex items-center justify-center p-4">
            <EmptyData />
          </div>
        }
      </div>

      <MyLoyaltyFormModal
        isOpen={isOpen}
        onClose={() => {
          toggle();
        }}
        onOpen={toggle}
        setSelectedLoyalty={setSelectedLoyalty}
        selectedLoyalty={selectedLoyalty}
        refetch={refetch}
      />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingIsOpen || isLoading}
        onClose={() => { }}
      />

      <ModalState
        title="Delete Program?"
        subtitle={
          <p>
            Are you sure you want to delete this program? This action cannot be undone.<br /><span className="font-semibold">Note:</span> The associated landing page URL will no longer be accessible.
          </p>
        }
        isOpen={IsOpenDelete}
        onClose={toggleDelete}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete</p>
          </div>
        }
        titleButtonLeft="Cancel"
        leftAction={toggleDelete}
        rightAction={() => handleDeleteLoyalty(selectedLoyalty?.id)}
      />

      <ModalState
        title={
          selectedLoyalty?.status ? "Deactivate Program?" : "Activate Program?"
        }
        subtitle={
          selectedLoyalty?.status ?
            <p>Once deactivated, this program will no longer be available within the platform. Are you sure you want to continue?<br/><br /><span className="font-bold">Note: </span>The associated landing page URL will no longer be accessible.</p>
            :
            <p>This action will activate the program and make it available within the platform. Are you sure you want to continue?</p>
        }
        isOpen={IsOpenStatus}
        onClose={toggleStatus}
        type={selectedLoyalty?.status ? "danger" : "default"}
        titleButtonLeft="Back"
        titleButtonRight={selectedLoyalty?.status ? "Yes, Deactivate" : "Yes, Activate"}
        leftAction={toggleStatus}
        rightAction={() => handleToggleLoyaltyStatus(selectedLoyalty?.id)}
      />
    </div>
  );
};

export default ProgramSection;
