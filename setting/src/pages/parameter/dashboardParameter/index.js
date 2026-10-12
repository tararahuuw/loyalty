import React, { useState } from "react";
import { TabBar } from "sprint-asia-custom-component";
import ParameterSection from "../../../components/ParameterSection/ParameterSection";
import ProgramSection from "../../../components/ProgramSection/ProgramSection";

const DashboardParameter = ({ roleAccess, setTitleHeader, clientId }) => {
  const [currentTab, setCurrentTab] = useState("Parameter");

  return (
    <>
      {/* <div className="sticky top-0 z-10">
        <TabBar
          dataBar={["Parameter", "Program"]}
          dataValue={["Parameter", "Program"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
      </div> */}

      {currentTab === "Parameter" && (
        <ParameterSection roleAccess={roleAccess} companyId={clientId} setTitleHeader={setTitleHeader} />
      )}
      {currentTab === "Program" && <ProgramSection setTitleHeader={setTitleHeader} roleAccess={roleAccess} companyId={clientId} />}
    </>
  );
};

export default DashboardParameter;
