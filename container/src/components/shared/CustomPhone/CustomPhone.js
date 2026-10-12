import React, { useState, useEffect } from "react";

import LogoPrezentHidden from "../../../assets/images/logo_prezent_hidden.png";
import LogoEmptyVoucher from "../../../assets/images/logo_empty_voucher.png";
import {
  Microphone,
  Camera,
  Copy,
  TagChevron,
  Sticker,
  PhonePlus,
  EnvelopeSimple,
  Trash,
  DotsThree,
  Archive,
  Star,
  ArrowElbowUpLeft,
  CaretDown,
  ArrowElbowUpRight,
  Plus,
  BatteryFull,
  WifiHigh,
  SpeakerHigh,
  AppStoreLogo,
  CaretLeft,
} from "@phosphor-icons/react";
import BackgroundWA from "../../../assets/images/background_whatsapp.png";
import { PrimaryButton, TextInput } from "sprint-asia-custom-component";
import VoucherPhoto from "../../../assets/images/voucher_photo.png";
import SandezaBills from "../../../assets/images/logo_switching_biller_hidden.png";
import KonnekLogo from "../../../assets/images/konnek_logo.png";
import TextArea from "../TextArea/TextArea";
import DateTimePicker from "../DateTimePicker/DateTimePicker";
import LandingPageSelectComponent from "../LandingPageSelectComponent/LandingPageSelectComponent";
import LandingPageAddressInput from "../LandingPageAddressInput/LandingPageAddressInput";
import LandingPageSmallTabBar from "../LandingPageSmallTabBar/LandingPageSmallTabBar";
import LandingPageAddressItemList from "../LandingPageAddressItemList/LandingPageAddressItemList";
import { useFormik } from "formik";
import { useFetch } from "../../../hooks/useFetch";
import { GetAllCity, GetAllDistrict, GetAllProvince } from "../../../service/usermanagement/endpoint";
import moment from "moment";

const CustomPhone = ({ mode = "Empty", data }) => {
  const [date, setDate] = useState("");
  const [currentTab, setCurrentTab] = useState("province");
  const [currentMode, setCurrentMode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const onClickAddress = () => {
    setCurrentMode("Address");
  };

  const formik = useFormik({
    initialValues: {
      "Province, City, District, Postal Code": "",
      "Street Name, Building, House No.": "",
      "Other Details (e.g Block / Unit No, Landmarks)": "",
    },
  });

  const addressValues = formik.values["Province, City, District, Postal Code"].split(",");

  const { data: provinces } = useFetch(GetAllProvince, "provinces", [], {});
  const { data: cities } = useFetch(provinceCode && GetAllCity, "cities", [provinceCode], provinceCode);
  const { data: districts } = useFetch(cityCode && GetAllDistrict, "districts", [cityCode], cityCode);

  useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Reset mode when user in address page and selected type is changed
  // To prevent user stuck in address page
  useEffect(() => {
    if (data?.selectedType !== "Address") {
      setCurrentMode(mode);
    }
  }, [data?.selectedType]);

  return (
    <div
      style={{ width: "250px", height: "500px", border: "10px solid #000", position: "relative", borderRadius: "25px" }}
    >
      <div className="flex justify-between">
        <p className="absolute left-0 pt-1 pl-2 text-xs text-black ml-2">09.41</p>
        <div
          style={{
            width: "110px",
            height: "20px",
            borderRadius: "0px 0px 10px 10px",
            backgroundColor: "#000",
            position: "absolute",
            top: "0px",
            left: "calc(50% - 55px)",
            zIndex: 1,
          }}
        />
        <div className="absolute right-0 pt-1 pr-2">
          <div className="flex">
            <SpeakerHigh weight="fill" className="w-3 h-3 text-black my-1" />
            <WifiHigh className="w-3 h-3 text-black m-1" />
            <BatteryFull weight="fill" className="w-3 h-3 text-black my-1" />
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-white rounded-xl overflow-hidden">
        {currentMode === "Empty" && (
          <div className="h-full w-full bg-white flex justify-center items-center text-center">
            <div>
              <div className="flex justify-center">
                <img alt="voucher-img" src={LogoEmptyVoucher} className="w-16 h-16 mb-2" />
              </div>
              <div className="w-32">
                <p className="font-semibold text-xs">Please click voucher!</p>
                <p style={{ fontSize: "8px" }} className="text-neutral300 p-1">
                  Click on any voucher in the table to preview how it will appear when you use it.
                </p>
              </div>
            </div>
          </div>
        )}
        {currentMode === "Whatsapp" && (
          <div className="h-screen">
            <div className="w-full bg-neutral20 pt-6 px-2 pb-1 flex justify-between items-center">
              <div className="flex items-center">
                <CaretLeft className="w-4 h-4 text-info500 mr-1" />
                <img alt="prezent-logo" src={LogoPrezentHidden} className="rounded-full w-5 h-5 bg-white mx-2 p-0.5" />
                <div>
                  <p className="text-xs text-bold">Prezent</p>
                  <p className="text-neutral80" style={{ fontSize: "8px" }}>
                    Online
                  </p>
                </div>
              </div>
              <PhonePlus className="w-4 h-4 text-info500" />
            </div>
            <div className="relative w-full h-screen">
              <img
                alt="background-img"
                src={BackgroundWA}
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="relative z-10 px-3 py-2">
                <div className="flex justify-center">
                  <div className="bg-info50 px-6 rounded w-fit">
                    <p style={{ fontSize: "8px" }} className="text-neutral900">
                      Today
                    </p>
                  </div>
                </div>
                <div className="bg-warning100 p-1.5 rounded mx-6 my-2 text-center">
                  <p style={{ fontSize: "8px" }} className="text-neutral900">
                    Messages and call are end-to-end encrypted. No one outside of this chat, not even Whatsapp, can read
                    or listen to them. Tap to learn more.
                  </p>
                </div>
                <div className="bg-white py-1 px-2 rounded-md w-32 drop-shadow-2xl">
                  <div className="flex">
                    <p style={{ fontSize: "8px", wordBreak: "break-word" }} className="text-neutral5">
                      {data === "" ? (
                        "-"
                      ) : (
                        <>
                          <span>{data}</span>
                          <span className="ml-1 text-primary500">https://prezent.id/redeem/NXcralJZffsjksdDVds9</span>
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <p style={{ fontSize: "8px" }} className="text-neutral80">
                      9.41 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full bg-neutral20 absolute bottom-0 p-2 rounded-md-lb rounded-b-xl">
              <div className="flex justify-between mb-2 items-center">
                <Plus className="w-5 h-5 text-info500" />
                <div className="w-32 py-1 border border-neutral80 rounded-full flex justify-between items-center px-2">
                  <p className="text-xs text-neutral50"></p>
                  <Sticker className="w-3 h-3 text-info500" />
                </div>
                <Camera weight="fill" className="w-5 h-5 text-info500" />
                <Microphone weight="fill" className="w-5 h-5 text-info500" />
              </div>
              <div className="flex justify-center mt-1">
                <div className="w-32 h-1 bg-black rounded-full"></div>
              </div>
            </div>
          </div>
        )}
        {currentMode === "Voucher" && (
          <div className="h-screen">
            <div className="overflow-y-auto no-scrollbar" style={{ height: "450px" }}>
              {data?.voucherBackgroundType === "image" ? (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{
                    backgroundImage: `url(${data?.voucherBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              ) : (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{ background: data?.voucherBackground || "#e5e5e5" }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              )}
              <div className="bg-white p-3 flex flex-row gap-1 items-center">
                <img alt="client-logo" src={LogoPrezentHidden} className="rounded-md h-9 w-9 object-cover" />
                <div>
                  <p className="text-xs font-semibold">{data?.productName || "-"}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-neutral300" style={{ fontSize: "10px" }}>
                      Voucher Ref ID : {data?.orderNumber}
                    </p>

                    <Copy size={14} className="text-neutral300 cursor-pointer" />
                  </div>
                  <p className="text-neutral300" style={{ fontSize: "10px" }}>
                    {data?.validDate ? `Valid until ${moment(data?.validDate).format("DD MMMM YYYY")}` : "-"}
                  </p>
                </div>
              </div>

              <div className="bg-neutral20 p-3 pb-8 flex flex-col gap-4">
                <div>
                  <p className="text-sm font-semibold">{data?.messageTitle || "-"}</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line" style={{ fontSize: "10px" }}>
                    {data?.message || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold">Description</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line" style={{ fontSize: "10px" }}>
                    {data?.voucherDescription || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold">How to redeem</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line" style={{ fontSize: "10px" }}>
                    {data?.howToRedeem || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold">Terms & conditions</p>
                  <p className="text-neutral300 mt-1 whitespace-pre-line" style={{ fontSize: "10px" }}>
                    {data?.terms || "-"}
                  </p>
                </div>
              </div>

              <div className="w-12 h-12 rounded-full bg-primary50 absolute bottom-0 right-0 mb-12 mr-2 flex justify-center items-center">
                <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
              </div>
              <div className="w-full bg-white absolute bottom-0 p-2 rounded-md-lb rounded-b-xl">
                <PrimaryButton title="Redeem Now" type="full" size="small" />
              </div>
            </div>
          </div>
        )}
        {currentMode === "Voucher2" && (
          <div className="h-screen">
            <div className="overflow-y-auto no-scrollbar" style={{ height: "450px" }}>
              {data?.voucherBackgroundType === "image" ? (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{
                    backgroundImage: `url(${data?.voucherBackground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              ) : (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{ background: data?.voucherBackground || "#e5e5e5" }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              )}
              <div className="bg-white p-3 flex flex-row gap-1 items-center">
                <img alt="client-logo" src={LogoPrezentHidden} className="rounded-md h-9 w-9 object-cover" />
                <div>
                  <p className="text-xs font-semibold">{data?.productName}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-neutral300" style={{ fontSize: "10px" }}>
                      Voucher Ref ID : {data?.orderNumber}
                    </p>

                    <Copy size={14} className="text-neutral300 cursor-pointer" />
                  </div>
                  <p className="text-neutral300" style={{ fontSize: "10px" }}>
                    {data?.validDate ? `Valid until ${moment(data?.validDate).format("DD MMMM YYYY")}` : "-"}
                  </p>
                </div>
              </div>

              <div className="bg-neutral20 p-3 pb-8 flex flex-col gap-4">
                <p className="text-neutral300 mt-1 whitespace-pre-line" style={{ fontSize: "10px" }}>
                  Please fill out the details below so we can process your redemption!
                </p>

                {data?.fields?.length
                  ? data.fields
                      ?.sort((a, b) => a.sequence - b.sequence)
                      ?.map((field) => {
                        if (field.type === "Short Answer") {
                          return (
                            <TextInput
                              key={field.sequence}
                              title={field.label}
                              isRequired={field.isRequired}
                              placeholder={field.instruction}
                              type={field.category === "number" ? "number" : "text"}
                            />
                          );
                        } else if (field.type === "Store Code") {
                          return (
                            <TextInput
                              key={field.sequence}
                              title={field.label}
                              isRequired={field.isRequired}
                              placeholder={field.instruction}
                              type="number"
                            />
                          );
                        } else if (field.type === "Paragraph") {
                          return (
                            <TextArea
                              key={field.sequence}
                              title={field.label}
                              isRequired={field.isRequired}
                              placeholder={field.instruction}
                              lengthChecker={false}
                              mode="default"
                            />
                          );
                        } else if (field.type === "Date Picker") {
                          return (
                            <DateTimePicker
                              key={field.sequence}
                              title={field.label}
                              isRequired={field.isRequired}
                              placeholder={field.instruction}
                              onChange={(date) => setDate(date)}
                              value={date}
                            />
                          );
                        } else if (field.type === "Single Choice" || field.type === "Multiple Choice") {
                          return (
                            <LandingPageSelectComponent
                              key={field.sequence}
                              title={field.label}
                              isRequired={field.isRequired}
                              options={field.options}
                              multipleSelect={field.type === "Single Choice" ? false : true}
                            />
                          );
                        } else if (field.type === "Address") {
                          return (
                            <LandingPageAddressInput
                              key={field.sequence}
                              formik={formik}
                              labels={field.label}
                              isRequired={field.isRequired}
                              onClickAddress={() => {}}
                            />
                          );
                        }
                      })
                  : null}
              </div>

              <div className="w-12 h-12 rounded-full bg-primary50 absolute bottom-0 right-0 mb-12 mr-2 flex justify-center items-center">
                <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
              </div>
              <div className="w-full bg-white absolute bottom-0 p-2 rounded-md-lb rounded-b-xl">
                <PrimaryButton title="Redeem Now" type="full" size="small" />
              </div>
            </div>
          </div>
        )}
        {currentMode === "Address" && (
          <div className="h-screen">
            <div className="overflow-y-auto no-scrollbar" style={{ height: "450px" }}>
              {data?.voucherBackgroundType === "image" ? (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{ backgroundImage: `url(${data?.voucherBackground})`, backgroundSize: "cover" }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              ) : (
                <div
                  className="w-full h-54 pt-6 pb-4 px-4"
                  style={{ background: data?.voucherBackground || "#e5e5e5" }}
                >
                  <img alt="voucher-img" src={data?.voucherPhoto || VoucherPhoto} className="rounded-md mt-12" />
                </div>
              )}
              <div className="bg-white p-3 flex flex-row gap-1 items-center">
                <img alt="client-logo" src={SandezaBills} className="rounded-md h-9 w-9 object-cover" />
                <div>
                  <p className="text-xs font-semibold">{data?.productName}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-neutral300" style={{ fontSize: "10px" }}>
                      Voucher Ref ID : {data?.orderNumber}
                    </p>

                    <Copy size={14} className="text-neutral300 cursor-pointer" />
                  </div>
                  <p className="text-neutral300" style={{ fontSize: "10px" }}>
                    Valid until {data?.validDate}
                  </p>
                </div>
              </div>

              <div className="bg-white p-3 pb-8 flex flex-col gap-4">
                <LandingPageSmallTabBar
                  dataBar={[
                    addressValues[0] || "Province",
                    addressValues[1] || "City",
                    addressValues[2] || "District",
                    addressValues[3] || "Postal Code",
                  ]}
                  dataValue={["province", "city", "district", "postal code"]}
                  currentTab={currentTab}
                  data={addressValues}
                  onChangeTabBar={(tab) => setCurrentTab(tab)}
                />

                {currentTab === "province" && (
                  <LandingPageAddressItemList
                    data={provinces?.data}
                    category="province"
                    formik={formik}
                    setCurrentTab={setCurrentTab}
                    setProvinceCode={setProvinceCode}
                    setCityCode={setCityCode}
                    setDistrictCode={setDistrictCode}
                    setPostalCode={setPostalCode}
                  />
                )}
                {currentTab === "city" && (
                  <LandingPageAddressItemList
                    data={cities?.data}
                    category="city"
                    formik={formik}
                    setCurrentTab={setCurrentTab}
                    setProvinceCode={setProvinceCode}
                    setCityCode={setCityCode}
                    setDistrictCode={setDistrictCode}
                    setPostalCode={setPostalCode}
                  />
                )}
                {currentTab === "district" && (
                  <LandingPageAddressItemList
                    data={districts?.data}
                    category="district"
                    formik={formik}
                    setCurrentTab={setCurrentTab}
                    setProvinceCode={setProvinceCode}
                    setCityCode={setCityCode}
                    setDistrictCode={setDistrictCode}
                    setPostalCode={setPostalCode}
                  />
                )}
                {currentTab === "postal code" && (
                  <LandingPageAddressItemList
                    data={[
                      { code: "14045", name: "14045" },
                      { code: "14046", name: "14046" },
                      { code: "14047", name: "14047" },
                    ]}
                    category="postal code"
                    formik={formik}
                    setCurrentMode={setCurrentMode}
                    setCurrentTab={setCurrentTab}
                    setProvinceCode={setProvinceCode}
                    setCityCode={setCityCode}
                    setDistrictCode={setDistrictCode}
                    setPostalCode={setPostalCode}
                  />
                )}
              </div>

              <div className="w-12 h-12 rounded-full bg-primary50 absolute bottom-0 right-0 mb-12 mr-2 flex justify-center items-center">
                <img alt="konnek-logo" src={KonnekLogo} className="w-6 h-6" />
              </div>
            </div>
          </div>
        )}
        {currentMode === "Email" && (
          <div className="h-screen">
            <div className="overflow-y-auto no-scrollbar" style={{ height: "450px" }}>
              <div className="w-full bg-white pt-6 px-2 flex justify-between">
                <CaretLeft className="w-4 h-4 text-neutral200 mt-2" />
                <div className="flex">
                  <Archive className="w-3 h-3 text-neutral200 mt-2 mr-3" />
                  <Trash className="w-3 h-3 text-neutral200 mt-2 mr-3" />
                  <EnvelopeSimple className="w-3 h-3 text-black mt-2 mr-3" />
                  <DotsThree className="w-3 h-3 text-neutral200 mt-2" />
                </div>
              </div>
              <div className="w-full bg-white pt-2 px-2 flex justify-between">
                <div className="flex items-center ml-1">
                  <p className="text-sm">Title Email</p>
                  <TagChevron weight="fill" className="w-4 h-4 text-primary400 ml-2" />
                  <div className="py-0.5 px-2 bg-neutral30 rounded-sm ml-1">
                    <p style={{ fontSize: "8px" }}>Inbox</p>
                  </div>
                </div>
                <Star className="w-4 h-4 text-neutral80 mr-2" />
              </div>
              <div className="w-full bg-white pt-2 px-2 flex justify-between items-center">
                <div className="flex items-center ml-1">
                  <img alt="prezent-logo" src={LogoPrezentHidden} className="rounded-full w-5 h-5 bg-white" />
                  <div className="ml-1">
                    <p className="font-semibold" style={{ fontSize: "10px" }}>
                      Prezent@sprint.id
                    </p>
                    <div className="flex items-center">
                      <p className="text-neutral80" style={{ fontSize: "8px" }}>
                        to me
                      </p>
                      <CaretDown className="w-3 h-3 text-neutral80 ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center mr-3">
                  <ArrowElbowUpLeft className="w-3 h-3 text-black mr-3" />
                  <DotsThree className="w-3 h-3 text-neutral200" />
                </div>
              </div>
              <div className="w-full bg-white px-2">
                <div className="p-4" style={{ fontSize: "8px", wordBreak: "break-word", whiteSpace: "pre-line" }}>
                  <p>
                    {data === "" ? (
                      "-"
                    ) : (
                      <>
                        <span>{data}</span>
                        <span className="ml-1 text-primary500">https://prezent.id/redeem/NXcralJZffsjksdDVds9</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white absolute bottom-0 p-2 rounded-md-lb rounded-b-xl">
                <div>
                  <div className="flex justify-center">
                    <div className="border border-neutral300 flex justify-center items-center w-24 py-1 m-1 rounded-sm">
                      <ArrowElbowUpLeft className="w-3 h-3 text-neutral300" />
                      <p className="ml-1 text-neutral300" style={{ fontSize: "10px" }}>
                        Reply
                      </p>
                    </div>
                    <div className="border flex justify-center items-center w-24 py-1 m-1 rounded-sm">
                      <p className="mr-1 text-neutral300" style={{ fontSize: "10px" }}>
                        Forward
                      </p>
                      <ArrowElbowUpRight className="w-3 h-3 text-neutral300" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        {currentMode === "SMS" && (
          <div className="h-screen">
            <div className="overflow-y-auto no-scrollbar" style={{ height: "450px" }}>
              <div className="w-full bg-neutral20 border-b border-neutral30 border pt-6 px-2 flex justify-between">
                <CaretLeft className="w-5 h-5 text-primary300 mt-2" />
                <div>
                  <div className="flex justify-center mt-2">
                    <img alt="prezent-logo" src={LogoPrezentHidden} className="rounded-full w-8 h-8 bg-white" />
                  </div>
                  <p className="mb-1" style={{ fontSize: "10px" }}>
                    Prezent
                  </p>
                </div>
                <CaretLeft className="w-5 h-5 text-neutral20 mt-2" />
              </div>
              <div className="w-full bg-white px-2 py-4">
                <div
                  className="w-40 bg-neutral30 rounded-lg p-2"
                  style={{ fontSize: "8px", wordBreak: "break-word", whiteSpace: "pre-line" }}
                >
                  <p>
                    {data === "" ? (
                      "-"
                    ) : (
                      <>
                        <span>{data}</span>
                        <span className="ml-1 text-primary500">https://prezent.id/redeem/NXcralJZffsjksdDVds9</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="w-full bg-white absolute bottom-0 p-2 rounded-md-lb rounded-b-xl">
                <div className="flex justify-between mb-2 items-center">
                  <Camera weight="fill" className="w-5 h-5 text-neutral80" />
                  <AppStoreLogo weight="fill" className="w-5 h-5 text-neutral80" />
                  <div className="w-40 py-1 border border-neutral80 rounded-full flex justify-between items-center px-2">
                    <p className="text-xs text-neutral50">iMessage</p>
                    <Microphone weight="fill" className="w-4 h-4 text-neutral80" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-32 h-1 bg-black rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPhone;
