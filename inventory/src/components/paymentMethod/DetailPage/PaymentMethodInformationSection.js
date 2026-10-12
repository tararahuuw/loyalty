import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { TextInput } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";

const PaymentMethodInformationSection = ({ paymentMethods = [] }) => {
  const [dataSearch, setDataSearch] = useState("");

  const columns = [
    {
      header: "Payment Method",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="text-neutral300 text-sm">{row.code}</p>
          </div>
        );
      },
    },
    {
      header: "Description",
      assessor: "description",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.description}</p>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        Payment Method Information
      </div>

      <div className="flex items-center justify-between">
        <TextInput
          placeholder="Search"
          className="max-w-sm"
          leftAdornment={<MagnifyingGlass />}
          onChangeInput={(e) => setDataSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border border-neutral30 overflow-hidden">
        <DataTable
          staticData={paymentMethods.filter((outlet) =>
            Object.values(outlet).some((val) => val?.toString().toLowerCase().includes(dataSearch.toLowerCase()))
          )}
          columns={columns}
          options={{ pagination: true, isRounded: true }}
          onClickRow={() => {}}
        />
      </div>
    </div>
  );
};

export default PaymentMethodInformationSection;
