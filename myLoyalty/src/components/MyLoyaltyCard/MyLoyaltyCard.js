import React, { useEffect, useRef } from "react";
import { Chip } from "sprint-asia-custom-component";
import moment from "moment";
import { Copy, DotsThreeVertical, Eye, Gear, NotePencil, Trash } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";

const MyLoyaltyCard = ({
  id,
  projectName,
  description,
  logoURL,
  landingPageURL,
  createdDate,
  status,
  onClickEdit,
  onClickToggle,
  onClickDelete,
}) => {
  const { isOpen, toggle, close } = useDisclosure();
  const dropdownRef = useRef(null);

  const handleCopyURL = (landingPageURL) => {
    navigator.clipboard.writeText(landingPageURL);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        close(); // Close dropdown
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="border border-neutral80 rounded-lg flex flex-col gap-4 px-4 py-8 relative">
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-2 w-full">
          <img src={logoURL} className="w-16 h-16 border border-neutral80 rounded-md" />

          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-4">
              <p className="whitespace-nowrap font-semibold">{projectName}</p>
              <Chip title={status} type={status === "Active" ? "success" : "neutral"} />
            </div>

            <p>Created: {moment(createdDate).format("DD/MM/YYYY")}</p>
          </div>
        </div>
        <a className="cursor-pointer" onClick={toggle}>
          <DotsThreeVertical className="text-neutral500" size={28} />
        </a>

        {/* Drop Down Menu */}
        {isOpen && (
          <div
            className="absolute top-14 right-10 flex flex-col bg-neutral20 p-2 border rounded-lg border-neutral80 gap-2"
            ref={dropdownRef}
          >
            <a
              className="flex items-center gap-2 hover:bg-neutral40 p-2 rounded-md cursor-pointer"
              onClick={() => {
                onClickEdit({ id, projectName, description, logoURL, landingPageURL });
                close();
              }}
            >
              <NotePencil className="text-neutral300" />
              <p>Edit Program</p>
            </a>

            <a
              className="flex items-center gap-2 hover:bg-neutral40 p-2 rounded-md cursor-pointer"
              onClick={() => {
                onClickToggle(id);
                close();
              }}
            >
              <Gear className="text-neutral300" />
              <p>{status === "Active" ? "Deactivate" : "Activate"}</p>
            </a>

            <a
              className="flex items-center gap-2 hover:bg-neutral40 p-2 rounded-md cursor-pointer"
              onClick={() => {
                onClickDelete(id);
                close();
              }}
            >
              <Trash className="text-neutral300" />
              <p>Delete</p>
            </a>
          </div>
        )}
      </div>

      <p>{description}</p>

      <div className="flex flex-col gap-2">
        <p className="text-xs">Landing Page Url</p>

        <div className="flex gap-2">
          <div className="bg-neutral30 py-2 px-4 rounded-md text-neutral300 w-full">{landingPageURL}</div>

          <a
            className="px-2 flex items-center justify-center bg-neutral30 rounded-md cursor-pointer hover:bg-neutral40"
            onClick={() => handleCopyURL(landingPageURL)}
          >
            <Copy className="text-neutral300" size={24} />
          </a>

          <a
            className="px-2 flex items-center justify-center bg-neutral30 rounded-md cursor-pointer hover:bg-neutral40"
            href={landingPageURL}
            target="_blank"
          >
            <Eye className="text-neutral300" size={24} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyLoyaltyCard;
