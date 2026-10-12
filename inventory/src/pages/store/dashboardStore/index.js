import React, { useEffect, useState } from "react";
import DataTable from "prezent/DataTable";
import { SearchDropdown, Chip, OutlineButton } from "sprint-asia-custom-component";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import { NotePencil, Trash, DownloadSimpleIcon } from "@phosphor-icons/react";
import {
  CreateStore,
  DeleteStore,
  DownloadStores,
  EditStore,
  GetAllClient,
  GetAllMerchantOutlets,
  GetAllProvinceStore,
  GetAllSandezaBillsMerchants,
  GetAllStores,
  PostAllCityStore,
  PostAllDistrictStores,
} from "../../../service/inventoryManagement/endpoint/store";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import FilterDropDown from "prezent/FilterDropDown";
import SandezaBillsMerchantModal from "../../../components/store/SandezaBillsMerchantModal/SandezaBillsMerchantModal";
import SandezaBillsStoreListModal from "../../../components/store/SandezaBillsStoreListModal/SandezaBillsStoreListModal";
import SelectClientModal from "../../../components/store/SelectClientModal/SelectClientModal";
import AddButton from "../../../components/shared/AddButton";
import AddBulkStoreModal from "../../../components/store/StoreForm/AddBulkStoreModal";
import AddSingleStoreModal from "../../../components/store/StoreForm/AddSingleStoreModal";
import { formatPrefixPhoneNumber } from "../../../../src/utils/index";
import { useNavigate } from "react-router-dom";

const DashboardStore = ({ roleAccess, setTitleHeader, loyaltyId, userInfo, history }) => {
  const [dataSubtitleModal, setDataSubtitleModal] = useState("Your SandezaBills account is connected.");
  const [flagResult, setFlagResult] = useState("success");
  const [reRender, setReRender] = useState(false);
  const [stores, setStores] = useState();
  const [syncToSandezaBills, setSyncToSandezaBills] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Store Name",
    value: "storeName",
  });
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: storeListIsOpen, toggle: toggleStoreList } = useDisclosure(false);
  const { isOpen: clientModalIsOpen, open: openClientModal, close: closeClientModal } = useDisclosure(false);
  const { isOpen: sandezaIsOpen, open: openSandezaModal, close: closeSandezaModal } = useDisclosure(false);
  const { isOpen: confirmationIsOpen, toggle: toggleConfirmation } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const {
    isOpen: addBulkStoreIsOpen,
    toggle: toggleAddBulkStore,
    close: closeAddBulkStore,
    open: openAddBulkStore,
  } = useDisclosure(false);
  const { toggle: toggleDownloadFileExcel } = useDisclosure(false);
  const { isOpen: addSingleStoreIsOpen, toggle: toggleSingleStore } = useDisclosure(false);
  const { isOpen: isLoading, toggle: toggleIsLoading } = useDisclosure(false);
  const {
    isOpen: isLoadingModal,
    toggle: toggleIsLoadingModal,
    open: openIsLoadingModal,
    close: closeIsLoadingModal,
  } = useDisclosure(false);
  const [dataFilter, setDataFilter] = useState({ province: [], city: [], district: [] });
  const [selectedOptions, setSelectedOptions] = useState({ province: [], city: [], district: [] });
  const { data: provinces } = useFetch(GetAllProvinceStore, "provinces", [], null);
  const { data: cities } = useFetch(
    dataFilter?.province?.length > 0 && dataFilter?.province[0] && PostAllCityStore,
    "cities",
    [dataFilter?.province[0]],
    { province: dataFilter?.province },
  );
  const { data: districts } = useFetch(
    dataFilter?.city?.length > 0 && dataFilter?.city[0] && PostAllDistrictStores,
    "districts",
    [dataFilter?.city[0]],
    { city: dataFilter?.city },
  );
  const { data: clients } = useFetch(GetAllClient, "clients", [], {});
  const {
    data: merchants,
    isSuccess: fetchMerchantIsSuccess,
    isError: fetchMerchantIsError,
  } = useFetch(syncToSandezaBills && GetAllSandezaBillsMerchants, "merchants", [syncToSandezaBills], {});
  const { data: outlets } = useFetch(selectedClient && GetAllMerchantOutlets, "outlets", [], {
    merchantId: selectedClient?.id,
  });
  const navigateTo = useNavigate();

  const dataOptions = [
    { option: "Store ID", value: "storeCode" },
    { option: "Store Name", value: "storeName" },
    { option: "Address", value: "address" },
    { option: "Phone Number", value: "phoneNumber" },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
    setSelectedOptions(options);
  };

  const handleDeleteStore = async () => {
    try {
      closeDeleteModal();
      openIsLoadingModal();
      await DeleteStore(roleAccess, selectedRow.id);
      setReRender(!reRender);
      setSelectedRow(null);
      closeIsLoadingModal();
      handleOpenModalResult("success", "Store has been successfully deleted.");
    } catch (error) {
      if (error?.response?.data?.rc === 5) {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to delete store at the moment. The store is currently being used for an active campaign.",
        );
      } else {
        handleOpenModalResult("failed", "Store has been failed deleted. Please try again");
      }
      closeIsLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleOpenEditStore = (row) => {
    toggleSingleStore();
    setSelectedRow(row);
  };

  const handleOpenDeleteConfirmation = (row) => {
    setSelectedRow(row);
    openDeleteModal();
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedRow(null);
    closeDeleteModal();
  };

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      openResultModal();
      setTimeout(() => {
        closeResultModal();
      }, 1500);
    }, 250);
  };

  const handleOpenClientModal = () => {
    setSyncToSandezaBills(true);
  };

  const handleCloseClientModal = () => {
    closeClientModal();
    setSelectedClient(null);
    setSyncToSandezaBills(false);
  };

  const handleBackSandezaModal = () => {
    closeSandezaModal();
    openClientModal();
    setSelectedMerchant(null);
  };

  const handleCloseSandezaModal = () => {
    closeSandezaModal();
    setSelectedMerchant(null);
    setSelectedClient(null);
  };

  const handleOpenSandezaModal = (client) => {
    closeClientModal();
    openSandezaModal();
    setSelectedClient(client);
  };

  const handleOpenStoreListModal = (merchant) => {
    closeSandezaModal();
    setSyncToSandezaBills(false);
    toggleStoreList();
    setSelectedMerchant(merchant);
  };

  const handleOpenConfirmationModal = () => {
    toggleConfirmation();
    toggleStoreList();
  };

  const handleCloseConfirmationModal = () => {
    toggleConfirmation();
    toggleStoreList();
  };

  const handleConfirm = () => {
    toggleConfirmation();
    setSelectedMerchant(null);
    setSelectedClient(null);
  };

  const handleCloseStoreListModal = () => {
    toggleStoreList();
    setSelectedMerchant(null);
    setSelectedClient(null);
  };

  function handleSubmitDownload() {
    closeAddBulkStore();
    toggleDownloadFileExcel();
  }

  const handleSubmitStore = async (form) => {
    try {
      toggleIsLoading();
      var bodyRequest = {
        address: form.address,
        city: form.city,
        code: form.code,
        district: form.district,
        loyaltyId: loyaltyId,
        name: form.name,
        phoneNumber: form.phoneNumber,
        postalCode: form.postalCode,
        province: form.province,
        status: form.status === true ? "active" : "inactive",
        isAutoGenerated: form.isAutoGenerated,
      };
      if (selectedRow) {
        await EditStore(roleAccess, selectedRow.id, bodyRequest);
      } else {
        await CreateStore(roleAccess, { stores: [bodyRequest] });
      }
      setSelectedRow(null);
      setReRender(!reRender);
      toggleIsLoading();
      setTimeout(() => {
        handleOpenModalResult("success", `Store has been successfully ${selectedRow ? "updated" : "added"}`);
      }, 250);
    } catch (error) {
      if (error?.response?.data?.rc === 5) {
        handleOpenModalResult(
          "failed",
          `Sorry, we are unable to ${
            selectedRow ? "edit" : "adding"
          } store at the moment. The store is currently being used for an active campaign.`,
        );
      } else {
        handleOpenModalResult(
          "failed",
          `Sorry, unable to ${selectedRow ? "edit" : "adding"} store at the moment. Please try again`,
        );
      }

      toggleIsLoading();
      setSelectedRow(null);
    }
  };

  const handleDownloadStore = async () => {
    try {
      toggleIsLoadingModal();
      const response = await DownloadStores({
        dataFilter: dataFilterSearch.value,
        dataSearch,
        body: dataFilter,
        loyaltyId: loyaltyId,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `store-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleIsLoadingModal();
      handleOpenModalResult("success", `Store data downloaded successfully.`);
    } catch (error) {
      toggleIsLoadingModal();
      handleOpenModalResult("failed", `Failed to download Store data. Please try again.`);
    }
  };

  const columns = [
    {
      header: "Store",
      assessor: "store",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-black text-xs">{row.code}</p>
          </div>
        );
      },
    },
    {
      header: "Address",
      assessor: "address",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.address}</p>
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      assessor: "address",
      Cell: (row) => {
        return (
          <div className="w-32">
            <p className="font-semibold text-black text-sm">{formatPrefixPhoneNumber(row.phoneNumber)}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return <Chip title={row.status} type={row.status.toLowerCase() === "active" ? "success" : "neutral"} />;
      },
    },
    {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div
              onClick={() => {
                handleOpenEditStore(row);
              }}
            >
              <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <div
              onClick={() => {
                handleOpenDeleteConfirmation(row);
              }}
            >
              <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (syncToSandezaBills) {
      if (fetchMerchantIsError) {
        handleOpenModalResult(
          "failed",
          "Your SandezaBills account could not be connected. Please check your account details and try again.",
        );
      } else if (fetchMerchantIsSuccess) {
        handleOpenModalResult("success", "Your SandezaBills account is connected. ");
        setTimeout(() => {
          openClientModal();
        }, 2000);
      }
    }
  }, [fetchMerchantIsError, fetchMerchantIsSuccess, syncToSandezaBills]);

  useEffect(() => {
    const updatedOptions = {
      ...selectedOptions,
      city: [],
      district: [],
    };
    setSelectedFilterOptions(updatedOptions);
  }, [dataFilter?.province]);

  useEffect(() => {
    const updatedOptions = {
      ...selectedOptions,
      district: [],
    };
    setSelectedFilterOptions(updatedOptions);
  }, [dataFilter?.city]);

  useEffect(() => {
    setTitleHeader("Store");
  }, []);
  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8" style={{ minHeight: "calc(100dvh - 165px)" }}>
      <div className="bg-white rounded-lg shadow-md h-full">
        <div className="flex justify-between items-center w-full py-3 px-4">
          <div className="flex gap-2 items-center">
            <SearchDropdown
              options={dataOptions}
              placeholderSearch="Search Here"
              filterDropdown={dataFilterSearch}
              setFilterDropdown={setDataFilterSearch}
              onEnterPress={setDataSearch}
            />
            <div>
              <FilterDropDown
                options={[
                  {
                    menu: "Province",
                    parameter: "province",
                    submenu:
                      provinces?.data?.map((city) => ({
                        option: city.name,
                        value: city.code,
                      })) || [],
                    type: "checkbox",
                  },
                  {
                    menu: "City / Regencies",
                    parameter: "city",
                    submenu:
                      cities?.data?.map((city) => ({
                        option: city.name,
                        value: city.code,
                      })) || [],
                    type: "checkbox",
                  },
                  {
                    menu: "District",
                    parameter: "district",
                    submenu:
                      districts?.data?.map((district) => ({
                        option: district.name,
                        value: district.code,
                      })) || [],
                    type: "checkbox",
                  },
                ]}
                dataFilterResult={dataFilter}
                setDataFilterResult={setSelectedFilterOptions}
              />
            </div>

            <OutlineButton
              title={
                <div className="flex items-center gap-1">
                  <DownloadSimpleIcon />
                  <p>Download</p>
                </div>
              }
              isActive={stores?.data?.length || false}
              onClick={handleDownloadStore}
            />
          </div>

          <AddButton addBulkHandler={toggleAddBulkStore} addSingleHandler={toggleSingleStore} title="Add Store" />
        </div>
        <div className="drop-shadow">
          <DataTable
            columns={columns}
            reRender={reRender}
            service={GetAllStores}
            queryName={"stores"}
            dependencies={[dataFilterSearch.value, dataSearch, dataFilter, loyaltyId]}
            params={{
              dataFilter: dataFilterSearch.value,
              dataSearch,
              body: dataFilter,
              loyaltyId: loyaltyId,
            }}
            options={{ pagination: true }}
            searchKeyword={dataSearch}
            onClickRow={(id) => navigateTo(`/prezent/loyalty-setting/inventory/store/${id}`)}
            loadingIndicator={isLoading}
            getResponse={setStores}
          />
        </div>
      </div>

      <ResultModal
        subtitle={dataSubtitleModal}
        type={flagResult}
        isOpen={resultModalIsOpen}
        onClose={closeResultModal}
      />

      <SelectClientModal
        isOpen={clientModalIsOpen}
        onClick={handleOpenSandezaModal}
        onClose={handleCloseClientModal}
        selectedClient={selectedClient}
        merchants={merchants?.data?.data}
        setSelectedClient={setSelectedClient}
        clients={clients?.data}
      />

      <SandezaBillsMerchantModal
        isOpen={sandezaIsOpen}
        selectedMerchant={selectedMerchant}
        selectedClient={selectedClient}
        merchants={merchants?.data}
        onClose={handleCloseSandezaModal}
        setSelectedMerchant={setSelectedMerchant}
        onClick={handleOpenStoreListModal}
        onClickBack={handleBackSandezaModal}
      />

      <SandezaBillsStoreListModal
        isOpen={storeListIsOpen}
        onClose={handleCloseStoreListModal}
        merchant={selectedMerchant}
        client={selectedClient}
        stores={outlets?.data}
        onClickCancel={handleOpenConfirmationModal}
      />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={isLoadingModal || isLoading}
        onClose={() => {}}
      />

      <StateModal
        title="Do you want to cancel?"
        subtitle="The information you filled in has not been saved and will be lost if you cancel this process."
        isOpen={confirmationIsOpen}
        onClose={handleCloseConfirmationModal}
        titleButtonLeft="Back"
        titleButtonRight="Cancel"
        leftAction={handleCloseConfirmationModal}
        rightAction={handleConfirm}
      />

      <StateModal
        title="Confirm Deletion"
        subtitle={
          <p>
            Are you sure you want to delete the store: <span className="font-semibold">{selectedRow?.name}</span>? This
            action cannot be undone.
          </p>
        }
        isOpen={deleteModalIsOpen}
        onClose={handleCloseDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Store</p>
          </div>
        }
        leftAction={handleCloseDeleteConfirmation}
        rightAction={handleDeleteStore}
      />

      <AddSingleStoreModal
        isOpen={addSingleStoreIsOpen}
        onClose={() => {
          toggleSingleStore();
          if (!selectedRow) {
            setSelectedRow(null);
          }
        }}
        selectedStore={selectedRow}
        setSelectedStore={setSelectedRow}
        roleAccess={roleAccess}
        handleSubmitStore={handleSubmitStore}
        clientName={userInfo?.clientName}
      />

      <AddBulkStoreModal
        isOpen={addBulkStoreIsOpen}
        onClose={closeAddBulkStore}
        existingStores={stores?.data}
        onSubmit={handleSubmitStore}
        handleSubmitDownload={handleSubmitDownload}
        loyaltyId={loyaltyId}
        onOpen={openAddBulkStore}
        reRender={() => setReRender(!reRender)}
      />
    </div>
  );
};

export default DashboardStore;
