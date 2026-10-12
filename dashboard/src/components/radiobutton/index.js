import React from 'react';

const RadioButton = ({ title, subtitle, value, name, checked, onChange }) => {
  return (
    <label className="flex">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio h-5 w-5 text-blue-600"
      />
      <div>
        <p className='font-semibold text-md ml-2'>{title}</p>
        <p className='text-sm ml-2 mt-1 text-neutral300'>{subtitle}</p>
      </div>
    </label>
  );
};

export default RadioButton;