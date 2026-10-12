import React from "react";

const ProgressBar = ({ nameFile, progress }) => {
  return (
    <div className="w-full">
      <p className="text-sm font-bold">{nameFile}</p>
      <div className="flex items-center">
        <div className="w-full bg-neutral40 rounded-full h-2 flex items-center">
          <div
            className={`
              ${progress === 100 ? "bg-success500" : "bg-info500"} h-2 rounded-full`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={`${progress === 100 ? "text-success500" : "text-info500"} text-sm flex justify-end ml-3 font-semibold`}>
          {progress}%
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
