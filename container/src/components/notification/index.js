import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Profile from '../../assets/images/profile.png';

const Notification = (props) => {
    const [dataNotification, setDataNotification] = useState([])
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))

    useEffect(() => {
        if (props.dataNotification) {
            setDataNotification(props.dataNotification);
        }
    }, [props.dataNotification]);

    function handleNavigation(urlNavigation) {
        navigate(urlNavigation);
    }

  return (
    <div>
        <div className='flex px-2 p-2'>
            <img src={Profile} className='w-10 h-10 mr-2' />
            <div className='flex-1'>
                <p className='text-sm text-black font-semibold whitespace-nowrap'>{userInfo ? userInfo.username : "Undefined Name"}</p>
                <p className='text-xs text-neutral300 font-normal whitespace-nowrap'>{userInfo ? userInfo.roleName : "Undefined Role"}</p>
            </div>
        </div>
        <div className="border-b border-neutral40 w-full"></div>
        {dataNotification.map((value, index) => (
            <div
                key={index}
                className={`px-2 flex items-center cursor-pointer bg-white hover:bg-neutral20 p-2 ${
                    index === 0 ? 'rounded-t-md' : index === dataNotification.length - 1 ? 'rounded-b-md' : ''
                }`}
                onClick={() => handleNavigation(value.navigate)}
            >   
                <value.logo size={16} className='text-neutral300 mr-2' />
                <p className='text-sm'>{value.title}</p>
            </div>
        ))}
    </div>
  );
};

export default Notification;