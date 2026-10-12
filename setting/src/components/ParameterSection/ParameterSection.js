import React, { useEffect, useState } from "react";
import _ from "lodash";

import { PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import {
  CreateNewParameter,
  DeleteParameter,
  DownloadParameters,
  GetAllParameter,
  UpdateParameter,
} from "../../service/settingparametermanagement/endpoint";
import ModalParameter from "../modal/ModalParameter";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import { Plus, DownloadSimpleIcon } from "@phosphor-icons/react";
import DataTable from "prezent/DataTable";
import OutlineButton from "../button/outlinebutton";

const ParameterSection = ({ roleAccess, setTitleHeader, companyId }) => {
  const { isOpen: loadingModalIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: formIsOpen, open: openForm, toggle: toggleForm } = useDisclosure(false);
  const { isOpen: deleteConfirmationIsOpen, toggle: toggleDeleteConfirmation } = useDisclosure(false);
  const { isOpen: cancelModalParameterInformationIsOpen, toggle: toggleCancelModalParameterInformation } =
    useDisclosure(false);
  const [parameters, setParameters] = useState();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [reRender, setReRender] = useState(false);
  const [selectedParameter, setSelectedParameter] = useState(null);

  const dataOptions = [
    { option: "Parameter Name", value: "parameterName" },
    { option: "Type", value: "type" },
  ];

  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Parameter Name",
    value: "parameterName",
  });

  function handleCancelModal() {
    toggleCancelModalParameterInformation();
  }

  function handleBackModal() {
    toggleCancelModalParameterInformation();
    toggleCategoryForm();
  }

  const handleOpenEditForm = (data) => {
    openForm();
    setSelectedParameter(data);
  };

  const handleOpenDeleteConfirmation = (data) => {
    toggleDeleteConfirmation();
    setSelectedParameter(data);
  };

  const handleCloseDeleteConfirmation = () => {
    toggleDeleteConfirmation();
    setSelectedParameter(null);
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

  const handleCreateParameter = async (form) => {
    try {
      openLoading();
      toggleForm();
      await CreateNewParameter({ companyId, ...form });
      setReRender(!reRender);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully added");
      }, 250);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, unable to adding parameter data at the moment. Please try again");
    }
  };

  const handleEditParameter = async (form) => {
    try {
      openLoading();
      toggleForm();
      await UpdateParameter({ companyId, id: selectedParameter?.id, ...form });
      setReRender(!reRender);
      setSelectedParameter(null);
      closeLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully updated");
      }, 250);
    } catch (error) {
      closeLoading();
      setSelectedParameter(null);
      handleOpenModalResult("failed", "Sorry, unable to edit parameter data at the moment. Please try again");
    }
  };

  const handleDeleteParameter = async () => {
    try {
      openLoading();
      toggleDeleteConfirmation();
      await DeleteParameter(selectedParameter?.id);
      setReRender(!reRender);
      closeLoading();
      setSelectedParameter(null);
      setTimeout(() => {
        handleOpenModalResult("success", "Parameter has been successfully deleted");
      }, 250);
    } catch (error) {
      closeLoading();
      setSelectedParameter(null);
      if (error?.response?.data?.rc === 409) {
        handleOpenModalResult(
          "failed",
          "This parameter cannot be deleted because it is currently linked to an active campaign.",
        );
      } else {
        handleOpenModalResult("failed", "Sorry, unable to delete parameter at the moment. Please try again");
      }
    }
  };

  const handleDownloadParameters = async () => {
    try {
      openLoading();
      const response = await DownloadParameters({ dataFilter: dataFilterSearch.value, dataSearch, companyId });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `parameter-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      closeLoading();
      handleOpenModalResult("success", `Parameter data downloaded successfully.`);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", `Failed to download Parameter data. Please try again.`);
    }
  };

  const columns = [
    {
      header: "Parameter Name",
      assessor: "parameterName",
      Cell: (row) => (
        <div className="flex gap-2">
          <p className="font-medium text-black text-sm">{row.parameterName}</p>
          {row.isMaster && <p className="text-neutral80 text-sm">(Default)</p>}
        </div>
      ),
    },
    {
      header: "Type",
      assessor: "type",
      Cell: (row) => (
        <div>
          <p className="font-medium text-black text-sm">{row.type.charAt(0).toUpperCase() + row.type.slice(1)}</p>
        </div>
      ),
    },
    {
      header: "Action",
      Cell: (row) => (
        <div className="flex">
          {(row.parameterName === "Program" || row.isMaster === false) && (
            <div onClick={() => handleOpenEditForm(row)}>
              <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
          )}
          {row.isMaster === false && (
            <div onClick={() => handleOpenDeleteConfirmation(row)}>
              <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    setTitleHeader("Parameter");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex gap-2 items-center">
              <SearchDropdown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                filterSearch={dataSearch}
                onEnterPress={setDataSearch}
              />

              <OutlineButton
                title={
                  <div className="flex items-center gap-1">
                    <DownloadSimpleIcon />
                    <p>Download</p>
                  </div>
                }
                isActive={parameters?.data?.length || false}
                onClick={handleDownloadParameters}
              />
            </div>
            <PrimaryButton
              title={
                <div className="flex items-center gap-2">
                  <Plus size={20} />
                  Add Parameter
                </div>
              }
              onClick={openForm}
            />
          </div>

          <div className="drop-shadow h-full">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllParameter}
              queryName="parameter"
              dependencies={[roleAccess, dataFilterSearch.value, dataSearch]}
              params={{ dataFilter: dataFilterSearch.value, dataSearch, companyId }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={() => {}}
              getResponse={setParameters}
            />
          </div>
        </div>
      </div>

      <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} onClose={() => {}} />

      <ModalParameter
        title={selectedParameter ? "Edit parameter" : "Create new parameter"}
        onSubmit={selectedParameter ? handleEditParameter : handleCreateParameter}
        selectedParameter={selectedParameter}
        setSelectedParameter={setSelectedParameter}
        isOpen={formIsOpen}
        onClose={toggleForm}
        reRender={() => setReRender(!reRender)}
      />

      <StateModal
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={cancelModalParameterInformationIsOpen}
        onClose={toggleCancelModalParameterInformation}
        type="default"
        titleButtonRight="Cancel"
        titleButtonLeft="Back"
        leftAction={() => handleBackModal()}
        rightAction={() => handleCancelModal()}
      />

      <StateModal
        title="Confirm Deletion"
        subtitle={
          <span>
            Are you sure you want to delete parameter{" "}
            <span
              className="font-bold"
              style={{
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              {selectedParameter?.parameterName}
            </span>
            ? This action cannot be undone.
          </span>
        }
        isOpen={deleteConfirmationIsOpen}
        onClose={handleCloseDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-2">
            <PiTrash />
            <p>Delete Parameter</p>
          </div>
        }
        leftAction={handleCloseDeleteConfirmation}
        rightAction={handleDeleteParameter}
      />
    </>
  );
};

export default ParameterSection;
