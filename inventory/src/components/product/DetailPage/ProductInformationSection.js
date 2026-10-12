import React, { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { Chip, TextInput } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";

const ProductInformationSection = ({ products = [] }) => {
  const [dataSearch, setDataSearch] = useState("");

  const columns = [
    {
      header: "SKU / ID",
      assessor: "skuId",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.skuId}</p>
          </div>
        );
      },
    },
    {
      header: "Product Name",
      assessor: "productName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.productName}</p>
          </div>
        );
      },
    },
    {
      header: "Category",
      assessor: "category",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.category}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return (
          <div>
            <Chip title={row.status ? "Active" : "Inactive"} type={row.status ? "success" : "neutral"} />
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
          staticData={products.filter((product) =>
            Object.values(product).some((val) => val?.toString().toLowerCase().includes(dataSearch.toLowerCase()))
          )}
          columns={columns}
          options={{ pagination: true, isRounded: true }}
          onClickRow={() => {}}
        />
      </div>
    </div>
  );
};

export default ProductInformationSection;
