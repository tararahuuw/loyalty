import React, { useState } from "react";
import moment from "moment";
import { PrimaryButton, SearchDropdown } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { Plus, XCircle } from "@phosphor-icons/react";
import ImportTransactionsModal from "./ImportTransactionsModal/ImportTransactionModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useFormik } from "formik";
import * as yup from "yup";

const TransactionsSection = () => {
  const [dataSearch, setDataSearch] = useState();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Name",
    value: "name",
  });
  const [reRender, setReRender] = useState(false);
  const { isOpen: importTransactionsIsOpen, toggle: toggleImportTransactions } = useDisclosure(false);

  const dataOptions = [
    { option: "Name", value: "name" },
    { option: "Customer ID", value: "customerId" },
    { option: "Email", value: "email" },
    { option: "Phone Number", value: "phoneNumber" },
  ];

  const productDummy = [
    {
      campaignName: "Loyalty A",
      customerName: "Bambang Sutrisno",
      email: "bambang@sprintasia.com",
      products: [
        { id: 1, name: "Man T-Shirt Kimi Volk Swagen", price: 150000, quantity: 1 },
        { id: 2, name: "Man T-Shirt Andrew", price: 350000, quantity: 2 },
        { id: 3, name: "Man T-Shirt Marinier", price: 150000, quantity: 1 },
        { id: 4, name: "Man T-Shirt Hugo", price: 250000, quantity: 3 },
      ],
      amount: 900000,
      point: 50,
      date: moment(),
    },
    {
      campaignName: "Loyalty B",
      customerName: "Mulyono Sudarsono",
      email: "mulyono@sprintasia.com",
      products: [
        { id: 1, name: "Man T-Shirt Kimi Volk Swagen", price: 150000, quantity: 1 },
        { id: 2, name: "Man T-Shirt Andrew", price: 350000, quantity: 2 },
        { id: 3, name: "Man T-Shirt Marinier", price: 150000, quantity: 1 },
        { id: 4, name: "Man T-Shirt Hugo", price: 250000, quantity: 3 },
      ],
      amount: 100000,
      point: 50,
      date: moment(),
    },
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
      assessor: "customerName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row.customerName}</p>
            <p className="text-neutral80">{row.email}</p>
          </div>
        );
      },
    },
    {
      header: "Product",
      assessor: "product",
      tdStyle: { paddingLeft: 0, paddingRight: 0, width: "15%" },
      Cell: (row) => {
        return (
          <div className="flex flex-col w-full">
            {row.products.slice(0, 3).map((product, index) => (
              <div
                key={product.id}
                className={`whitespace-nowrap overflow-hidden overflow-ellipsis ${index !== 0 ? "pt-2" : ""} ${
                  index === 2 || index === row.products.length - 1
                    ? "border-b border-neutral80"
                    : "border-b border-dashed border-neutral80"
                }`}
                style={{ maxWidth: 190 }}
              >
                {product.name}
              </div>
            ))}

            {row.products.length > 3 && <a className="text-primary500 cursor-pointer mt-2 font-semibold">View All</a>}
          </div>
        );
      },
    },
    {
      header: "Price",
      assessor: "price",
      tdStyle: { paddingLeft: 0, paddingRight: 0, width: "8%" },
      Cell: (row) => {
        return (
          <div className="flex flex-col w-full">
            {row.products.slice(0, 3).map((product, index) => (
              <div
                key={product.id}
                className={`${index !== 0 ? "pt-2" : ""} ${
                  index === 2 || index === row.products.length - 1
                    ? "border-b border-neutral80"
                    : "border-b border-dashed border-neutral80"
                }`}
              >
                Rp {product.price.toLocaleString("id", "ID")}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Qty",
      assessor: "quantity",
      tdStyle: { paddingLeft: 0 },
      Cell: (row) => {
        return (
          <div className="flex flex-col w-full">
            {row.products.slice(0, 3).map((product, index) => (
              <div
                key={product.id}
                className={`${index !== 0 ? "pt-2" : ""} ${
                  index === 2 || index === row.products.length - 1
                    ? "border-b border-neutral80"
                    : "border-b border-dashed border-neutral80"
                }`}
              >
                {product.quantity}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Amount",
      assessor: "amount",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">Rp {row.amount.toLocaleString("id", "ID")}</p>
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
            <p className="font-normal text-black text-sm">{row.point.toLocaleString("id", "ID")}</p>
          </div>
        );
      },
    },
    {
      header: "Date",
      assessor: "date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{moment(row.date).format("DD MMM YYYY, HH.mm")}</p>
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
      transactions: [],
    },
    validationSchema: yup.object().shape({
      transactions: yup.array().min(1, "Transactions must not be empty").required("Transactions is required"),
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
                  <p>Upload Transaction</p>
                </div>
              }
              onClick={toggleImportTransactions}
            />
          </div>
        </div>
        <div className="drop-shadow">
          <DataTable
            columns={columns}
            reRender={reRender}
            staticData={productDummy}
            options={{ pagination: true }}
            searchKeyword={dataSearch}
            onClickRow={() => {}}
          />
        </div>
      </div>

      <ImportTransactionsModal
        isOpen={importTransactionsIsOpen}
        title="Import to transaction point"
        formik={formik}
        onClose={toggleImportTransactions}
      />
    </div>
  );
};

export default TransactionsSection;
