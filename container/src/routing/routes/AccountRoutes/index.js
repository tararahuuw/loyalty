import React from "react";
import { Route, Routes } from "react-router-dom";
import UserAccessGuard from "../../../provider/UserAccessGuard";

const AddUserPage = React.lazy(() => import("account/AddUserPage"));
const EditUserPage = React.lazy(() => import("account/EditUserPage"));
const UserDashboardPage = React.lazy(() => import("account/UserDashboardPage"));

const ClientDashboardPage = React.lazy(() => import("account/ClientDashboardPage"));
const DetailClientPage = React.lazy(() => import("account/DetailClientPage"));
const AddClientPage = React.lazy(() => import("account/AddClientPage"));
const EditClientPage = React.lazy(() => import("account/EditClientPage"));

const DivisionDashboardPage = React.lazy(() => import("account/DivisionDashboardPage"));
const DetailDivisionPage = React.lazy(() => import("account/DetailDivisionPage"));
const EditDivisionPage = React.lazy(() => import("account/EditDivisionPage"));
const AddDivisionPage = React.lazy(() => import("account/AddDivisionPage"));

const PointConvertionDashboardPage = React.lazy(() => import("account/PointConvertionDashboardPage"));

const AccountRoutes = ({ userInfo, setTitleHeader }) => {
  const companyId = JSON.parse(localStorage.getItem("valueLogin"))?.corporateId;

  return (
    <Routes>
      {/* Client Management */}
      <Route
        path="/client"
        element={<ClientDashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/client/add"
        element={<AddClientPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/client/:id"
        element={<DetailClientPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/client/edit/:id"
        element={<EditClientPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />

      {/* User Management */}
      <Route
        path="/user"
        element={
          <UserDashboardPage
            roleAccess={userInfo.roleName}
            setTitleHeader={setTitleHeader}
            userClient={userInfo.clientId}
          />
        }
      />
      <Route
        path="/user/add"
        element={<AddUserPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/user/edit/:id"
        element={<EditUserPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />

      {/* Division Management */}
      <Route
        path="/division"
        element={<DivisionDashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/division/add"
        element={<AddDivisionPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/division/add/:id"
        element={<AddDivisionPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/division/:id"
        element={<DetailDivisionPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
      <Route
        path="/division/edit/:id"
        element={<EditDivisionPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />

      {/* Point Convertion */}
      <Route
        path="/point-conversion"
        element={
          <UserAccessGuard
            allowedRoles={[
              "Client Admin - Loyalty",
              "Client User - Loyalty",
              "Client WhatsApp - Loyalty",
              "Client Loyalty",
            ]}
          >
            <PointConvertionDashboardPage
              roleAccess={userInfo.roleName}
              setTitleHeader={setTitleHeader}
              clientId={companyId}
            />
          </UserAccessGuard>
        }
      />
    </Routes>
  );
};

export default AccountRoutes;
