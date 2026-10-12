import React from 'react';
import EmptyData from '../emptystate/table/emptydata';

const BestVoucherList = ({ title, description, vouchers, isLoading }) => {
    const limitedVouchers = vouchers ? vouchers.slice(0, 5) : [];
    const isGenerated = title.toLowerCase().includes('generated');

    return (
        <div className="flex-1 bg-white rounded-lg border border-neutral40 p-6">
            <p className="text-xl font-semibold text-black">{title}</p>
            <p className="text-neutral300 text-sm">{description}</p>
            <div className="mt-6 overflow-x-auto">
                {isLoading ? (
                    <div className="text-center py-4">
                        <p className="text-sm font-semibold text-neutral300">Loading...</p>
                    </div>
                ) : vouchers && vouchers.length === 0 ? (
                    <EmptyData />
                ) : (
                    <table className="w-full table-auto border-collapse border-x-0">
                        <tbody>
                            {limitedVouchers.map((voucher, index) => (
                                <tr
                                    key={index}
                                    className={`py-2 px-4 ${index === limitedVouchers.length - 1 ? 'border-b-0' : 'border-b border-neutral40'
                                        }`}
                                >
                                    <td>
                                        <div className="flex items-center mt-2 mb-2">
                                            <div className="rounded flex items-center justify-center">
                                                <img
                                                    src={
                                                        voucher.image
                                                            ? `${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${voucher.image}`
                                                            : ''
                                                    }
                                                    alt={voucher.image}
                                                    className="w-16 h-10 object-cover rounded-md mr-2"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm text-black">{voucher.name}</p>
                                                <p className="mt-1 text-xs text-neutral300">{voucher.price}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <p className="text-sm text-black">
                                            {isGenerated
                                                ? `${voucher.generated ?? 0} generated`
                                                : `${voucher.redeemed ?? 0} redeemed`}
                                        </p>
                                        <p
                                            className={`mt-1 text-xs ${voucher.stock > 50 ? 'text-success600' : 'text-danger500'
                                                }`}
                                        >
                                            {voucher.stock} available stock
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default BestVoucherList;
