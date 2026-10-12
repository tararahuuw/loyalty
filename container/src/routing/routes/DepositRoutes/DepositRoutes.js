import React from "react";
import { Route, Routes } from "react-router-dom";

const DepositDashboardPage = React.lazy(() => import("deposit/DepositDashboardPage"));
const OverallBalancePage = React.lazy(() => import("deposit/OverallBalancePage"));

const DepositRoutes = ({ userInfo, setTitleHeader }) => {
  return (
    <Routes>
      <Route
        path="/deposit"
        element={<DepositDashboardPage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />

      <Route
        path="/overall-balance"
        element={<OverallBalancePage roleAccess={userInfo.roleName} setTitleHeader={setTitleHeader} />}
      />
    </Routes>
  );
};

export default DepositRoutes;
