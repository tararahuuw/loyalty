import React, { useState } from "react";
import moment from "moment";
import { PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { GetAllCustomer } from "../../../service/CustomerManagement/endpoint";
import { Plus, XCircle } from "@phosphor-icons/react";
import ImportPointsModal from "./ImportPointsModal/ImportPointsModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useFormik } from "formik";
import * as yup from "yup";

const PointsSection = () => {
  const [dataSearch, setDataSearch] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Name",
    value: "name",
  });
  const [reRender, setReRender] = useState(false);
  const { isOpen: importPointsIsOpen, toggle: toggleImportPoints } = useDisclosure(false);

  const dataOptions = [
    { option: "Name", value: "name" },
    { option: "Customer ID", value: "customerId" },
    { option: "Email", value: "email" },
    { option: "Phone Number", value: "phoneNumber" },
  ];

  const columns = [
    {
      header: "Campaign Name",
      assessor: "campaignName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.campaignName}</p>
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
      header: "Point",
      assessor: "point",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.point}</p>
          </div>
        );
      },
    },
    {
      header: "Action",
      assessor: "",
      Cell: (row) => {
        return (
          <a className="custor-pointer">
            <XCircle className="text-danger500" size={24} />
          </a>
        );
      },
    },
  ];

  const formik = useFormik({
    initialValues: {
      points: [],
    },
    validationSchema: yup.object().shape({
      points: yup.array().min(1, "Points must not be empty").required("Points is required"),
    }),
    onSubmit: (values) => {},
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center w-full py-3 px-4">
          <div className="w-full flex justify-between items-center">
            <div>
              <SearchDropdown
                options={dataOptions}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                onEnterPress={setDataSearch}
              />
            </div>

            <PrimaryButton
              title={
                <div className="flex items-center gap-2">
                  <Plus />
                  <p>Upload Point</p>
                </div>
              }
              onClick={toggleImportPoints}
            />
          </div>
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
            onClickRow={() => {}}
          />
        </div>
      </div>

      <ImportPointsModal
        isOpen={importPointsIsOpen}
        title="Import to upload point"
        formik={formik}
        onClose={toggleImportPoints}
      />
    </div>
  );
};

export default PointsSection;
