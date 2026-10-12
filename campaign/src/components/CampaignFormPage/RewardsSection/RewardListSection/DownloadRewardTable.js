import React, { useState } from "react";
import moment from "moment";
import ToolTip from "prezent/ToolTip";
import { useDisclosure } from "prezent/useDisclosure";
import { EmptyData, Switch } from "sprint-asia-custom-component";
import { InfoIcon } from "@phosphor-icons/react";

const DownloadRewardTable = ({ formik, vouchers = [], isLoading }) => {
  const { isOpen: isChecked, toggle } = useDisclosure();
  const [input, setInput] = useState("0");

  const handleChangeAllocatedStock = (id, value) => {
    const updatedVoucherArr = vouchers.map((item) => (item.id === id ? { ...item, quantity: value } : item));
    formik.setFieldValue("rewards", updatedVoucherArr);
  };

  const distributeRoundRobin = (total, vouchers) => {
    // Only vouchers that can receive quantity
    const available = vouchers.filter((v) => v.ownedQuantity > 0);
    const count = available.length;
    if (count === 0) return vouchers.map((v) => ({ ...v, quantity: 0 }));

    let result = vouchers.map((v) => ({ ...v, quantity: 0 }));
    let remaining = total;

    // Keep looping until distributed or no capacity left
    while (remaining > 0) {
      let distributed = false;
      for (let i = 0; i < result.length && remaining > 0; i++) {
        const v = result[i];
        if (v.ownedQuantity > v.quantity) {
          result[i] = { ...v, quantity: v.quantity + 1 };
          remaining--;
          distributed = true;
        }
      }
      // Stop if no voucher can take more
      if (!distributed) break;
    }

    return result;
  };

  return (
    <div
      className="border rounded-md border-neutral40 font-normal text-black text-sm overflow-hidden overflow-y-auto"
      style={{
        maxHeight: 500,
        minHeight: 200,
      }}
    >
      {/* Round Robin */}
      <div className="p-2">
        <div
          className={`${
            formik.errors.rewards ? "bg-danger50 border border-danger500" : ""
          } flex flex-col gap-1 rounded-md p-2`}
        >
          <div className="flex items-center justify-between" style={{ paddingRight: 60 }}>
            <div className="flex items-center gap-4">
              <Switch isEdit checked={isChecked} onChange={toggle} />
              <p className="font-semibold text-sm text-neutral300">Set Total Download Quantity for All Rewards</p>
              <InfoIcon className="text-neutral300" size={20} />
            </div>

            <input
              disabled={!isChecked}
              className={`p-2 rounded-md w-32 border border-neutral80 text-sm focus:outline-none ${
                isChecked ? "cursor-text bg-white" : "cursor-not-allowed bg-neutral30"
              }`}
              onChange={(e) => {
                let value = e.target.value.replace(/,/g, "");
                if (value === "") {
                  setInput(0);
                  const updated = distributeRoundRobin(0, formik.values.rewards);
                  formik.setFieldValue("rewards", updated);
                  return;
                }

                if (/^\d*$/.test(value)) {
                  const total = Number(value);
                  setInput(total.toLocaleString());

                  const updated = distributeRoundRobin(total, formik.values.rewards);
                  formik.setFieldValue("rewards", updated);
                }
              }}
              value={input}
            />
          </div>

          {formik.errors.rewards && (
            <div className="flex items-center gap-1 text-danger500">
              <InfoIcon size={20} />
              <p>{formik.errors.rewards}</p>
            </div>
          )}
        </div>
      </div>

      <table className="w-full table-auto">
        <thead className="bg-neutral200 text-neutral500 text-xs font-semibold uppercase">
          <tr>
            <th className="px-4 py-2 text-left">Reward</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Point Needed</th>
            <th className="px-4 py-2 text-left">Owned Qty</th>
            <th className="px-4 py-2 text-left">Validity Period</th>
            <th className="px-4 py-2 text-left">
              <div className="flex items-center gap-1">
                <p>Download Qty</p>
                <ToolTip id="download-qty" message="" />
              </div>
            </th>
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
              const isError = formik.errors.rewards || row.quantity > row.ownedQuantity;
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
                    {row.type === "PPOB" ? "Unlimited" : row.stock}
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">Rp {row.price.toLocaleString("id-ID")}</td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    {row.pointNeeded ? row.pointNeeded.toLocaleString("id-ID") : "0"}
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">{row.ownedQuantity || 0}</td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-sm">{moment(row.startDate).format("DD MMM YYYY")}</p>
                      <p className="font-normal text-neutral80 text-xs">
                        Until {moment(row.endDate).format("DD MMM YYYY")}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    <div className="flex flex-col gap-1 relative">
                      <input
                        className={`p-2 rounded-md w-32 border ${
                          isError ? "border-danger500 bg-danger50" : "border-neutral80"
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
                      />

                      {isError && <InfoIcon className="text-danger500 absolute top-2.5 right-12" size={18} />}

                      {row.quantity > row.ownedQuantity && (
                        <p className="text-xs text-danger500">
                          Only {row.ownedQuantity.toLocaleString("id", "ID")} ownedQuantity available
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
  );
};

export default DownloadRewardTable;
