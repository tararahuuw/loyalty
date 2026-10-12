import React, { useRef } from "react";
import { useDisclosure } from "prezent/useDisclosure";
import { CaretDown, Trash } from "@phosphor-icons/react";
import { PrimaryButton } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useFormik } from "formik";
import * as yup from "yup";
import TextInputMask from "prezent/TextInputMask";
import { GetAllIpAddress } from "../../../service/settingmanagement/endpoint";

const IPSection = ({ loading, handleSubmitIpAddress, handleOpenDeleteConfirmation, reRender }) => {
  const contentRef = useRef(null);
  const { isOpen: formIsOpen, toggle: toggleForm } = useDisclosure(true);

  // helper (no regex)
  const isValidIPv4 = (raw) => {
    if (!raw) return false;

    // remove mask underscores/spaces just in case
    const cleaned = raw.replace(/_/g, "").trim();

    // must have exactly 3 dots -> 4 parts
    const parts = cleaned.split(".");
    if (parts.length !== 4) return false;

    for (const p of parts) {
      // disallow empty parts (e.g., "192..1.1")
      if (p === "") return false;

      // must be digits only
      if (!/^\d+$/.test(p)) return false;

      // numeric range 0-255
      const n = Number(p);
      if (Number.isNaN(n) || n < 0 || n > 255) return false;

      // optional: prevent values like "0000" (> 3 digits)
      if (p.length > 3) return false;

      // optional strictness: prevent "01", "001" (allow only "0" or no leading zeros)
      // if (p.length > 1 && p.startsWith("0")) return false;
    }

    return true;
  };

  const formik = useFormik({
    initialValues: {
      ipAddress: "",
    },
    validationSchema: yup.object().shape({
      ipAddress: yup.string().required("IP Address is required"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { resetForm, setFieldError, setFieldTouched }) => {
      const ip = values.ipAddress;

      // validate first
      if (!isValidIPv4(ip)) {
        setFieldTouched("ipAddress", true, false);
        setFieldError("ipAddress", "IP format is incorrect (must be 0-255 per octet)");
        return; // stop submit
      }

      // proceed if valid
      const cleanedValue = ip.replace(/_/g, "");
      handleSubmitIpAddress({ ipAddress: cleanedValue }, resetForm, setFieldTouched, setFieldError);
    },
  });

  const columns = [
    {
      header: "IP Address",
      assessor: "ip_address",
      Cell: (row) => {
        return <p className="font-medium text-sm">{row.ipAddress}</p>;
      },
    },
    {
      header: "",
      tdStyle: { width: "10%" },
      Cell: (row) => {
        return (
          <a onClick={() => handleOpenDeleteConfirmation(row)}>
            <Trash size="20" className="text-danger500 cursor-pointer" />
          </a>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="flex flex-col gap-2 pb-2 border-b border-neutral40">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold leading-6 text-left">IP Address</p>

          <a className="cursor-pointer" onClick={toggleForm}>
            <CaretDown
              className={`transform ${
                formIsOpen ? "rotate-180" : "rotate-0"
              } transition-transform duration-300 ease-in-out`}
            />
          </a>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{
          maxHeight: !formIsOpen ? 0 : 2000,
        }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <TextInputMask
              mask="999.999.999.999"
              title="IP Address"
              isRequired
              placeholder="Input IP Address"
              onChange={(e) => {
                formik.setFieldValue("ipAddress", e.target.value);
                formik.setFieldTouched("ipAddress", true, false);
              }}
              value={formik.values.ipAddress}
              footer={
                (formik.touched.ipAddress || formik.submitCount > 0) && formik.errors.ipAddress
                  ? formik.errors.ipAddress
                  : null
              }
              mode={
                (formik.touched.ipAddress || formik.submitCount > 0) && formik.errors.ipAddress ? "danger" : "default"
              }
            />
          </div>

          <PrimaryButton title="Add IP Address" onClick={formik.handleSubmit} />
        </div>

        <DataTable
          columns={columns}
          reRender={reRender}
          service={GetAllIpAddress}
          queryName="ip-whitelists"
          dependencies={[]}
          params={{}}
          options={{ pagination: true, isRounded: true }}
          searchKeyword={""}
          onClickRow={() => {}}
          loadingIndicator={loading}
        />
      </div>
    </div>
  );
};

export default IPSection;
