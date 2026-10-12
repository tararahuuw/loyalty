import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const DasboardTierLevelPage = React.lazy(() => import("engagement/DasboardTierLevelPage"));
const AddTierLevelPage = React.lazy(() => import("engagement/AddTierLevelPage"));
const EditTierLevelPage = React.lazy(() => import("engagement/EditTierLevelPage"));
const DashboardCustomersPage = React.lazy(() => import("engagement/DashboardCustomersPage"));
const DashboardTransactionsPage = React.lazy(() => import("engagement/DashboardTransactionsPage"));
const DashboardPointsPage = React.lazy(() => import("engagement/DashboardPointsPage"));

const EngagementRoutes = ({ userInfo, setTitleHeader, loyaltyId }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  return (
    <Routes>
      <Route
        path="/customer/tier-level"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DasboardTierLevelPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer/tier-level/add"
        element={
          <UserAccessGuard allowedRoles={["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"]}>
            <AddTierLevelPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer/tier-level/edit/:id"
        element={
          <UserAccessGuard allowedRoles={["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"]}>
            <EditTierLevelPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer/customers"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardCustomersPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              clientId={companyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer/transactions"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardTransactionsPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              clientId={companyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer/points"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardPointsPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              loyaltyId={loyaltyId}
              clientId={companyId}
              userInfo={userInfo}
            />
          </UserAccessGuard>
        }
      />
    </Routes>
  );
};

export default EngagementRoutes;
