import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ModalLoading, ModalResult } from 'sprint-asia-custom-component';
import { GetVerifyEmailUser } from '../../../service/usermanagement/endpoint';
import queryString from 'query-string';

const VerifyEmail = () => {
    const [isModalOpenLoading, setIsModalOpenLoading] = useState(false)
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [flagResult, setFlagResult] = useState("success")
    const [dataSubtitleModal, setDataSubtitleModal] = useState("")
    const location = useLocation();
    const navigateTo = useNavigate()
    const { id, code } = queryString.parse(location.search);

    useEffect(() => {
        if (!id || !code) {
            handleNavigateToLogin()
        }
        else {
            handleVerifyEmail()
        }
    }, [])

    function handleNavigateToLogin() {
        navigateTo("/")
    }

    function handleOpenModalResult(type, subtitle) {
        setTimeout(() => {
            setFlagResult(type)
            setDataSubtitleModal(subtitle)
            setIsModalOpenResult(true)
            setTimeout(() => {
                setIsModalOpenResult(false)
            }, 2000);
        }, 250);
    }

    async function handleVerifyEmail() {
        if (id && code) {
            try {
                setIsModalOpenLoading(true)
                await GetVerifyEmailUser(id, code)
                setIsModalOpenLoading(false)
                setTimeout(() => {
                    handleOpenModalResult("success", "Verification email has been succesfully!")
                    setTimeout(() => {
                        handleNavigateToLogin()
                    }, 1500);
                }, 250);
            } catch (error) {
                if (error && error.response && error.response.data.code == 404) {
                    setIsModalOpenLoading(false)
                    handleOpenModalResult("failed", "User not found. Please contact our operation team on help center.")
                }
                else if (error && error.response && error.response.data.code == 400) {
                    setIsModalOpenLoading(false)
                    handleOpenModalResult("failed", "Code is invalid. Please contact our operation team on help center.")
                }
                else {
                    setIsModalOpenLoading(false)
                    handleOpenModalResult("failed", "We couldn't complete your registration. Please try again.")
                }
            }
        }
        else {
            handleNavigateToLogin()
        }
    }

  return (
    <div className='h-screen flex flex-col justify-center items-center relative overflow-hidden bg-neutral20'>
        <ModalLoading
            title="Loading..."
            subtitle="Please wait a moment"
            isOpen={isModalOpenLoading}
            onClose={() => {}}
        />

        <ModalResult
            subtitle={dataSubtitleModal}
            type={flagResult}
            isOpen={isModalOpenResult}
        />
    </div>
  );
};

export default VerifyEmail;