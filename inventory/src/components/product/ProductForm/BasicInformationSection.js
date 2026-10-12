import { CaretUp, CaretDown } from "@phosphor-icons/react";
import React, { useState } from "react";
import { DropdownText, TextInput, Switch } from "sprint-asia-custom-component";
import ToolTip from "prezent/ToolTip"
import { useFetch } from "prezent/useFetch"
import DropdownMultipleChild from "../../DropdownMultipleChild";
import { GetAllTree } from "../../../service/inventoryManagement/endpoint/category";
import { GenerateProduct } from "../../../service/inventoryManagement/endpoint/product";

const BasicInformationSection = ({ formik, brands, id, clientName }) => {
  const [isOpen, setIsOpen] = useState(true)
  const { data: categories } = useFetch(GetAllTree, "first-category", [], {});
  const corporateName = JSON.parse(localStorage.getItem("valueLogin"));

  async function generateId() {
    try {
      var response = await GenerateProduct({ "name": corporateName.corporateName })
      return response.data
    }
    catch (err) {
      return "PRDSPR-00001"
    }
  }
  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40 flex justify-between items-center">
        <p>Product Information</p>
        {
          isOpen ? <CaretUp size={20} className="cursor-pointer" onClick={() => setIsOpen(false)} /> : <CaretDown size={20} className="cursor-pointer" onClick={() => setIsOpen(true)} />
        }
      </div>
      {
        isOpen &&
        <>
          <div>
            <DropdownMultipleChild
              options={categories?.data}
              currentData={formik.values.category}
              setCurrentData={(e) => {
                formik.setFieldValue("category", e)
                formik.setFieldTouched("category", true, false);
              }}
              title="Category"
              placeholder="Select category"
              footer={
                (formik.touched.category || formik.submitCount > 0) && formik.errors.category
                  ? formik.errors.category
                  : null
              }
              mode={(formik.touched.category || formik.submitCount > 0) && formik.errors.category ? "danger" : "default"}
            />
          </div>

          <div className='flex gap-4'>
            <div className="w-1/2">
              <DropdownText
                title="Brand"
                placeholder="Select Brand"
                options={brands?.map(({ name, id }) => ({
                  option: name,
                  value: id,
                }))}
                isRequired
                onSelect={(e) => {
                  formik.setFieldValue("brandId", e.value);
                  formik.setFieldTouched("brandId", true, false);
                }}
                currentOption={formik.values.brandId}
                footer={
                  (formik.touched.brandId || formik.submitCount > 0) && formik.errors.brandId
                    ? formik.errors.brandId
                    : null
                }
                mode={(formik.touched.brandId || formik.submitCount > 0) && formik.errors.brandId ? "danger" : "default"}
              />
            </div>

            <div className="w-1/2">
              <TextInput
                title="Product Name"
                placeholder="Input Product Name"
                onChangeInput={(e) => {
                  formik.setFieldValue("productName", e.target.value);
                  formik.setFieldTouched("productName", true, false);
                }}
                footer={(formik.touched.productName || formik.submitCount > 0) && formik.errors.productName ? formik.errors.productName : null}
                mode={(formik.touched.productName || formik.submitCount > 0) && formik.errors.productName ? "danger" : "default"}
                isRequired
                value={formik.values.productName}
              />
            </div>
          </div>
          <div className="w-full">
            <TextInput
              title="Master SKU"
              placeholder="Master SKU"
              onChangeInput={(e) => {
                const upperValue = e.target.value.replace(/\s+/g, "").toUpperCase();
                formik.setFieldValue("masterSKU", upperValue);
                formik.setFieldTouched("masterSKU", true, false);
              }}
              rightAdornment={
                <ToolTip id={"masterSKU-basicInformation"} message={
                  <div>
                    <p className="font-semibold">Format Auto Generate:</p>
                    <div className="flex items-center my-2">
                      <p className="mr-2 rounded-full px-4 py-1 font-semibold text-primary500 bg-primary100">PRD</p>
                      <p className="mr-2 rounded-full px-4 py-1 font-semibold text-primary500 bg-primary100">3 First Letter of Client Name</p>
                      <p className="mr-2 rounded-full px-4 py-1 font-semibold text-primary500 bg-primary100">5 Digit Running Number</p>
                    </div>
                    <p className="font-semibold mt-4">Example:</p>
                    <div className="flex items-center my-2">
                      <p className="mr-2 rounded-full px-4 py-1 font-semibold text-success500 bg-success50">PRDSPR-00001</p>
                    </div>
                  </div>
                } />
              }
              isRequired
              footer={(formik.touched.masterSKU || formik.submitCount > 0) && formik.errors.masterSKU ? formik.errors.masterSKU : null}
              mode={formik.values.isAutoGenerated ? "disable" : (formik.touched.masterSKU || formik.submitCount > 0) && formik.errors.masterSKU ? "danger" : "default"}
              value={formik.values.masterSKU}
              minimum={0}
              rightComponent={
                <div className="flex items-center mb-2 ml-4">
                  <Switch
                    onChange={async () => {
                      const newValue = !formik.values.isAutoGenerated;
                      formik.setFieldValue("isAutoGenerated", newValue);

                      if (newValue) {
                        if (formik.values.codeBucket === "") {
                          const idGenerate = await generateId();
                          formik.setFieldValue("masterSKU", idGenerate);
                          formik.setFieldTouched("masterSKU", true, false);
                        }
                        else {
                          formik.setFieldValue("masterSKU", formik.values.codeBucket);
                          formik.setFieldTouched("masterSKU", true, false);
                        }
                      }
                    }}
                    checked={formik.values.isAutoGenerated}
                    isEdit
                  />
                  <p className={`ml-2 text-sm text-neutral50`}>Auto Generate</p>
                </div>
              }
            />
          </div>
        </>
      }
    </div>
  );
};

export default BasicInformationSection;