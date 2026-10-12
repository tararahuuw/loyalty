import React from "react";
import ToolTip from "prezent/ToolTip";

const PointProcessingSection = ({ pointProcessingMethod }) => {
  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Processing</p>
          <ToolTip message="Define how the system will process and distribute the points after they are created. This determines the method used to deliver points to Customers." />
        </div>

        <div className="bg-white rounded-lg flex flex-col gap-2 p-4">
          <p className="font-semibold text-sm">
            {pointProcessingMethod === "api"
              ? "API"
              : pointProcessingMethod === "upload transaction"
              ? "Upload Transaction"
              : pointProcessingMethod === "upload point"
              ? "Upload Point"
              : ""}
          </p>
          {pointProcessingMethod === "api" && (
            <div className="text-sm">
              <span>
                Points can be processed automatically in real time by integrating your system via API. Please refer to
                the <span className="text-primary500 hover:underline cursor-pointer">Developer page</span> for more
                details.
              </span>
            </div>
          )}

          {pointProcessingMethod === "upload transaction" && (
            <div className="text-sm">
              <span>Points can be processed manually by uploading recipient data through the </span>
              <span className="text-primary500 hover:underline cursor-pointer">
                Customer &gt; Upload Transaction menu
              </span>
              <span> after the campaign ends.</span>
            </div>
          )}

          {pointProcessingMethod === "upload point" && (
            <div className="text-sm">
              <span>Points can be processed manually by uploading recipient data through the </span>
              <span className="text-primary500 hover:underline cursor-pointer">Customer &gt; Upload Point menu</span>
              <span> after the campaign ends.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointProcessingSection;
