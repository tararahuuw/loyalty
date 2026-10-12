import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardVoucher from "../pages/voucher/dashboardVoucher";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/prezent/loyalty-setting/rewards/*"
          element={
            <Routes>
              <Route path="/" element={<DashboardVoucher setTitleHeader={() => {}} />} />
            </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
