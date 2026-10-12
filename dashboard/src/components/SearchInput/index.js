import React, { useEffect, useRef, useState } from 'react';
import { PiMagnifyingGlassDuotone, PiInfo } from 'react-icons/pi';

const SearchInput = ({
    placeholder = 'Search Theme',
    data,
    mode,
    footer,
    initialValueOption = null,
    setValueOption,
    disabled = false,
}) => {
    const [dataOption, setDataOption] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [valueInput, setValueInput] = useState(initialValueOption ? initialValueOption.templateName : "");
    const inputRef = useRef(null);

    function handleOnClickOption(value) {
        setValueOption(value);
        setValueInput(value.templateName);
        setIsOpen(false);
    }

    function handleOnChangeInput(value) {
        setValueInput(value);
        setValueOption()
    }

    useEffect(() => {
        if (valueInput) {
            const filteredData = data.filter(option =>
                option.templateName.toLowerCase().includes(valueInput.toLowerCase())
            );
            setDataOption(filteredData);
        } else {
            setDataOption(data);
        }
    }, [valueInput, data]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    useEffect(() => {
        if (initialValueOption !== null) {
            setValueOption(initialValueOption);
            setValueInput(initialValueOption.templateName)
        }
    }, [initialValueOption])

    return (
        <div className='relative' ref={inputRef}>
            <div className="relative">
                <PiMagnifyingGlassDuotone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral50 w-4 h-4" />
                <input
                    type="text"
                    value={valueInput}
                    placeholder={placeholder}
                    onChange={e => handleOnChangeInput(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    className={`
                        ${disabled === true && "bg-neutral30 border-black cursor-not-allowed"} 
                        ${mode === "default" ? "bg-neutral10 border-black" : ""} 
                        ${mode === "danger" ? "border-danger500 bg-danger50" : ""}
                        w-full py-2.5 pr-8 pl-4 font-normal text-sm text-neutral300 rounded-md border focus:outline-none
                    `}
                />
            </div>
            {footer && (
                <div className="mt-1">
                    {mode === "danger" ? (
                        <div className="flex">
                            <div>
                                <PiInfo size={16} className="text-danger500" />
                            </div>
                            <p className="text-danger500 text-xs ml-1">{footer}</p>
                        </div>
                    ) : (
                        <p className="text-black text-xs">{footer}</p>
                    )}
                </div>
            )}
            {isOpen && (
                <div className='absolute top-12 bg-white rounded-md shadow-md p-2 w-full z-10 cursor-pointer max-h-60 overflow-y-auto'>
                    {dataOption?.length === 0 ? (
                        <div className='hover:bg-neutral20 rounded-md p-2 flex items-center'>
                            <p>No Data</p>
                        </div>
                    ) : (
                        dataOption?.map((option) => (
                            <div
                                key={option.id}
                                className='hover:bg-neutral20 rounded-md p-2 flex items-center'
                                onClick={() => handleOnClickOption(option)}
                            >
                                {option.templateName[0] === "#" && (
                                    <div
                                        className='w-4 h-4 border mr-2 rounded-sm'
                                        style={{ backgroundColor: option.templateName }}
                                    ></div>
                                )}
                                <p>{option.templateName}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchInput;
