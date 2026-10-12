import React from "react";
import { useState } from "react";
import { TabBar } from "sprint-asia-custom-component";
import ProductSection from "../../../components/product/ProductSection/ProductSection";
import { useEffect } from "react";
import CategorySection from "../../../components/category/CategorySection/CategorySection";
import SpecificationSection from "../../../components/specification/SpecificationSection/SpecificationSection";

const DashboardProduct = ({ roleAccess, setTitleHeader, corporateId, userInfo }) => {
  const [currentTab, setCurrentTab] = useState("Categories");

  useEffect(() => {
    setTitleHeader(currentTab);
  }, [currentTab]);
  return (
    <>
      <div className="fixed top-[195px] z-10 w-full">
        <TabBar
          dataBar={["Categories", "Specifications", "Products"]}
          dataValue={["Categories", "Specifications", "Products"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
      </div>

      {currentTab === "Categories" && (
        <CategorySection roleAccess={roleAccess} corporateId={corporateId} userInfo={userInfo} />
      )}
      {currentTab === "Specifications" && (
        <SpecificationSection roleAccess={roleAccess} corporateId={corporateId} userInfo={userInfo} />
      )}
      {currentTab === "Products" && (
        <ProductSection roleAccess={roleAccess} corporateId={corporateId} userInfo={userInfo} />
      )}
    </>
  );
};

export default DashboardProduct;
