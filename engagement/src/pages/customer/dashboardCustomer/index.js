import React, { useEffect, useState } from "react";
import { TabBar } from "sprint-asia-custom-component";
import CustomersSection from "../../../components/Customer/CustomersSection/CustomersSection";
import PointsSection from "../../../components/Customer/PointsSection/PointsSection";
import TransactionsSection from "../../../components/Customer/TransactionsSection/TransactionsSection";
import DashboardTieringLevel from "../../tieringLevel/dashboardTieringLevel";

const DashboardCustomer = ({ roleAccess, setTitleHeader, clientId, loyaltyId }) => {
  const [currentTab, setCurrentTab] = useState("Customers");

  useEffect(() => {
    setTitleHeader("Customer 360");
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10">
        <TabBar
          dataBar={["Customers", "Tier Level", "Points", "Transactions"]}
          dataValue={["Customers", "Tier Level", "Points", "Transactions"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
      </div>

      {currentTab === "Customers" && <CustomersSection clientId={clientId} loyaltyId={loyaltyId} />}
      {currentTab === "Tier Level" && (
        <DashboardTieringLevel loyaltyId={loyaltyId} roleAccess={roleAccess} setTitleHeader={() => {}} />
      )}
      {currentTab === "Points" && <PointsSection clientId={clientId} loyaltyId={loyaltyId} />}
      {currentTab === "Transactions" && <TransactionsSection clientId={clientId} loyaltyId={loyaltyId} />}
    </>
  );
};

export default DashboardCustomer;
