import React from "react";

const ProgressBarFile = ({ nameFile, totalData, progress }) => {
  return (
    <div className="w-full">
      <p className="text-sm font-bold">{nameFile}</p>
      <div className="w-full bg-danger500 rounded-full h-2">
        <div className={`bg-success500 h-2 rounded-full`} style={{ width: `${progress}%` }}></div>
      </div>
      <div className={`${progress === 0 ? "text-danger500" : "text-success500"} text-xs flex justify-end mt-1`}>
        {Math.floor(totalData)}%
      </div>
    </div>
  );
};

export default ProgressBarFile;
