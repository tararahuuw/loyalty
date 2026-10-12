import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const ChangePasswordPage = React.lazy(() => import("settings/ChangePasswordPage"));
const AddIntegrationPage = React.lazy(() => import("settings/AddIntegrationPage"));
const DashboardParameterPage = React.lazy(() => import("settings/DashboardParameterPage"));

const SettingsRoutes = ({ userInfo, setTitleHeader }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  return (
    <Routes>
      {/* Integration Routes */}
      <Route
        path="/integration"
        element={
          <UserAccessGuard allowedRoles={["Client Admin - Loyalty", "Client Loyalty", "Client WhatsApp - Loyalty"]}>
            <AddIntegrationPage setTitleHeader={setTitleHeader} companyId={companyId} />
          </UserAccessGuard>
        }
      />

      {/* Parameter Routes */}
      <Route
        path="/parameter"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <DashboardParameterPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              clientId={companyId}
            />
          </UserAccessGuard>
        }
      />

      {/* Change Password */}
      <Route
        path="/change-password"
        element={<ChangePasswordPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
    </Routes>
  );
};

export default SettingsRoutes;
