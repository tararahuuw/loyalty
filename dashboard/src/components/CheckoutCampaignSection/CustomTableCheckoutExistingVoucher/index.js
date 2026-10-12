import moment from 'moment'
import React, { useState } from 'react'
import { PiCaretDown, PiCaretUp, PiNote } from 'react-icons/pi'

const CustomTableCheckoutExistingVoucher = ({
    data
}) => {
    const [isOpen, setIsOpen] = useState(true)
  return (
    <div className='w-full'>
        <div className='w-full bg-white rounded-t-md flex justify-between items-center py-2 px-4 shadow cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
            <div className='flex items-center'>
                <PiNote size={20}/>
                <p className='text-black ml-2'>Existing voucher <span className='text-neutral300 text-sm'>({data.length})</span></p>
            </div>
            {
                isOpen ?
                <PiCaretUp size={20}/>
                :
                <PiCaretDown size={20}/>
            }
        </div>
        {
            isOpen &&
            <div className='w-full'>
                <div className='flex items-center shadow bg-neutral20'>
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
                </div>
                {data.length === 0 ? (
                    <div className="w-full bg-white rounded-b-md flex items-center justify-center border border-neutral40 shadow">
                        <p className="py-2 px-4">No data available</p>
                    </div>
                ) : (
                    data.map((value, index) => (
                        <div
                            key={index}
                            className={`w-full ${index === 0 ? "border-0" : "border-t border-dashed"} bg-white border-neutral40 shadow`}
                        >
                            <div className="flex items-center">
                                <div className="w-2/5 py-2 px-4">
                                    <div className="flex">
                                        <div className="relative w-24 h-16">
                                        <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${value.voucherPhoto}`} className="w-full h-full bg-neutral80 rounded-md"/>
                                        </div>
                                        <div className="ml-2">
                                            <p className={"text-primary500 font-semibold text-xs"}>{value.stock == null ? "Unlimited" : value.stock} Voucher left</p>
                                            <p className={ "text-neutral300 font-semibold text-sm my-1"}>{value.voucherName}</p>
                                            <p className={"text-neutral300 text-xs"}>{moment(value.startDate).format("DD MMM YYYY")} - {moment(value.endDate).format("DD MMM YYYY")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/5 py-2 px-4">
                                    <p className="text-black">Rp{value.price.toLocaleString()}</p>
                                </div>
                                <div className="w-1/5 py-2 px-4">
                                <p className="text-black">{value.stock == null ? "Unlimited" : value.stock}</p>
                                </div>
                                <div className="w-1/5 py-2 px-4 text-right">
                                    <p className="text-black">Rp{value.subtotal.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )
                ))}
            </div>
        }
    </div>
  )
}

export default CustomTableCheckoutExistingVoucher