import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "prezent/DataTable";
import { TabBar, PrimaryButton, SearchInput, Chip, DangerButton } from "sprint-asia-custom-component";
import { Plus, DotsSixVerticalIcon, Trash, NotePencil, CaretUp, CaretDown } from "@phosphor-icons/react";
import {
  GetAllCustomSpecification,
  GetAllCustomSpecificationTable,
  DeleteCustom,
  DeleteCustomSpecification,
} from "../../../service/inventoryManagement/endpoint/product";
import ModalAddSpecification from "../ModalAddSpecification";
import ModalAddItemSpecification from "../ModalAddItemSpecification";
import { useDisclosure } from "prezent/useDisclosure";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import { useFetch } from "prezent/useFetch";
import LoadingModal from "prezent/LoadingModal";

const SpecificationSection = ({ roleAccess, loyaltyId, userInfo, setTitleHeader }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;
  const navigate = useNavigate();
  const [reRenderCustom, setReRenderCustom] = useState(false);
  const [reRenderSpecification, setReRenderSpecification] = useState(false);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [currentSpecification, setCurrentSpecification] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const { data: rawCustomSpecification, isLoading: isLoadingModal } = useFetch(
    GetAllCustomSpecification,
    "specification",
    [reRenderSpecification],
    { companyId }
  );
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const [searchValueCustom, setSearchValueCustom] = useState(Array(customSpecification?.data.length).fill("") || [""]);
  const [searchValueCustomSpecification, setSearchValueCustomSpecification] = useState(
    Array(customSpecification?.data.length).fill("") || [""]
  );
  const [customSpecification, setCustomSpecification] = useState(null);
  const {
    isOpen: isOpenModalDeleteItemCustomSpecification,
    toggle: toggleIsOpenModalDeleteItemCustomSpecification,
    close: closeIsOpenModalDeleteItemCustomSpecification,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalDeleteCustomSpecification,
    toggle: toggleIsOpenModalDeleteCustomSpecification,
    close: closeIsOpenModalDeleteCustomSpecification,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalAddSpecification,
    toggle: toggleIsOpenModalAddSpecification,
    close: closeIsOpenModalAddSpecification,
    open: openIsOpenModalAddSpecification,
  } = useDisclosure(false);
  const { isOpen: isLoading, close: closeLoading, open: openLoading } = useDisclosure(false);
  const {
    isOpen: isOpenModalAddItemCustomSpecification,
    toggle: toggleIsOpenModalAddItemCustomSpecification,
    close: closeIsOpenModalAddItemCustomSpecification,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalAddCustomItemSpecification,
    toggle: toggleIsOpenModalAddCustomItemSpecification,
    close: closeIsOpenModalAddCustomItemSpecification,
    open: openIsOpenModalAddCustomItemSpecification,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalConfirmationAddSpecification,
    toggle: toggleIsOpenModalConfirmationAddSpecification,
    close: closeIsOpenModalConfirmationAddSpecification,
  } = useDisclosure(false);
  const {
    isOpen: isOpenModalConfirmationAddCustomItemSpecification,
    toggle: toggleIsOpenModalConfirmationAddCustomItemSpecification,
    close: closeIsOpenModalConfirmationAddCustomItemSpecification,
  } = useDisclosure(false);

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1000);
    }, 250);
  };

  useEffect(() => {
    if (rawCustomSpecification) {
      setCustomSpecification({
        ...rawCustomSpecification,
        data: rawCustomSpecification.data?.map((item) => ({
          ...item,
          isOpen: true,
        })),
      });
    }
  }, [rawCustomSpecification]);

  function handleDeleteItemCustom(value, title) {
    setCurrentTitle(title);
    toggleIsOpenModalDeleteItemCustomSpecification();
    setCurrentData(value);
  }
  function handleDeleteCustomSpecificationConfirmation(value, title) {
    setCurrentTitle(title);
    setCurrentData(value);
    toggleIsOpenModalDeleteCustomSpecification();
  }
  function handleEditItemCustom(value, title) {
    setCurrentTitle(title);
    openIsOpenModalAddCustomItemSpecification();
    setCurrentData(value);
  }
  async function handleDeleteItemCustomSpecification() {
    try {
      openLoading();
      closeIsOpenModalDeleteItemCustomSpecification();
      await DeleteCustom(currentData.id);
      closeLoading();
      setReRenderCustom(!reRenderCustom);
      handleOpenModalResult(
        "success",
        `The Specification "${currentData.name || currentData.unit}" has been successfully deleted.`
      );
    } catch (error) {
      closeLoading();
      closeIsOpenModalDeleteItemCustomSpecification();
      handleOpenModalResult(
        "failed",
        `Unable to delete the Specification "${
          currentData.name || currentData.unit
        }". Please try again later or contact support if the issue persists.`
      );
    }
  }
  async function handleDeleteCustomSpecification() {
    try {
      openLoading();
      closeIsOpenModalDeleteCustomSpecification();
      await DeleteCustomSpecification(currentData.id);
      closeLoading();
      setReRenderSpecification(!reRenderSpecification);
      handleOpenModalResult("success", `The Specification "${currentData.name}" has been successfully deleted.`);
    } catch (error) {
      closeLoading();
      closeIsOpenModalDeleteCustomSpecification();
      handleOpenModalResult(
        "failed",
        `Unable to delete the Specification "${currentData.name}". Please try again later or contact support if the issue persists.`
      );
    }
  }

  function handleOpenAddItemSpecification(value, title, specification) {
    setCurrentTitle(title);
    setCurrentData(value);
    toggleIsOpenModalAddCustomItemSpecification();
    setCurrentSpecification(specification);
  }

  function handlereRenderSpecification() {
    setReRenderSpecification(!reRenderSpecification);
  }

  function getColumnTable(value) {
    var column = [
      {
        header: value.name,
        assessor: value.name,
        Cell: (row) => <p className="font-semibold text-black text-sm">{row.name}</p>,
      },
    ];
    if (value.type === "text") {
      column = [
        {
          header: value.name,
          assessor: value.name,
          Cell: (row) => <p className="font-semibold text-black text-sm">{row.name}</p>,
        },
        {
          header: "Status",
          assessor: "status",
          Cell: (row) => (
            <div>
              <Chip title={row.status} type={row?.status?.toLowerCase() === "active" ? "success" : "neutral"} />
            </div>
          ),
        },
        {
          header: "Action",
          Cell: (row) => (
            <div className="flex">
              <div onClick={() => handleEditItemCustom(row, value.name)}>
                <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
              </div>
              <div onClick={() => handleDeleteItemCustom(row, value.name)}>
                <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
              </div>
            </div>
          ),
        },
      ];
    } else {
      column = [
        {
          header: "Label Name",
          assessor: "Label Name",
          Cell: (row) => <p className="font-semibold text-black text-sm">{row.name}</p>,
        },
        {
          header: "Unit",
          assessor: "Unit",
          Cell: (row) => <p className="font-semibold text-black text-sm">{row.unit}</p>,
        },
        {
          header: "Size Total",
          assessor: "sizeTotal",
          Cell: (row) => <p className="font-semibold text-black text-sm">{row.size?.length || 0}</p>,
        },
        {
          header: "Status",
          assessor: "status",
          Cell: (row) => (
            <div>
              <Chip title={row.status} type={row?.status?.toLowerCase() === "active" ? "success" : "neutral"} />
            </div>
          ),
        },
        {
          header: "Action",
          Cell: (row) => (
            <div className="flex">
              <div onClick={() => handleEditItemCustom(row, value.name)}>
                <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
              </div>
              <div onClick={() => handleDeleteItemCustom(row, value.name)}>
                <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
              </div>
            </div>
          ),
        },
      ];
    }
    return column;
  }

  const handleChange = (index, newValue) => {
    const updatedValues = [...searchValueCustom];
    updatedValues[index] = newValue;
    setSearchValueCustom(updatedValues);
  };

  const handleChangeValue = (index, newValue) => {
    const updatedValues = [...searchValueCustomSpecification];
    updatedValues[index] = newValue;
    setSearchValueCustomSpecification(updatedValues);
  };
  const [currentTab, setCurrentTab] = useState("Specifications");

  useEffect(() => {
    setTitleHeader(currentTab);
  }, [currentTab]);

  useEffect(() => {
    if (customSpecification?.data?.length > 0) {
      const newLength = customSpecification?.data.length;

      setSearchValueCustom((prev) => {
        const updated = [...prev];
        updated.length = newLength;
        return updated.map((v) => v ?? "");
      });

      setSearchValueCustomSpecification((prev) => {
        const updated = [...prev];
        updated.length = newLength;
        return updated.map((v) => v ?? "");
      });
    }
  }, [customSpecification]);

  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Categories", "Specifications", "Products"]}
          dataValue={["Categories", "Specifications", "Products"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => {
            setCurrentTab(tab);
            if (tab === "Categories") {
              navigate("/prezent/loyalty-setting/inventory/category");
            } else if (tab === "Specifications") {
              navigate("/prezent/loyalty-setting/inventory/specification");
            } else if (tab === "Products") {
              navigate("/prezent/loyalty-setting/inventory/product");
            }
          }}
        />
      </div>
      <div
        className="flex-1 overflow-y-auto bg-neutral20 pb-2 pt-16 px-8"
        style={{ minHeight: "calc(100dvh - 215px)" }}
      >
        <div className="mb-4">
          <PrimaryButton
            title={
              <div className="flex gap-2 items-center">
                <Plus />
                <p>Add Specification</p>
              </div>
            }
            onClick={toggleIsOpenModalAddSpecification}
          />
        </div>

        {customSpecification &&
          customSpecification?.data?.length > 0 &&
          customSpecification?.data.map((value, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md h-full p-8 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DotsSixVerticalIcon size={20} />
                  <p className="font-semibold ml-2">{value.name}</p>
                  {value.isDefault && (
                    <p className="text-neutral300 bg-neutral30 ml-2 rounded-full px-4 py-1">Default</p>
                  )}
                </div>
                <div
                  onClick={() => {
                    const newData = customSpecification.data.map((item, i) =>
                      i === index ? { ...item, isOpen: !item.isOpen } : item
                    );
                    setCustomSpecification({ ...customSpecification, data: newData });
                  }}
                >
                  {value.isOpen ? (
                    <CaretUp size={24} className="text-black cursor-pointer" />
                  ) : (
                    <CaretDown size={24} className="text-black cursor-pointer" />
                  )}
                </div>
              </div>

              <hr className="w-full text-neutral40 mt-4" />
              {value.isOpen && (
                <>
                  <div className="flex justify-between items-center w-full py-3">
                    <div className="flex gap-4">
                      <SearchInput
                        value={searchValueCustom[index]}
                        placeholder="Search"
                        onChange={(e) => handleChange(index, e.target.value)}
                        onEnterPress={() => handleChangeValue(index, searchValueCustom[index])}
                      />
                    </div>

                    <PrimaryButton
                      title={
                        <div className="flex gap-2 items-center">
                          <Plus />
                          <p>Add {value.name}</p>
                        </div>
                      }
                      onClick={() => handleOpenAddItemSpecification(null, value.name, value)}
                    />
                  </div>

                  <div className="drop-shadow">
                    {customSpecification && (
                      <DataTable
                        columns={getColumnTable(value)}
                        service={GetAllCustomSpecificationTable}
                        queryName="Specification"
                        dependencies={searchValueCustomSpecification[index]}
                        params={{
                          id: customSpecification?.data[index].id,
                          search: searchValueCustomSpecification[index],
                        }}
                        reRender={reRenderCustom}
                        options={{ pagination: true, isRounded: true }}
                        searchKeyword={searchValueCustomSpecification[index]}
                        popupModal={false}
                        onClickRow={() => {}}
                      />
                    )}
                  </div>

                  {!value.isDefault && (
                    <div className="flex w-full justify-end mt-4">
                      <DangerButton
                        title={
                          <div className="flex items-center gap-2">
                            <Trash size="24" className="text-white" />
                            Delete
                          </div>
                        }
                        onClick={() => handleDeleteCustomSpecificationConfirmation(value, value.name)}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}

        <ModalAddSpecification
          isOpen={isOpenModalAddSpecification}
          onClose={closeIsOpenModalAddSpecification}
          onOpen={openIsOpenModalAddSpecification}
          clientId={companyId}
          reRender={handlereRenderSpecification}
        />

        <LoadingModal isOpen={isLoadingModal} onClose={() => {}} title="Loading" subtitle="Please wait a moment" />

        <ModalAddItemSpecification
          isOpen={isOpenModalAddCustomItemSpecification}
          onClose={closeIsOpenModalAddCustomItemSpecification}
          onOpen={openIsOpenModalAddCustomItemSpecification}
          currentData={currentData}
          clientId={companyId}
          titleParent={currentTitle}
          reRender={() => setReRenderCustom(!reRenderCustom)}
          type={currentData ? currentData?.type : currentSpecification?.type}
          specificationId={currentSpecification?.id || ""}
        />
        <ResultModal
          subtitle={dataSubtitleModal}
          type={flagResult}
          isOpen={resultModalIsOpen}
          onClose={closeResultModal}
        />

        <StateModal
          title="Do you want to cancel?"
          subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
          isOpen={isOpenModalConfirmationAddSpecification}
          onClose={closeIsOpenModalAddSpecification}
          titleButtonLeft="Back"
          titleButtonRight="Cancel"
          leftAction={toggleIsOpenModalAddSpecification}
          rightAction={closeIsOpenModalAddSpecification}
        />
        <StateModal
          title={`Delete ${currentData?.name}?`}
          subtitle={`Are you sure you want to delete this Specification ${currentData?.name}? This action cannot be undone.`}
          isOpen={isOpenModalDeleteItemCustomSpecification}
          onClose={closeIsOpenModalDeleteItemCustomSpecification}
          type="danger"
          titleButtonRight="Delete"
          leftAction={closeIsOpenModalDeleteItemCustomSpecification}
          rightAction={handleDeleteItemCustomSpecification}
        />
        <StateModal
          title={`Delete ${currentTitle}`}
          subtitle={`Are you sure you want to delete this Specification ${currentTitle}? This action cannot be undone.`}
          isOpen={isOpenModalDeleteCustomSpecification}
          onClose={closeIsOpenModalDeleteCustomSpecification}
          type="danger"
          titleButtonRight="Delete"
          leftAction={closeIsOpenModalDeleteCustomSpecification}
          rightAction={handleDeleteCustomSpecification}
        />
        <StateModal
          title="Do you want to cancel?"
          subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
          isOpen={isOpenModalConfirmationAddCustomItemSpecification}
          onClose={closeIsOpenModalAddItemCustomSpecification}
          titleButtonLeft="Back"
          titleButtonRight="Cancel"
          leftAction={toggleIsOpenModalAddItemCustomSpecification}
          rightAction={closeIsOpenModalAddItemCustomSpecification}
        />

        <LoadingModal title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} onClose={() => {}} />
      </div>
    </>
  );
};

export default SpecificationSection;
