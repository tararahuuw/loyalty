import React from "react";
import { Tooltip } from "react-tooltip";
import { Info } from "@phosphor-icons/react";

const ToolTip = ({ message, id = "my-tooltip" }) => {
  return (
    <>
      <div>
        <a data-tooltip-id={id} data-tooltip-place="top">
          <Info className="text-neutral80" size={20} />
        </a>

        <Tooltip
          id={id}
          className="custom-tooltip"
          style={{
            zIndex: 1001,
            borderRadius: 8,
            background: "#e6edf6",
            padding: 12,
            color: "black",
            fontSize: 12,
            fontWeight: 400,
            lineHeight: "140%",
            outline: "2px solid #034ea2",
            maxWidth: 600,
          }}
          arrowColor="#034ea2"
        >
          {message}
        </Tooltip>
      </div>
    </>
  );
};

export default ToolTip;
