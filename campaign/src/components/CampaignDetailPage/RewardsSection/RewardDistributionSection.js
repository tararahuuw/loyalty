import React, { useState } from "react";
import MessagePreviewSection from "../../CampaignFormPage/RewardsSection/RewardDistributionSection/MessagePreviewSection";
import DataTable from "prezent/DataTable";
import { TabBar } from "sprint-asia-custom-component";

const RewardDistributionSection = () => {
  const [currentTab, setCurrentTab] = useState("whatsapp");

  const columns = [
    {
      header: "Recipient Data",
      assessor: "recipient",
      Cell: (row) => {
        return (
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-black text-sm">{row.recipientName}</p>
              <p className="font-normal text-neutral300 text-xs">{row.phoneNumber}</p>
              <p className="font-normal text-neutral300 text-xs">{row.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Distribution",
      assessor: "distribution",
      Cell: (row) => {
        return <p>{row.distribution}</p>;
      },
    },
    {
      header: "Reward",
      assessor: "reward",
      Cell: (row) => {
        return <p>{row.reward}</p>;
      },
    },
  ];

  const recipients = [
    {
      recipientName: "Alice Johnson",
      phoneNumber: "+62 812-3456-7890",
      email: "alice@example.com",
      distribution: "Email",
      reward: "E-Voucher 100K",
    },
    {
      recipientName: "Bob Smith",
      phoneNumber: "+62 813-2222-3333",
      email: "bob.smith@example.com",
      distribution: "WhatsApp",
      reward: "Gift Card 50K",
    },
    {
      recipientName: "Charlie Tan",
      phoneNumber: "+62 811-9999-8888",
      email: "charlie.tan@example.com",
      distribution: "SMS",
      reward: "Discount Coupon",
    },
    {
      recipientName: "Diana Lee",
      phoneNumber: "+62 812-9876-5432",
      email: "diana.lee@example.com",
      distribution: "Email",
      reward: "Free Shipping Voucher",
    },
    {
      recipientName: "Evan Putra",
      phoneNumber: "+62 815-1111-2222",
      email: "evan.putra@example.com",
      distribution: "WhatsApp",
      reward: "Cashback 25K",
    },
    {
      recipientName: "Farah Nuraini",
      phoneNumber: "+62 816-3333-4444",
      email: "farah.nuraini@example.com",
      distribution: "SMS",
      reward: "Membership Upgrade",
    },
    {
      recipientName: "George Lim",
      phoneNumber: "+62 819-5555-6666",
      email: "george.lim@example.com",
      distribution: "Email",
      reward: "Gift Card 100K",
    },
    {
      recipientName: "Hanna Wijaya",
      phoneNumber: "+62 817-7777-8888",
      email: "hanna.wijaya@example.com",
      distribution: "WhatsApp",
      reward: "Buy 1 Get 1 Voucher",
    },
  ];

  return (
    <div className="mb-2 bg-neutral20 rounded-lg py-5 px-6 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold leading-6 text-left">Reward Distribution</p>
      </div>

      <div className="bg-white rounded-lg p-4 flex flex-col gap-1">
        <p className="font-semibold">Channel Messaging</p>
        <p>Send rewards manually via messaging channels (e.g., WhatsApp, Email, or SMS) to selected Customers.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2 gap-4">
          <div className="flex flex-col gap-4 bg-white rounded-lg p-4 overflow-hidden h-full">
            <p className="pb-2 border-b border-neutral40 font-semibold text-lg">Recipient List</p>

            <div className="flex flex-col gap-2">
              <p className="font-semibold text-base">Specific Voucher</p>
              <p>Choose specific recipients from your list to distribute the voucher.</p>
            </div>

            <DataTable
              columns={columns}
              staticData={recipients}
              options={{ pagination: false, isRounded: true }}
              onClickRow={() => {}}
              setCheckedParent={() => {}}
            />
          </div>

          <div className="flex flex-col gap-4 bg-white rounded-lg p-4">
            <p className="font-semibold text-lg">Distribution Message</p>

            <TabBar
              dataBar={["WhatsApp", "SMS", "Email"]}
              dataValue={["whatsapp", "sms", "email"]}
              currentTab={currentTab}
              onChangeTabBar={(tab) => setCurrentTab(tab)}
            />

            <div className="flex flex-col gap-1">
              <p>Template</p>
              <p className="font-medium">Birthday</p>
            </div>

            <div className="flex flex-col gap-1">
              <p>Bahasa Indonesia</p>
              <p className="font-medium">Sebarkan kampanye dalam bahasa indonesia</p>
            </div>
          </div>
        </div>

        <div className="col-span-1">
          <MessagePreviewSection />
        </div>
      </div>
    </div>
  );
};

export default RewardDistributionSection;
