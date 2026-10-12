import React, { useEffect, useState, createContext, useContext } from "react";

const RemoteStatusContext = createContext();

export const CheckRemoteStatusProvider = ({ children }) => {
  const [adminRemoteIsUp, setAdminRemoteIsUp] = useState(false);
  const [campaignRemoteIsUp, setCampaignRemoteIsUp] = useState(false);
  const [rewardRemoteIsUp, setRewardRemoteIsUp] = useState(false);
  const [settingRemoteIsUp, setSettingRemoteIsUp] = useState(false);
  const [engagementRemoteIsUp, setEngagementRemoteIsUp] = useState(false);
  const [redeemRemoteIsUp, setRedeemRemoteIsUp] = useState(false);
  const [reportRemoteIsUp, setReportRemoteIsUp] = useState(false);
  const [inventoryRemoteIsUp, setInventoryRemoteIsUp] = useState(false);
  const [dashboardRemoteIsUp, setDashboardRemoteIsUp] = useState(false);

  const checkRemoteStatus = async (url, setStatus) => {
    try {
      const response = await fetch(url);
      setStatus(response.ok);
    } catch (error) {
      setStatus(false);
    }
  };

  useEffect(() => {
    checkRemoteStatus(`${process.env.REACT_APP_ACCOUNT_HOST}remoteEntry.js`, setAdminRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_CAMPAIGN_HOST}remoteEntry.js`, setCampaignRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_ENGAGEMENT_HOST}remoteEntry.js`, setEngagementRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_INVENTORY_HOST}remoteEntry.js`, setInventoryRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_REDEEM_HOST}remoteEntry.js`, setRedeemRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_REPORT_HOST}remoteEntry.js`, setReportRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_REWARD_HOST}remoteEntry.js`, setRewardRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_SETTING_HOST}remoteEntry.js`, setSettingRemoteIsUp);
    checkRemoteStatus(`${process.env.REACT_APP_DASHBOARD_HOST}remoteEntry.js`, setDashboardRemoteIsUp);
  }, []);

  return (
    <RemoteStatusContext.Provider
      value={{
        adminRemoteIsUp,
        campaignRemoteIsUp,
        rewardRemoteIsUp,
        settingRemoteIsUp,
        engagementRemoteIsUp,
        redeemRemoteIsUp,
        reportRemoteIsUp,
        inventoryRemoteIsUp,
        dashboardRemoteIsUp,
      }}
    >
      {children}
    </RemoteStatusContext.Provider>
  );
};

export const useCheckRemoteStatus = () => {
  return useContext(RemoteStatusContext);
};
