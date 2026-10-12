import React, { useRef } from "react";
import { Info, CaretDown } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import GeneratePoint from "./GeneratePoint";
import RedeemPoint from "./RedeemPoint";
import RedeemReward from "./RedeemReward";

const APIDocumentationSection = () => {
  const contentRef = useRef(null);
  const { isOpen: docIsOpen, toggle: toggleDoc } = useDisclosure(true);

  return (
    <div className="flex flex-col gap-4 bg-primary50 rounded-lg border border-neutral40 p-6">
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Info className="text-neutral80 -mt-0.5" size={24} />
          <div>
            <p className="font-semibold text-sm">API Access for Integration</p>
            <span className="text-sm">
              Easily integrate your system with our loyalty program using our available APIs. Check the full list of
              endpoints and technical guide on our{" "}
              <a
                className="cursor-pointer hover:underline text-primary500"
                href="https://api.sprintasia.co.id/"
                target="_blank"
              >
                Developer Page.
              </a>{" "}
              Use this Base URL to communicate with our system.{" "}
              <a className="no-underline font-semibold">https://api4.sandeza.id/json/cgw</a>
            </span>
          </div>
        </div>

        <a className="cursor-pointer" onClick={toggleDoc}>
          <CaretDown
            className={`transform ${
              docIsOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300 ease-in-out`}
          />
        </a>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: !docIsOpen ? 0 : 2500,
        }}
        className="flex flex-col gap-8 overflow-hidden transition-[max-height] duration-300 overflow-y-auto no-scrollbar"
      >
        <GeneratePoint />
        <RedeemPoint />
        <RedeemReward />
      </div>
    </div>
  );
};

export default APIDocumentationSection;
