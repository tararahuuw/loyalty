import React, { useState } from "react";
import { TabBar, DropdownText } from "sprint-asia-custom-component";
import RadioButtonComponent from "../../../RadioButtonComponent/RadioButtonComponent";

const DistributionMessageSection = () => {
  const [currentTab, setCurrentTab] = useState("whatsapp");
  const templates = [{ option: "Birthday", value: "Birthday" }];
  const [bahasa, setBahasa] = useState("indonesia");

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg p-6 flex-1">
      <div className="flex flex-col gap-4">
        <p className="text-lg font-semibold leading-6 text-left">Distribution Message</p>
        <TabBar
          dataBar={["WhatsApp", "SMS", "Email"]}
          dataValue={["whatsapp", "sms", "email"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />

        <DropdownText
          title="Template"
          placeholder="Choose Template"
          options={templates}
          isRequired
          onSelect={(e) => {}}
        />

        <div className="flex flex-row justify-between items-center">
          <RadioButtonComponent
            onChange={() => setBahasa("indonesia")}
            checked={bahasa === "indonesia"}
            value="indonesia"
            title="Bahasa Indonesia"
            description="Sebarkan kampanye dalam bahasa indonesia."
          />

          <RadioButtonComponent
            onChange={() => setBahasa("english")}
            checked={bahasa === "english"}
            value="english"
            title="English Language"
            description="Share the campaign in English."
          />
        </div>
      </div>
    </div>
  );
};

export default DistributionMessageSection;
