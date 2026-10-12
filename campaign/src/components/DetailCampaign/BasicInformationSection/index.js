import moment from 'moment'
import React, { useState } from 'react'
import { Description } from 'sprint-asia-custom-component'
import { PiCalendarBlank } from "react-icons/pi"

const BasicInformationSection = ({
    data
}) => {
  return (
    <div className='bg-white rounded-lg py-5 px-6 shadow-md w-full'>
        <p className='font-semibold text-black text-lg'>Basic Information</p>
        <hr className='text-neutral30'/>
        <div>
            <p className={`${
                data?.status === "Active" ? "text-success500" :  
                data?.status === "Inactive" ? "text-neutral300" :  
                data?.status === "Scheduled" ? "text-primary500" :  
                data?.status === "Draft" ? "text-warning800" : "text-black"
            } mt-4 font-semibold text-md`}
            >Campaign is {data ? data.status : ""}</p>
        </div>
        <div className='flex justify-between py-4'>
            <div class="grid grid-cols-1 gap-4 w-full">
                <Description title="Campaign Title" value={data ? data.name : ""} />
            </div>
        </div>
        <div className='flex justify-between pb-4'>
            <div class="grid grid-cols-2 gap-4 w-full">
                <Description title="Type" value={data ? data.type : ""} />
                <Description title="Category" value={data ? data.category : ""} />
                {
                    data?.category === "API Distribution" &&
                    <Description title="Type" value={data ? data.apiType : ""} />
                }
                {
                    data?.type === "Period" &&
                    <>
                        <Description title="Start Date Period" value={data ? moment(data.startDate).format("DD MMM YYYY HH:mm") : ""} icon={<PiCalendarBlank />} />
                        <Description title="End Date Period" value={data ? moment(data.endDate).format("DD MMM YYYY HH:mm") : ""} icon={<PiCalendarBlank />} />
                    </>
                }
                <Description title="Client" value={data ? data.clientName : ""} />
                <Description title="Division" value={data ? data.divisionName : ""} />
            </div>
        </div>
        <div className='flex justify-between'>
            <div class="grid grid-cols-1 gap-4 w-full">
                <Description title="Description" value={data ? data.description : ""} />
            </div>
        </div>
    </div>
  )
}

export default BasicInformationSection