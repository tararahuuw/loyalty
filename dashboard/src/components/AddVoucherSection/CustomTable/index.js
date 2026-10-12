import moment from "moment";
import React from "react";
import { PiWarning, PiArrowRight } from "react-icons/pi";
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
      <div className="border rounded-t-md bg-neutral20 text-neutral500 text-xs font-semibold text-left border-neutral40 uppercase">
        <table className="w-full rounded-md">
          <thead className="bg-neutral200">
            <tr>
              <th className="px-4 py-2 w-8">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="px-4 py-2">
                <div className="my-2">
                  <p>Voucher Detail</p>
                </div>
              </th>
              <th className="w-24 px-4 py-2">
                <div className="my-2">
                  <p>Stock</p>
                </div>
              </th>
              <th className="w-24 px-4 py-2">
                <div className="my-2">
                  <p>Price</p>
                </div>
              </th>
              <th className="w-48 px-4 py-2">
                <div className="my-2">
                  <p>Validity Period</p>
                </div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="overflow-y-auto border rounded-b-md no-scrollbar border-neutral40 font-normal text-black text-sm" style={{ maxHeight: '600px' }}>
        <table className="w-full">
          <tbody>
            {voucher && voucher.length === 0 ? (
              <tr>
                {
                  isLoading ?
                  <td colSpan={5} className="text-center">
                    <p>Loading...</p>
                  </td>
                  :
                  <td colSpan={5} className="text-center">
                    <EmptyData />
                  </td>
                }
              </tr>
            ) : (
              voucher.map((row, index) => (
                <tr 
                  key={index} 
                  className={`${row.existingVoucher || row.checked ? "bg-neutral20" : "bg-white"} hover:bg-neutral20 cursor-pointer`}
                >
                  <td className="w-8 px-4 py-2 border-t border-neutral40">
                    <input
                      type="checkbox"
                      checked={row.existingVoucher || row.checked}
                      style={{accentColor: row.existingVoucher ? "#9B9B9C" : "blue"}}
                      onChange={() => {
                        if (row.existingVoucher) {
                          return
                        }
                        handleCheckboxChange(row.id)
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 border-t border-neutral40">
                    <div className="flex">
                      <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${row.voucherPhoto}`} className="mt-0.5 mr-2 w-16 h-10 rounded-md" />
                      <div>
                        <p className="font-semibold text-black text-sm">{row.voucherName}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.voucherType} - {row.voucherCategory}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="w-24 px-4 py-4 border-t border-neutral40">
                    <p className={`${row.voucherType === "PPOB Voucher" ? "text-success500" : row.stock < 50 ? "text-danger500" : "text-success500"} text-sm`}>{row.voucherType === "PPOB Voucher" ? "Unlimited" : row.stock}</p>
                  </td>
                  <td className="w-24 px-4 py-4 border-t border-neutral40">
                    <p className="text-sm">Rp{row.price.toLocaleString()}</p>
                  </td>
                  <td className="w-48 px-4 py-4 border-t border-neutral40">
                    <div className="flex justify-between items-center">
                      <div>
                        {(() => {
                          const expiryDate = row.validityEndDate;
                          const parsedExpiryDate = moment(expiryDate, "YYYY-MM-DD HH:mm:ss Z");
                          const isExpiringIn30Days = parsedExpiryDate.diff(validityStartDate, "days") <= 50;
                          return (
                            <div className="flex items-center">
                              <div className={`${isExpiringIn30Days ? "text-danger500" : "text-black"} items-center`}>
                                <div className="flex items-center">
                                  <p className="text-sm mr-1">{moment(row.validityStartDate).format("DD MMM YYYY HH:mm")}</p>
                                  <PiArrowRight />
                                </div>
                                <p className="text-sm">{moment(row.validityEndDate).format("DD MMM YYYY HH:mm")}</p>
                              </div>
                              {isExpiringIn30Days && (
                                <a data-tooltip-id="invalidExpiredVoucher" data-tooltip-content="This voucher will expire in 50 days from the start date of the campaign you’ve created.">
                                  <PiWarning className="text-warning500 text-sm my-0.5" />
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
            )}
          </tbody>
        </table>
      </div>
      <Tooltip id="invalidThemeID" />
      <Tooltip id="invalidExpiredVoucher" />
    </div>
  );
};

export default CustomTable;