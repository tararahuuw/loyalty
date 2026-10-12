import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { PiCoinsFill, PiHandCoinsFill, PiPercentFill } from "react-icons/pi";
import { Switch } from "sprint-asia-custom-component";

const TierLevelCard = ({ roleAccess, item, handleEditById, handleDeleteTier, handleChangeTier }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const allowedRoles = ["Client Admin - Loyalty", "Client WhatsApp - Loyalty", "Client Loyalty"];

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-neutral40 p-4 flex flex-col h-full relative">
      {/* Menu dropdown */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        {allowedRoles.includes(roleAccess) && (
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 rounded-full hover:bg-neutral200 cursor-pointer select-none"
          >
            <span className="text-neutral300 text-lg font-bold">⋮</span>
          </div>
        )}

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg z-10 p-2">
            {(item.customer === 0 || (item.customer !== 0 && item.status === false)) && (
              <div
                onClick={() => handleEditById(item.id)}
                className="w-full rounded-lg text-left px-4 py-2 text-sm hover:bg-neutral20 cursor-pointer"
              >
                Edit
              </div>
            )}
            <div
              onClick={() => handleDeleteTier(item)}
              className="w-full rounded-lg text-danger500 text-left px-4 py-2 text-sm hover:bg-neutral20 cursor-pointer"
            >
              Delete
            </div>
          </div>
        )}
      </div>

      {/* Header info */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 p-2 border-2 border-neutral30 rounded-lg flex-shrink-0">
          <img src={item.icons.icons} alt={item.tierName} className="w-full h-full object-cover rounded-lg" />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-neutral800 break-words whitespace-normal pr-4">{item.tierName}</h3>
          <p className="text-sm text-neutral300">Last update : {moment(item.updatedAt).format("DD MMM YYYY, HH.mm")}</p>
        </div>
      </div>

      {/* Criteria */}
      <p className="mt-2 font-semibold text-black">Criteria : {item.criteriaName}</p>
      <p className="mt-2 font-normal text-neutral300">
        {item.criteriaName === "Amount OR Frequency" ||
        item.criteriaName === "Amount AND Frequency" ||
        item.criteriaName === "Amount"
          ? "Amount : Rp " + item.valueFirst.toLocaleString("id")
          : `${item.criteriaName} : ${item.valueFirst.toLocaleString("id")}`}
      </p>
      {item.valueSecond && (
        <p className="mt-2 font-normal text-neutral300">
          Frequency : {item.valueSecond.toLocaleString("id")}x transactions
        </p>
      )}

      {/* Benefit count */}
      <p className="mt-2 font-semibold text-black">Total Benefit : {item.benefit.length}</p>

      {/* Benefit container fleksibel */}
      <div className="mt-2 bg-neutral20 rounded-lg p-2 flex-1">
        {item.benefit.length === 0 ? (
          <div className="h-full flex items-start">
            <p className="text-neutral300 italic">No benefits configured for this tier level.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-y-2 h-full p-2">
            {item.benefit.map((benefit) => (
              <div key={benefit.id} className="flex items-center">
                <div>
                  {benefit.benefitType === "Percentage Discount" && (
                    <PiPercentFill size={20} className="text-primary500" />
                  )}
                  {benefit.benefitType === "Points Multiplier" && <PiCoinsFill size={20} className="text-primary300" />}
                  {benefit.benefitType === "Cashback Rewards" && (
                    <PiHandCoinsFill size={20} className="text-success500" />
                  )}
                </div>
                <span className="text-sm font-semibold text-neutral800 ml-2">
                  {benefit.benefitValue}
                  {benefit.benefitType === "Percentage Discount"
                    ? "% Discount"
                    : benefit.benefitType === "Cashback Rewards"
                    ? "% Cashback"
                    : "x Points Multiplier"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status switch */}
      {allowedRoles.includes(roleAccess) && (
        <>
          <hr className="text-neutral40 my-3" />
          <div className="flex items-center">
            <p className="mr-2 text-md">{item.status ? "Deactivate Tier" : "Activate Tier"}</p>
            <div onClick={() => handleChangeTier(item)} className="flex items-center cursor-pointer">
              <Switch checked={item.status} isEdit />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TierLevelCard;
