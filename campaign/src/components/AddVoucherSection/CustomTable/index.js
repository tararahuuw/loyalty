import moment from "moment";
import React from "react";
import { PiWarning, PiArrowRight, PiInfo } from "react-icons/pi";
import { Tooltip } from 'react-tooltip';
import { EmptyData } from "sprint-asia-custom-component";

const CustomTable = ({
  voucher,
  validityStartDate, 
  selectAll, 
  handleSelectAll, 
  handleCheckboxChange,
  isLoading,
}) => {
  return (
    <div className="mt-4 z-50">
      <div className="border rounded-md border-neutral40 font-normal text-black text-sm overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-neutral200 text-neutral500 text-xs font-semibold uppercase">
            <tr>
              <th className="px-2 py-2 w-6 text-center">
                <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              </th>
              <th className="px-4 py-2 text-left">Voucher Detail</th>
              <th className="px-4 py-2 text-left">Stock</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Validity Period</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-4">Loading...</td>
              </tr>
            ) : voucher && voucher.length > 0 ? (
              voucher.map((row, index) => (
                <tr key={index} className={`${row.existingVoucher || row.checked ? "bg-neutral20" : "bg-white"} hover:bg-neutral20 cursor-pointer`}>
                  <td className="w-6 px-2 py-2 text-center border-t border-neutral40">
                    <input
                      type="checkbox"
                      checked={row.existingVoucher || row.checked}
                      style={{ accentColor: row.existingVoucher ? "#9B9B9C" : "blue" }}
                      onChange={() => {
                        if (!row.existingVoucher) handleCheckboxChange(row.id);
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    <div className="flex items-center">
                      <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${row.voucherPhoto}`} className="w-16 h-10 rounded-md mr-2" />
                      <div>
                        <p className="font-semibold text-black text-sm">{row.voucherName}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.voucherType} - {row.voucherCategory}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-4 border-t border-neutral40 ${row.voucherType === "PPOB Voucher" ? "text-success500" : row.stock < 50 ? "text-danger500" : "text-success500"}`}>
                    {row.voucherType === "PPOB Voucher" ? "Unlimited" : row.stock}
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">Rp{row.price.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    <div className="flex justify-between items-center">
                      <div>
                        {(() => {
                          const expiryDate = row.validityEndDate;
                          const parsedExpiryDate = moment(expiryDate, "YYYY-MM-DD HH:mm:ss Z");
                          const isExpiringIn30Days = parsedExpiryDate.diff(validityStartDate, "days") <= 50;
                          return (
                            <div className="flex items-center">
                              <div className={`${isExpiringIn30Days ? "text-danger500" : "text-black"}`}>
                                <div className="flex items-center">
                                  <p className="text-sm mr-1">{moment(row.validityStartDate).format("DD MMM YYYY HH:mm")}</p>
                                  <PiArrowRight />
                                </div>
                                <p className="text-sm">{moment(row.validityEndDate).format("DD MMM YYYY HH:mm")}</p>
                              </div>
                              {isExpiringIn30Days && (
                                <a data-tooltip-id="invalidExpiredVoucher" data-tooltip-content="This voucher will expire in 50 days from the start date of the campaign you’ve created.">
                                  <PiWarning className="text-warning500 text-sm ml-1" />
                                </a>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4">
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

export default CustomTable;