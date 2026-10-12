import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPointRules from "../pages/pointrules/dashboardPointRules";
import AddPointRules from "../pages/pointrules/addPointRules";
import EditPointRules from "../pages/pointrules/editPointRules";

const Routing = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/prezent/campaign/*"
          element={
            <Routes>
              <Route path="/" element={<DashboardPointRules setTitleHeader={() => {}} />} />
              <Route path="/add" element={<AddPointRules setTitleHeader={() => {}} />} />
              <Route path="/edit/:id" element={<EditPointRules setTitleHeader={() => {}} />} />
            </Routes>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
