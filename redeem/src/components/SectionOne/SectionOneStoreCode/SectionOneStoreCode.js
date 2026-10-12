import React, { useState } from "react";
import TabBar from "../../TabBar/TabBar";
import KonnekLogo from "../../../assets/konnek_logo.png";
import { TextInput, PrimaryButton } from "sprint-asia-custom-component";
import { MagnifyingGlass } from "@phosphor-icons/react";
import SectionOne from "../SectionOne";
import { useFetch } from "prezent/useFetch";
import { GetAvailableStores } from "../../../service/redeempage/endpoint";

const SectionOneStoreCode = ({
  setCurrentSection,
  containerRef,
  voucherData,
  title,
  message,
  redeem,
  currentSection,
  productID,
}) => {
  const [input, setInput] = useState("");
  const [currentTab, setCurrentTab] = useState("information");
  const { data: stores } = useFetch(productID && GetAvailableStores, "stores", [], { productID });

  return (
    <div className="flex flex-col">
      <TabBar
        onChangeTabBar={(tab) => setCurrentTab(tab)}
        currentTab={currentTab}
        dataBar={["Information", "Store"]}
        dataValue={["information", "store"]}
      />

      {currentTab === "information" && (
        <>
          <SectionOne voucherData={voucherData} title={title} message={message} />

          {/* Konnek button */}
          <div className="sticky rounded-full bg-primary50 bottom-2 self-end p-4 mr-2 mb-2 cursor-pointer">
            <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
          </div>

          <section className="px-4 mb-4">
            <PrimaryButton
              type="full"
              title="Redeem Voucher"
              onClick={() => {
                setCurrentSection(2);
                if (containerRef.current) {
                  containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              isActive={
                redeem !== undefined &&
                redeem?.data?.status !== "pending" &&
                !(currentSection === 1 && redeem?.data?.retryCount === 3)
              }
            />
          </section>
        </>
      )}
      {currentTab === "store" && (
        <section className="bg-neutral10 flex-1 flex flex-col p-6 gap-4">
          <TextInput
            placeholder="Search Here"
            leftAdornment={<MagnifyingGlass className="text-neutral300" />}
            onChangeInput={(e) => setInput(e.target.value)}
            value={input}
          />

          <div className="flex flex-col gap-2">
            {stores?.data
              ?.filter((store) => store.name.includes(input))
              .map((store) => {
                return (
                  <a
                    key={store?.id}
                    className="cursor-pointer bg-neutral20 px-2 py-3 rounded-lg text-black font-bold text-sm"
                  >
                    {store?.name}
                  </a>
                );
              })}
          </div>
        </section>
      )}
    </div>
  );
};

export default SectionOneStoreCode;
