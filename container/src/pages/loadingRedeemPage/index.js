import React from "react";
import { TailSpin } from "react-loader-spinner";

const LoadingRedeemPage = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <TailSpin visible={true} height="50" width="50" color="#0e56a6" radius="1" wrapperClass="flex justify-center" />
    </div>
  );
};

export default LoadingRedeemPage;
