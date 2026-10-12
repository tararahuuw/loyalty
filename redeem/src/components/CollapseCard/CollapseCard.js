import React from "react";
import { CaretUp } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";

const CollapseCard = ({ title, content }) => {
  const { isOpen, toggle } = useDisclosure(true);

  return (
    <section
      style={{ paddingTop: 14, paddingBottom: isOpen ? 14 : 8 }}
      className="border border-neutral80 rounded-lg w-full px-4 flex flex-col gap-2 transition-all duration-500 ease-in-out"
    >
      <div className="flex items-center justify-between">
        <a className="font-medium" onClick={toggle}>
          {title}
        </a>
        <a onClick={toggle}>
          <CaretUp
            className={`transform ${
              isOpen ? "rotate-180" : "rotate-0"
            } transition-transform duration-300 ease-in-out cursor-pointer`}
          />
        </a>
      </div>

      <div
        style={{ maxHeight: isOpen ? 200 : 0 }}
        className="overflow-hidden duration-500 ease-in-out overflow-y-auto transition-[max-height] no-scrollbar"
      >
        <p className="whitespace-pre-line text-left font-normal text-neutral500">{content}</p>
      </div>
    </section>
  );
};

export default CollapseCard;
