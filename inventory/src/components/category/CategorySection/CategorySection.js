import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "prezent/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import ResultModal from "prezent/ResultModal";
import StateModal from "prezent/StateModal";
import { SearchDropdown, PrimaryButton, TabBar, OutlineButton } from "sprint-asia-custom-component";
import { Plus, Trash, NotePencil, DownloadSimpleIcon } from "@phosphor-icons/react";
import {
  DeleteCategoryByID,
  GetAllCategories,
  UpdateCategoryTree,
  DownloadCategories,
} from "../../../service/inventoryManagement/endpoint/category";
import EditCategoryModal from "../EditCategoryModal";
import moment from "moment";

const CategorySection = ({ corporateId, setTitleHeader, handleSetCategory, category }) => {
  const navigate = useNavigate();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [categories, setCategories] = useState(null);
  const { isOpen: resultModalIsOpen, open: openResultModal, close: closeResultModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const { isOpen: isLoading, open: openLoading, close: closeLoading } = useDisclosure(false);
  const { isOpen: editModalIsOpen, toggle: toggleEditModal } = useDisclosure(false);

  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Category",
    value: "name",
  });

  const dataOptions = [{ option: "Category", value: "name" }];

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

  const handleOpenEditForm = (row) => {
    toggleEditModal();
    setSelectedRow(row);
  };

  const handleCloseEditForm = () => {
    toggleEditModal();
    setSelectedRow(null);
  };

  const handleOpenDeleteConfirmation = (row) => {
    setSelectedRow(row);
    openDeleteModal();
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedRow(null);
    closeDeleteModal();
  };

  const handleUpdateCategory = async (form) => {
    try {
      openLoading();
      toggleEditModal();
      await UpdateCategoryTree(selectedRow?.id, form);
      closeLoading();
      setReRender(!reRender);
      setSelectedRow(null);
      handleOpenModalResult("success", "Category has been updated.");
    } catch (error) {
      closeLoading();
      setSelectedRow(null);
      handleOpenModalResult("failed", "Sorry, we are unable to edit category at the moment. Please try again");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      openLoading();
      closeDeleteModal();
      await DeleteCategoryByID(selectedRow.id);
      closeLoading();
      setReRender(!reRender);
      setSelectedRow(null);
      handleOpenModalResult("success", "Category has been successfully deleted.");
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", "Sorry, we are unable to delete category at the moment. Please try again");
      setSelectedRow(null);
    }
  };

  const columns = [
    {
      header: "Category Level 1",
      assessor: "level 1",
      tdStyle: { maxWidth: "200px" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.level1}</p>
          </div>
        );
      },
    },
    {
      header: "Category Level 2",
      assessor: "level 2",
      tdStyle: { maxWidth: "200px" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.level2 || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Category Level 3",
      assessor: "level 3",
      tdStyle: { maxWidth: "200px" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.level3 || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Category Level 4",
      assessor: "level 4",
      tdStyle: { maxWidth: "200px" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.level4 || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Category Level 5",
      assessor: "level 5",
      tdStyle: { maxWidth: "200px" },
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.level5 || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <a onClick={() => handleOpenEditForm(row)}>
              <NotePencil size="24" className="text-primary500 cursor-pointer" />
            </a>

            <a onClick={() => handleOpenDeleteConfirmation(row)}>
              <Trash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </a>
          </div>
        );
      },
    },
  ];

  const [currentTab, setCurrentTab] = useState("Categories");

  const handleDownloadCategories = async () => {
    try {
      openLoading();
      const response = await DownloadCategories({
        dataSearch,
        dataFilter: dataFilterSearch.value,
        companyId: corporateId,
      });
      const blob = response;
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      const today = moment().format("DDMMYYYY");
      link.download = `categories-${today}`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(link);
      closeLoading();
      handleOpenModalResult("success", `Categories data downloaded successfully.`);
    } catch (error) {
      closeLoading();
      handleOpenModalResult("failed", `Failed to download Categories data. Please try again.`);
    }
  };

  useEffect(() => {
    if (dataSearch) {
      if (categories?.data?.length) {
        handleSetCategory({ option: categories?.data[0]?.level1, value: categories?.data[0]?.level1Id });
      } else {
        handleSetCategory(category);
      }
    }
  }, [dataSearch, categories]);

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
        className="flex-1 overflow-y-auto bg-neutral20 pb-6 pt-16 px-8"
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
                isActive={categories?.data?.length || false}
                onClick={handleDownloadCategories}
              />
            </div>

            <PrimaryButton
              title={
                <div className="flex gap-2 items-center">
                  <Plus />
                  <p>Add Categories</p>
                </div>
              }
              onClick={() => navigate("/prezent/loyalty-setting/inventory/category/add")}
            />
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllCategories}
              queryName="categories"
              dependencies={[dataFilterSearch.value, dataSearch]}
              params={{ dataSearch, dataFilter: dataFilterSearch.value, companyId: corporateId }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              loadingIndicator={isLoading}
              onClickRow={() => {}}
              getResponse={(data) => setCategories(data)}
            />
          </div>
        </div>

        <EditCategoryModal
          isOpen={editModalIsOpen}
          onClose={handleCloseEditForm}
          selectedCategory={selectedRow}
          onSubmit={handleUpdateCategory}
        />

        <StateModal
          title="Delete Category"
          subtitle={
            <div className="flex flex-col gap-2">
              <p>Are you sure you want to delete this category? This action cannot be undone.</p>
              <div className="flex flex-col gap-1">
                <p>Category to be deleted:</p>
                <div className="flex bg-primary50 px-4 py-1 rounded-2xl text-primary500 w-max text-sm font-medium">
                  {selectedRow?.level1}
                  {selectedRow?.level2 && ` / ${selectedRow?.level2}`}
                  {selectedRow?.level3 && ` / ${selectedRow?.level3}`}
                  {selectedRow?.level4 && ` / ${selectedRow?.level4}`}
                  {selectedRow?.level5 && ` / ${selectedRow?.level5}`}
                </div>
              </div>
            </div>
          }
          isOpen={deleteModalIsOpen}
          onClose={handleCloseDeleteConfirmation}
          type="danger"
          titleButtonRight={
            <div className="flex items-center gap-1">
              <Trash />
              <p>Delete Category</p>
            </div>
          }
          leftAction={handleCloseDeleteConfirmation}
          rightAction={handleDeleteCategory}
        />

        <ResultModal
          subtitle={dataSubtitleModal}
          type={flagResult}
          isOpen={resultModalIsOpen}
          onClose={closeResultModal}
        />
      </div>
    </>
  );
};

export default CategorySection;
