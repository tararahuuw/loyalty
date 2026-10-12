import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import PercentageBadge from '../PercentageBadge';

const PercentageIndicator = ({ 
  title, 
  total = 0, 
  totalLastMonth = 0, 
  statusPercentage, 
  status 
}) => {
  return (
    <div className="w-full bg-white rounded-lg border border-neutral40 p-6">
      <div className="flex justify-between items-center">
        <p className="text-neutral-900 text-sm font-medium">{title}</p>
        <div className='flex justify-items-end'>
          <PercentageBadge statusPercentage={statusPercentage} status={status} className="ml-auto" />
        </div>
      </div>
      <p className="text-2xl font-semibold mt-2">{total}</p>

      <div className="text-right text-sm">
        <p className="text-neutral80">Compared with last month</p>
        <p className="text-neutral300">{totalLastMonth}</p>
      </div>
    </div>
  );
};

export default PercentageIndicator;
