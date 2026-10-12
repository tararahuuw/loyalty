import React from "react";

const LandingPageSmallTabBar = ({
  currentTab = "all",
  dataBar = ["All Voucher", "Digital Voucher", "PPOB Voucher", "Loyalty Voucher"],
  dataValue = ["All Voucher", "Digital Voucher", "PPOB Voucher", "Loyalty Voucher"],
  onChangeTabBar,
  data,
}) => {
  return (
    <div className="w-full flex bg-white border-b border-neutral40 overflow-x-auto">
      {dataBar.map((value, index) => (
        <div
          key={dataValue[index]}
          className={`${
            currentTab === dataValue[index] || data[index]
              ? "text-primary500 border-b-2 border-primary500"
              : "text-neutral300 border-b-2 border-white"
          } cursor-pointer py-2 flex justify-center items-center px-3`}
          style={{ width: "fit-content", whiteSpace: "nowrap" }} // Adjust to fit content and prevent wrapping
          onClick={() => onChangeTabBar(dataValue[index])}
        >
          <p className={`${currentTab === dataValue[index] ? "font-medium" : "font-normal"} text-xs`}>{value}</p>
        </div>
      ))}
    </div>
  );
};

export default LandingPageSmallTabBar;
