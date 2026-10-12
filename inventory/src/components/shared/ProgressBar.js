import React from "react";

const ProgressBar = ({ nameFile, progress }) => {
  return (
    <div className="w-full">
      <p className="text-sm font-bold">{nameFile}</p>
      <div className="w-full bg-neutral40 rounded-full h-2">
        <div
          className={`
            ${progress === 100 ? "bg-success500" : "bg-primary500"} h-2 rounded-full`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={`${progress === 100 ? "text-success500" : "text-primary500"} text-xs flex justify-end mt-1`}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
