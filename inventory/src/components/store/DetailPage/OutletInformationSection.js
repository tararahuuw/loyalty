import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Chip, TextInput } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import {formatPrefixPhoneNumber} from "../../../utils/index"

const OutletInformationSection = ({ outlets = [] }) => {
  const [dataSearch, setDataSearch] = useState("");

  const columns = [
    {
      header: "Outlet Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="text-neutral300 text-sm">{row.code}</p>
            <p className="text-neutral300 text-sm">CODE / ID</p>
          </div>
        );
      },
    },
    {
      header: "Address",
      assessor: "address",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.address}</p>
          </div>
        );
      },
    },
    {
      header: "PIC",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="text-neutral300 text-sm">{formatPrefixPhoneNumber(row.picPhoneNumber)}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "email",
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <div>
            <Chip
              title={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              type={row.status === "active" ? "success" : "neutral"}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Store Information</div>

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
          staticData={outlets.filter((outlet) =>
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

export default OutletInformationSection;
