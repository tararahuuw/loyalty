import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import { NotePencil } from "@phosphor-icons/react";

import { Chip, FilterDropdown, PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useFetch } from "prezent/useFetch";
import { GetAllIntegration, GetClientByName, GetDivisionByName } from "../../../service/settingmanagement/endpoint";

const DashboardIntegration = ({ roleAccess, setTitleHeader }) => {
  const navigateTo = useNavigate();
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [] });
  const [formattedFilter, setFormattedFilter] = useState("");
  const [dataFilterSearch, setDataFilterSearch] = useState(() =>
    roleAccess === "System Administrator"
      ? { option: "Client", value: "name" }
      : { option: "Division", value: "divisionId" }
  );

  const dataOptions = [
    ...(roleAccess === "System Administrator"
      ? [{ option: "Client", value: "client" }]
      : []),
    { option: "Division", value: "divisionId" },
    { option: "IP Address", value: "ipAddress" },
  ];
  const dataStatus = [
    { option: "Active", value: "1" },
    { option: "Inactive", value: "0" },
  ];

  const handleNavigateToAddIntegration = () => {
    navigateTo("/prezent/setting/integration/add");
  };

  const handleNavigateToDetailIntegration = (id) => {
    navigateTo(`/prezent/setting/integration/${id}`);
  };

  const handleNavigateToEditIntegration = (id) => {
    navigateTo(`/prezent/setting/integration/edit/${id}`);
  };

  const columns = [
    {
      header: "Division",
      assessor: "division",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.divisionName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.division_id}</p>
          </div>
        );
      },
    },
    roleAccess === "System Administrator" && {
      header: "Client",
      assessor: "client",
      Cell: (row) => {
        return <p className="font-semibold text-black text-sm">{row.clientName}</p>;
      },
    },
    {
      header: "IP Address",
      assessor: "ip address",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{`${row.totalIp} IP`}</p>
            <p className="font-normal text-primary500 text-xs">{`Waiting for approval (${row.totalWaitingApproval})`}</p>
            <p className="font-normal text-danger500 text-xs">{`Rejected (${row.totalRejected})`}</p>
          </div>
        );
      },
    },
    {
      header: "Created",
      assessor: "createdAt",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{moment(row.created_at).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">{`by ${row.created_by_name}`}</p>
          </div>
        );
      },
    },
    {
      header: "Last Update",
      assessor: "updatedAt",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{moment(row.updated_at).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">
              {row.updated_by_name ? `by ${row.updated_by_name}` : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return <Chip title={row.status ? "Active" : "Inactive"} type={row.status ? "success" : "neutral"} />;
      },
    },
    roleAccess !== "Client Support" && {
      header: "Action",
      Cell: (row) => {
        return (
          <a onClick={() => handleNavigateToEditIntegration(row.id)}>
            <NotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
          </a>
        );
      },
    },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
  };

  const { data: client } = useFetch(
    dataFilterSearch.option === "Client" && dataSearch !== "" && GetClientByName,
    "clients",
    [dataSearch, dataFilterSearch],
    {
      roleAccess,
      clientName: dataSearch,
    }
  );

  const { data: division } = useFetch(
    dataFilterSearch.option === "Division" && dataSearch !== "" && GetDivisionByName,
    "divisions",
    [dataSearch, dataFilterSearch],
    {
      roleAccess,
      divisionName: dataSearch,
    }
  );

  useEffect(() => {
    if (dataFilter.status.length) {
      setFormattedFilter(dataFilter.status[0]);
    } else {
      setFormattedFilter("");
    }
  }, [dataFilter.status]);

  useEffect(() => {
    setTitleHeader("Integration");
  }, []);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
        <div className="bg-white rounded-lg shadow-md h-full">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex">
              <SearchDropdown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />
              <div className="pl-4">
                <FilterDropdown
                  options={[
                    {
                      menu: "Status",
                      parameter: "status",
                      submenu: dataStatus,
                      type: "radiobutton",
                    },
                  ]}
                  dataFilterResult={dataFilter}
                  setDataFilterResult={setSelectedFilterOptions}
                />
              </div>
            </div>

            <PrimaryButton title="+ Add Integrations" onClick={handleNavigateToAddIntegration} />
          </div>
          <div className="drop-shadow">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllIntegration}
              queryName="integrations"
              dependencies={[dataFilterSearch.value, dataSearch, formattedFilter]}
              params={{
                roleAccess,
                body: {
                  clientId: client?.data?.length
                    ? client.data.map((item) => item.id)
                    : client?.data === null
                      ? [client.data]
                      : [],
                  divisionId: division?.data?.length
                    ? division.data.map((item) => item.id)
                    : division?.data === null
                      ? [division.data]
                      : [],
                  status: formattedFilter,
                  ipAddress: dataFilterSearch.value === "ipAddress" ? dataSearch : "",
                },
              }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(id) => handleNavigateToDetailIntegration(id)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardIntegration;
