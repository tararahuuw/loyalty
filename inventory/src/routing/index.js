import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardStore from "../pages/store/dashboardStore";
import DetailStore from "../pages/store/detailStore";
import CategorySection from "../components/category/CategorySection/CategorySection";
import AddCategory from "../pages/product/addCategory";
import SpecificationSection from "../components/specification/SpecificationSection/SpecificationSection";
import ProductSection from "../components/product/ProductSection/ProductSection";
import AddProduct from "../pages/product/addProduct";
import DetailProduct from "../pages/product/detailProduct";
import EditProduct from "../pages/product/editProduct";
import DashboardPaymentMethod from "../pages/paymentMethod/dashboardPaymentMethod";

const Routing = ({ history, ReRender }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/prezent/loyalty-setting/inventory/*"
          element={
            <Routes>
              <Route path="/" element={<DashboardPaymentMethod setTitleHeader={() => {}} />} />

              <Route path="/store" element={<DashboardStore setTitleHeader={() => {}} />} />

              <Route path="/store/:id" element={<DetailStore setTitleHeader={() => {}} />} />

              <Route path="/category" element={<CategorySection setTitleHeader={() => {}} />} />

              <Route path="/category/add" element={<AddCategory setTitleHeader={() => {}} />} />

              <Route path="/specification" element={<SpecificationSection setTitleHeader={() => {}} />} />

              <Route path="/product" element={<ProductSection setTitleHeader={() => {}} />} />

              <Route path="/product/add" element={<AddProduct setTitleHeader={() => {}} />} />

              <Route path="/product/:id" element={<DetailProduct setTitleHeader={() => {}} />} />

              <Route path="/product/edit/:id" element={<EditProduct setTitleHeader={() => {}} />} />
            </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
