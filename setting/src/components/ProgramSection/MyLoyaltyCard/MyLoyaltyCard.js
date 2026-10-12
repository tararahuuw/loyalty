import React, { useState, useRef, useEffect } from "react";
import moment from "moment";
import { Switch } from "sprint-asia-custom-component";
import { Copy } from "@phosphor-icons/react/dist/ssr";

const MyLoyaltyCard = ({ item, handleEditById, handleDelete, handleChangeStatus, roleAccess }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md border-2 border-neutral40 p-4 flex flex-col h-full relative">
      {/* Menu dropdown */}
      <div className="absolute top-4 right-4" ref={menuRef}>
        <div
          onClick={() => {
            if (item.status === false) {
              setIsMenuOpen(!isMenuOpen)
            }
          }}
          className="p-1 rounded-full hover:bg-neutral200 cursor-pointer select-none"
        >
          <span className={`text-neutral300 text-lg font-bold ${item.status === true ? "cursor-not-allowed" : "cursor-pointer"}`}>⋮</span>
        </div>

        {isMenuOpen && (
          <div className="absolute right-0 w-28 bg-white shadow-lg rounded-lg z-10 p-2">
            {((item.customer === 0) || (item.customer !== 0 && item.status === false)) && (
              <div
                onClick={() => handleEditById(item.id)}
                className="w-full rounded-lg text-left px-4 py-2 text-sm hover:bg-neutral20 cursor-pointer"
              >
                Edit
              </div>
            )}
            <div
              onClick={() => handleDelete(item)}
              className="w-full rounded-lg text-danger500 text-left px-4 py-2 text-sm hover:bg-neutral20 cursor-pointer"
            >
              Delete
            </div>
          </div>
        )}
      </div>
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 p-2 border-2 border-neutral30 rounded-lg flex-shrink-0">
          <img
            src={item.logoURL}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-bold text-neutral800 break-words whitespace-normal pr-4">
            {item.projectName}
          </h3>
          <p className="text-sm text-neutral300">
            Last update : {moment(item.updatedAt).format("DD MMM YYYY, HH.mm")}
          </p>
        </div>
      </div>
      <div className="mb-4 mt-2">
        <p className="text-black">{item.description}</p>
      </div>
      <p>Landing page Url</p>
      <div className="w-full bg-neutral30 rounded-lg mb-2 p-4 mt-2">
        <div className="flex justify-between items-center">
          <p className="break-all">
            {`https://stagpwa-prezent.sandeza.id/${item.landingPageURL}`}
          </p>
          <button
            type="button"
            onClick={() =>
              navigator.clipboard.writeText(
                `https://stagpwa-prezent.sandeza.id/${item.landingPageURL}`
              )
            }
            className="mt-1 px-2 self-start text-neutral500 hover:text-primary500"
          >
            <Copy size={20} weight="regular" />
          </button>
        </div>
      </div>
      <hr className="text-neutral40 my-3" />
      <div className="flex items-center">
        <p className="mr-2 text-md font-medium">
          {item.status ? "Deactivate" : "Activate"}
        </p>
        <div
          onClick={() => {
            if (roleAccess === "Client Administrator") {
              handleChangeStatus(item)
            }
          }}
          className="flex items-center cursor-pointer">
          <Switch checked={item.status} />
        </div>
      </div>
    </div>
  );
};

export default MyLoyaltyCard;