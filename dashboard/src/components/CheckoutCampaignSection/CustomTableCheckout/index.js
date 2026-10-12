import moment from "moment";
import React, { useEffect, useState } from "react";
import { PiCaretDown, PiCaretUp } from "react-icons/pi";
import { Alert } from "sprint-asia-custom-component";
import Counter from "../../Counter";

const CustomTableCheckout = ({
  data,
  setData,
  typeCampaign,
  disable
}) => {
  const [openRows, setOpenRows] = useState({});

  const toggleRow = (index) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [index]: !prevOpenRows[index],
    }));
  };

  const handleQuantityChange = (voucherID, newQuantity) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.voucherID === voucherID
          ? { ...item, counter: newQuantity }
          : item
      )
    );
  };

  return (
    <div className="w-full">
      <div className="w-full bg-neutral30 rounded-t-md flex items-center border border-neutral40 shadow">
        {(typeCampaign === "API Distribution" || (typeCampaign === "Export Data" && disable)) ? (
          <>
            <div className="w-1/2 py-2 px-4">
              <p className="text-sm">VOUCHER</p>
            </div>
            <div className="w-1/2 py-2 px-4">
              <p className="text-sm">PRICE</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-2/5 py-2 px-4">
              <p className="text-sm">VOUCHER</p>
            </div>
            <div className="w-1/5 py-2 px-4">
              <p className="text-sm">PRICE</p>
            </div>
            <div className="w-1/5 py-2 px-4">
              <p className="text-sm">QUANTITY</p>
            </div>
            <div className="w-1/5 py-2 px-4 text-right">
              <p className="text-sm">SUBTOTAL</p>
            </div>
          </>
        )}
      </div>

      {data.length === 0 ? (
        <div className="w-full bg-white rounded-b-md flex items-center justify-center border border-neutral40 shadow">
          <p className="py-2 px-4">No data available</p>
        </div>
      ) : (
        data.map((value, index) => (
          <div
            key={index}
            className={`w-full ${index === 0 ? "rounded-b-md" : "mt-4 rounded-md"} bg-white border border-neutral40 shadow`}
          >
            {typeCampaign === "API Distribution" && (
              <div className="flex items-center">
                <div className="w-1/2 py-2 px-4">
                  <div className="flex">
                    <div className="relative w-24 h-16">
                      <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${value.voucherPhoto}`} className="w-full h-full bg-neutral80 rounded-md" />
                      {
                        disable &&
                        <p className="bg-black opacity-50 absolute bottom-0 text-center text-white w-full py-1 rounded-b-md" style={{ fontSize: "8px" }}>
                          Out of Stock
                        </p>
                      }
                    </div>
                    <div className="ml-2">
                      <p className={`${disable ? "text-neutral80" : "text-primary500"} font-semibold text-xs`}>{value.stock == null ? "Unlimited" : value.stock} Voucher left</p>
                      <p className={`${disable ? "text-neutral80" : "text-black" } font-semibold text-sm my-1`}>{value.voucherName}</p>
                      <p className={`${disable ? "text-neutral80" : "text-neutral300"} text-xs`}>{moment(value.validityStartDate).format("DD MMM YYYY")} - {moment(value.validityEndDate).format("DD MMM YYYY")}</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/2 py-2 px-4">
                  <p className={`${disable ? "text-neutral80" : "text-black"}`}>Rp{value.price.toLocaleString()}</p>
                </div>
              </div>
            )}
            {typeCampaign === "One Time Channel Delivery" && (
              <div>
                <div className="flex items-center">
                  <div className="w-2/5 py-2 px-4">
                    <div className="flex">
                      <div className="relative w-24 h-16">
                        <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${value.voucherPhoto}`} className="w-full h-full bg-neutral80 rounded-md" />
                        {
                          disable &&
                          <p className="bg-black opacity-50 absolute bottom-0 text-center text-white w-full py-1 rounded-b-md" style={{ fontSize: "8px" }}>
                            Out of Stock
                          </p>
                        }
                      </div>
                      <div className="ml-2">
                        <p className={`${disable ? "text-neutral80" : value.isInsufficientStock ? "text-danger500" : "text-primary500"} font-semibold text-xs`}>{value.stock == null ? "Unlimited" : value.stock} Voucher left</p>
                        <p className={`${disable ? "text-neutral80" : "text-black"} font-semibold text-sm my-1`}>{value.voucherName}</p>
                        <p className={`${disable ? "text-neutral80" : "text-neutral300"} text-xs`}>{moment(value.validityStartDate).format("DD MMM YYYY")} - {moment(value.validityEndDate).format("DD MMM YYYY")}</p>
                        <div className={`${disable ? "text-neutral80" : "text-primary500"} flex items-center text-sm cursor-pointer mt-1`} onClick={() => toggleRow(index)}>
                          <p className="mr-1">see distribution cost ({value.channels.length})</p>
                          {
                            openRows[index] ?
                            <PiCaretUp size={12} />
                            :
                            <PiCaretDown size={12} />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-1/5 py-2 px-4">
                    <p className={`${disable ? "text-neutral80" : "text-black"}`}>Rp{value.price.toLocaleString()}</p>
                  </div>
                  <div className="w-1/5 py-2 px-4">
                    <p className={`${disable ? "text-neutral80" : "text-black"}`}>{value.qty}</p>
                  </div>
                  <div className="w-1/5 py-2 px-4 text-right">
                    <p className={`${disable ? "text-neutral80" : "text-black"}`}>Rp{value.subtotal.toLocaleString()}</p>
                  </div>
                </div>
                {openRows[index] && (
                  <>
                    <div className="ml-28 pl-2 mr-4">
                      <hr className={`${disable ? "bg-neutral80" : "bg-neutral40"} border-dashed`} />
                    </div>
                    {value.channels.map((channel, channelIndex) => (
                      <div key={channelIndex} className="w-full flex mt-1">
                        <div className={`${disable ? "text-neutral80" : "text-neutral300"} w-2/5 pl-28 mx-2 text-sm`}>
                          <p>{channel.name} Cost</p>
                        </div>
                        <div className={`${disable ? "text-neutral80" : "text-neutral300"} w-1/5 text-sm`}>
                          <p className="mx-3">Rp{channel.cost.toLocaleString()}</p>
                        </div>
                        <div className={`${disable ? "text-neutral80" : "text-neutral300"} w-1/5 text-sm`}>
                          <p className="mx-4">{channel.qty}</p>
                        </div>
                        <div className={`${disable ? "text-neutral80" : "text-neutral300"} w-1/5 text-sm font-semibold text-right mr-4`}>
                          <p>Rp{channel.total.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {value.isInsufficientStock ?
                    <div className="mx-4 my-2">
                      <Alert type="warning" subtitle="Sorry, the available voucher stock does not meet the recipient quota. Please review and adjust the recipients in the list." />
                    </div>
                    :
                    <div className="bg-primary50 rounded-md p-2 flex justify-between mx-4 my-2">
                      <p className="font-semibold text-sm">Total</p>
                      <p className="font-bold text-sm text-right">{value.total.toLocaleString()}</p>
                    </div>
                }
              </div>
            )}
            {typeCampaign === "Export Data" && (
              <div className="flex items-center">
                <div className={`${disable ? "w-1/2" : "w-2/5"} py-2 px-4`}>
                  <div className="flex">
                    <div className="relative w-24 h-16">
                      <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${value.voucherPhoto}`} className="w-full h-full bg-neutral80 rounded-md" />
                      {
                        disable &&
                        <p className="bg-black opacity-50 absolute bottom-0 text-center text-white w-full py-1 rounded-b-md" style={{ fontSize: "8px" }}>
                          Out of Stock
                        </p>
                      }
                    </div>
                    <div className="ml-2">
                      <p className={`${disable ? "text-neutral80" : "text-primary500"} font-semibold text-xs`}>{value.stock == null ? "Unlimited" : value.stock} Voucher left</p>
                      <p className={`${disable ? "text-neutral80" : "text-black"} font-semibold text-sm my-1`}>{value.voucherName}</p>
                      <p className={`${disable ? "text-neutral80" : "text-neutral300"} text-xs`}>{moment(value.validityStartDate).format("DD MMM YYYY")} - {moment(value.validityEndDate).format("DD MMM YYYY")}</p>
                    </div>
                  </div>
                </div>
                <div className="w-1/5 py-2 px-4">
                  <p className={`${disable ? "text-neutral80" : "text-black"}`}>Rp{value.price.toLocaleString()}</p>
                </div>
                {
                  !disable &&
                  <>
                    <div className="w-1/5 py-2 px-4">
                      <Counter
                        max={value.stock || 1000000000000000}
                        quantity={value.counter}
                        setQuantity={(newQuantity) =>
                          handleQuantityChange(value.voucherID, newQuantity)
                        }
                      />
                    </div>
                    <div className="w-1/5 py-2 px-4 text-right">
                      <p className={`${disable ? "text-neutral80" : "text-black"}`}>Rp{(value.price * value.counter).toLocaleString()}</p>
                    </div>
                  </>
                }
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CustomTableCheckout;