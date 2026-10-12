import React, { useState, useRef, useEffect } from "react";
import { PiCaretUp, PiCaretDown, PiCaretRight } from "react-icons/pi";

const MultiSelectDropdownNumber = ({
    options = [],
    isRequired,
    title = "",
    placeholder = "",
    setCurrentData,
    currentData = []
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUnitId, setOpenUnitId] = useState(null);

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setOpenUnitId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const isSizeSelected = (unitId, sizeId) => {
        const unit = currentData.find(u => u.id === unitId);
        return unit?.size?.some(s => s.id === sizeId);
    };

    const isAllSizeSelected = (unit) => {
        const selectedUnit = currentData.find(u => u.id === unit.id);
        return (
            selectedUnit &&
            selectedUnit.size.length === unit.size.length
        );
    };

    const handleToggleSize = (unit, size) => {
        const updated = [...currentData];
        const unitIndex = updated.findIndex(u => u.id === unit.id);
        if (unitIndex !== -1) {
            const sizeIndex = updated[unitIndex].size.findIndex(s => s.id === size.id);
            if (sizeIndex !== -1) {
                updated[unitIndex].size.splice(sizeIndex, 1);
                if (updated[unitIndex].size.length === 0) {
                    updated.splice(unitIndex, 1);
                }
            } else {
                updated[unitIndex].size.push(size);
            }
        } else {
            updated.push({ id: unit.id, unit: unit.unit, size: [size] });
        }
        setCurrentData(updated);
    };

    const handleSelectAll = (unit) => {
        const isAllSelected = isAllSizeSelected(unit);
        let updated = [...currentData];
        const unitIndex = updated.findIndex(u => u.id === unit.id);
        if (isAllSelected) {
            if (unitIndex !== -1) updated.splice(unitIndex, 1);
        } else {
            if (unitIndex !== -1) {
                updated[unitIndex].size = [...unit.size];
            } else {
                updated.push({ id: unit.id, unit: unit.unit, size: [...unit.size] });
            }
        }
        setCurrentData(updated);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {title && (
                <div className="flex mb-1">
                    <p className="text-sm font-normal text-black">{title}</p>
                    {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
                </div>
            )}
            <div>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center w-full px-4 text-sm rounded-md border focus:outline-none overflow-hidden text-left ${currentData.length > 0 ? "border-black text-black" : "border-neutral50 text-neutral300"
                        } bg-neutral20`}
                >
                    <div className="flex flex-wrap gap-2 py-2.5 w-full">
                        {currentData.length === 0 ? (
                            <span className="text-neutral300">{placeholder}</span>
                        ) : (
                            <span className="text-neutral300">
                                {currentData
                                    .flatMap(unit => (unit.size?.length ? unit.size.map(size => size.name) : []))
                                    .filter(name => name && name.trim() !== "") // jaga kalau ada name kosong
                                    .join(", ") || "-"}
                            </span>
                        )}
                    </div>
                    <span className="ml-2 cursor-pointer">
                        {isOpen ? (
                            <PiCaretUp size={16} className="text-neutral300" />
                        ) : (
                            <PiCaretDown size={16} className="text-neutral300" />
                        )}
                    </span>
                </button>
            </div>

            {isOpen && (
                <div className="bg-white border border-neutral40 w-48 rounded-md px-2 py-2 top-1 absolute z-10 mt-10 shadow-md">
                    {options.map((unit) => (
                        <div key={unit.id}>
                            <div
                                className="hover:bg-neutral20 bg-white py-2.5 px-4 my-0.5 rounded-md flex items-center cursor-pointer justify-between"
                                onClick={() =>
                                    setOpenUnitId(openUnitId === unit.id ? null : unit.id)
                                }
                            >
                                <p>{unit.unit}</p>
                                {(currentData.find((u) => u.id === unit.id)?.size.length || 0) === 0 ? (
                                    <PiCaretRight size={16} className="text-neutral300" />
                                ) : (
                                    <div className="w-4 h-4 border border-primary500 rounded-full flex items-center justify-center text-primary500">
                                        <p style={{ fontSize: "8px" }}>
                                            {currentData.find((u) => u.id === unit.id)?.size.length}
                                        </p>
                                    </div>
                                )}
                            </div>
                            {openUnitId === unit.id && unit.size.length > 0 && (
                                <div className={`ml-1 border border-neutral40 bg-white px-2 py-2 shadow-md rounded-md w-56 absolute left-48 z-20 max-h-48 overflow-y-auto top-0`}>
                                    <div className="flex bg-white hover:bg-neutral20 rounded-md py-2.5 px-4 my-0.5">
                                        <input
                                            type="checkbox"
                                            className="mr-2"
                                            checked={isAllSizeSelected(unit)}
                                            onChange={() => handleSelectAll(unit)}
                                            style={{width:"fit-content"}}
                                        />
                                        <p className="text-sm font-normal text-black">Select All</p>
                                    </div>

                                    {unit.size.map((size) => (
                                        <div
                                            key={size.id}
                                            className="flex bg-white hover:bg-neutral20 rounded-md py-2.5 px-4 my-0.5"
                                        >
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={isSizeSelected(unit.id, size.id)}
                                                onChange={() => handleToggleSize(unit, size)}
                                                style={{width:"fit-content"}}
                                            />
                                            <p className="text-sm text-black">{size.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdownNumber;
