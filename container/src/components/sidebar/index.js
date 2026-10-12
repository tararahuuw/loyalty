import React, { useState, useEffect } from "react";
import LogoPrezentFull from "../../assets/images/logo_prezent_full.png";
import LogoPrezentHidden from "../../assets/images/logo_prezent_hidden.png";
import Menu from "../menu";
import { useLocation, useNavigate } from "react-router-dom";
import { CaretLeft, CaretRight, Coins, SlidersHorizontal, Notebook } from "@phosphor-icons/react";

const Sidebar = ({ roleName, clientStatus, divisionBillingType, isExpand, onClick }) => {
  const [currentMenuParent, setCurrentMenuParent] = useState("campaign");
  const [currentMenuChild, setCurrentMenuChild] = useState("campaign");
  const [menu, setMenu] = useState([]);

  const navigateTo = useNavigate();
  const location = useLocation();

  const menuInternalRole = [
    {
      logo: [Coins, Coins],
      title: "Campaign",
      urlLink: "/prezent/campaign",
      isOpen: true,
      subMenu: [],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Setting",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Store",
          urlLink: "/prezent/loyalty-setting/inventory/store",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Product",
          urlLink: "/prezent/loyalty-setting/inventory/category",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Payment Method",
          urlLink: "/prezent/loyalty-setting/inventory/payment-method",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Parameter",
          urlLink: "/prezent/loyalty-setting/setting/parameter",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Point Conversion",
          urlLink: "/prezent/loyalty-setting/account/point-conversion",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Customer",
          urlLink: "/prezent/loyalty-setting/engagement/customer/tier-level",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Integration",
          urlLink: "/prezent/loyalty-setting/setting/integration",
        },
      ],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Rewards",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Voucher",
          urlLink: "/prezent/loyalty-setting/rewards",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Goods",
          urlLink: "/prezent/loyalty-setting/rewards/goods",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Cashback & Discount",
          urlLink: "/prezent/loyalty-setting/rewards/cashbackdiscount",
        },
      ],
    },
    {
      logo: [Notebook, Notebook],
      title: "Report",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [Notebook, Notebook],
          title: "Summary",
          urlLink: "/prezent/report/summary/campaign",
        },
        {
          logo: [Notebook, Notebook],
          title: "Details",
          urlLink: "/prezent/report/details",
        },
        {
          logo: [Notebook, Notebook],
          title: "Customer 360",
          urlLink: "/prezent/report/customer-360",
        },
        {
          logo: [Notebook, Notebook],
          title: "Analytic",
          urlLink: "/prezent/report/analytic",
        },
      ],
    },
  ];

  const menuClientPrepaid = [
    {
      logo: [Coins, Coins],
      title: "Campaign",
      urlLink: "/prezent/campaign",
      isOpen: true,
      subMenu: [],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Setting",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Store",
          urlLink: "/prezent/loyalty-setting/inventory/store",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Product",
          urlLink: "/prezent/loyalty-setting/inventory/category",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Payment Method",
          urlLink: "/prezent/loyalty-setting/inventory/payment-method",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Parameter",
          urlLink: "/prezent/loyalty-setting/setting/parameter",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Point Conversion",
          urlLink: "/prezent/loyalty-setting/account/point-conversion",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Customer",
          urlLink: "/prezent/loyalty-setting/engagement/customer/tier-level",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Integration",
          urlLink: "/prezent/loyalty-setting/setting/integration",
        },
      ],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Rewards",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Voucher",
          urlLink: "/prezent/loyalty-setting/rewards",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Goods",
          urlLink: "/prezent/loyalty-setting/rewards/goods",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Cashback & Discount",
          urlLink: "/prezent/loyalty-setting/rewards/cashbackdiscount",
        },
      ],
    },
    {
      logo: [Notebook, Notebook],
      title: "Report",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [Notebook, Notebook],
          title: "Summary",
          urlLink: "/prezent/report/summary/campaign",
        },
        {
          logo: [Notebook, Notebook],
          title: "Details",
          urlLink: "/prezent/report/details",
        },
        {
          logo: [Notebook, Notebook],
          title: "Customer 360",
          urlLink: "/prezent/report/customer-360",
        },
        {
          logo: [Notebook, Notebook],
          title: "Analytic",
          urlLink: "/prezent/report/analytic",
        },
      ],
    },
  ].filter(Boolean);

  const menuClientPostpaid = [
    {
      logo: [Coins, Coins],
      title: "Campaign",
      urlLink: "/prezent/campaign",
      isOpen: true,
      subMenu: [],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Setting",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Store",
          urlLink: "/prezent/loyalty-setting/inventory/store",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Product",
          urlLink: "/prezent/loyalty-setting/inventory/category",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Payment Method",
          urlLink: "/prezent/loyalty-setting/inventory/payment-method",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Parameter",
          urlLink: "/prezent/loyalty-setting/setting/parameter",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Point Conversion",
          urlLink: "/prezent/loyalty-setting/account/point-conversion",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Customer",
          urlLink: "/prezent/loyalty-setting/engagement/customer/tier-level",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Integration",
          urlLink: "/prezent/loyalty-setting/setting/integration",
        },
      ],
    },
    {
      logo: [SlidersHorizontal, SlidersHorizontal],
      title: "Rewards",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Voucher",
          urlLink: "/prezent/loyalty-setting/rewards",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Goods",
          urlLink: "/prezent/loyalty-setting/rewards/goods",
        },
        {
          logo: [SlidersHorizontal, SlidersHorizontal],
          title: "Cashback & Discount",
          urlLink: "/prezent/loyalty-setting/rewards/cashbackdiscount",
        },
      ],
    },
    {
      logo: [Notebook, Notebook],
      title: "Report",
      urlLink: "",
      isOpen: true,
      subMenu: [
        {
          logo: [Notebook, Notebook],
          title: "Summary",
          urlLink: "/prezent/report/summary/campaign",
        },
        {
          logo: [Notebook, Notebook],
          title: "Details",
          urlLink: "/prezent/report/details",
        },
        {
          logo: [Notebook, Notebook],
          title: "Customer 360",
          urlLink: "/prezent/report/customer-360",
        },
        {
          logo: [Notebook, Notebook],
          title: "Analytic",
          urlLink: "/prezent/report/analytic",
        },
      ],
    },
  ].filter(Boolean);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const parentSegment = pathSegments[2] || "campaign";
    const childSegment = pathSegments[3] || "campaign";

    setCurrentMenuParent(parentSegment);
    setCurrentMenuChild(childSegment.replace("-", " "));

    setMenu((prevData) =>
      prevData.map((item) =>
        item.title.toLowerCase() === parentSegment ? { ...item, isOpen: true } : { ...item, isOpen: true }
      )
    );
  }, [location]);

  useEffect(() => {
    let updatedMenu = [...menuInternalRole];

    // If the role is "Ops Administrator" or "Reconcile," adjust the "Voucher" menu
    if (["Ops Administrator", "Reconcile"].includes(roleName)) {
      updatedMenu = updatedMenu
        .map((menuItem) => {
          // Identify the "Voucher" menu item
          if (menuItem.title === "Voucher") {
            return clientStatus === "Active"
              ? {
                  ...menuItem,
                  urlLink: "/reward/voucher",
                  subMenu: [],
                }
              : null; // Exclude "Voucher" menu completely if clientStatus isn't "Active"
          }
          return menuItem;
        })
        .filter(Boolean); // Remove any null items
    }

    if (
      [
        "System Administrator",
        "Ops Administrator",
        "Business Administrator",
        "Business Support",
        "Reconcile",
        "Client Administrator",
        "Supervisor",
      ].includes(roleName)
    ) {
      setMenu(updatedMenu);
    } else if (["Client Administrator", "Client Support"].includes(roleName) && divisionBillingType === "Prepaid") {
      setMenu(menuClientPrepaid);
    } else if (["Client Administrator", "Client Support"].includes(roleName) && divisionBillingType === "Postpaid") {
      setMenu(menuClientPostpaid);
    }
  }, [roleName, divisionBillingType, clientStatus]);

  const handleClickMenu = (value, isParent = false) => {
    if (isParent) {
      setMenu((prevData) => prevData.map((item) => (item.title === value.title ? { ...item, isOpen: true } : item)));
    } else {
      setMenu((prevData) =>
        prevData.map((item) =>
          item.subMenu.some((sub) => sub.title === value.title) ? { ...item, isOpen: true } : item
        )
      );
    }

    if (value.urlLink) {
      navigateTo(value.urlLink);
    }

    if (isParent) {
      setCurrentMenuParent(value.title.toLowerCase());
    } else {
      setCurrentMenuChild(value.title.toLowerCase());
    }
  };

  return (
    <div className={`${isExpand ? "w-56" : "w-20"} h-screen flex flex-col bg-white border-r border-neutral40 z-10`}>
      <div
        className={`${isExpand ? "px-10" : ""} flex justify-center items-center py-4 h-16 border-b border-neutral40`}
      >
        {isExpand ? <img src={LogoPrezentFull} alt="LogoPrezent" /> : <img src={LogoPrezentHidden} alt="LogoPrezent" />}
      </div>
      <div
        className="flex items-center justify-center border-b border-neutral40 py-3.5 px-2 cursor-pointer"
        onClick={onClick}
      >
        {isExpand ? (
          <>
            <CaretLeft size="20" className="text-neutral300" />
            <p className="text-neutral300 font-normal ml-3 text-sm">Hide Menu</p>
          </>
        ) : (
          <CaretRight size="20" className="text-neutral300" />
        )}
      </div>
      <div className="py-6 px-3 flex-1 overflow-y-auto no-scrollbar">
        <div>
          {menu.length !== 0 &&
            menu.map((value, index) => (
              <React.Fragment key={index}>
                <div onClick={() => handleClickMenu(value, true)}>
                  <Menu
                    isActive={value.title.toLowerCase() === currentMenuParent}
                    title={value.title}
                    iconMenuActive={value.logo[1]}
                    iconMenuPassive={value.logo[0]}
                    type="parent"
                    urlLink={value.urlLink}
                    isHaveChild={value.subMenu.length !== 0}
                    isExpand={isExpand}
                    isOpen={value.isOpen}
                    subMenu={value.subMenu}
                  />
                </div>
                {value.isOpen &&
                  isExpand &&
                  value.subMenu.map((subValue, subIndex) => (
                    <div key={subIndex} onClick={() => handleClickMenu(subValue)}>
                      <Menu
                        isActive={subValue.title.toLowerCase() === currentMenuChild}
                        title={subValue.title}
                        iconMenuActive={subValue.logo[1]}
                        iconMenuPassive={subValue.logo[0]}
                        type="child"
                        urlLink={subValue.urlLink}
                        isExpand={isExpand}
                      />
                    </div>
                  ))}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
