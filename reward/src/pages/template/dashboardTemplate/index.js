import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FilterCheckbox, PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import CardList from "../../../components/CardList/CardList";
import {
  GetAllTemplate,
  GetClientByName,
  GetDivisionByName,
} from "../../../service/voucherManagement/endpoint/voucherTemplate";
import { useFetch } from "prezent/useFetch";

const DashboardVoucher = ({ roleAccess, setTitleHeader }) => {
  const navigateTo = useNavigate();
  const [reRender, setReRender] = useState(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ type: "" });
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Template name",
    value: "template_name",
  });

  const dataOptions = [
    { option: "Template name", value: "template_name" },
    { option: "Client", value: "client" },
    { option: "Division", value: "division" },
  ];

  const handleNavigateToAddTemplate = () => {
    navigateTo("/prezent/reward/template/add");
  };

  const setSelectedFilterOptions = (options = []) => {
    const convertedOptions = options.map((option) => {
      if (option === "Image") return "upload_image";
      if (option === "Color") return "solid_color";
      return option; // In case you have other options in the future
    });

    setDataFilter({ type: !convertedOptions.length || convertedOptions.length === 2 ? "" : convertedOptions[0] });
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
    setTitleHeader("Template Voucher");
  }, []);

  return (
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
              <FilterCheckbox
                options={["Image", "Color"]}
                dataFilterResult={dataFilter}
                onSelect={setSelectedFilterOptions}
              />
            </div>
          </div>
          {roleAccess !== "Client Support" && (
            <PrimaryButton title="+ Add Template" onClick={handleNavigateToAddTemplate} />
          )}
        </div>
        <div className="drop-shadow">
          <CardList
            service={GetAllTemplate}
            queryName="templates"
            dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
            params={{
              roleAccess,
              body: {
                clients: client?.data?.length
                  ? client.data.map((item) => item.id)
                  : client?.data === null
                  ? [client.data]
                  : [],
                divisions: division?.data?.length
                  ? division.data.map((item) => item.id)
                  : division?.data === null
                  ? [division.data]
                  : [],
                type: dataFilter.type,
                template_name: dataFilterSearch.value === "template_name" ? dataSearch : "",
              },
            }}
            options={{ pagination: true }}
            searchKeyword={dataSearch}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardVoucher;
