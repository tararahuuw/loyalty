import React, { useState, useEffect } from "react";
import { TabBar } from "sprint-asia-custom-component";
import VoucherSection from "../../../components/VoucherSection/VoucherSection";
import GoodsSection from "../../../components/GoodsSection/GoodsSection";
import DiscountAndCashbackSection from "../../../components/DiscountAndCashbackSection/DiscountAndCashbackSection";

const DashboardVoucher = ({ setTitleHeader, balance = 0, companyId }) => {
  const [currentTab, setCurrentTab] = useState("Voucher");

  useEffect(() => {
    setTitleHeader(currentTab);
  }, [currentTab]);
  return (
    <>
      {/* <div className="sticky top-0 z-10">
        <TabBar
          dataBar={["Voucher", "Goods", "Cashback & Discounts"]}
          dataValue={["Voucher", "Goods", "Cashback & Discounts"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
      </div> */}

      {currentTab === "Voucher" && <VoucherSection balance={balance} companyId={companyId} />}
      {currentTab === "Goods" && <GoodsSection />}
      {currentTab === "Cashback & Discounts" && <DiscountAndCashbackSection />}
    </>
  );
};

export default DashboardVoucher;
