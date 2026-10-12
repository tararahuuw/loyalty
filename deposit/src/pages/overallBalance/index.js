import React, { useEffect, useState } from "react";
import moment from "moment";
import DataTable from "prezent/DataTable";
import DatePicker from "../../components/DatePicker/DatePicker";
import { SearchDropdown } from "sprint-asia-custom-component";
import { GetOverallBalance } from "../../service/depositManagement/endpoint";

const OverallBalance = ({ roleAccess, setTitleHeader }) => {
  const [startDate, setStartDate] = useState(moment().subtract(1, "month").format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Division",
    value: "divisionName",
  });

  const dataOptions1 = [
    { option: "Client", value: "clientName" },
    { option: "Division", value: "divisionName" },
    { option: "Client ID", value: "clientId" },
  ];

  const dataOptions2 = [
    { option: "Division", value: "divisionName" },
    { option: "Division ID", value: "divisionId" },
  ];

  const columns1 = [
    {
      header: "Client Data",
      assessor: "client",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.clientName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.clientId}</p>
          </div>
        );
      },
    },
    {
      header: "PIC Data",
      assessor: "pic",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.picEmail}</p>
            <p className="font-normal text-neutral300 text-xs">{row.picPhoneNumber}</p>
          </div>
        );
      },
    },
    {
      header: "Last Top Up",
      assessor: "createdAt",
      Cell: (row) => {
        return <p className="font-normal text-black text-sm">{moment(row.lastTopUp).format("D MMM YYYY")}</p>;
      },
    },
    {
      header: "Balance Nominal",
      assessor: "payment_method",
      Cell: (row) => {
        return <p className="text-black text-sm">Rp {row.balanceAmount.toLocaleString()}</p>;
      },
    },
  ];

  const columns2 = [
    {
      header: "Division Data",
      assessor: "division",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.divisionName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionId}</p>
          </div>
        );
      },
    },
    {
      header: "PIC Data",
      assessor: "pic",
      Cell: (row) => {
        return (
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.picEmail}</p>
            <p className="font-normal text-neutral300 text-xs">{row.picPhoneNumber}</p>
          </div>
        );
      },
    },
    {
      header: "Last Top Up",
      assessor: "createdAt",
      Cell: (row) => {
        return <p className="font-normal text-black text-sm">{moment(row.lastTopUp).format("D MMM YYYY")}</p>;
      },
    },
    {
      header: "Balance Nominal",
      assessor: "payment_method",
      Cell: (row) => {
        return <p className="text-black text-sm">Rp {row.balanceAmount.toLocaleString()}</p>;
      },
    },
  ];

  useEffect(() => {
    setTitleHeader("Balance");
  }, []);

  return (
    <div className="flex flex-col gap-4 flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
      <div className="bg-white rounded-lg shadow-md h-full py-8 px-6 flex flex-col gap-2">
        <p className="font-bold text-2xl">Overall Balance</p>
        {[
          "System Administrator",
          "Ops Administrator",
          "Business Administrator",
          "Business Support",
          "Reconcile",
        ].includes(roleAccess) ? (
          <p className="text-base text-neutral300">This overall balance is from your various client</p>
        ) : (
          <p className="text-base text-neutral300">This overall balance is from your division</p>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md h-full">
        <div className="flex justify-between items-center w-full py-3 px-4">
          <div className="flex gap-3 flex-1">
            <div>
              <SearchDropdown
                options={
                  [
                    "System Administrator",
                    "Ops Administrator",
                    "Business Administrator",
                    "Business Support",
                    "Reconcile",
                  ].includes(roleAccess)
                    ? dataOptions1
                    : dataOptions2
                }
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />
            </div>

            <DatePicker
              onChangeRange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              value={[startDate, endDate]}
              onReset={() => {
                setStartDate(moment().subtract(1, "month").format("YYYY-MM-DD"));
                setEndDate(moment().format("YYYY-MM-DD"));
              }}
              placeholder="Select period"
              mode="dashboard"
              className="max-w-xs"
            />
          </div>
        </div>

        <DataTable
          columns={
            [
              "System Administrator",
              "Ops Administrator",
              "Business Administrator",
              "Business Support",
              "Reconcile",
            ].includes(roleAccess)
              ? columns1
              : columns2
          }
          service={GetOverallBalance}
          queryName="balances"
          dependencies={[dataFilterSearch.value, dataSearch, startDate, endDate]}
          params={{
            roleAccess,
            dataFilter: dataFilterSearch.value,
            dataSearch,
            body: {
              startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
              endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
            },
          }}
          options={{ pagination: true }}
          onClickRow={() => {}}
        />
      </div>
    </div>
  );
};

export default OverallBalance;
