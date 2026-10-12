import React, { useState } from "react";
import TabBar from "../TabBar/TabBar";
import CollapseCard from "../CollapseCard/CollapseCard";
import { GetAvailableStores } from "../../service/redeempage/endpoint";
import { TextInput } from "sprint-asia-custom-component";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useFetch } from "prezent/useFetch";

const SectionOne = ({ description, howToUse, terms, productID, type }) => {
  const [currentTab, setCurrentTab] = useState("information");
  const [input, setInput] = useState("");
  const { data: stores } = useFetch(productID && type !== "PPOB" && GetAvailableStores, "stores", [], { productID });

  return (
    <div className="mt-4 flex flex-col flex-1">
      <TabBar
        dataBar={type === "PPOB" ? ["Information"] : ["Information", "Store"]}
        dataValue={type === "PPOB" ? ["information"] : ["information", "store"]}
        currentTab={currentTab}
        onChangeTabBar={(tab) => setCurrentTab(tab)}
      />

      <div className="px-4 flex flex-col gap-4 bg-neutral10 py-4 pb-24">
        {currentTab === "information" && (
          <>
            <section className="flex flex-col gap-2 w-full">
              <p className="font-medium">About this reward</p>
              <p className="text-neutral500">{description}</p>
            </section>

            <CollapseCard title="How to use" content={howToUse} />

            <CollapseCard title="Terms and conditions" content={terms} />
          </>
        )}

        {currentTab === "store" && (
          <>
            <TextInput
              placeholder="Search Here"
              leftAdornment={<MagnifyingGlass className="text-neutral300" />}
              onChangeInput={(e) => setInput(e.target.value)}
              value={input}
            />

            <div className="flex flex-col gap-1 max-h-56 overflow-y-auto no-scrollbar">
              {stores?.data
                ?.filter((store) => store?.name?.toLowerCase()?.includes(input.toLocaleLowerCase()))
                ?.map((store) => {
                  return (
                    <a
                      key={store?.id}
                      className="font-medium cursor-pointer bg-neutral20 px-2 py-3 rounded-lg text-black text-sm"
                    >
                      {store?.name}
                    </a>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SectionOne;
