import React, { useState } from 'react'

const ParameterDetail = ({ type, statusType, title, keyName, statuses, createdBy, lastEditedBy }) => {

  const formatStatus = (text) => {
    if (!text) return '-';
    const withSpace = text.replace(/([a-zA-Z])(\d+)/, '$1 $2'); 
    return withSpace.charAt(0).toUpperCase() + withSpace.slice(1); 
  };

  return (
    <div className='mb-5 bg-white rounded-lg py-5 px-6 shadow-md'>
      <p className='font-semibold text-black text-lg mb-2'>{title}</p>
      <hr className='text-neutral30 mb-4' />

      {type === "parameter" && (
        <>
          <div className="mb-4">
            <p>Parameter Name (Key)</p>
            <p>{keyName}</p>
          </div>
          <div className="mb-4">
            <p>Type</p>
            <p>{statusType}</p>
          </div>
          {
            statusType === "Status" &&
            <div className="grid grid-cols-2 gap-4">
              {statuses.map((item, index) => (
                <div key={item.id}>
                  <p className="font-medium">Status {index + 1}</p>
                  <p className="text-gray-600">{item.value}</p>
                </div>
              ))}
            </div>
          }
        </>
      )}

      {type === "activity" && (
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-4">

            <div>
              <span>Created By</span>
              <p>{createdBy.name}</p>
              <p>{createdBy.date}</p>
            </div>

            <div>
              <span>Last Edited By</span>
              <p>{lastEditedBy.name}</p>
              <p>{lastEditedBy.date}</p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default ParameterDetail;