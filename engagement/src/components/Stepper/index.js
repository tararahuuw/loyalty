import React from 'react';
import { Check } from "@phosphor-icons/react";

const Stepper = ({
    data = ["Basic Information", "Address Information", "Billing Information"],
    currentStep = 2,
}) => {
  return (
    <div className='flex w-full justify-center items-center'>
        {data.map((value, index) => (
            <div key={index} className='flex flex-col items-center w-36'>
                <div className='flex items-center justify-center w-full'>
                    <div className={`${index === 0 ? "opacity-0" : "opacity-100"} h-1 bg-neutral40 flex-grow mr-2`}></div>
                    <div
                    className={`w-8 h-8 rounded-full border-4 cursor-pointer flex items-center justify-center font-semibold ${
                        index === currentStep ? 'border-primary500 text-primary500 bg-white' : index < currentStep ? 'border-primary500 text-white bg-primary500' : 'border-neutral50 text-nuetral500 bg-white'
                    }`}
                    >
                    {
                        index < currentStep ? <Check /> : <p className="text-center">{index + 1}</p>
                    }
                    </div>
                    <div className={`${index === data.length - 1 ? "opacity-0" : "opacity-100"} h-1 bg-neutral40 flex-grow ml-2`}></div>
                </div>
                <div className='justify-center w-full flex'>
                    <p className={`text-sm ${index === currentStep ? "text-primary500" : "text-neutral500"} font-normal mt-2`}>{value}</p>
                </div>
            </div>
        ))}
    </div>
  );
};

export default Stepper;