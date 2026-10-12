import React from 'react'
import LogoNotFound from "../../../../assets/images/logo_not_found.png"

const NotFound = () => {
  return (
    <div className='w-full h-80 bg-white flex justify-center items-center'>
        <div>
            <div className='flex justify-center mb-1'>
                <img src={LogoNotFound} className='w-32 h-32'/>
            </div>
            <p className='text-xl font-semibold text-black text-center'>Oops! Data Not Found</p>
            <p className='text-sm font-semibold text-neutral300 text-center'>Sorry, There are no data found at this time</p>
        </div>
    </div>
  )
}

export default NotFound