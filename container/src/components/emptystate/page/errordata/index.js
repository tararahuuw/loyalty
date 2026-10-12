import React from 'react'

const ErrorData = () => {
  return (
    <div className='h-full w-full bg-white rounded-md flex items-center justify-center text-center'>
      <div className='p-8'>
        <p className='text-black font-semibold text-xl'>Server Maintenance</p>
        <p className='text-neutral300 font-normal text-sm'>Currently this service is not available. Please contact the admin...</p>
      </div>
    </div>
  )
}

export default ErrorData