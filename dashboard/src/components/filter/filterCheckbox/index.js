import React, { useState, useEffect, useRef } from 'react';
import { PiFunnelDuotone, PiX } from 'react-icons/pi';

const FilterCheckbox = ({ options = ["Type", "Company"], onSelect, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen]);

    const handleToggleFilterCheckbox = () => {
        if (options === '' || options.length === 0) return;
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option) => {
        const updatedOptions = selectedOptions.includes(option)
            ? selectedOptions.filter((selected) => selected !== option)
            : [...selectedOptions, option];

        setSelectedOptions(updatedOptions);

        if (onSelect) {
            onSelect(updatedOptions);
        }
    };

    const handleCloseFilter = () => {
        setSelectedOptions([]); // Reset selected options
        setIsOpen(false); // Close dropdown
        if (onSelect) {
            onSelect([]); // Reset filter in parent
        }
    };

    const buttonText =
        selectedOptions.length > 0
            ? `${selectedOptions.length} Filter Selected`
            : 'Filter';

    return (
        <div className='relative inline-block text-left' ref={dropdownRef}>
            <div>
                <span className='rounded-md shadow-sm'>
                    <button
                        type='button'
                        className={`flex items-center w-60 py-2.5 text-left px-4 border font-normal text-sm rounded-md focus:outline-none 
                            ${disabled ? "cursor-not-allowed bg-neutral30" : "cursor-pointer"}`}
                        disabled={disabled}
                        onClick={handleToggleFilterCheckbox}
                    >
                        <span className='flex-grow'>{buttonText}</span>
                        <span className='ml-2'>
                            {selectedOptions.length > 0 ? (
                                <PiX size={16} onClick={handleCloseFilter} />
                            ) : (
                                <PiFunnelDuotone size={16} />
                            )}
                        </span>
                    </button>
                </span>
            </div>

            { isOpen && (
                <div
                    className='z-10 origin-top-right absolute left-0 mt-2 w-60 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='options-menu'
                >
                    <div className='px-1 py-2'>
                        {options.map((option) => (
                            <div
                                key={option}
                                className={`hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center cursor-pointer ${selectedOptions.includes(option) ? 'bg-primary500' : ''
                                    }`}
                                onClick={() => handleOptionClick(option)}
                            >
                                <input
                                    type='checkbox'
                                    className='mr-2'
                                    checked={selectedOptions.includes(option)}
                                    onChange={() => handleOptionClick(option)}
                                />
                                <p className={`text-sm ${selectedOptions.includes(option) ? 'text-primary500' : 'text-black'}`}>
                                    {option}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterCheckbox;
