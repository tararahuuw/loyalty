import React, { useEffect, useState } from "react";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "sprint-asia-custom-component";
import { NotePencil, Trash } from "@phosphor-icons/react";
import AddSingleProductModal from "../../../components/product/ProductForm/AddSingleProductModal";
import {
  DeleteProduct,
  EditProducts,
  GetAllBrand,
  GetAllCategory,
  GetProductById,
} from "../../../service/inventoryManagement/endpoint/product";
import BasicInformationSection from "../../../components/product/DetailPage/BasicInformationSection";
import StatusSection from "../../../components/product/DetailPage/StatusSection";
import DetailActivitySection from "../../../components/product/DetailPage/DetailSpecificationSection";
import ProductInformationSection from "../../../components/product/DetailPage/ProductInformationSection";
import LoadingModal from "prezent/LoadingModal";
import StateModal from "prezent/StateModal";
import ResultModal from "prezent/ResultModal";
import DetailSpecificationSection from "../../../components/product/DetailPage/DetailSpecificationSection";

const DetailProduct = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: isLoading, toggle: toggleIsLoading } = useDisclosure(false);
  const { isOpen: storeFormIsOpen, toggle: toggleStoreForm } = useDisclosure(false);
  const { data: product, isLoading: productIsLoading } = useFetch(GetProductById, "product", [], { roleAccess, id });
  const { data: categories } = useFetch(GetAllCategory, "categories", [], {});
  const { data: brands, isLoading: brandsIsLoading } = useFetch(GetAllBrand, "brands", [], {});

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 3500);
    }, 250);
  };

  const handleDeleteProduct = async () => {
    try {
      closeDeleteModal();
      toggleIsLoading();
      await DeleteProduct(id);
      toggleIsLoading();
      handleOpenModalResult("success", "Product has been successfully deleted.");
      setTimeout(() => {
        navigate("/prezent/loyalty-setting/inventory/product");
      }, 3500);
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to delete product at the moment. Please try again");
      toggleIsLoading();
    }
  };

  const handleSubmitProduct = async (form) => {
    try {
      toggleIsLoading();
      toggleStoreForm();
      await EditProducts(roleAccess, { ...form, id });
      toggleIsLoading();
      setTimeout(() => {
        handleOpenModalResult("success", "Product has been successfully edited");
        setTimeout(() => {
          navigate("/prezent/inventory/product");
        }, 4000);
      }, 250);
    } catch (error) {
      handleOpenModalResult("failed", "Sorry, unable to edit Product at the moment. Please try again");
      toggleIsLoading();
    }
  };

  useEffect(() => {
    setTitleHeader("Detail Product");
  }, []);
  return (
    <div>
      <div className="bg-neutral20 pt-8 px-8 pb-16">
        <div className="bg-white w-full px-4 py-6 font-semibold rounded-lg shadow-sm mb-4">
          <p className={`${product?.data?.status ? "text-success500" : "text-danger500"}`}>
            Product is {product?.data?.status ? "active" : "inactive"}
          </p>
        </div>
        <BasicInformationSection data={product?.data} />
        <DetailSpecificationSection data={product?.data} />
      </div>
      <Footer
        modeLeftButton="danger"
        modeRightButton="outline"
        titleLeftButton={
          <div className="flex items-center gap-2">
            <Trash />
            <p>Delete</p>
          </div>
        }
        titleRightButton={
          <div className="flex items-center gap-2">
            <NotePencil />
            <p>Edit</p>
          </div>
        }
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={openDeleteModal}
        onClickRightButton={() => {
          navigate(`/prezent/loyalty-setting/inventory/product/edit/${id}`)
        }}
      />

      <StateModal
        title="Delete Product"
        subtitle={`Are you sure you want to delete this product? This action cannot be undone.`}
        isOpen={deleteModalIsOpen}
        onClose={closeDeleteModal}
        type="danger"
        titleButtonRight={"Delete"}
        leftAction={closeDeleteModal}
        rightAction={handleDeleteProduct}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={productIsLoading || isLoading}
        onClose={() => { }}
      />

      <AddSingleProductModal
        isOpen={storeFormIsOpen}
        onClose={toggleStoreForm}
        selectedProduct={product?.data}
        categories={categories}
        roleAccess={roleAccess}
        onSubmit={handleSubmitProduct}
      />
    </div>
  );
};

export default DetailProduct;
