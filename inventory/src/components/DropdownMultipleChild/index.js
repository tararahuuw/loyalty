import React, { useState, useRef, useEffect } from "react";
import { PiCaretDown, PiCaretRight, PiCaretUp, PiInfo } from "react-icons/pi";

const DropdownMultipleChild = ({
    options = [],
    title = "Title Dropdown",
    placeholder = "Placeholder",
    isRequired = true,
    isEdited = true,
    mode = "default",
    footer = null,
    currentData = null,
    setCurrentData = () => { },
    className = "",
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPath, setSelectedPath] = useState([]);
    const [finalSelectedPath, setFinalSelectedPath] = useState([]);
    const [columns, setColumns] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isOpen]);

    const handleSelect = (node, level) => {
        const newPath = [...selectedPath.slice(0, level), node];
        setSelectedPath(newPath);

        if (!node.children || node.children.length === 0) {
            setIsOpen(false);
            setFinalSelectedPath(newPath);

            // Convert to nested structure
            const nested = newPath.reduceRight((acc, item) => {
                return { id: item.id, name: item.name, children: acc };
            }, null);

            setCurrentData(nested);
        }
    };

    // Normalisasi dan isi selectedPath dari currentData
    useEffect(() => {
        if (currentData) {
            const path = [];
            let pointer = currentData;

            while (pointer) {
                const child = pointer.children;
                const normalizedChild = child
                    ? Array.isArray(child)
                        ? child
                        : [child]
                    : [];

                path.push({
                    id: pointer.id,
                    name: pointer.name,
                    child: normalizedChild,
                });

                pointer = child && !Array.isArray(child) ? child : null;
            }

            setSelectedPath(path);
            setFinalSelectedPath(path);
        }
    }, [currentData]);

    useEffect(() => {
        const newColumns = [];
        let currentLevel = Array.isArray(options) ? options : [];

        for (let i = 0; i <= selectedPath.length; i++) {
            if (!currentLevel || currentLevel.length === 0) break;

            newColumns.push(currentLevel);

            const selectedId = selectedPath[i]?.id;
            const selectedNode = currentLevel.find((item) => item.id === selectedId);

            currentLevel =
                selectedNode && Array.isArray(selectedNode.children) ? selectedNode.children : [];
        }

        setColumns(newColumns.slice(0, 5));
    }, [selectedPath, options]);

    const selectedValue = finalSelectedPath.map((item) => item.name).join(" > ");

    return (
        <div className={`relative w-full text-left ${className}`} ref={dropdownRef}>
            {title && (
                <div className="flex">
                    <p className="text-sm font-normal text-black mb-1">{title}</p>
                    {isRequired && <p className="text-sm font-normal text-danger500 ml-1">*</p>}
                </div>
            )}

            <div>
                <span className="rounded-md shadow-sm">
                    <button
                        type="button"
                        className={`
                            ${!isEdited && "bg-neutral30 cursor-not-allowed"} 
                            ${mode === "default" && !selectedValue && "border-neutral50 bg-neutral20"} 
                            ${mode === "default" && selectedValue && "border-black bg-neutral20"} 
                            ${mode === "danger" && "border-danger500 bg-danger50"} 
                            flex items-center w-full py-2.5 text-left px-4 font-normal text-sm text-neutral300 rounded-md border focus:outline-none overflow-hidden`}
                        onClick={() => isEdited && setIsOpen((prev) => !prev)}
                    >
                        <span className="flex-grow overflow-hidden">{selectedValue || placeholder}</span>
                        <span className="ml-2">
                            {isOpen ? <PiCaretUp size={16} /> : <PiCaretDown size={16} />}
                        </span>
                    </button>
                </span>
            </div>

            {isOpen && isEdited && (
                <div className="absolute z-20 mt-2 grid grid-cols-5 w-full max-w-full">
                    {columns.map((items, level) => (
                        <div
                            key={level}
                            className="rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 overflow-hidden"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            <div className="px-1 py-2 max-h-56 overflow-y-auto">
                                {items.map((item) => {
                                    const isSelected = selectedPath[level]?.id === item.id;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`${isSelected ? "bg-neutral20" : "bg-white"
                                                } hover:bg-neutral20 py-2.5 px-4 my-0.5 rounded-md flex justify-between items-center cursor-pointer`}
                                            onClick={() => handleSelect(item, level)}
                                        >
                                            <p className="text-sm text-black">{item.name}</p>
                                            {item.children.length > 0 && <PiCaretRight />}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {footer && (
                <div className="mt-1">
                    {mode === "danger" ? (
                        <div className="flex">
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

export default DropdownMultipleChild;