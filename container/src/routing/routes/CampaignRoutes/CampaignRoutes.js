import React from "react";
import { connect } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { mapDispatchToProps, mapStateToProps } from "../../../state/redux";
import UserAccessGuard from "../../../provider/UserAccessGuard";

// Point Rules
const PointRulesDashboardPage = React.lazy(() => import("campaign/PointRulesDashboardPage"));
const DetailPointRulesPage = React.lazy(() => import("campaign/DetailPointRulesPage"));
const AddPointRulesPage = React.lazy(() => import("campaign/AddPointRulesPage"));
const EditPointRulesPage = React.lazy(() => import("campaign/EditPointRulesPage"));
const SimulationDashboardPage = React.lazy(() => import("campaign/SimulationDashboardPage"));
const SimulationPage = React.lazy(() => import("campaign/SimulationPage"));
const AddSimulationPage = React.lazy(() => import("campaign/AddSimulationPage"));
const DetailSimulationPage = React.lazy(() => import("campaign/DetailSimulationPage"));

const CampaignRoutes = ({ campaignId, handleSetCampaignId, balance, setTitleHeader }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  const userInfo = {
    userName: JSON.parse(localStorage.getItem("userName")),
    phoneNumber: JSON.parse(localStorage.getItem("valueLogin"))?.phoneNumber,
    email: JSON.parse(localStorage.getItem("valueLogin"))?.email,
  };
  return (
    <Routes>
      {/* Point Rules Management */}
      <Route
        path="/"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <PointRulesDashboardPage companyId={companyId} setTitleHeader={setTitleHeader} />
          </UserAccessGuard>
        }
      />
      <Route
        path="/add"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddPointRulesPage companyId={companyId} setTitleHeader={setTitleHeader} balance={balance} />
          </UserAccessGuard>
        }
      />
      <Route
        path="/edit/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <EditPointRulesPage companyId={companyId} setTitleHeader={setTitleHeader} />
          </UserAccessGuard>
        }
      />
      <Route
        path="/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailPointRulesPage companyId={companyId} setTitleHeader={setTitleHeader} />
          </UserAccessGuard>
        }
      />
      <Route
        path="/simulation"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <SimulationDashboardPage
              companyId={companyId}
              campaignId={campaignId}
              handleSetCampaignId={handleSetCampaignId}
              setTitleHeader={setTitleHeader}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/simulation/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <SimulationPage
              companyId={companyId}
              setTitleHeader={setTitleHeader}
              userInfo={userInfo}
              handleSetCampaignId={handleSetCampaignId}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/simulation/add"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <AddSimulationPage
              companyId={companyId}
              setTitleHeader={setTitleHeader}
              userInfo={userInfo}
              handleSetCampaignId={handleSetCampaignId}
            />
          </UserAccessGuard>
        }
      />
      <Route
        path="/simulation/detail/:id"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Approval - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DetailSimulationPage companyId={companyId} setTitleHeader={setTitleHeader} userInfo={userInfo} />
          </UserAccessGuard>
        }
      />
    </Routes>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(CampaignRoutes);
