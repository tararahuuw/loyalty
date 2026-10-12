import moment from "moment";
import React from "react";
import { Description } from "sprint-asia-custom-component";

const DetailSpecificationSection = ({ data }) => {
  return (
    <div className="bg-white mt-4 rounded-lg border border-neutral40 shadow-md p-6">
      <p className="text-lg font-semibold mb-4">Specifications</p>

      <Description title={"Master SKU"} value={data?.masterSKU || "-"} />

      <div className="border border-neutral40 rounded-lg bg-white p-4 mt-2">
        <table className="w-full">
          <thead>
            <tr>
              {
                data?.specificationFirst.name !== "" &&
                <th>
                  <div className="py-2 flex justify-start px-2">
                    {data?.specificationFirst.name}
                  </div>
                </th>
              }
              {
                data?.specificationSecond.name !== "" &&
                <th>
                  <div className="py-2 flex justify-start px-2">
                    {data?.specificationSecond.name}
                  </div>
                </th>
              }
              <th>
                <div className="py-2 flex justify-start px-2">
                  Price
                </div>
              </th>
              <th>
                <div className="py-2 flex justify-start px-2">
                  SKU
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {
              data && data.combinations.map((value) =>
                <tr>
                  {
                    data?.specificationFirst.name !== "" &&
                    <td>
                      <div className="py-2 flex justify-start px-2">
                        {value?.specificationsFirst?.name || "-"}
                      </div>
                    </td>
                  }
                  {
                    data?.specificationSecond.name !== "" &&
                    <td>
                      <div className="py-2 flex justify-start px-2">
                        {value?.specificationsSecond?.name || "-"}
                      </div>
                    </td>
                  }
                  <td>
                    <div className="py-2 flex justify-start px-2">
                      {value?.price || "-"}
                    </div>
                  </td>
                  <td>
                    <div className="py-2 flex justify-start px-2">
                      {value?.sku || "-"}
                    </div>
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailSpecificationSection;
