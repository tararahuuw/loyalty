import React from "react";
import { Route, Routes } from "react-router-dom";
const DashboardPage = React.lazy(() => import("dashboard/DashboardPage"));

const DashboardRoutes = ({ userInfo, setTitleHeader }) => {
  return <Routes>
    <Route path="/" element={<DashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} userName={userInfo.userName} clientId={userInfo.clientId} divisionId={userInfo.divisionId} clientName={userInfo.clientName} divisionName={userInfo.divisionName} />} />
  </Routes>;
};

export default DashboardRoutes;
