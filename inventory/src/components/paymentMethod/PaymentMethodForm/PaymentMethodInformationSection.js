import React, { useState } from "react";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { MagnifyingGlass, NotePencil, Plus, Trash } from "@phosphor-icons/react";
import { PrimaryButton, TextInput, ModalState } from "sprint-asia-custom-component";
import AddPaymentMethodModal from "./AddPaymentMethodModal";

const PaymentMethodInformationSection = ({ parentFormik }) => {
  const [dataSearch, setDataSearch] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { isOpen: addPaymentMethodIsOpen, toggle: toggleAddPaymentMethod } = useDisclosure(false);
  const { isOpen: deleteConfirmationIsOpen, toggle: toggleDeleteConfirmation } = useDisclosure(false);

  const handleDeleteDataTable = () => {
    const updatedArr = parentFormik.values.paymentMethods.filter((_, index) => index !== selectedIndex);
    parentFormik.setFieldValue("paymentMethods", updatedArr);
    closeDeleteConfirmation();
  };

  const openEditPaymentMethodModal = (selectedRow) => {
    setSelectedPaymentMethod(selectedRow);
    toggleAddPaymentMethod();
  };

  const closeAddPaymentMethodModal = () => {
    toggleAddPaymentMethod();
  };

  const openDeleteConfirmation = (idx, selectedRow) => {
    toggleDeleteConfirmation();
    setSelectedIndex(idx);
    setSelectedPaymentMethod(selectedRow);
  };

  const closeDeleteConfirmation = () => {
    toggleDeleteConfirmation();
    setSelectedIndex(null);
    setSelectedPaymentMethod(null);
  };

  const columns = [
    {
      header: "Payment Method",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="text-neutral300 text-sm">{row.code}</p>
          </div>
        );
      },
    },
    {
      header: "Description",
      assessor: "description",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.description}</p>
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row, idx) => {
        return (
          <div className="flex">
            <div onClick={() => openEditPaymentMethodModal(row)}>
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

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Payment Method Information
      </div>

      <div className="flex items-center justify-between">
        <TextInput
          placeholder="Search"
          className="max-w-sm"
          leftAdornment={<MagnifyingGlass />}
          onChangeInput={(e) => setDataSearch(e.target.value)}
        />

        <PrimaryButton
          onClick={toggleAddPaymentMethod}
          title={
            <div className="flex items-center gap-2">
              <Plus />
              <p>Add Payment Data</p>
            </div>
          }
        />
      </div>

      <div className="rounded-md border border-neutral30 overflow-hidden">
        <DataTable
          staticData={parentFormik.values.paymentMethods?.filter((method) =>
            Object.values(method).some((val) => val?.toString().toLowerCase().includes(dataSearch.toLowerCase()))
          )}
          columns={columns}
          options={{ pagination: true, isRounded: true }}
          onClickRow={() => {}}
        />
      </div>

      <AddPaymentMethodModal
        isOpen={addPaymentMethodIsOpen}
        onClose={closeAddPaymentMethodModal}
        parentFormik={parentFormik}
        selectedPaymentMethod={selectedPaymentMethod}
        setSelectedPaymentMethod={setSelectedPaymentMethod}
      />

      <ModalState
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete the Payment method: ${selectedPaymentMethod?.name}? This action cannot be undone.`}
        isOpen={deleteConfirmationIsOpen}
        onClose={closeDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Payment method</p>
          </div>
        }
        leftAction={closeDeleteConfirmation}
        rightAction={handleDeleteDataTable}
      />
    </div>
  );
};

export default PaymentMethodInformationSection;
