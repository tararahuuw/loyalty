import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import DataTable from "prezent/DataTable";
import { SearchDropdown, Chip, TabBar, OutlineButton } from "sprint-asia-custom-component";
import { NotePencil, Trash, DownloadSimpleIcon } from "@phosphor-icons/react";
import {
  CreateDownloadProducts,
  CreateProduct,
  CreateProductBulk,
  DeleteProduct,
  DeleteProductSpecifications,
  DownloadProducts,
  EditProducts,
  GetAllCategory,
  GetAllProduct,
} from "../../../service/inventoryManagement/endpoint/product";
import AddButton from "../../shared/AddButton";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import AddBulkProductModal from "../ProductForm/AddBulkProductModal";
import AddSingleProductModal from "../ProductForm/AddSingleProductModal";
import SpecificationCell from "../ProductTable/SpecificationCell";
import SKUCell from "../ProductTable/SKUCell";
import PriceCell from "../ProductTable/PriceCell";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";

const ProductSection = ({ roleAccess, loyaltyId, setTitleHeader }) => {
  const navigate = useNavigate();
  const [reRender, setReRender] = useState(false);
  const [products, setProducts] = useState();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ category: [] });
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Product Name",
    value: "productName",
  });
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedSpecifications, setSelectedSpecifications] = useState(null);

  const {
    isOpen: addBulkProductIsOpen,
    toggle: toggleAddBulkProduct,
    close: closeAddBulkProduct,
    open: openAddBulkProduct,
  } = useDisclosure(false);
  const {
    isOpen: addSingleProductIsOpen,
    toggle: toggleSingleProduct,
    close: closeSingleProduct,
  } = useDisclosure(false);
  const { isOpen: isLoading, toggle: toggleIsLoading } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const {
    isOpen: deleteModalSpecificationsIsOpen,
    open: openDeleteSpecificationsModal,
    close: closeDeleteSpecificationsModal,
  } = useDisclosure(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const [confirmSubmitData, setConfirmSubmitData] = useState({ totalSuccessRows: 0, totalFailedRows: 0, items: [] });
  const [openRows, setOpenRows] = useState({});
  const { data: categories } = useFetch(GetAllCategory, "categories", [], {});

  const handleToggleRowOpen = (rowId) => {
    setOpenRows((prev) => ({
      ...prev,
      [rowId]: true, // Atau toggle kalau mau tutup juga
    }));
  };

  const dataOptions = [{ option: "Product Name", value: "productName" }];

  function handleSubmitDownload() {
    closeAddBulkProduct();
  }

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

  const handleOpenConfirmSubmit = ({ totalSuccessRows, totalFailedRows, items }) => {
    setConfirmSubmitData({ totalSuccessRows, totalFailedRows, items });
    setIsConfirmSubmitOpen(true);
  };

  const handleCloseConfirmSubmit = () => {
    setIsConfirmSubmitOpen(false);
  };

  const handleConfirmSubmit = () => {
    if (handleSubmitDownloadProducts) {
      handleSubmitDownloadProducts(confirmSubmitData.items, () => {});
    }
    setIsConfirmSubmitOpen(false);
  };

  const handleOpenEditProducts = (row) => {
    toggleSingleProduct();
    setSelectedRow(row);
  };

  const handleOpenDeleteConfirmation = (row) => {
    setSelectedRow(row);
    openDeleteModal();
  };
  const handleOpenDeleteSpecificationsConfirmation = (specification, row) => {
    setSelectedRow(row);
    setSelectedSpecifications(specification);
    openDeleteSpecificationsModal();
  };

  const handleCloseDeleteConfirmation = (row) => {
    setSelectedRow(null);
    closeDeleteModal();
  };

  const handleCloseDeleteSpecificationsConfirmation = () => {
    setSelectedRow(null);
    setSelectedSpecifications(null);
    closeDeleteSpecificationsModal();
  };

  const handleDeleteProduct = async () => {
    try {
      closeDeleteModal();
      await DeleteProduct(selectedRow.id);
      setReRender(!reRender);
      handleOpenModalResult("success", "Product has been successfully deleted from the list.");
    } catch (error) {
      handleOpenModalResult("failed", "Failed to delete product. Please try again.");
      setSelectedRow(null);
    }
  };

  const handleDeleteSpecificationsProduct = async () => {
    try {
      closeDeleteSpecificationsModal();
      await DeleteProductSpecifications(selectedRow.id, selectedSpecifications.id);
      setReRender(!reRender);
      handleOpenModalResult("success", "Product has been successfully deleted from the list.");
      setSelectedRow(null);
      setSelectedSpecifications(null);
    } catch (error) {
      handleOpenModalResult("failed", "Failed to delete product. Please try again.");
      setSelectedRow(null);
      setSelectedSpecifications(null);
    }
  };

  const handleSubmitProduct = async (form, resetForm) => {
    try {
      toggleIsLoading();
      closeSingleProduct();
      if (selectedRow) {
        await EditProducts(roleAccess, { ...form, id: selectedRow.id });
      } else {
        await CreateProduct(roleAccess, { products: Array.isArray(form) ? form : [form] });
      }
      resetForm();
      setSelectedRow(null);
      setReRender(!reRender);
      toggleIsLoading();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          `The product information has been successfully ${selectedRow ? "updated" : "added"}.`,
        );
      }, 250);
    } catch (error) {
      handleOpenModalResult(
        "failed",
        `Sorry, unable to ${selectedRow ? "edit" : "adding"} product at the moment. Please try again`,
      );
      toggleIsLoading();
      setSelectedRow(null);
    }
  };

  const handleSubmitProductsBulk = async (items, resetForm) => {
    try {
      toggleLoadingModal();
      await CreateProductBulk(roleAccess, {
        loyaltyID: loyaltyId,
        products: items,
      });
      resetForm();
      setSelectedRow(null);
      setReRender(!reRender);

      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Bulk payment method has been successfully added");
      }, 500);
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to add bulk payment method at the moment. Please try again");
      toggleLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleSubmitDownloadProducts = async (items, resetForm) => {
    try {
      toggleLoadingModal();
      handleCloseConfirmSubmit();
      const response = await CreateDownloadProducts(roleAccess, {
        loyaltyID: loyaltyId,
        products: items,
      });

      if (response && response.size > 0) {
        const blob = response;
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `Failed_Products_${moment().format("DD-MM-YYYY_HH-mm-ss")}.xlsx`;
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(link);
        toggleLoadingModal();
        resetForm();
        setSelectedRow(null);
        setReRender(!reRender);
        setTimeout(() => {
          handleOpenModalResult("success", "Bulk payment method has been successfully added and downloaded");
        }, 500);
      } else {
        toggleLoadingModal();
        setSelectedRow(null);
        handleOpenModalResult("failed", "The requested data is not available for download.");
      }
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to add bulk payment method at the moment. Please try again");
      toggleLoadingModal();
      setSelectedRow(null);
    }
  };

  const handleDownloadProducts = async () => {
    try {
      toggleLoadingModal();
      const response = await DownloadProducts({
        dataSearch,
        dataFilter: dataFilterSearch.value,
        body: dataFilter,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `product_${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      toggleLoadingModal();
      handleOpenModalResult("success", `Product data downloaded successfully.`);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", `Failed to download Product data. Please try again.`);
    }
  };

  const columns = [
    {
      header: "Product Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.productName}</p>
          </div>
        );
      },
    },
    {
      header: "Specification",
      tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
      Cell: (row) => {
        return (
          <>
            <SpecificationCell row={row} isOpen={openRows[row.id]} onOpen={() => handleToggleRowOpen(row.id)} />
          </>
        );
      },
    },
    {
      header: "SKU",
      assessor: "sku",
      tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
      Cell: (row) => {
        return (
          <>
            <SKUCell row={row} isOpen={openRows[row.id]} />
          </>
        );
      },
    },
    {
      header: "Price",
      tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
      Cell: (row) => {
        return (
          <>
            <PriceCell
              row={row}
              isOpen={openRows[row.id]}
              onDelete={(specification) => handleOpenDeleteSpecificationsConfirmation(specification, row)}
            />
          </>
        );
      },
    },
    {
      header: "Brand",
      assessor: "brandName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.brand}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return <Chip title={row.status ? "Active" : "Inactive"} type={row.status ? "success" : "neutral"} />;
      },
    },
    {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div onClick={() => navigate(`/prezent/loyalty-setting/inventory/product/edit/${row.id}`)}>
              <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <div onClick={() => handleOpenDeleteConfirmation(row)}>
              <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          </div>
        );
      },
    },
  ];

  const [currentTab, setCurrentTab] = useState("Products");

  useEffect(() => {
    setTitleHeader(currentTab);
  }, [currentTab]);

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
        className="flex-1 overflow-y-auto bg-neutral20 pb-6 py-16 px-8"
        style={{ minHeight: "calc(100dvh - 165px)" }}
      >
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

              <OutlineButton
                title={
                  <div className="flex items-center gap-1">
                    <DownloadSimpleIcon />
                    <p>Download</p>
                  </div>
                }
                isActive={products?.data?.length || false}
                onClick={handleDownloadProducts}
              />
            </div>
            <AddButton
              addBulkHandler={toggleAddBulkProduct}
              addSingleHandler={() => navigate("/prezent/loyalty-setting/inventory/product/add")}
              title="Add Product"
            />
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllProduct}
              queryName="products"
              dependencies={[dataFilterSearch.value, dataSearch]}
              params={{
                dataSearch,
                dataFilter: dataFilterSearch.value,
                body: dataFilter,
              }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(id) => navigate(`/prezent/loyalty-setting/inventory/product/${id}`)}
              loadingIndicator={isLoading}
              getResponse={setProducts}
            />
          </div>
        </div>

        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingModalIsOpen}
          onClose={toggleLoadingModal}
        />

        <ResultModal
          subtitle={dataSubtitleModal}
          type={flagResult}
          isOpen={resultModalIsOpen}
          onClose={closeResultModal}
        />

        <StateModal
          title="Delete Product"
          subtitle={`Are you sure you want to delete this product? This action cannot be undone.`}
          isOpen={deleteModalIsOpen}
          onClose={handleCloseDeleteConfirmation}
          type="danger"
          titleButtonRight={"Delete"}
          leftAction={handleCloseDeleteConfirmation}
          rightAction={handleDeleteProduct}
        />

        <StateModal
          title="Delete Product Specifications"
          subtitle={`Are you sure you want to delete this product specifications? This action cannot be undone.`}
          isOpen={deleteModalSpecificationsIsOpen}
          onClose={handleCloseDeleteSpecificationsConfirmation}
          type="danger"
          titleButtonRight={"Delete"}
          leftAction={handleCloseDeleteSpecificationsConfirmation}
          rightAction={handleDeleteSpecificationsProduct}
        />

        <AddSingleProductModal
          isOpen={addSingleProductIsOpen}
          onClose={() => {
            toggleSingleProduct();
            setSelectedRow(null);
          }}
          selectedProduct={selectedRow}
          categories={categories}
          roleAccess={roleAccess}
          onSubmit={handleSubmitProduct}
        />

        <AddBulkProductModal
          isOpen={addBulkProductIsOpen}
          onClose={closeAddBulkProduct}
          existingProducts={products?.data}
          onSubmit={handleSubmitProduct}
          handleSubmitDownload={handleSubmitDownload}
          loyaltyId={loyaltyId}
          onOpen={openAddBulkProduct}
          reRender={() => setReRender(!reRender)}
        />

        <StateModal
          title="Confirmation"
          subtitle={`You are about to proceed with submitting ${confirmSubmitData.totalSuccessRows} data entries and downloading ${confirmSubmitData.totalFailedRows} entries marked as Failed. Are you sure you want to continue ?`}
          isOpen={isConfirmSubmitOpen}
          onClose={handleCloseConfirmSubmit}
          type="default"
          titleButtonRight="Yes, Continue"
          leftAction={handleCloseConfirmSubmit}
          rightAction={handleConfirmSubmit}
        />
      </div>
    </>
  );
};

export default ProductSection;
