import { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { mapDispatchToProps, mapStateToProps } from "../state/redux";
import { RefreshToken as RefreshTokenService } from "../service/usermanagement/endpoint";

const RefreshToken = ({ children, handleSetUserInfo, handleResetStore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const idleTimeoutRef = useRef(null);
  const idleDuration = 10 * 60 * 1000;
  const excludedPaths = [
    "",
    "register",
    "forgot-password",
    "reset-password",
    "verify-email",
    "error-page",
    "redeem-voucher",
  ];

  const removeUser = (reason = "unknown") => {
    console.log(`[AutoLogout] User removed due to: ${reason}`);
    handleResetStore();
    localStorage.clear();
    // navigate("/prezent");
    navigate("/");
  };

  const insertUser = async (response) => {
    try {
      localStorage.setItem("token", response.data.token);
      handleSetUserInfo({
        userId: response.data.userId,
        userName: response.data.userName,
        roleId: response.data.roleId,
        roleName: response.data.roleName,
        clientId: response.data.companyId,
        divisionId: response.data.divisionId,
        clientName: response.data.companyName,
        divisionName: response.data.divisionName,
        isInternal: response.data.isInternal,
        phoneNumber: response.data.userPhoneNumber,
        email: response.data.userEmail,
      });
    } catch (error) {
      console.log(error);
      removeUser("fail to insert user");
    }
  };

  const resetIdleTimer = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      removeUser("idle timeout");
    }, idleDuration);
  };

  const refresh = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const currentPath = location.pathname.split("/")[1];

      if (!excludedPaths.includes(currentPath)) {
        if (token) {
          const response = await RefreshTokenService(token);
          insertUser(response);
        } else {
          removeUser("Failed to hit refresh token service");
        }
      }
    } catch (error) {
      console.log(error);
      removeUser(error);
    }
  };

  useEffect(() => {
    const basePath = location.pathname.split("/")[1];
    const isExcluded = excludedPaths.includes(basePath);

    if (isExcluded) {
      return;
    }

    refresh();
    resetIdleTimer();

    const resetActivity = () => resetIdleTimer();
    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    events.forEach((event) => document.addEventListener(event, resetActivity));

    return () => {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      events.forEach((event) => document.removeEventListener(event, resetActivity));
    };
  }, [location.pathname]);

  return children;
};

export default connect(mapStateToProps, mapDispatchToProps)(RefreshToken);
