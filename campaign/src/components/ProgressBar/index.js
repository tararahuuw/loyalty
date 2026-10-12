import React from "react";

const ProgressBar = ({ nameFile, progress, type }) => {
  return (
    <div className="w-full">
      <p className="text-sm font-bold">{nameFile}</p>
      <div className={`w-full ${type === "partial" ? "bg-danger500" : "bg-neutral40"} rounded-full h-2`}>
        <div
          className={`
           ${
             type === "success" || type === "partial"
               ? "bg-success500"
               : type === "failed"
               ? "bg-danger500"
               : "bg-primary500"
           }
            h-2 rounded-full transition-width duration-300 ease-in-out`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div
        className={`${
          type === "success" || type === "partial"
            ? "text-success500"
            : type === "failed"
            ? "text-danger500"
            : "text-primary500"
        } text-xs flex justify-end mt-1`}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
