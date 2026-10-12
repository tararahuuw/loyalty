import React, { useState } from "react";
import ToolTip from "prezent/ToolTip";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";

const PointUtilizationSection = () => {
  const [selected, setSelected] = useState("api2");

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Utilization</p>
          <ToolTip message="Define how the system will utilize the points after they are processed. This determines how the points will be used for further actions or reward access." />
        </div>
      </div>

      <div className="bg-white rounded-lg flex justify-between gap-8 p-4">
        <RadioButtonComponent
          onChange={() => setSelected("api2")}
          checked={selected === "api2"}
          value="api2"
          title="API"
          description={
            <span>
              Points can be utilized automatically in real time by integrating your system via API. Please refer to the{" "}
              <span className="text-primary500 hover:underline cursor-pointer">Developer page</span> for more details
            </span>
          }
        />

        <RadioButtonComponent
          onChange={() => setSelected("dashboard")}
          checked={selected === "dashboard"}
          value="dashboard"
          title="Dashboard"
          description="Points can be utilized by selecting rewards available in the dashboard. Customers will be able to view and exchange their points for these rewards."
        />

        <RadioButtonComponent
          onChange={() => setSelected("download")}
          checked={selected === "download"}
          value="download"
          title="Download"
          description="Points can be utilized by exporting the data without assigning rewards through the system. Suitable for offline handling or internal processes."
        />
      </div>
    </div>
  );
};

export default PointUtilizationSection;
