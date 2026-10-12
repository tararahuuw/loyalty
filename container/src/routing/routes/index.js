import React, { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { mapStateToProps, mapDispatchToProps } from "../../state/redux";
import { connect } from "react-redux";

import NotAuthorizePage from "../../pages/errorpage/notAuthorize";
import { useCheckRemoteStatus } from "../../provider/CheckRemoteStatus";

import ErrorPage from "../../pages/errorpage/notFound";
import LoadingPage from "../../pages/loadingpage";

import AccountRoutes from "./AccountRoutes";
import RewardRoutes from "./RewardRoutes/RewardRoutes";
import EngagementRoutes from "./EngagementRoutes/EngagementRoutes";
import CampaignRoutes from "./CampaignRoutes/CampaignRoutes";
import ReportRoutes from "./ReportRoutes/ReportRoutes";
import SettingsRoutes from "./SettingsRoutes/SettingsRoutes";
import InventoryRoutes from "./InventoryRoutes/InventoryRoutes";
import RefreshToken from "../../provider/RefreshToken";
import RedeemVoucherRoutes from "./RedeemVoucherRoutes/RedeemVoucherRoutes";
import LoadingRedeemPage from "../../pages/loadingRedeemPage";
import Login from "../../pages/authentication/login";
import Layout from "../../components/Layout/Layout";
import ForgotPassword from "../../pages/authentication/forgotpassword";
import Register from "../../pages/authentication/register";
import ResetPassword from "../../pages/authentication/resetpassword";
import VerifyEmail from "../../pages/authentication/verifyemail";

const Routing = ({ userInfo, balance, currentUser, handleSetUserInfo }) => {
  const {
    adminRemoteIsUp,
    rewardRemoteIsUp,
    campaignRemoteIsUp,
    settingRemoteIsUp,
    engagementRemoteIsUp,
    reportRemoteIsUp,
    inventoryRemoteIsUp,
    redeemRemoteIsUp,
  } = useCheckRemoteStatus();
  const [titleHeader, setTitleHeader] = useState("");
  return (
    <BrowserRouter>
      <Layout userInfo={userInfo} titleHeader={titleHeader} handleSetUserInfo={handleSetUserInfo} balance={balance}>
      <Routes>
        {/* Login (unauthenticated landing page) */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        <Route
          path="/prezent/*"
          element={
            <Routes>
              {/* Not Authorize */}
              <Route path="/not-authorized" element={<NotAuthorizePage />} />

              {/* Redeem Module */}
              <Route
                path="/redeem-voucher/*"
                element={
                  <Suspense fallback={<LoadingRedeemPage />}>
                    {redeemRemoteIsUp ? <RedeemVoucherRoutes /> : <ErrorPage />}
                  </Suspense>
                }
              />

              <Route
                path="/campaign/*"
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <Routes>
                      {/* Campaign Management */}
                      <Route
                        path="/*"
                        element={
                          campaignRemoteIsUp ? (
                            <CampaignRoutes balance={balance} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />
                    </Routes>
                  </Suspense>
                }
              />

              <Route
                path="/loyalty-setting/*"
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <Routes>
                      {/* Inventory Management */}
                      <Route
                        path="/inventory/*"
                        element={
                          inventoryRemoteIsUp ? <InventoryRoutes setTitleHeader={setTitleHeader} /> : <ErrorPage />
                        }
                      />

                      {/* Engagement Management */}
                      <Route
                        path="/engagement/*"
                        element={
                          engagementRemoteIsUp ? (
                            <EngagementRoutes userInfo={userInfo} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />

                      {/* Account Management */}
                      <Route
                        path="/account/*"
                        element={
                          adminRemoteIsUp ? (
                            <AccountRoutes userInfo={userInfo} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />

                      {/* Settings Management */}
                      <Route
                        path="/setting/*"
                        element={
                          settingRemoteIsUp ? (
                            <SettingsRoutes userInfo={userInfo} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />

                      {/* Rewards Management */}
                      <Route
                        path="/rewards/*"
                        element={
                          rewardRemoteIsUp ? (
                            <RewardRoutes userInfo={userInfo} balance={balance} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />
                    </Routes>
                  </Suspense>
                }
              />

              <Route
                path="/report/*"
                element={
                  <Suspense fallback={<LoadingPage />}>
                    <Routes>
                      {/* Report Management */}
                      <Route
                        path="/*"
                        element={
                          reportRemoteIsUp ? (
                            <ReportRoutes userInfo={userInfo} setTitleHeader={setTitleHeader} />
                          ) : (
                            <ErrorPage />
                          )
                        }
                      />
                    </Routes>
                  </Suspense>
                }
              />
            </Routes>
          }
        />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Routing);
