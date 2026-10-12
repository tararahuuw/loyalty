import React, { useState } from "react";

import DataTable from "prezent/DataTable";
import { SearchDropdown } from "sprint-asia-custom-component";
import { GetVoucherHistory } from "../../../service/voucherManagement/endpoint/voucherManagement";
import moment from "moment";

const HistorySection = ({ roleAccess, voucherId }) => {
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Campaign name",
    value: "campaignName",
  });
  const dataOptions = [
    { option: "Campaign name", value: "campaignName" },
    { option: "Campaign ID", value: "campaignID" },
    { option: "Client Name", value: "client" },
    { option: "Division Name", value: "division" },
  ];

  const columns = [
    {
      header: "Campaign Data",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-xs">{row.id}</p>
          </div>
        );
      },
    },
    {
      header: "Client",
      assessor: "clientName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.clientName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionName}</p>
          </div>
        );
      },
    },
    {
      header: "Validity Period",
      Cell: (row) => {
        return row.type === "Period" ? (
          <p>
            {moment.utc(row.startDate).format("D MMM YYYY HH:mm")} ➜{" "}
            {moment.utc(row.endDate).format("D MMM YYYY HH:mm")}
          </p>
        ) : (
          <p>-</p>
        );
      },
    },
    {
      header: "Generated",
      assessor: "generated",
      Cell: (row) => {
        return <p>{row.generatedVouchers?.toLocaleString()}</p>;
      },
    },
    {
      header: "Redeemed",
      assessor: "redeemed",
      Cell: (row) => {
        return <p>{row.redeemedVouchers?.toLocaleString()}</p>;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5 bg-white rounded-lg border border-neutral40 shadow-md p-6 ">
      <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Voucher History</div>

      <SearchDropdown
        options={dataOptions}
        placeholderSearch="Search Here"
        filterDropdown={dataFilterSearch}
        setFilterDropdown={setDataFilterSearch}
        onEnterPress={setDataSearch}
      />

      <div className="rounded-md border border-neutral30 overflow-hidden">
        <DataTable
          service={GetVoucherHistory}
          queryName="voucher-history"
          columns={columns}
          options={{ pagination: true }}
          searchKeyword={dataSearch}
          dependencies={[dataFilterSearch.value, dataSearch]}
          params={{ roleAccess, voucherId, dataFilter: dataFilterSearch.value, dataSearch }}
          onClickRow={() => {}}
        />
      </div>
    </div>
  );
};

export default HistorySection;
