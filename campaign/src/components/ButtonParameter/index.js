import React, { useEffect, useState } from 'react';
import { PiGear, PiMagnifyingGlassDuotone } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import { OutlineButton, PrimaryButton } from 'sprint-asia-custom-component';

const ButtonParameter = ({
    title,
    data = [],
    onClick,
    onClickAddParameter,
    isLoading,
    isActive
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [menuData, setMenuData] = useState([]);
    const [search, setSearch] = useState("");
    const navigateTo = useNavigate()

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (value) => {
        onClick(value);
        setIsOpen(false);
    };

    function handleNavigateToSettingParameter() {
        navigateTo("/prezent/setting/parameter")
    }

    function handleFilterData() {
        if (search === "") {
          setMenuData(data)
        }
        else {
            setMenuData(data.filter(item => item.parameterName.toLowerCase().includes(search.toLowerCase())))
        }
    }

    useEffect(() => {
        handleFilterData()
    }, [search])

    useEffect(() => {
        setMenuData(data)
    }, [data])

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <OutlineButton onClick={toggleDropdown} title={title} isActive={isActive}/>
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        right: '0',
                        background: '#fff',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        borderRadius: '5px',
                        marginTop: '8px',
                        zIndex: 10,
                        padding: "8px",
                        width:"350px"
                    }}
                >
                    <div className='flex items-center w-full'>
                        <div className="relative mr-2 w-full">
                            <PiMagnifyingGlassDuotone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral50 w-4 h-4" />
                            <input
                                value={search}
                                placeholder={"Find parameter"}
                                onChange={e => setSearch(e.target.value)}
                                className={`w-full py-2.5 pr-8 pl-4 font-normal text-sm text-neutral300 rounded-md border border-neutral50 focus:outline-none`}
                            />
                        </div>
                        <OutlineButton onClick={handleNavigateToSettingParameter} title={null} icon={<PiGear size={16} className="text-primary500"/>} isIconVisible/>
                    </div>
                    <ul style={{ listStyle: 'none', margin: 0, padding: '10px 0', maxHeight: '250px', overflowY: 'auto'}}>
                        {
                            menuData.length === 0 ? 
                                <li
                                    className='hover:bg-neutral20 bg-white rounded-md'
                                    style={{ padding: '10px 20px', textAlign:"center" }}
                                >
                                    {isLoading ? "Loading..." : "No Data"}
                                </li>
                            :
                            <div>
                                {
                                    menuData.map((value, index) =>
                                        <li
                                            key={index}
                                            className='hover:bg-neutral20 bg-white rounded-md'
                                            style={{ padding: '10px 20px', cursor: 'pointer' }}
                                            onClick={() => handleOptionClick(value)}
                                        >
                                            {value.parameterName}
                                        </li>
                                    )
                                }
                            </div>
                        }
                    </ul>
                    <hr className='text-neutral30 py-1' />
                    <div className='py-1'>
                        <PrimaryButton onClick={() => onClickAddParameter()} title='Create new parameter' type='full'/>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ButtonParameter;