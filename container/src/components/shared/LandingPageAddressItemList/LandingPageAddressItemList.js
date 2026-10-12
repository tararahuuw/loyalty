import React from "react";

const LandingPageAddressItemList = ({
  data,
  category,
  setCurrentMode,
  formik,
  setCurrentTab,
  setAddressMode,
  setProvinceCode,
  setCityCode,
  setDistrictCode,
  setPostalCode,
}) => {
  const values = formik.values["Province, City, District, Postal Code"]?.split(",") || ["", "", "", ""];

  const onClick = (value) => {
    const { name, code, postal_code } = value;

    // Ensure the field is initialized properly
    let valueArr = formik.values["Province, City, District, Postal Code"]
      ? formik.values["Province, City, District, Postal Code"].split(",")
      : ["", "", "", ""]; // Default to an array of 4 empty strings

    if (category === "province") {
      valueArr[0] = name.trim(); // Set province
      valueArr[1] = ""; // Clear city
      valueArr[2] = ""; // Clear district
      valueArr[3] = ""; // Clear postal code
      setProvinceCode(code); // Update province code
      setCityCode("");
      setDistrictCode("");
      setCurrentTab("city");
    } else if (category === "city") {
      valueArr[1] = name.trim(); // Set city
      valueArr[2] = ""; // Clear district
      valueArr[3] = ""; // Clear postal code
      setCityCode(code); // Update city code
      setDistrictCode("");
      setCurrentTab("district");
    } else if (category === "district") {
      valueArr[2] = name.trim(); // Set district
      valueArr[3] = ""; // Clear postal code
      setDistrictCode(code); // Update district code
      setCurrentTab("postal code");
    } else if (category === "postal code") {
      valueArr[3] = postal_code; // Set postal code
      setPostalCode(postal_code); // Update postal code
    }

    // Join the array back into a string and update Formik's value
    formik.setFieldValue("Province, City, District, Postal Code", valueArr.join(","));

    if (category === "postal code") {
      setCurrentMode && setCurrentMode("Voucher2");
      setAddressMode && setAddressMode(false);
    }
  };

  return (
    <div className="flex flex-col overflow-y-auto">
      {data?.length > 0 &&
        data.map((item) => {
          if (category !== "postal code") {
            return (
              <a
                key={item.name}
                onClick={() => onClick({ name: item.name, code: item.code })}
                className={`${
                  (category === "province" && values[0] === item.code) ||
                  (category === "city" && values[1] === item.code) ||
                  (category === "district" && values[2] === item.code)
                    ? "text-primary500"
                    : "text-black"
                } cursor-pointer py-4 hover:bg-neutral20`}
              >
                {item.name}
              </a>
            );
          } else {
            return (
              <>
                {item.postal_code?.map((item) => {
                  return (
                    <a
                      key={item}
                      onClick={() => onClick({ postal_code: item })}
                      className={`${
                        category === "postal code" && values[3] === item ? "text-primary500" : "text-black"
                      } cursor-pointer py-4 hover:bg-neutral20`}
                    >
                      {item}
                    </a>
                  );
                })}
              </>
            );
          }
        })}
    </div>
  );
};

export default LandingPageAddressItemList;
