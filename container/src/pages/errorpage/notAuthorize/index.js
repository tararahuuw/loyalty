import React from "react";

const NotAuthorizePage = () => {
  return (
    <div
      className="w-full bg-white rounded-md flex items-center justify-center text-center"
      style={{ minHeight: "calc(100dvh - 165px)" }}
    >
      <div className="p-8">
        <p className="text-black font-semibold text-xl">Unauthorized</p>
        <p className="text-neutral300 font-normal text-sm">You do not have permission to access this page.</p>
      </div>
    </div>
  );
};

export default NotAuthorizePage;
