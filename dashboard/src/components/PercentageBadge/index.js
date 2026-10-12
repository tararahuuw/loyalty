import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const PercentageBadge = ({ statusPercentage, status }) => {
  let badgeClasses, Icon;

  if (status === 'increase') {
    badgeClasses = 'text-success700 border-success600 bg-success50';
    Icon = FaArrowUp;
  } else if (status === 'decrease') {
    badgeClasses = 'text-danger700 border-danger600 bg-danger50';
    Icon = FaArrowDown;
  } else {
    badgeClasses = 'text-neutral500 border-neutral50 bg-neutral50';
    Icon = null; 
  }

  return (
    <div className={`flex justify-center items-center w-full ${badgeClasses} rounded-full px-3 py-1`}>
      {Icon && <Icon className="mr-1 text-sm flex-shrink-0" />}
      <span className="text-sm">{statusPercentage}</span>
    </div>
  );
};

export default PercentageBadge;
