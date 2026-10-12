import React, { useState, useRef } from "react";
import ToolTip from "prezent/ToolTip";
import TextArea from "prezent/TextArea";
import { Switch } from "sprint-asia-custom-component";
import ChannelDropDown from "../../RewardsSection/RewardDistributionSection/ChannelDropDown";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";
import moment from "moment";
import {
  WifiMediumIcon,
  CellSignalHighIcon,
  BatteryFullIcon,
  CaretLeftIcon,
  LockSimpleIcon,
  PlusIcon,
  StickerIcon,
  CameraIcon,
  MicrophoneIcon,
} from "@phosphor-icons/react";
import prezentLogo from "../../../../assets/images/logo_prezent_hidden.png";
import DropDownText from "../../../DropDownText/DropDownText";

const PointEarnedNotificationSection = ({ formik, channels, setChannels, templates = [], senderIds = [] }) => {
  const parentRef = useRef(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const content = templates.filter((template) => template.id === selectedTemplateId)[0]?.content;

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Earned Notification</p>
          <ToolTip
            id="point-earned-notification"
            message="Automatically send a notification when Customers earn points. This keeps them informed about every points‑earning activity and, if using PWA, encourages them to check their points balance directly."
          />
          <Switch
            checked={formik.values.isPointEarnedNotification}
            onChange={() => {
              formik.setFieldValue("isPointEarnedNotification", !formik.values.isPointEarnedNotification);
              if (formik.values.isPointEarnedNotification) {
                formik.setFieldValue("subject", "");
                formik.setFieldValue("templateLanguage", "");
                formik.setFieldValue("whatsappTemplate", "");
                formik.setFieldValue("emailTemplate", "");
                formik.setFieldValue("smsTemplate", "");
                setChannels([]);
              }
            }}
            isEdit
          />
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col gap-4 col-span-3">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
            <div className="flex items-center gap-4">
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
                  (formik.touched.channels || formik.submitCount > 0) && formik.errors.channels
                    ? formik.errors.channels
                    : null
                }
                mode={
                  (formik.touched.channels || formik.submitCount > 0) && formik.errors.channels ? "danger" : "default"
                }
              />

              <DropDownText
                title="Sender ID"
                isRequired
                isEdited={senderIds.length === 1 ? false : true}
                multiselect={false}
                currentOption={[formik.values.senderID]}
                options={senderIds.map((sender) => ({ option: sender.senderId, value: sender.id }))}
                onSelect={(e) => {
                  formik.setFieldValue("senderID", e.value);
                  formik.setFieldTouched("senderID", true, false);
                }}
                footer={
                  (formik.touched.senderID || formik.submitCount > 0) && formik.errors.senderID
                    ? formik.errors.senderID
                    : null
                }
                mode={
                  senderIds.length === 1
                    ? "disable"
                    : (formik.touched.senderID || formik.submitCount > 0) && formik.errors.senderID
                    ? "danger"
                    : "default"
                }
                parentRef={parentRef}
              />
            </div>

            <TextArea
              lengthChecker={false}
              title="Subject"
              isRequired
              placeholder="Input Subject"
              onChange={(e) => {
                formik.setFieldValue("subject", e.target.value);
                formik.setFieldTouched("subject", true, false);
              }}
              value={formik.values.subject}
              footer={
                (formik.touched.subject || formik.submitCount > 0) && formik.errors.subject
                  ? formik.errors.subject
                  : null
              }
              mode={(formik.touched.subject || formik.submitCount > 0) && formik.errors.subject ? "danger" : "default"}
            />
          </div>

          {channels.length ? (
            <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
              <div className="flex items-center gap-4">
                <DropDownText
                  multiselect={false}
                  parentRef={parentRef}
                  title="Template Language"
                  isRequired
                  isEdited
                  options={[
                    { option: "English", value: "en" },
                    { option: "Indonesian", value: "id" },
                  ]}
                  placeholder="Choose Language"
                  currentOption={[formik.values.templateLanguage]}
                  onSelect={(e) => {
                    formik.setFieldValue("templateLanguage", e.value, false);
                    formik.setFieldValue("whatsappTemplate", "");
                    formik.setFieldValue("emailTemplate", "");
                    formik.setFieldValue("smsTemplate", "");
                    // formik.setFieldTouched("templateLanguage", true, false);
                    setSelectedTemplateId(null);
                  }}
                  footer={
                    (formik.touched.templateLanguage || formik.submitCount > 0) && formik.errors.templateLanguage
                      ? formik.errors.templateLanguage
                      : null
                  }
                  mode={
                    (formik.touched.templateLanguage || formik.submitCount > 0) && formik.errors.templateLanguage
                      ? "danger"
                      : "default"
                  }
                />
                {channels.includes("WhatsApp") && formik.values.templateLanguage && (
                  <DropDownText
                    multiselect={false}
                    parentRef={parentRef}
                    title="WhatsApp Template"
                    isRequired
                    isEdited
                    options={templates
                      .filter(
                        (template) =>
                          template.category === "General Earn Point" &&
                          template.channel === "whatsapp" &&
                          template.language === formik.values.templateLanguage
                      )
                      .map((item) => ({ option: item.theme, value: item.id }))}
                    placeholder="Choose WhatsApp Template"
                    currentOption={[formik.values.whatsappTemplate]}
                    onSelect={(e) => {
                      formik.setFieldValue("whatsappTemplate", e.value);
                      formik.setFieldTouched("whatsappTemplate", true, false);
                      setSelectedTemplateId(e.value);
                    }}
                    footer={
                      (formik.touched.whatsappTemplate || formik.submitCount > 0) && formik.errors.whatsappTemplate
                        ? formik.errors.whatsappTemplate
                        : null
                    }
                    mode={
                      (formik.touched.whatsappTemplate || formik.submitCount > 0) && formik.errors.whatsappTemplate
                        ? "danger"
                        : "default"
                    }
                  />
                )}
              </div>

              <div className="flex items-center gap-4">
                {channels.includes("SMS") && formik.values.templateLanguage && (
                  <DropDownText
                    multiselect={false}
                    parentRef={parentRef}
                    title="SMS Template"
                    isRequired
                    isEdited
                    options={templates
                      .filter(
                        (template) =>
                          template.category === "General Earn Point" &&
                          template.channel === "sms" &&
                          template.language === formik.values.templateLanguage
                      )
                      .map((item) => ({ option: item.theme, value: item.id }))}
                    placeholder="Choose SMS Template"
                    currentOption={[formik.values.smsTemplate]}
                    onSelect={(e) => {
                      formik.setFieldValue("smsTemplate", e.value);
                      formik.setFieldTouched("smsTemplate", true, false);
                    }}
                    footer={
                      (formik.touched.smsTemplate || formik.submitCount > 0) && formik.errors.smsTemplate
                        ? formik.errors.smsTemplate
                        : null
                    }
                    mode={
                      (formik.touched.smsTemplate || formik.submitCount > 0) && formik.errors.smsTemplate
                        ? "danger"
                        : "default"
                    }
                  />
                )}

                {channels.includes("Email") && formik.values.templateLanguage && (
                  <DropDownText
                    multiselect={false}
                    parentRef={parentRef}
                    title="Email Template"
                    isRequired
                    isEdited
                    options={templates
                      .filter(
                        (template) =>
                          template.category === "General Earn Point" &&
                          template.channel === "email" &&
                          template.language === formik.values.templateLanguage
                      )
                      .map((item) => ({ option: item.theme, value: item.id }))}
                    placeholder="Choose Email Template"
                    currentOption={[formik.values.emailTemplate]}
                    onSelect={(e) => {
                      formik.setFieldValue("emailTemplate", e.value);
                      formik.setFieldTouched("emailTemplate", true, false);
                    }}
                    footer={
                      (formik.touched.emailTemplate || formik.submitCount > 0) && formik.errors.emailTemplate
                        ? formik.errors.emailTemplate
                        : null
                    }
                    mode={
                      (formik.touched.emailTemplate || formik.submitCount > 0) && formik.errors.emailTemplate
                        ? "danger"
                        : "default"
                    }
                  />
                )}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 bg-white p-2 col-span-2 rounded-md" style={{ height: 440 }}>
          <p className="pb-2 border-b border-neutral40 font-semibold text-lg">Message Preview</p>

          <div className="flex justify-center">
            <div
              style={{
                transform: "scale(0.4)",
                transformOrigin: "top center",
                width: "fit-content",
              }}
            >
              <DeviceFrameset device="iPhone X" color="black" landscape={false} width={375} height={812}>
                <div className="flex flex-col h-full border">
                  <div className="flex items-center justify-between pt-6 pb-2 px-8">
                    <p className="font-bold text-sm">{moment().format("HH:mm")}</p>

                    <div className="flex gap-1">
                      <WifiMediumIcon size={24} />
                      <CellSignalHighIcon size={24} />
                      <BatteryFullIcon size={24} weight="fill" />
                    </div>
                  </div>

                  <div className="flex items-center px-4 pb-2 gap-4">
                    <div className="flex items-center gap-2">
                      <CaretLeftIcon className="text-primary500" size={28} />
                      <p className="text-primary500 text-lg">1</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <img src={prezentLogo} alt="prezent-logo" className="h-10 w-h-10" />
                      <p className="text-lg font-semibold">Prezent</p>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#EBE5E0",
                    }}
                    className="flex flex-col items-center px-4 py-2 flex-1 gap-4"
                  >
                    <div className="rounded-xl bg-white px-2 py-1 shadow-md">Today</div>
                    <div
                      className="rounded-xl p-4 text-center shadow-md flex flex-col gap-4 items-center"
                      style={{ background: "#FFF8BF" }}
                    >
                      <p>
                        Messages and calls are end-to-end encrypted. No one outside of this chat, not even WhatsApp, can
                        read or listen to them. Tap to learn more.
                      </p>

                      <LockSimpleIcon size={20} weight="fill" />
                    </div>

                    <div className="rounded-xl p-4 shadow-md bg-white whitespace-pre-line self-start">
                      {content || (
                        <span className="break-words">
                          Happy Birthday! Hey, you just got a birthday gift voucher belanja MAP Rp 100.000 from us.
                          Click link below to redeem it now:{" "}
                          <span className="text-primary500 underline break-all">
                            http://staging.prezent.id/redeem/NXcralJZMnFyeFVpZXVJjbX-FOVGFjUT09
                          </span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    className="border-t border-neutral40 pt-2 pb-10 px-4 flex items-center gap-4"
                    style={{ background: "#F4F2FB" }}
                  >
                    <PlusIcon className="text-primary500" size={28} />

                    <div className="rounded-2xl flex justify-end border border-neutral40 flex-1 p-1 bg-white">
                      <StickerIcon className="text-primary500" size={28} />
                    </div>

                    <CameraIcon className="text-primary500" size={28} />

                    <MicrophoneIcon className="text-primary500" size={28} />
                  </div>
                </div>
              </DeviceFrameset>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointEarnedNotificationSection;
