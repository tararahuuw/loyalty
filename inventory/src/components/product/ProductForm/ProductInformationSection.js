import React, { useState } from "react";
import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import { MagnifyingGlass, NotePencil, Trash } from "@phosphor-icons/react";
import { Chip, ModalState, TextInput } from "sprint-asia-custom-component";
import AddButton from "../../shared/AddButton";
import AddSingleProductModal from "./AddSingleProductModal";
import AddBulkProductModal from "./AddBulkProductModal";
import { GetAllCategory } from "../../../service/inventoryManagement/endpoint/product";

const ProductInformationSection = ({ parentFormik, roleAccess }) => {
  const [dataSearch, setDataSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { isOpen: addBulkProductIsOpen, toggle: toggleAddBulkProduct } = useDisclosure(false);
  const { isOpen: addSingleProductIsOpen, toggle: toggleSingleProduct } = useDisclosure(false);
  const { isOpen: deleteConfirmationIsOpen, toggle: toggleDeleteConfirmation } = useDisclosure(false);
  const { data: categories } = useFetch(GetAllCategory, "categories", [], {});

  const handleDeleteDataTable = () => {
    const updatedArr = parentFormik.values.products.filter((_, index) => index !== selectedIndex);
    parentFormik.setFieldValue("products", updatedArr);
    closeDeleteConfirmation();
  };

  const openEditProductModal = (selectedRow) => {
    setSelectedProduct(selectedRow);
    toggleSingleProduct();
  };

  const closeAddSingleProductModal = () => {
    toggleSingleProduct();
  };

  const openDeleteConfirmation = (idx, selectedRow) => {
    toggleDeleteConfirmation();
    setSelectedIndex(idx);
    setSelectedProduct(selectedRow);
  };

  const closeDeleteConfirmation = () => {
    toggleDeleteConfirmation();
    setSelectedIndex(null);
    setSelectedProduct(null);
  };

  const columns = [
    {
      header: "SKU / ID",
      assessor: "skuId",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.skuId}</p>
          </div>
        );
      },
    },
    {
      header: "Product Name",
      assessor: "productName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.productName}</p>
          </div>
        );
      },
    },
    {
      header: "Category",
      assessor: "category",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.category}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <div>
            <Chip title={row.status ? "Active" : "Inactive"} type={row.status ? "success" : "neutral"} />
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row, idx) => {
        return (
          <div className="flex">
            <div onClick={() => openEditProductModal(row)}>
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
        Product Information
      </div>

      <div className="flex items-center justify-between">
        <TextInput
          placeholder="Search"
          className="max-w-sm"
          leftAdornment={<MagnifyingGlass />}
          onChangeInput={(e) => setDataSearch(e.target.value)}
        />

        <AddButton addBulkHandler={toggleAddBulkProduct} addSingleHandler={toggleSingleProduct} title="Add Product" />
      </div>

      <div className="rounded-md border border-neutral30 overflow-hidden">
        <DataTable
          staticData={parentFormik.values.products?.filter((product) =>
            Object.values(product).some((val) => val?.toString().toLowerCase().includes(dataSearch.toLowerCase()))
          )}
          columns={columns}
          options={{ pagination: true, isRounded: true }}
          onClickRow={() => {}}
        />
      </div>

      <AddSingleProductModal
        isOpen={addSingleProductIsOpen}
        onClose={closeAddSingleProductModal}
        parentFormik={parentFormik}
        selectedProduct={selectedProduct}
        roleAccess={roleAccess}
        categories={categories}
        setSelectedProduct={setSelectedProduct}
      />

      <AddBulkProductModal
        isOpen={addBulkProductIsOpen}
        title="Add Bulk Product"
        formik={parentFormik}
        onClose={toggleAddBulkProduct}
        categories={categories}
        existingProducts={parentFormik.values.products}
      />

      <ModalState
        title="Confirm Deletion"
        subtitle={`Are you sure you want to delete the Product: ${selectedProduct?.productName}? This action cannot be undone.`}
        isOpen={deleteConfirmationIsOpen}
        onClose={closeDeleteConfirmation}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Product</p>
          </div>
        }
        leftAction={closeDeleteConfirmation}
        rightAction={handleDeleteDataTable}
      />
    </div>
  );
};

export default ProductInformationSection;
