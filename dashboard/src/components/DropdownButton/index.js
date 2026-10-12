import React, { useState, useEffect, useRef } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const DropdownButton = ({
    defaultType = 'Voucher Type',
    options = [],
    onSelect = () => {},
    className = '', 
    dropdownStyle = '', 
    style = {},
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultType);
    const dropdownRef = useRef(null);

    const buttonClass = `flex justify-between items-center rounded-md border px-2 py-2 text-base cursor-pointer w-full ${
        style.border || 'border-primary500'
    } ${style.text || 'text-primary500'}`;

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
        onSelect(value);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`flex flex-col w-full relative ${className}`} ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className={buttonClass}
            >
                {selectedValue}
                <FaChevronDown className="ml-2 text-base" />
            </button>
            {isOpen && (
                <div
                    className={`absolute top-full left-0 mt-2 z-10 rounded-lg bg-white shadow-lg ${dropdownStyle}`}
                >
                    <ul className="list-none m-0 p-0">
                        {options.map((option, index) => (
                            <li
                                key={index}
                                className="w-full px-4 py-2 cursor-pointer hover:bg-gray-100 text-base"
                                onClick={() => handleOptionClick(option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownButton;
