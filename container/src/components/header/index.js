/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef } from "react";
import Profile from "../../assets/images/profile.png";
import { Infinity, DoorOpen, UserCircle, Bell, Wallet } from "@phosphor-icons/react";

const Header = ({
  title = "Label",
  fullName = "Undefined Name",
  roleName = "Undefined Role",
  dataProfile = [
    {
      title: "Change Password",
      action: () => {
        console.log("Change Password");
      },
      logo: UserCircle,
    },
    {
      title: "Logout",
      action: () => {
        console.log("Logout");
      },
      logo: DoorOpen,
    },
  ],
  isNotificationActive = false,
  dataNotification = ["Notification 1", "Notification 2"],
  dataBalance = 0,
  onClickWallet,
}) => {
  const [isProfileContentVisible, setProfileContentVisible] = useState(false);
  const [isNotificationContentVisible, setNotificationContentVisible] = useState(false);
  const modalRefProfile = useRef(null);
  const modalRefNotification = useRef(null);

  function toggleProfileContent() {
    setProfileContentVisible(!isProfileContentVisible);
    setNotificationContentVisible(false);
  }

  // Test

  function toggleNotificationContent() {
    setNotificationContentVisible(!isNotificationContentVisible);
    setProfileContentVisible(false);
  }

  return (
    <div className="w-full h-16 flex items-center bg-white border-b border-neutral40 px-8">
      <div className="flex w-full justify-between items-center">
        <p className="text-2xl font-semibold">{title}</p>
        <div className="flex">
          <a className="flex items-center cursor-pointer" onClick={onClickWallet}>
            <div className="w-10 h-10 rounded-full border border-neutral40 mr-2 flex items-center justify-center">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-neutral300 text-xs">Balance:</p>
              {[
                "System Administrator",
                "Ops Administrator",
                "Business Administrator",
                "Business Support",
                "Reconcile",
              ].includes(roleName) ? (
                <div className="flex items-center gap-1">
                  <p className="font-semibold text-black">Rp</p>
                  <Infinity />
                </div>
              ) : (
                <p className="font-semibold text-black">Rp {dataBalance.toLocaleString()}</p>
              )}
            </div>
          </a>

          <div className="w-px bg-neutral40 h-16 mx-3"></div>

          <div
            className="flex items-center cursor-pointer"
            onClick={toggleNotificationContent}
            ref={modalRefNotification}
          >
            <div className="w-10 h-10 rounded-full border border-neutral40 flex items-center justify-center">
              <div className="relative">
                <Bell size={24} />
                {isNotificationActive && (
                  <div className="absolute top-0 right-0 border border-white w-2 h-2 rounded-full bg-danger500"></div>
                )}
              </div>
            </div>
            {isNotificationContentVisible && (
              <div className="absolute right-20 top-16 z-50">
                {dataNotification.length !== 0 && (
                  <div className="z-50 w-48 bg-white border border-neutral40 rounded-md shadow-md">
                    {dataNotification.map((value, index) => (
                      <div
                        key={index}
                        className={`px-2 flex items-center cursor-pointer bg-white hover:bg-neutral20 p-2 
                                                ${
                                                  dataProfile.length == 1
                                                    ? "rounded-md"
                                                    : index === 0
                                                    ? "rounded-t-md"
                                                    : index === dataProfile.length - 1
                                                    ? "rounded-b-md"
                                                    : ""
                                                }
                                            `}
                        onClick={value.action}
                      >
                        <p className="text-sm">{value}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="w-px bg-neutral40 h-16 mx-3"></div>
          <div className="flex items-center cursor-pointer" onClick={toggleProfileContent} ref={modalRefProfile}>
            <img src={Profile} className="w-10 h-10 mr-2" />
            <div className="flex-1">
              <p className="text-sm text-black font-semibold whitespace-nowrap">{fullName}</p>
              <p className="text-xs text-neutral300 font-normal whitespace-nowrap">{roleName}</p>
            </div>
            {isProfileContentVisible && (
              <div className="absolute right-0 top-16 z-50">
                {dataProfile.length !== 0 && (
                  <div className="z-50 w-48 bg-white border border-neutral40 rounded-md shadow-md">
                    {dataProfile.map((value, index) => (
                      <div
                        key={index}
                        className={`px-2 flex items-center cursor-pointer bg-white hover:bg-neutral20 p-2 
                                                ${
                                                  dataProfile.length == 1
                                                    ? "rounded-md"
                                                    : index === 0
                                                    ? "rounded-t-md"
                                                    : index === dataProfile.length - 1
                                                    ? "rounded-b-md"
                                                    : ""
                                                }
                                            `}
                        onClick={value.action}
                      >
                        <value.logo size={16} className="text-neutral300 mr-2" />
                        <p className="text-sm">{value.title}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
