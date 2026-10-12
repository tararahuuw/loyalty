import React, { useEffect, useState } from 'react';

const ProgressBar = ({ nameFile, isLoading, progress }) => {
  // const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   let interval;

  //   if (isLoading) {
  //     interval = setInterval(() => {
  //       setProgress(prevProgress => {
  //         const newProgress = prevProgress + 1;
  //         return newProgress <= 100 ? newProgress : 100;
  //       });
  //     }, 1000);
  //   } else {
  //     setProgress(100);
  //   }
  //   return () => clearInterval(interval);
  // }, [isLoading]);

  return (
    <div className="w-full">
      <p className="text-sm font-bold">{nameFile}</p>
      <div className="w-full bg-neutral40 rounded-full h-2">
        <div
          className={`
            ${progress === 100 ? "bg-success500" : "bg-primary500"} 
            h-2 rounded-full transition-width duration-300 ease-in-out`}
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