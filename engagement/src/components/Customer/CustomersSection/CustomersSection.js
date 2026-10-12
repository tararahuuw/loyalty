import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { GetAllCustomer } from "../../../service/CustomerManagement/endpoint";
import { formatPrefixPhoneNumber } from "../../../utils/index";

const CustomersSection = ({ roleAccess, clientId, loyaltyId }) => {
  const [dataSearch, setDataSearch] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Name",
    value: "name",
  });
  const [reRender, setReRender] = useState(false);

  function handleNavigateToDetailCustomer360(id) {
    navigateTo(`/prezent/engagement/customer-360/${id}`);
  }

  const dataOptions = [
    { option: "Name", value: "name" },
    { option: "Customer ID", value: "customerId" },
    { option: "Email", value: "email" },
    { option: "Phone Number", value: "phoneNumber" },
  ];

  const navigateTo = useNavigate();

  const columns = [
    {
      header: "Customer ID",
      assessor: "customer",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{formatPrefixPhoneNumber(row.customerId)}</p>
          </div>
        );
      },
    },
    {
      header: "Name",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.name}</p>
          </div>
        );
      },
    },
    {
      header: "Email",
      assessor: "email",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Phone Number",
      assessor: "phoneNumber",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.phoneNumber}</p>
          </div>
        );
      },
    },
    {
      header: "Date Created",
      assessor: "dateCreated",
      Cell: (row) => {
        return (
          <p className="font-normal text-black text-sm">
            {row.createdAt ? moment(row.createdAt).format("DD MMM YYYY, HH.mm") : "-"}
          </p>
        );
      },
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full py-3 px-4">
          <SearchDropdown
            options={dataOptions}
            placeholderSearch="Search Here"
            filterDropdown={dataFilterSearch}
            setFilterDropdown={setDataFilterSearch}
            onEnterPress={setDataSearch}
          />
        </div>
        <div className="drop-shadow">
          <DataTable
            columns={columns}
            reRender={reRender}
            service={GetAllCustomer}
            queryName="customer-360"
            dependencies={[dataFilterSearch.value, dataSearch, endDate]}
            params={{
              dataFilter: dataFilterSearch.value,
              dataSearch: dataSearch,
              dates: endDate
                ? {
                    startDate: moment(startDate).format("YYYY-MM-DD"),
                    endDate: moment(endDate).format("YYYY-MM-DD"),
                  }
                : null,
            }}
            options={{ pagination: true }}
            searchKeyword={dataSearch}
            onClickRow={(id) => handleNavigateToDetailCustomer360(id)}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomersSection;
