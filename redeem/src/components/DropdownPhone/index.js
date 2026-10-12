import React, { useState, useEffect, useRef } from "react";
import { PiCaretDown, PiCaretUp, PiInfo } from "react-icons/pi";
import { customList } from "country-codes-list";

const DropdownPhone = ({
    dropdownCountry = { option: "+62", value: "id", label: "Indonesia" },
    setDropdownCountry,
    title = "",
    isRequired = true,
    value = "",
    onChangeInput,
    footer = null,
    mode = "default",
    placeholder = "",
    redeemType = "",
    fields
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef(null);
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const [options, setOptions] = useState([]);

    useEffect(() => {
        const list = Object.entries(
            customList("countryCode", "{countryNameEn} +{countryCallingCode}")
        ).map(([code, label]) => {
            const [countryName, callingCode] = label.split(" +");
            return {
                option: `+${callingCode}`,
                value: code.toLowerCase(),
                label: countryName,
            };
        });

        const sortedList = list.sort((a, b) => a.label.localeCompare(b.label));

        const indonesiaExists = sortedList.some(
            (item) => item.value === "id" && item.option === "+62"
        );
        if (!indonesiaExists) {
            sortedList.push({
                option: "+62",
                value: "id",
                label: "Indonesia",
            });
        }

        setOptions(sortedList);
    }, []);

    useEffect(() => {
        if (wrapperRef.current) {
            setWrapperWidth(wrapperRef.current.offsetWidth);
        }
    }, [wrapperRef.current, value]);

    const handleClickOption = (data) => {
        setIsOpen(false);
        setDropdownCountry(data);
    };

    return (
        <div className="w-full">
            {title && (
                <div className="flex mb-1">
                    <p className="text-sm font-normal text-black">{title}</p>
                    {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
                </div>
            )}

            <div ref={wrapperRef} className="relative w-full">
                <div
                    className={`
                        flex items-center rounded-md overflow-hidden w-full pr-3
                        ${mode === "danger"
                            ? "border border-danger500 bg-danger50"
                            : "border border-neutral50 bg-neutral20"}
                    `}
                >
                    <div
                        className="flex items-center px-3 py-2 cursor-pointer border-r border-neutral50 mr-3"
                        onClick={() => {
                            if (redeemType !== "ppob") {
                                setIsOpen(!isOpen);
                            }
                        }}
                    >
                        <img
                            src={`https://flagcdn.com/w40/${dropdownCountry.value}.png`}
                            alt={dropdownCountry.label}
                            className="w-4 h-4 object-cover rounded-full"
                        />
                        <p className="text-sm font-bold text-neutral300 ml-3 mr-2">
                            {dropdownCountry.option}
                        </p>
                        {isOpen ? <PiCaretUp /> : <PiCaretDown />}
                    </div>

                    <input
                        type="number"
                        value={value}
                        onChange={onChangeInput}
                        style={{
                            MozAppearance: 'textfield',
                            WebkitAppearance: 'none',
                            appearance: 'none',
                        }}
                        className={`
                            flex-1 w-full py-2.5 text-sm text-black focus:outline-none
                            placeholder:text-neutral300
                            ${mode === "danger" ? "bg-danger50 text-danger500" : "bg-neutral20"}
                            hide-spinner
                        `}
                        placeholder={placeholder}
                    />
                </div>

                {isOpen && redeemType !== "ppob" && (
                    <div
                        className="absolute top-full mt-1 z-10 rounded-md shadow-md bg-neutral20 ring-1 ring-black ring-opacity-5 overflow-y-auto max-h-64 no-scrollbar"
                        style={{ width: wrapperWidth }}
                    >
                        <div className="py-2 bg-white">
                            <div className="bg-neutral20 rounded-lg px-4 py-2.5 my-1 mx-2 cursor-default">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={`https://flagcdn.com/w40/${dropdownCountry.value}.png`}
                                        alt={dropdownCountry.label}
                                        className="w-5 h-5 object-cover rounded-full"
                                    />
                                    <p className="text-sm text-black">
                                        {
                                            dropdownCountry.label ||
                                            options.find((opt) => opt.value === dropdownCountry.value && opt.option === dropdownCountry.option)?.label
                                        }
                                    </p>
                                    <p className="text-sm text-black">{dropdownCountry.option}</p>
                                </div>
                            </div>

                            {options
                                .filter(
                                    (opt) =>
                                        opt.value !== dropdownCountry.value ||
                                        opt.option !== dropdownCountry.option
                                )
                                .map((option, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg px-4 py-2.5 my-1 mx-2 cursor-pointer transition-all hover:bg-neutral20"
                                        onClick={() => handleClickOption(option)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={`https://flagcdn.com/w40/${option.value}.png`}
                                                alt={option.label}
                                                className="w-5 h-5 object-cover rounded-full"
                                            />
                                            <p className="text-sm text-black">{option.label}</p>
                                            <p className="text-sm text-black">{option.option}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>

            {footer && (
                <div className="mt-1">
                    {mode === "danger" ? (
                        <div className="flex items-center">
                            <PiInfo size={16} className="text-danger500" />
                            <p className="text-danger500 text-xs ml-1">{footer}</p>
                        </div>
                    ) : (
                        <p className="text-black text-xs">{footer}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropdownPhone;