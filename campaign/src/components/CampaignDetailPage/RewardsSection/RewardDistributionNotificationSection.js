import React from "react";
import ToolTip from "prezent/ToolTip";

const RewardDistributionNotificationSection = ({
  channels = [],
  senderName,
  subject,
  templateLanguage,
  whatsappTemplate,
  smsTemplate,
  emailTemplate,
  templates = [],
}) => {
  const getTemplateObj = (templateId) => {
    return templates.filter((template) => template.id === templateId)[0];
  };

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Distribution Notification</p>
          <ToolTip
            id="reward-distribution-notification"
            message="Choose how rewards will be delivered, redeemed, and tracked after processing. This option defines how rewards are made available to Customers and how their usage is managed within the loyalty program"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg grid grid-cols-3 p-4 text-sm">
        <div className="flex flex-col gap-2">
          <p>Channel</p>
          <p className="font-medium">{channels.join(", ")}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Sender ID</p>
          <p className="font-medium">{senderName || "-"}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p>Subject</p>
          <p className="font-medium">{subject}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg grid grid-cols-4 p-4 text-sm">
        <div className="flex flex-col gap-2">
          <p>Template Language</p>
          <p className="font-medium">{templateLanguage === "id" ? "Indonesian" : "English"}</p>
        </div>

        {channels.includes("WhatsApp") && (
          <div className="flex flex-col gap-2">
            <p>WhatsApp Template</p>
            <p className="font-medium">{getTemplateObj(whatsappTemplate)?.theme}</p>
          </div>
        )}

        {channels.includes("SMS") && (
          <div className="flex flex-col gap-2">
            <p>SMS Template</p>
            <p className="font-medium">{getTemplateObj(smsTemplate)?.theme}</p>
          </div>
        )}

        {channels.includes("Email") && (
          <div className="flex flex-col gap-2">
            <p>Email Template</p>
            <p className="font-medium">{getTemplateObj(emailTemplate)?.theme}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RewardDistributionNotificationSection;
