import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logout from "../../pages/authentication/logout";
import Sidebar from "../sidebar";
import { decodeJWT } from "../../utils";
import { useDisclosure } from "../../hooks/useDisclosure";
import Header from "../header";
import { DoorOpen } from "@phosphor-icons/react";

const Layout = ({ children, userInfo, titleHeader, handleSetUserInfo, balance }) => {
  const location = useLocation();
  const { isOpen: logoutModalIsOpen, toggle: toggleLogoutModal } = useDisclosure(false);
  const { isOpen: sidebarIsOpen, toggle: toggleSidebar } = useDisclosure(true);
  const dataProfile = [{ title: "Logout", action: () => toggleLogoutModal(), logo: DoorOpen }];

  const excludedPath = ["/", "/register", "/forgot-password", "/reset-password", "/verify-email", "/error-page"];

  // token is stored JSON.stringify'd (see login/index.js) — must be parsed back the same way,
  // otherwise decodeJWT() below receives a quoted string and breaks on the first "." split.
  const [token, setToken] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("token")) || null;
    } catch {
      return null;
    }
  });

  const navigateTo = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const decodedToken = decodeJWT(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken < currentTime) {
          setToken(null);
          handleSetUserInfo({
            userId: null,
            userName: null,
            roleName: null,
            clientStatus: null,
            divisionBillingType: null,
            clientName: null,
            divisionName: null,
          });
          localStorage.clear();
          navigateTo("/");
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <>
      {!excludedPath.includes(location.pathname) && (
        <div className="flex w-screen h-screen">
          <Sidebar
            roleName={userInfo.roleName}
            clientStatus={userInfo.clientStatus}
            divisionBillingType={userInfo.divisionBillingType}
            isExpand={sidebarIsOpen}
            onClick={toggleSidebar}
          />

          <div className="h-screen flex flex-col" style={{ width: `calc(100% - ${sidebarIsOpen ? "14rem" : "5rem"})` }}>
            <Header
              title={titleHeader}
              dataBalance={balance}
              dataNotification={[]}
              dataProfile={dataProfile}
              fullName={userInfo.userName}
              roleName={userInfo.roleName}
              onClickWallet={() => navigateTo("/prezent/overall-balance")}
            />
            <div className="w-full h-full overflow-y-auto bg-neutral20">{children}</div>
          </div>

          <Logout handleSetUserInfo={handleSetUserInfo} isOpen={logoutModalIsOpen} onClose={toggleLogoutModal} />
        </div>
      )}
      {excludedPath.includes(location.pathname) && children}
    </>
  );
};

export default Layout;
