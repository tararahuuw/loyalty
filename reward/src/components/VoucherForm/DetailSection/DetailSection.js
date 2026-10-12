import React, { useEffect } from "react";
import { useState } from "react";

import { TextInput } from "sprint-asia-custom-component";
import moment from "moment";

import DropDownSearch from "prezent/DropDownSearch";
import TextArea from "prezent/TextArea";
import { LockSimple } from "@phosphor-icons/react";
import { GetProductBySearch } from "../../../service/voucherManagement/endpoint/voucherManagement";
import CustomDatePicker from "../../DatePicker/DatePicker";
import DateTimePicker from "../../DateTimePicker/DateTimePicker";

const DetailSection = ({ formik, editable, selectedCategoryName, voucherId }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const checkValidityPeriod = (type) => {
    let error = false;
    let tooltipMessage = "";

    if (selectedProduct) {
      if (type === "start") {
        const formattedStartDateProduct = moment.utc(selectedProduct?.startDate);
        const formattedStartDateFormik = moment.utc(formik.values.validityStartDate);
        const diff = formattedStartDateProduct.diff(formattedStartDateFormik);
        if (diff > 0) {
          error = true;
          tooltipMessage = `Voucher validity cannot be faster than Sandeza bills; Sandeza bills validity period starts on ${formattedStartDateProduct.format(
            "DD MMMM YYYY, HH:mm"
          )}.`;
        }
      } else if (type === "end") {
        const formattedEndDateProduct = moment.utc(selectedProduct?.endDate);
        const formattedEndDateFormik = moment.utc(formik.values.validityEndDate);
        const diff2 = formattedEndDateProduct.diff(formattedEndDateFormik);
        if (diff2 < 0) {
          error = true;
          tooltipMessage = `Voucher validity cannot be longer than Sandeza bills; Sandeza bills validity period ends on ${formattedEndDateProduct.format(
            "DD MMMM YYYY, HH:mm"
          )}.`;
        }
      }
    }

    // New validation for end date being greater than start date
    if (type === "end" && formik.values.validityEndDate && formik.values.validityStartDate) {
      const validityStartDate = moment.utc(formik.values.validityStartDate);
      const validityEndDate = moment.utc(formik.values.validityEndDate);
      if (validityEndDate.isBefore(validityStartDate)) {
        error = true;
        tooltipMessage = "End date period can't be previous than start date period.";
      }
    }

    return { error, tooltipMessage };
  };

  useEffect(() => {
    if (
      selectedProduct &&
      (formik.values.voucherCategory === "2.1" ||
        formik.values.voucherCategory === "2.2" ||
        formik.values.voucherCategory === "3.9" ||
        formik.values.voucherCategory === "3.10")
    ) {
      formik.setFieldValue("activePeriodStartDate", selectedProduct.startDate);
      formik.setFieldValue("activePeriodEndDate", selectedProduct.endDate);
    }
  }, [selectedProduct, formik.values.voucherCategory]);

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher Detail</div>
      <DropDownSearch
        title="Product Name"
        placeholder="Input Product Name"
        onChange={(value) => {
          formik.setFieldValue("productId", value.id);
          formik.setFieldValue("denom", value.denom);
          formik.setFieldValue("provider", value.provider || "");
          formik.setFieldValue("activePeriod", value.activePeriod || "");
          formik.setFieldValue("price", value.price);
          formik.setFieldValue("stock", value.stock);
          setSelectedProduct(value);
          formik.setFieldTouched("productId", true, false);
        }}
        footer={
          (formik.touched.productId || formik.submitCount > 0) && formik.errors.productId
            ? formik.errors.productId
            : null
        }
        mode={
          voucherId
            ? "disable"
            : (formik.touched.productId || formik.submitCount > 0) && formik.errors.productId
            ? "danger"
            : "default"
        }
        isRequired
        value={formik.values.productId}
        className="max-w-sm"
        service={GetProductBySearch}
        queryName="products"
        dependencies={[formik.values.voucherType]}
        params={{ type: Number(formik.values.voucherType), category: selectedCategoryName }}
        disabled={editable || voucherId}
      />

      <div className="flex flex-row gap-6 flex-wrap">
        <TextInput
          title="Denom"
          placeholder="Input Denom"
          footer={formik.errors.denom}
          isRequired
          mode="disable"
          value={formik.values.denom}
          className="max-w-sm"
          rightAdornment={<LockSimple />}
        />

        {formik.values.voucherType !== "2" && (
          <TextInput
            title="Stock"
            placeholder="Input Stock"
            footer={formik.errors.stock}
            isRequired
            mode="disable"
            value={formik.values.stock}
            className="max-w-sm"
            type="number"
            rightAdornment={<LockSimple />}
          />
        )}

        <TextInput
          title="Voucher Price"
          placeholder="Input Voucher Price"
          footer={formik.errors.price}
          isRequired
          mode="disable"
          value={formik.values.price}
          className="max-w-sm"
          leftAdornment={<p className="font-normal text-neutral300 text-xs">Rp</p>}
          rightAdornment={<LockSimple />}
        />

        {(formik.values.voucherCategory === "2.1" ||
          formik.values.voucherCategory === "2.2" ||
          formik.values.voucherCategory === "3.9" ||
          formik.values.voucherCategory === "3.10") && (
          <CustomDatePicker
            title="Active Period"
            placeholder="Select Active Period"
            isRequired
            value={[formik.values.activePeriodStartDate, formik.values.activePeriodEndDate]}
            className="max-w-sm"
            disabled
            mode="disable"
          />
        )}

        <DateTimePicker
          title="Start Date Period"
          placeholder="Select Start Date"
          isRequired
          onChange={(value) => {
            formik.setFieldValue("validityStartDate", value);
            formik.setFieldTouched("validityStartDate", true, false);
          }}
          mode={
            editable
              ? "disable"
              : ((formik.touched.validityStartDate || formik.submitCount > 0) && formik.errors.validityStartDate) ||
                checkValidityPeriod("start").error
              ? "danger"
              : "default"
          }
          footer={
            (formik.touched.validityStartDate || formik.submitCount > 0) && formik.errors.validityStartDate
              ? formik.errors.validityStartDate
              : null
          }
          disabled={editable}
          value={formik.values.validityStartDate}
          className="max-w-sm"
          tooltip={checkValidityPeriod("start").error && checkValidityPeriod("start").tooltipMessage}
        />

        <DateTimePicker
          title="End Date Period"
          placeholder="Select End Date"
          isRequired
          onChange={(value) => {
            formik.setFieldValue("validityEndDate", value);
            formik.setFieldTouched("validityEndDate", true, false);
          }}
          mode={
            editable
              ? "disable"
              : ((formik.touched.validityEndDate || formik.submitCount > 0) && formik.errors.validityEndDate) ||
                checkValidityPeriod("end").error
              ? "danger"
              : "default"
          }
          footer={
            (formik.touched.validityEndDate || formik.submitCount > 0) && formik.errors.validityEndDate
              ? formik.errors.validityEndDate
              : null
          }
          disabled={editable}
          value={formik.values.validityEndDate}
          className="max-w-sm"
          tooltip={checkValidityPeriod("end").error && checkValidityPeriod("end").tooltipMessage}
        />

        <TextArea
          title="Description"
          placeholder="Input Description"
          onChange={(e) => {
            formik.setFieldValue("description", e.target.value);
            formik.setFieldTouched("description", true, false);
          }}
          footer={
            (formik.touched.description || formik.submitCount > 0) && formik.errors.description
              ? formik.errors.description
              : "Write a description of your voucher, so that client can understand more easily."
          }
          isRequired
          mode={
            (formik.touched.description || formik.submitCount > 0) && formik.errors.description ? "danger" : "default"
          }
          value={formik.values.description}
        />

        <TextArea
          title="How to redeem"
          placeholder="Input How to redeem"
          onChange={(e) => {
            formik.setFieldValue("howToRedeem", e.target.value);
            formik.setFieldTouched("howToRedeem", true, false);
          }}
          footer={
            (formik.touched.howToRedeem || formik.submitCount > 0) && formik.errors.howToRedeem
              ? formik.errors.howToRedeem
              : "Write a How to redeem of your voucher, so that client can understand more easily."
          }
          isRequired
          mode={
            (formik.touched.howToRedeem || formik.submitCount > 0) && formik.errors.howToRedeem ? "danger" : "default"
          }
          value={formik.values.howToRedeem}
        />

        <TextArea
          title="Term & condition"
          placeholder="Input Term & condition"
          onChange={(e) => {
            formik.setFieldValue("termAndConditions", e.target.value);
            formik.setFieldTouched("termAndConditions", true, false);
          }}
          footer={
            (formik.touched.termAndConditions || formik.submitCount > 0) && formik.errors.termAndConditions
              ? formik.errors.termAndConditions
              : "Write a Term & condition of your voucher, so that client can understand more easily."
          }
          isRequired
          mode={
            (formik.touched.termAndConditions || formik.submitCount > 0) && formik.errors.termAndConditions
              ? "danger"
              : "default"
          }
          value={formik.values.termAndConditions}
        />
      </div>
    </div>
  );
};

export default DetailSection;
