import React, { useState, useRef, useEffect } from "react";
import { PiClockCounterClockwise, PiEye, PiArrowRight } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { Chip, EmptyData } from "sprint-asia-custom-component";
import moment from "moment";
import DetailModal from "../modal/detailModal";
import DistributionModal from "../modal/distributionModal";
import { useDisclosure } from "prezent/useDisclosure";
import { useNavigate } from "react-router-dom";
import {formatPrefixPhoneNumber} from "../../utils/index"

const CustomTableReport = ({
  roleAccess,
  typeLoyalty,
  typeReport,
  typeVoucher,
  dataReport,
  isLoading = false,
  currentPage,
  setCurrentPage,
  onClickRow,
}) => {
  const { isOpen: detailModal, toggle: toggleDetailModal } = useDisclosure(false);
  const { isOpen: distributionModal, toggle: toggleDistributionModal } = useDisclosure(false);
  const navigateTo = useNavigate()

  function handleNavigateToDetailPointReport(id) {
    navigateTo(`/prezent/report/loyalty/detail/${id}`);
  }

  const columns = [
    ...(typeReport === "Loyalty" && typeLoyalty === "1"
      ? [
        {
          header: "CAMPAIGN ID",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.campaignId || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Point"
      ? [
        {
          header: "CUSTOMER DATA",
          body: (row) => (
            <div>
              <p className="pt-2 px-4 font-semibold text-black text-sm">{row.customerName || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{formatPrefixPhoneNumber(row.customerId || "-")}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.customerReffId || "-"}</p>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "REWARD REF ID",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.rewardRefId}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2" && roleAccess === "System Administrator"
      ? [
        {
          header: "CLIENT",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-neutral500 text-sm">{row.clientName || "-"}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2"
      ? [
        {
          header: "DIVISION",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.divisionName || "-"}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Loyalty"
      ? [
        {
          header: "CAMPAIGN NAME",
          body: (row) => (
            <div>
              <p className="py-2 px-4 font-semibold text-black text-sm">{row.campaignName || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{moment(row.startDatePeriod).format("DD MMM YYYY")} - {moment(row.endDatePeriod).format("DD MMM YYYY")}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.campaignId || "-"}</p>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "CUSTOMER DATA",
          body: (row) => (
            <div>
              <p className="pt-2 px-4 font-semibold text-black text-sm">{row.customerName || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{formatPrefixPhoneNumber(row.customerId || "-")}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.customerReffId || "-"}</p>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "REWARD ITEM",
          body: (row) => (
            <div>
              <p className="pt-2 px-4 font-semibold text-black text-sm">{row.voucherName || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.voucherType || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.voucherId || "-"}</p>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "1" || typeReport === "Loyalty" && typeVoucher === "Point"
      ? [
        {
          header: "POINT GENERATED",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.generatedPoints || row.generatedPoint || 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "1" || typeReport === "Loyalty" && typeVoucher === "Point"
      ? [
        {
          header: "POINT REDEEMED",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.redeemedPoints || row.redeemedPoint || 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "1"
      ? [
        {
          header: "ACTIVE USER",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.activeUser || 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "1" || typeReport === "Loyalty" && typeVoucher === "Point"
      ? [
        {
          header: "PERIOD",
          body: (row) => {
            return (
              <div>
                {
                  row.startDatePeriod && row.endDatePeriod ?
                    <>
                      <div className="flex items-center">
                        <p className="py-2 px-4 text-sm font-semibold text-black mr-1">{moment(row.startDatePeriod).format("DD MMM YYYY HH:mm")}</p>
                        <PiArrowRight />
                      </div>
                      <p className="py-2 px-4 text-sm font-semibold text-black">{moment(row.endDatePeriod).format("DD MMM YYYY HH:mm")}</p>
                    </>
                    :
                    <p className="py-2 px-4 text-sm font-semibold text-black">No Period</p>
                }
              </div>
            )
          },
        },
      ]
      : []),

    ...(typeReport === "Loyalty" && typeLoyalty === "1"
      ? [
        {
          header: "STATUS",
          body: (row) => (
            <div className="py-2 px-4 flex justify-items-center h-full w-full">
              <div className="w-full">
                <Chip title={row.status} type={row.status === "Active" ? "success" : "neutral"} />
              </div>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher"
      ? [
        {
          header: "VOUCHER REF ID",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.VoucherRefId || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1"
      ? [
        {
          header: "CUSTOMER DATA",
          body: (row) => (
            <div>
              <p className="pt-2 px-4 font-semibold text-black text-sm">{row.Customer.Name || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{formatPrefixPhoneNumber(row.Customer.PhoneNumber || "-")}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.Customer.OrderId || "-"}</p>
              {
                row.detailData?.length > 0 &&
                <p className="pb-2 px-4 font-normal text-primary600 text-sm cursor-pointer" onClick={() => {
                  setCurrentData(row)
                  toggleDetailModal()
                }}
                >Detail Data</p>
              }
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1" && typeVoucher === "PPOB Voucher"
      ? [
        {
          header: "ACCOUNT NUMBER",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{formatPrefixPhoneNumber(row.accountNumber || "-")}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1" && roleAccess === "System Administrator"
      ? [
        {
          header: "CLIENT",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.clientName || "-"}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1"
      ? [
        {
          header: "DIVISION",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.divisionName || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "2"
      ? [
        {
          header: "ORDER ID",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.campaignId || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher"
      ? [
        {
          header: "CAMPAIGN NAME",
          body: (row) => (
            <div>
              <p className="py-2 px-4 font-semibold text-black text-sm">{row.campaignName || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.campaignStartDate || "-"} - {row.campaignEndDate || "-"}</p>
              <p className="px-4 font-normal text-neutral300 text-sm">{row.campaignId || "-"}</p>
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher"
      ? [
        {
          header: "VOUCHER NAME",
          body: (row) => {
            return (
              <div>
                <p className="pt-2 px-4 font-semibold text-black text-sm">{row.voucherName || "-"}</p>
                <p className="px-4 font-normal text-neutral300 text-sm">{row.redeemType || "-"}</p>
                <p className="pb-2 px-4 font-normal text-neutral300 text-sm">{row.voucherId || "-"}</p>
              </div>
            );
          },
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1"
      ? [
        {
          header: "PRICE TYPE",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.priceType || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "PRICE",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.price ? "Rp " + row.price.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),

    ...(typeReport === "Voucher" && typeLoyalty === "1" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "ADMIN FEE",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.adminFee ? "Rp " + row.adminFee.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1"
      ? [
        {
          header: "DISTRIBUTION FEE",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.distributionFee ? "Rp " + row.distributionFee.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "2"
      ? [
        {
          header: "DENOM",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.distributionFee ? "Rp " + row.distributionFee.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "2"
      ? [
        {
          header: "COGS",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.distributionFee ? "Rp " + row.distributionFee.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "TAX/PPN",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.tax ? "Rp " + row.tax.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "TOTAL AMOUNT",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.totalAmount ? "Rp " + row.totalAmount.toLocaleString() : 0}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "PAYMENT METHOD",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.paymentMethod || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "1"
      ? [
        {
          header: "DISTRIBUTION",
          body: (row) => (
            <div className="flex items-center justify-between">
              <p className="py-2 px-4 font-semibold text-black text-sm w-48">{row.distribution || "-"}</p>
              {
                (row.distribution === "One Time Channel Delivery" || row.distribution === "API Channel") &&
                <PiClockCounterClockwise size={20} className="text-primary600 mx-2 cursor-pointer w-5 h-5" onClick={() => {
                  setCurrentData(row)
                  toggleDistributionModal()
                }} />
              }
            </div>
          ),
        },
      ]
      : []),
    ...(typeReport === "Voucher"
      ? [
        {
          header: "GENERATED TIME",
          body: (row) => {
            return (
              <p className="py-2 px-4 font-semibold text-black text-sm">{row.generatedTime ? moment(row.generatedTime).format("DD MMM YYYY, HH:mm") : "-"}</p>
            );
          },
        },
      ]
      : []),
    ...(typeReport === "Voucher"
      ? [
        {
          header: "REDEEMED TIME",
          body: (row) => {
            return (
              <p className="py-2 px-4 font-semibold text-black text-sm">{row.redeemTime ? moment(row.redeemTime).format("DD MMM YYYY, HH:mm") : "-"}</p>
            );
          },
        },
      ]
      : []),
    ...(typeReport === "Voucher" && typeLoyalty === "2"
      ? [
        {
          header: "TRX ID",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.campaignId || "-"}</p>
          ),
        },
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2"
      ? [
        {
          header: "GENERATED TIME",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.generatedTime ? moment(row.generatedTime).format("DD MMM YYYY, HH.mm") : "-"}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Loyalty" && typeLoyalty === "2"
      ? [
        {
          header: "REDEEMED TIME",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.redeemedTime ? moment(row.redeemedTime).format("DD MMM YYYY, HH.mm") : "-"}</p>
          )
        }
      ]
      : []),
    ...(typeReport === "Voucher" && typeVoucher === "Digital Voucher" || typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "OUTLET",
          body: (row) => (
            <p className="py-2 px-4 font-semibold text-black text-sm">{row.outlet || "-"}</p>
          )
        }
      ]
      : []),

    ...(typeReport === "Loyalty" && typeLoyalty === "2" && typeVoucher === "Reward"
      ? [
        {
          header: "ITEM STATUS",
          body: (row, index) => {
            return (
              <div className="py-2 px-4 flex justify-center h-full w-full" style={getShadowStyle(index)}>
                <div className="w-full">
                  <div data-tooltip-id="voucherStatus" data-tooltip-content={row.rewardStatusReason}>
                    <Chip title={row.rewardStatus} type={row.rewardStatus === "Redeemed" ? "success" : row.rewardStatus == "Generated" ? "primary" : row.rewardStatus == "Failed" ? "danger" : row.rewardStatus == "Pending" ? "warning" : row.rewardStatus == "Expired" ? "neutral" : "white"} />
                  </div>
                </div>
              </div>
            );
          },
        }
      ]
      : []),

    ...(typeReport === "Voucher"
      ? [
        {
          header: "VOUCHER STATUS",
          body: (row, index) => {
            return (
              <div className="py-2 px-4 flex justify-center h-full w-full" style={getShadowStyle(index)}>
                <div className="w-full">
                  <div data-tooltip-id="voucherStatus" data-tooltip-content={row.voucherStatusReason}>
                    <Chip title={row.voucherStatus} type={row.voucherStatus === "Redeemed" ? "success" : row.voucherStatus == "Generated" ? "primary" : row.voucherStatus == "Failed" ? "danger" : row.voucherStatus == "Pending" ? "warning" : row.voucherStatus == "Expired" ? "neutral" : "white"} />
                  </div>
                </div>
              </div>
            );
          },
        }
      ]
      : []),
  ]
  const tableRef = useRef();
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentData, setCurrentData] = useState();
  const [firstColumnFreeze, setFirstColumnFreeze] = useState(false);
  const [lastColumnFreeze, setLastColumnFreeze] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (tableRef.current) {
        setScrollLeft(tableRef.current.scrollLeft);
      }
    };
    const table = tableRef.current;
    if (table) {
      table.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (table) {
        table.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!tableRef.current) return;
    const maxScrollLeft = tableRef.current.scrollWidth - tableRef.current.clientWidth;
    if (scrollLeft > 0) {
      setFirstColumnFreeze(true);
    } else {
      setFirstColumnFreeze(false);
    }
    if (scrollLeft <= maxScrollLeft - 10) {
      setLastColumnFreeze(true);
    } else {
      setLastColumnFreeze(false);
    }
  }, [scrollLeft]);

  const getColumnStyle = (colIndex) => {
    if (!tableRef.current) {
      return {};
    }

    if (colIndex === 0) {
      return firstColumnFreeze
        ? { position: "sticky", left: 0, zIndex: 5 }
        : { position: "sticky", zIndex: 1 };
    }

    if (colIndex === (columns.length - 1)) {
      return lastColumnFreeze
        ? { position: "sticky", right: 0, zIndex: 5 }
        : { position: "sticky", zIndex: 1 };
    }

    return { position: "sticky", zIndex: 1 };
  };

  const getShadowStyle = (colIndex) => {
    if (colIndex === 0 && firstColumnFreeze) {
      return {
        boxShadow: "4px 0 10px rgba(0, 0, 0, 0.1)",
        width: "200px",
      };
    }
    if (colIndex === (columns.length - 1) && lastColumnFreeze) {
      return {
        boxShadow: "-4px 0 10px rgba(0, 0, 0, 0.1)",
        width: "200px",
      };
    }
    return {
      width: "200px",
    };
  };

  return (
    <>
      <div className="relative h-full">
        <div className="overflow-x-auto h-full" ref={tableRef}>
          <table className="table-auto h-full">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={col}
                    className="m-0 p-0 border-b bg-neutral20 border-neutral40 text-neutral500 text-xs font-semibold text-left"
                    style={getColumnStyle(index)}
                  >
                    <p className="py-2 px-4" style={getShadowStyle(index)}>
                      {col.header}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ?
                <tr>
                  <td className="h-16">
                  </td>
                </tr>
                :
                dataReport && dataReport.length > 0 ? (
                  dataReport.map((row, rowIndex) => (
                    <tr key={rowIndex}
                      // onClick={() => onClickRow(typeReport === "Loyalty" ? row.pointRuleId : row.campaignId)}
                      onClick={() => onClickRow(typeReport === "Loyalty" ? row.campaignId : row.campaignId)}
                      className="cursor-pointer hover:bg-gray-100 transition">
                      {columns.map((col, colIndex) => (
                        <td
                          key={`${rowIndex}-${col}`}
                          className="m-0 p-0 border-b bg-white border-neutral30 align-top"
                          style={getColumnStyle(colIndex)}
                        >
                          {col.body(row, colIndex)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) :
                  <tr>
                    <td className="h-96">
                    </td>
                  </tr>
              }
            </tbody>
          </table>
        </div>
        {isLoading && (
          <div className="absolute h-16 top-0 left-0 w-full h-full flex justify-center items-center">
            <p>Loading...</p>
          </div>
        )}
        {(!dataReport || dataReport.length === 0) && !isLoading && (
          <div className="absolute h-96 top-0 left-0 w-full h-full flex justify-center items-center">
            <EmptyData />
          </div>
        )}
        <Tooltip id="voucherStatus" style={{ zIndex: 50 }} />
      </div>
      <DetailModal
        title="Detail Data"
        isOpen={detailModal}
        onClose={toggleDetailModal}
        data={currentData}
      />

      <DistributionModal
        title="Distribution History"
        isOpen={distributionModal}
        onClose={toggleDistributionModal}
        data={currentData}
      />
    </>
  );
};

export default CustomTableReport;