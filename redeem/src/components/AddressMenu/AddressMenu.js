import React, { useState } from "react";
import LandingPageSmallTabBar from "prezent/LandingPageSmallTabBar";
import LandingPageAddressItemList from "prezent/LandingPageAddressItemList";
import { useFetch } from "prezent/useFetch";
import { GetAllCity, GetAllDistrict, GetAllPostalCode, GetAllProvince } from "../../service/redeempage/endpoint";

const AddressMenu = ({
  formik,
  setAddressMode,
  provinceCode,
  setProvinceCode,
  cityCode,
  setCityCode,
  districtCode,
  setDistrictCode,
  postalCode,
  setPostalCode,
}) => {
  const [currentTab, setCurrentTab] = useState("province");
  const values = formik.values["Province, City, District, Postal Code"]?.split(",") || ["", "", "", ""];

  const { data: provinces } = useFetch(GetAllProvince, "provinces", [], {});
  const { data: cities } = useFetch(provinceCode && GetAllCity, "cities", [provinceCode], provinceCode);
  const { data: districts } = useFetch(cityCode && GetAllDistrict, "districts", [cityCode], cityCode);
  const { data: postalcodes } = useFetch(districtCode && GetAllPostalCode, "postalCodes", [districtCode], districtCode);

  return (
    <div className="bg-white flex flex-col">
      <div className="p-3 pb-0 bg-white sticky top-0">
        <LandingPageSmallTabBar
          dataBar={[values[0] || "Province", values[1] || "City", values[2] || "District", values[3] || "Postal Code"]}
          dataValue={["province", "city", "district", "postal code"]}
          currentTab={currentTab}
          data={values}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
      </div>

      <div className="bg-white p-3 flex flex-col gap-4">
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
            data={postalcodes?.data}
            setAddressMode={setAddressMode}
            category="postal code"
            formik={formik}
            setProvinceCode={setProvinceCode}
            setCityCode={setCityCode}
            setDistrictCode={setDistrictCode}
            setPostalCode={setPostalCode}
          />
        )}
      </div>
    </div>
  );
};

export default AddressMenu;
