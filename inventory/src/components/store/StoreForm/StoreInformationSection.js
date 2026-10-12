import React, { useEffect, useState } from "react";
import DataTable from "prezent/DataTable";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { GetAllMerchantOutlets } from "../../../service/inventoryManagement/endpoint/store";
import { MagnifyingGlass, NotePencil, Trash } from "@phosphor-icons/react";
import { Chip, TextInput, ModalState } from "sprint-asia-custom-component";
import AddBulkStoreModal from "./AddBulkStoreModal";
import AddSingleStoreModal from "./AddSingleStoreModal";
import AddButton from "../../shared/AddButton";
import {formatPrefixPhoneNumber} from "../../../utils/index"

const StoreInformationSection = ({ merchantId, parentFormik, roleAccess }) => {
  const [dataSearch, setDataSearch] = useState("");
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { isOpen: addBulkStoreIsOpen, toggle: toggleAddBulkStore } = useDisclosure(false);
  const { isOpen: deleteConfirmationIsOpen, toggle: toggleDeleteConfirmation } = useDisclosure(false);
  const { isOpen: addSingleStoreIsOpen, toggle: toggleSingleStore } = useDisclosure(false);

  const { data: outlets } = useFetch(merchantId && GetAllMerchantOutlets, "outlets", [], {
    merchantId,
  });

  const handleDeleteDataTable = () => {
    const updatedArr = parentFormik.values.outlets.filter((_, index) => index !== selectedIndex);
    parentFormik.setFieldValue("outlets", updatedArr);
    closeDeleteConfirmation();
  };

  const openEditStoreModal = (selectedRow) => {
    setSelectedStore(selectedRow);
    toggleSingleStore();
  };

  const closeAddSingleStoreModal = () => {
    toggleSingleStore();
  };

  const openDeleteConfirmation = (idx, selectedRow) => {
    toggleDeleteConfirmation();
    setSelectedIndex(idx);
    setSelectedStore(selectedRow);
  };

  const closeDeleteConfirmation = () => {
    toggleDeleteConfirmation();
    setSelectedIndex(null);
    setSelectedStore(null);
  };

  const columns = [
    {
      header: "Outlet Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="text-neutral300 text-sm">{row.code}</p>
            <p className="text-neutral300 text-sm">CODE / ID</p>
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
      header: "PIC",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="text-neutral300 text-sm">{formatPrefixPhoneNumber(row.picPhoneNumber)}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "email",
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <div>
            <Chip
              title={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              type={row.status === "active" ? "success" : "neutral"}
            />
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row, idx) => {
        return (
          <div className="flex">
            <div onClick={() => openEditStoreModal(row)}>
              <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <div onClick={() => openDeleteConfirmation(idx, row)}>
              <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    if (outlets) {
      const transformedArray = outlets?.data?.map((outlet) => ({
        ...outlet,
      }));
      parentFormik.setFieldValue("outlets", transformedArray);
    }
  }, [outlets]);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Store Information</div>

      <div className="flex items-center justify-between">
        <TextInput
          placeholder="Search"
          className="max-w-sm"
          leftAdornment={<MagnifyingGlass />}
          onChangeInput={(e) => setDataSearch(e.target.value)}
        />

        <AddButton addBulkHandler={toggleAddBulkStore} addSingleHandler={toggleSingleStore} title="Add Store" />
      </div>

      <div className="rounded-md border border-neutral30 overflow-hidden">
        <DataTable
          staticData={parentFormik.values.outlets?.filter((outlet) =>
            Object.values(outlet).some((val) => val?.toString().toLowerCase().includes(dataSearch.toLowerCase()))
          )}
          columns={columns}
          options={{ pagination: true, isRounded: true }}
          onClickRow={() => {}}
        />
      </div>

      <AddSingleStoreModal
        isOpen={addSingleStoreIsOpen}
        onClose={closeAddSingleStoreModal}
        parentFormik={parentFormik}
        selectedStore={selectedStore}
        roleAccess={roleAccess}
        setSelectedStore={setSelectedStore}
      />

      <AddBulkStoreModal
        isOpen={addBulkStoreIsOpen}
        title="Import to upload store"
        formik={parentFormik}
        onClose={toggleAddBulkStore}
        existingStores={parentFormik.values.outlets}
      />

      <ModalState
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete the Store: ${selectedStore?.name}? This action cannot be undone.`}
        isOpen={deleteConfirmationIsOpen}
        onClose={closeDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Store</p>
          </div>
        }
        leftAction={closeDeleteConfirmation}
        rightAction={handleDeleteDataTable}
      />
    </div>
  );
};

export default StoreInformationSection;
