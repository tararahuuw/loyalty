import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const VoucherDashboardPage = React.lazy(() => import("reward/VoucherDashboardPage"));
const GoodsDashboardPage = React.lazy(() => import("reward/GoodsDashboardPage"));
const CashbackDiscountDashboardPage = React.lazy(() => import("reward/CashbackDiscountDashboardPage"));
const MaintenancePage = React.lazy(() => import("reward/MaintenancePage"));

const RewardRoutes = ({ userInfo, setTitleHeader, loyaltyId, balance }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  return (
    <Routes>
      {/* Manage Voucher Routes */}
      <Route
        path="/voucher"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <VoucherDashboardPage setTitleHeader={setTitleHeader} balance={balance} companyId={companyId} />
          </UserAccessGuard>
        }
      />

      {/* Manage Goods Routes */}
      <Route
        path="/goods"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <MaintenancePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} />
          </UserAccessGuard>
        }
      />
      {/* <Route
        path="/goods"
        element={
          <GoodsDashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} />
        }
      /> */}

      {/* Manage Goods Routes */}
      <Route
        path="/cashbackdiscount"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <MaintenancePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} />
          </UserAccessGuard>
        }
      />
      {/* <Route
        path="/cashbackdiscount"
        element={
          <CashbackDiscountDashboardPage
            roleAccess={userInfo.roleName}
            setTitleHeader={setTitleHeader}
            loyaltyId={loyaltyId}
          />
        }
      /> */}
    </Routes>
  );
};

export default RewardRoutes;
