import React, { useRef } from "react";
import { TextInput, DropdownText } from "sprint-asia-custom-component";
import ToolTip from "prezent/ToolTip";
import ChannelDropDown from "./ChannelDropDown";
import DropDownText from "../../../DropDownText/DropDownText";

const RewardDistributionNotificationSection = ({
  formik,
  channels,
  setChannels,
  templates = [],
  setSelectedTemplateId,
  senderIds = [],
}) => {
  const parentRef = useRef();

  const handleSelectChannel = (value) => {
    const allChannels = ["All", "WhatsApp", "SMS", "Email"];

    setChannels((prevState) => {
      let updated;

      if (value === "All") {
        const hasAll = allChannels.every((ch) => prevState.includes(ch));

        updated = hasAll
          ? prevState.filter((ch) => !allChannels.includes(ch)) // remove all
          : [...new Set([...prevState, ...allChannels])]; // add all
      } else {
        // toggle individual value
        updated = prevState.includes(value) ? prevState.filter((val) => val !== value) : [...prevState, value];
      }

      // ✅ Ensure "All" syncs correctly
      const hasWhatsApp = updated.includes("WhatsApp");
      const hasSMS = updated.includes("SMS");
      const hasEmail = updated.includes("Email");

      if (hasWhatsApp && hasSMS && hasEmail) {
        // all three selected → must include "All"
        if (!updated.includes("All")) {
          updated = [...updated, "All"];
        }
      } else {
        // not all three → remove "All"
        updated = updated.filter((ch) => ch !== "All");
      }

      return updated;
    });
  };

  return (
    <div className="flex flex-col gap-3 bg-neutral20 rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Reward Distribution Notification</p>
          <ToolTip
            id="reward-distribution-notification"
            message="Configure message to deliver rewards through messaging channels to Customers. This encourages active engagement and improved awareness."
          />
        </div>

        <div className="bg-white rounded-lg flex items-center gap-4 p-4">
          <ChannelDropDown
            title="Channel"
            isRequired
            placeholder="Choose Channel"
            options={[
              { option: "All", value: "All" },
              { option: "WhatsApp", value: "WhatsApp" },
              { option: "SMS", value: "SMS" },
              { option: "Email", value: "Email" },
            ]}
            onSelect={(e) => handleSelectChannel(e.value)}
            channels={channels}
            footer={
              (formik.touched.channels2 || formik.submitCount > 0) && formik.errors.channels2
                ? formik.errors.channels2
                : null
            }
            mode={
              (formik.touched.channels2 || formik.submitCount > 0) && formik.errors.channels2 ? "danger" : "default"
            }
          />
          <DropDownText
            title="Sender ID"
            isRequired
            isEdited={senderIds.length === 1 ? false : true}
            multiselect={false}
            currentOption={[formik.values.senderID2]}
            options={senderIds.map((sender) => ({ option: sender.senderId, value: sender.id }))}
            onSelect={(e) => {
              formik.setFieldValue("senderID2", e.value);
              formik.setFieldTouched("senderID2", true, false);
            }}
            footer={
              (formik.touched.senderID2 || formik.submitCount > 0) && formik.errors.senderID2
                ? formik.errors.senderID2
                : null
            }
            mode={
              senderIds.length === 1
                ? "disable"
                : (formik.touched.senderID2 || formik.submitCount > 0) && formik.errors.senderID2
                ? "danger"
                : "default"
            }
            parentRef={parentRef}
          />

          <TextInput
            title="Subject"
            isRequired
            placeholder="Input Subject"
            onChangeInput={(e) => {
              formik.setFieldValue("subject2", e.target.value);
              formik.setFieldTouched("subject2", true, false);
            }}
            value={formik.values.subject2}
            footer={
              (formik.touched.subject2 || formik.submitCount > 0) && formik.errors.subject2
                ? formik.errors.subject2
                : null
            }
            mode={(formik.touched.subject2 || formik.submitCount > 0) && formik.errors.subject2 ? "danger" : "default"}
          />
        </div>

        {channels.length ? (
          <div className="bg-white rounded-lg flex items-center gap-4 p-4">
            <DropDownText
              multiselect={false}
              title="Template Language"
              isRequired
              isEdited
              options={[
                { option: "English", value: "en" },
                { option: "Indonesian", value: "id" },
              ]}
              placeholder="Choose Language"
              currentOption={[formik.values.templateLanguage2]}
              onSelect={(e) => {
                formik.setFieldValue("templateLanguage2", e.value, false);
                formik.setFieldValue("whatsappTemplate2", "");
                formik.setFieldValue("emailTemplate2", "");
                formik.setFieldValue("smsTemplate2", "");
                // formik.setFieldTouched("templateLanguage2", true, false);
                setSelectedTemplateId(null);
              }}
              footer={
                (formik.touched.templateLanguage2 || formik.submitCount > 0) && formik.errors.templateLanguage2
                  ? formik.errors.templateLanguage2
                  : null
              }
              mode={
                (formik.touched.templateLanguage2 || formik.submitCount > 0) && formik.errors.templateLanguage2
                  ? "danger"
                  : "default"
              }
            />
            {channels.includes("WhatsApp") && (
              <DropdownText
                title="WhatsApp Template"
                isRequired
                placeholder="Choose WhatsApp Template"
                options={templates
                  .filter(
                    (template) =>
                      template.category === "General Reward" &&
                      template.channel === "whatsapp" &&
                      template.language === formik.values.templateLanguage2
                  )
                  .map((item) => ({ option: item.theme, value: item.id }))}
                currentOption={formik.values.whatsappTemplate2}
                onSelect={(e) => {
                  formik.setFieldValue("whatsappTemplate2", e.value);
                  formik.setFieldTouched("whatsappTemplate2", true, false);
                  setSelectedTemplateId(e.value);
                }}
                footer={
                  (formik.touched.whatsappTemplate2 || formik.submitCount > 0) && formik.errors.whatsappTemplate2
                    ? formik.errors.whatsappTemplate2
                    : null
                }
                mode={
                  (formik.touched.whatsappTemplate2 || formik.submitCount > 0) && formik.errors.whatsappTemplate2
                    ? "danger"
                    : "default"
                }
              />
            )}
            {channels.includes("SMS") && (
              <DropdownText
                title="SMS Template"
                isRequired
                placeholder="Choose SMS Template"
                options={templates
                  .filter(
                    (template) =>
                      template.category === "General Reward" &&
                      template.channel === "sms" &&
                      template.language === formik.values.templateLanguage2
                  )
                  .map((item) => ({ option: item.theme, value: item.id }))}
                currentOption={formik.values.smsTemplate2}
                onSelect={(e) => {
                  formik.setFieldValue("smsTemplate2", e.value);
                  formik.setFieldTouched("smsTemplate2", true, false);
                }}
                footer={
                  (formik.touched.smsTemplate2 || formik.submitCount > 0) && formik.errors.smsTemplate2
                    ? formik.errors.smsTemplate2
                    : null
                }
                mode={
                  (formik.touched.smsTemplate2 || formik.submitCount > 0) && formik.errors.smsTemplate2
                    ? "danger"
                    : "default"
                }
              />
            )}
            {channels.includes("Email") && (
              <DropdownText
                title="Email Template"
                isRequired
                placeholder="Choose Email Template"
                options={templates
                  .filter(
                    (template) =>
                      template.category === "General Reward" &&
                      template.channel === "email" &&
                      template.language === formik.values.templateLanguage2
                  )
                  .map((item) => ({ option: item.theme, value: item.id }))}
                currentOption={formik.values.emailTemplate2}
                onSelect={(e) => {
                  formik.setFieldValue("emailTemplate2", e.value);
                  formik.setFieldTouched("emailTemplate2", true, false);
                }}
                footer={
                  (formik.touched.emailTemplate2 || formik.submitCount > 0) && formik.errors.emailTemplate2
                    ? formik.errors.emailTemplate2
                    : null
                }
                mode={
                  (formik.touched.emailTemplate2 || formik.submitCount > 0) && formik.errors.emailTemplate2
                    ? "danger"
                    : "default"
                }
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RewardDistributionNotificationSection;
