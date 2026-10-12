import React from "react";
import { Route, Routes } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../../../state/redux";
import { connect } from "react-redux";

const RedeemPage = React.lazy(() => import("redeem/RedeemPage"));
const SuccessPage = React.lazy(() => import("redeem/SuccessPage"));
const RetryPage = React.lazy(() => import("redeem/RetryPage"));
const ExpiredPage = React.lazy(() => import("redeem/ExpiredPage"));

const RedeemVoucherRoutes = ({ handleSetUserInput, handleResetUserInput, userInput }) => {
  return (
    <Routes>
      <Route path="/:redeemId" element={<RedeemPage handleSetUserInput={handleSetUserInput} userInput={userInput} />} />
      <Route path="/success/:redeemId" element={<SuccessPage />} />
      <Route path="/retry/:redeemId" element={<RetryPage handleResetUserInput={handleResetUserInput} />} />
      <Route path="/expired" element={<ExpiredPage />} />
    </Routes>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(RedeemVoucherRoutes);
