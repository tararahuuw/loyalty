import React from "react";

const TabBar = ({ currentTab = "all", dataBar, dataValue, onChangeTabBar, isError }) => {
  return (
    <div className="w-full flex bg-white border-b border-neutral40">
      {dataBar.map((value, index) => {
        // Determine if the current tab is the second one and if there is an error
        const isSecondTabError = isError && index === 1;

        return (
          <div
            key={dataValue[index]}
            className={`
              cursor-pointer flex-1
              ${
                currentTab === dataValue[index]
                  ? "text-primary500 border-b-2 border-primary500"
                  : "text-neutral300 border-b-2 border-white"
              }
              ${isSecondTabError ? "bg-danger50" : ""}
            `}
            onClick={() => onChangeTabBar(dataValue[index])}
          >
            <p
              className={`text-sm py-2.5 px-4 text-center
                ${currentTab === dataValue[index] ? "font-medium" : "font-normal"}
                ${isSecondTabError ? "text-danger500" : ""}
              `}
            >
              {value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default TabBar;
