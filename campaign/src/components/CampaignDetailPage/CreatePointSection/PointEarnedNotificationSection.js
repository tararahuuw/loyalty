import React from "react";
import ToolTip from "prezent/ToolTip";
import { Chip } from "sprint-asia-custom-component";
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
import prezentLogo from "../../../assets/images/logo_prezent_hidden.png";

const PointEarnedNotificationSection = ({
  isPointEarnedNotification,
  channels = [],
  senderName,
  subject,
  templateLanguage = "",
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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold leading-6 text-left">Point Earned Notification</p>
          <ToolTip
            id="point-earned-notification"
            message="Automatically send a notification when Customers earn points. This keeps them informed about every points‑earning activity and, if using PWA, encourages them to check their points balance directly."
          />

          <div>
            <Chip
              title={isPointEarnedNotification ? "Active" : "Inactive"}
              type={isPointEarnedNotification ? "success" : "neutral"}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        <div className="flex flex-col gap-4 col-span-3">
          <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
            <div className="grid grid-cols-2">
              <div className="flex flex-col gap-2">
                <p>Channel</p>
                <p className="font-medium">{channels.length ? channels.join(", ") : "-"}</p>
              </div>

              <div className="flex flex-col gap-2">
                <p>Sender ID</p>
                <p className="font-medium">{senderName || "-"}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p>Subject</p>
              <p className="font-medium whitespace-pre-line">{subject || "-"}</p>
            </div>
          </div>

          {channels.length ? (
            <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
              <div className="grid grid-cols-2">
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
              </div>

              <div className="grid grid-cols-2">
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

                    <div className="rounded-xl p-4 shadow-md bg-white self-start">
                      {getTemplateObj(whatsappTemplate)?.content || (
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
