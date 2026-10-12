import React from 'react'
import LogoEmptyData from "../../../../assets/images/logo_empty_box.png"

const EmptyData = () => {
  return (
    <div className='w-full h-80 bg-white flex justify-center items-center'>
        <div>
            <div className='flex justify-center mb-1'>
                <img src={LogoEmptyData} className='w-32 h-32'/>
            </div>
            <p className='text-xl font-semibold text-black text-center'>No Data Available</p>
            <p className='text-sm font-semibold text-neutral300 text-center'>Sorry, There are no data to display at this time</p>
        </div>
    </div>
  )
}

export default EmptyData