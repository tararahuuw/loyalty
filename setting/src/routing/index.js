import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddIntegration from "../pages/integration/addIntegration";
import DashboardParameter from "../pages/parameter/dashboardParameter";

const Routing = ({ history, ReRender }) => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/prezent/loyalty-setting/setting/*"
          element={
            <Routes>
              <Route path="/integration" element={<AddIntegration setTitleHeader={() => {}} />} />
              <Route path="/parameter" element={<DashboardParameter setTitleHeader={() => {}} />} />
            </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
