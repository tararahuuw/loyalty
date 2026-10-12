import React, { useState } from 'react'

const Counter = ({
    max = 10,
    quantity = 1,
    setQuantity
}) => {

    function handleDecreaseValue() {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    function handleAddValue() {
        if (quantity < max) {
          setQuantity(quantity + 1);
        }
    }

  return (
    <div className='w-full flex'>
        <div className='w-full'>
            <div className='w-full flex text-sm justify-left'>
                <div className='w-12 text-primary500 h-8 rounded-l-md border-primary500 border flex items-center justify-center cursor-pointer' onClick={handleDecreaseValue}>
                    <p>-</p>
                </div>
                <div className='w-16 text-neutral300 border-neutral300 border-t border-b flex items-center justify-center'>
                    {quantity}
                </div>
                <div className='w-12 text-primary500 h-8 rounded-r-md border-primary500 border items-center flex justify-center cursor-pointer' onClick={handleAddValue}>
                    <p>+</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Counter