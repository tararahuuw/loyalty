import React from "react";
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

const MessagePreviewSection = ({ templates = [], selectedTemplateId }) => {
  const content = templates.filter((template) => template.id === selectedTemplateId)[0]?.content;

  return (
    <div className="flex flex-col gap-4 bg-white rounded-lg py-4 px-2 overflow-hidden" style={{ height: 600 }}>
      <p className="pb-2 border-b border-neutral40 font-semibold text-lg">Message Preview</p>

      <div className="flex justify-center">
        <div
          style={{
            transform: "scale(0.55)",
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
                  {content || (
                    <span className="break-words">
                      Happy Birthday! Hey, you just got a birthday gift voucher belanja MAP Rp 100.000 from us. Click
                      link below to redeem it now:{" "}
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
  );
};

export default MessagePreviewSection;
