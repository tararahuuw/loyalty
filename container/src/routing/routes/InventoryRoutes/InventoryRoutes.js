import React from "react";
import { Route, Routes } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../../../state/redux";
import { connect } from "react-redux";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const StoreDashboardPage = React.lazy(() => import("inventory/StoreDashboardPage"));
const AddStorePage = React.lazy(() => import("inventory/AddStorePage"));
const EditStorePage = React.lazy(() => import("inventory/EditStorePage"));
const DetailStorePage = React.lazy(() => import("inventory/DetailStorePage"));

const CategoryDashboardPage = React.lazy(() => import("inventory/CategoryDashboardPage"));
const AddCategoryPage = React.lazy(() => import("inventory/AddCategoryPage"));

const SpecificationDashboardPage = React.lazy(() => import("inventory/SpecificationDashboardPage"));

const ProductDashboardPage = React.lazy(() => import("inventory/ProductDashboardPage"));
const DetailProductPage = React.lazy(() => import("inventory/DetailProductPage"));
const AddProductPage = React.lazy(() => import("inventory/AddProductPage"));
const EditProductPage = React.lazy(() => import("inventory/EditProductPage"));

const PaymentMethodDashboardPage = React.lazy(() => import("inventory/PaymentMethodDashboardPage"));
const DetailPaymentMethodPage = React.lazy(() => import("inventory/DetailPaymentMethodPage"));
const AddPaymentMethodPage = React.lazy(() => import("inventory/AddPaymentMethodPage"));
const EditPaymentMethodPage = React.lazy(() => import("inventory/EditPaymentMethodPage"));

const InventoryRoutes = ({ userInfo, handleSetCategory, category, setTitleHeader }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  return (
    <Routes>
      {/* Store Management */}
      <Route
        path="/store"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <StoreDashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/store/add"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddStorePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/store/add/:merchantId/:clientId"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddStorePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/store/edit/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <EditStorePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/store/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailStorePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      {/* Category Management */}
      <Route
        path="/category"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <CategoryDashboardPage
              setTitleHeader={setTitleHeader}
              corporateId={companyId}
              handleSetCategory={handleSetCategory}
              category={category}
            />
          </UserAccessGuard>
        }
      />

      <Route
        path="/category/add"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddCategoryPage
              handleSetCategory={handleSetCategory}
              category={category}
              corporateId={companyId}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />

      {/* Specification Management */}
      <Route
        path="/specification"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <SpecificationDashboardPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              corporateId={companyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />

      <Route
        path="/product"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <ProductDashboardPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              userInfo={userInfo}
              corporateId={companyId}
            />
          </UserAccessGuard>
        }
      />

      <Route
        path="/product/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailProductPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/product/add"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddProductPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/product/edit/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <EditProductPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      {/* Payment Method Management */}
      <Route
        path="/payment-method"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <PaymentMethodDashboardPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              userInfo={userInfo}
              companyId={companyId}
            />
          </UserAccessGuard>
        }
      />

      <Route
        path="/payment-method/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailPaymentMethodPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />

      <Route
        path="/payment-method/add"
        element={
          <UserAccessGuard allowedRoles={["Client Admin - Loyalty", "Client Loyalty"]}>
            <AddPaymentMethodPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />

      <Route
        path="/payment-method/edit/:id"
        element={
          <UserAccessGuard allowedRoles={["Client Admin - Loyalty", "Client Loyalty"]}>
            <EditPaymentMethodPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />
    </Routes>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(InventoryRoutes);
