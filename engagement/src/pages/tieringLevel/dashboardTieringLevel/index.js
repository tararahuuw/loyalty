import React from "react";
import { useState } from "react";
import { TabBar } from "sprint-asia-custom-component";
import { useEffect } from "react";
import TierDashboardSection from "../../../components/TierDashboardSection";
import TierSettingSection from "../../../components/TierSettingSection";
import OnBoardingTieringLevel from "../onBoardingTieringLevel";
import { GetTierLevel } from "../../../service/TieringManagement/endpoint/tieringLevel";

const DashboardTieringLevel = ({ roleAccess, setTitleHeader, loyaltyId }) => {
  const [currentTab, setCurrentTab] = useState("Tier Level");
  const [conditionPage, setConditionPage] = useState(null)
  const [reRender, setReRender] = useState(false)
  const [tierData, setTierData] = useState(null)

  async function handleGetTieringLevel() {
    try {
      var response = await GetTierLevel(loyaltyId)
      if (response.data.onBoarding) {
        setConditionPage("dashboard")
        setTierData(response.data)
      }
      else {
        setConditionPage("onBoarding")
      }
    }
    catch(err) {
      setConditionPage("onBoarding")
    }
  }

  function reRenderPage() {
    setReRender(!reRender)
  }

  useEffect(() => {
    if (conditionPage) {
      setTitleHeader("Tier Level")
    }
    else {
      setTitleHeader(currentTab);
    }
  }, [currentTab]);

  useEffect(() => {
    handleGetTieringLevel()
  }, [reRender, loyaltyId])
  return (
    <>
      {
        conditionPage === "dashboard" &&
        <div className="sticky top-0 z-10">
          <TabBar
            dataBar={["Tier Level", "Tier Setting"]}
            dataValue={["Tier Level", "Tier Setting"]}
            currentTab={currentTab}
            onChangeTabBar={(tab) => setCurrentTab(tab)}
          />
        </div>
      }

      {conditionPage === "onBoarding" && <OnBoardingTieringLevel roleAccess={roleAccess} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} navigateToDashboard={() => setConditionPage("dashboard")}/>}
      {currentTab === "Tier Level" && conditionPage === "dashboard" && <TierDashboardSection roleAccess={roleAccess} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} tierData={tierData} reRenderPage={reRenderPage} />}
      {currentTab === "Tier Setting" && conditionPage === "dashboard" && <TierSettingSection roleAccess={roleAccess} setTitleHeader={setTitleHeader} loyaltyId={loyaltyId} />}
    </>
  );
};

export default DashboardTieringLevel;
