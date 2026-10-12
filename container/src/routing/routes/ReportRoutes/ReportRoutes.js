import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const DashboardCampaignReportPage = React.lazy(() => import("report/DashboardCampaignReportPage"));
const DetailCampaignReportPage = React.lazy(() => import("report/DetailCampaignReportPage"));
const DashboardRewardReportPage = React.lazy(() => import("report/DashboardRewardReportPage"));
const DashboardDetailsReportPage = React.lazy(() => import("report/DashboardDetailsReportPage"));
const DashboardCustomerReportPage = React.lazy(() => import("report/DashboardCustomerReportPage"));
const DetailCustomerReportPage = React.lazy(() => import("report/DetailCustomerReportPage"));
const MaintenancePage = React.lazy(() => import("report/MaintenancePage"));

const ReportRoutes = ({ userInfo, setTitleHeader }) => {
  return (
    <Routes>
      <Route
        path="/summary/campaign"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardCampaignReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/summary/campaign/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailCampaignReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/summary/reward"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardRewardReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/details"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardDetailsReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer-360"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardCustomerReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/customer-360/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Report - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailCustomerReportPage
              roleAccess={userInfo.roleName}
              userInfo={userInfo}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/analytic"
        element={<MaintenancePage roleAccess={userInfo.roleName} userInfo={userInfo} setTitleHeader={setTitleHeader} />}
      />
    </Routes>
  );
};

export default ReportRoutes;
