import React from "react";
import moment from "moment";
import { Tooltip } from "react-tooltip";
import { EmptyData } from "sprint-asia-custom-component";
import { Info, Warning, Infinity } from "@phosphor-icons/react";

const SelectVoucherTable = ({ vouchers = [], setVouchers, isLoading }) => {
  const handleChangeAllocatedStock = (id, value) => {
    const updatedVoucherArr = vouchers.map((item) => (item.id === id ? { ...item, quantity: value } : item));
    setVouchers(updatedVoucherArr);
  };

  return (
    <div className="z-10">
      <div
        className="border rounded-md border-neutral40 font-normal text-black text-sm overflow-hidden overflow-y-auto"
        style={{
          maxHeight: 500,
          minHeight: 200,
        }}
      >
        <table className="w-full table-auto">
          <thead className="bg-neutral200 text-neutral500 text-xs font-semibold uppercase">
            <tr>
              <th className="px-4 py-2 text-left">Reward</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left flex items-center">
                Point Needed
                <a
                  data-tooltip-id="pointRedeemVoucher"
                  data-tooltip-content="Points needed are calculated by dividing the voucher price by the burning point rule, then rounded up."
                >
                  <Info className="text-neutral500 text-sm ml-1" />
                </a>
              </th>
              <th className="px-4 py-2 text-left">Validity Period</th>
              <th className="px-4 py-2 text-left">Qty</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : vouchers.length > 0 ? (
              vouchers.map((row, index) => {
                const expiryDate = row.endDate;
                const parsedExpiryDate = moment(expiryDate, "YYYY-MM-DD HH:mm:ss Z");
                const isExpiringIn7Days = parsedExpiryDate.diff(moment(), "days") <= 7;
                const isExpired = parsedExpiryDate.isBefore(moment(), "day");
                return (
                  <tr key={index} className="bg-white hover:bg-neutral20 cursor-pointer">
                    <td className="px-4 py-4 border-t max-w-xs border-neutral40">
                      <div>
                        <p className="font-semibold text-black text-sm">{row.name}</p>
                        <p className="font-normal text-neutral300 text-xs">
                          {row.type} - {row.category}
                        </p>
                      </div>
                    </td>
                    <td
                      className={`px-4 py-4 border-t border-neutral40 ${
                        row.type === "PPOB" ? "text-success500" : row.stock < 50 ? "text-danger500" : "text-success500"
                      }`}
                    >
                      {row.type === "PPOB" ? <Infinity /> : row.stock}
                    </td>
                    <td className="px-4 py-4 border-t border-neutral40">Rp {row.price.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-4 border-t border-neutral40">
                      {row.pointNeeded ? row.pointNeeded.toLocaleString("id-ID") : "0"}
                    </td>
                    <td className="px-4 py-4 border-t border-neutral40">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-1 items-end">
                          <div className={`${isExpiringIn7Days ? "text-danger500" : "text-black"} items-center`}>
                            {moment(row.startDate).format("DD MMM YYYY")} - {moment(row.endDate).format("DD MMM YYYY")}
                          </div>
                          {isExpiringIn7Days && (
                            <a
                              data-tooltip-id="invalidExpiredVoucher"
                              data-tooltip-content="This voucher will expire in 7 days."
                            >
                              <Warning className="text-danger500 text-sm my-0.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 border-t border-neutral40">
                      <div className="flex flex-col gap-1">
                        <input
                          className={`p-2 rounded-md w-32 border ${
                            row.type === "Non PPOB" && row.quantity > row.stock
                              ? "border-danger500"
                              : "border-neutral80"
                          } text-sm focus:outline-none`}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\./g, "");

                            if (value === "") {
                              handleChangeAllocatedStock(row.id, 0);
                              return;
                            }

                            if (/^\d*$/.test(value)) {
                              handleChangeAllocatedStock(row.id, Number(value));
                            }
                          }}
                          value={row.quantity?.toLocaleString("id-ID") || 0}
                          disabled={isExpired}
                        />
                        {row.type === "Non PPOB" && row.quantity > row.stock && (
                          <p className="text-xs text-danger500">
                            Only {row.stock.toLocaleString("id", "ID")} stock available
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-4">
                  <EmptyData />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Tooltip id="invalidExpiredVoucher" />
    </div>
  );
};

export default SelectVoucherTable;
