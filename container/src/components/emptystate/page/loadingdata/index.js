import React from 'react'

const LoadingData = () => {
  return (
    <div className='h-full w-full bg-white rounded-md flex items-center justify-center text-center'>
      <div className='p-8'>
        <p className='text-black font-semibold text-xl'>Loading</p>
        <p className='text-neutral300 font-normal text-sm'>Please wait page still rendering the content...</p>
      </div>
    </div>
  )
}

export default LoadingData