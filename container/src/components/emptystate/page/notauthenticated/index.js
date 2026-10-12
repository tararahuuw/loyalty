import React from "react";

const NotAuthenticated = () => {
  return (
    <div className="h-full w-full bg-white rounded-md flex items-center justify-center text-center">
      <div className="p-8">
        <p className="text-black font-semibold text-xl">Access Token Not Found</p>
        <p className="text-neutral300 font-normal text-sm">This service requires an access token for access.</p>
      </div>
    </div>
  );
};

export default NotAuthenticated;
