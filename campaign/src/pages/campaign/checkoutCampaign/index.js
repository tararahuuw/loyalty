import React, { useState, useEffect } from "react";

import _ from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import {
  Footer,
  ModalState,
  ModalLoading,
  ModalResult,
  Alert
} from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import { GetCartOrder, ChekcoutCampaign } from "../../../service/campaignmanagement/endpoint";
import { PiInfoFill } from "react-icons/pi";
import CustomTableCheckout from "../../../components/CheckoutCampaignSection/CustomTableCheckout";
import CustomTableCheckoutExistingVoucher from "../../../components/CheckoutCampaignSection/CustomTableCheckoutExistingVoucher";

const CheckoutCampaign = ({ roleAccess, setTitleHeader }) => {
    const { id } = useParams();
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
    const [isValidCheckout, setIsValidCheckout ] = useState(false)
    const [accessContent, setAccessContent ] = useState(false)
    const [voucherAvailable, setVoucherAvailable] = useState([])
    const [voucherUnavailable, setVoucherUnavailable] = useState([])
    const [flagResult, setFlagResult] = useState("success");
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [data, setData] = useState()
    const navigateTo = useNavigate();

    function handleOpenModalResult(type, subtitle) {
        setTimeout(() => {
          setFlagResult(type);
          setDataSubtitleModal(subtitle);
          setIsModalOpenResult(true);
          setTimeout(() => {
            setIsModalOpenResult(false);
          }, 1500);
        }, 250);
    }

    const separateVouchersByStock = (vouchers) => {
        const availableVoucher = vouchers.filter(voucher => voucher.isOutOfStock === false)
        const unvailableVoucher = vouchers.filter(voucher => voucher.isOutOfStock === true)
        setVoucherAvailable(availableVoucher)
        setVoucherUnavailable(unvailableVoucher)

        
        if (availableVoucher.length > 0) {
            const check = availableVoucher.some(item => item.isInsufficientStock === true);
            setIsValidCheckout(!check)
        }

        if (unvailableVoucher.length > 0) {
            setIsValidCheckout(false)
        }
    };    

    function handleNavigateToDashboardCampaign() {
        console.lo
        navigateTo("/prezent/campaign/reward");
    }

    function handleNavigateToDetailCampaign() {
        navigateTo(`/prezent/campaign/reward/${id}`);
    }

    function handleNavigateFooterCampaign() {
        if (data?.data.status === "Inactive" || data?.data.status === "Cancelled") {
            navigateTo(`/prezent/campaign/reward/add/${id}`)
        }
        else {
            navigateTo(`/prezent/campaign/reward/edit/${id}`)
        }
    } 

    function handleNavigateDashboardCampaign() {
        navigateTo(`/prezent/campaign/reward`)
    }

    async function handleGetDataCart() {
        try {
            toggleLoadingModal();
            const response = await GetCartOrder({roleAccess, id});
            if (response && ["System Administrator", "Business Administrator", "Business Support", "Client Administrator", "Client Support"].some(role => roleAccess.includes(role))) {
                toggleLoadingModal();
                setTitleHeader("Checkout")
                setAccessContent(true)
                let vouchers = response?.data.vouchers
                if (response.data.category === "Export Data") {
                    vouchers = vouchers.map((item) => ({
                        ...item,
                        counter: 1,
                    }));
                }
                if (vouchers) {
                    separateVouchersByStock(vouchers)
                }
                else {
                    setIsValidCheckout(true)
                }
                setData(response)
            }
            else {
                handleNavigateDashboardCampaign()
            }
        } catch (error) {
            handleNavigateDashboardCampaign()
        }
    }

    async function handleCheckoutCampaign() {
        try {
            toggleLoadingModal();
            var vouchersCart = []
            if (data?.data.category === "Export Data") {
                vouchersCart = voucherAvailable.map(item => ({
                    voucherID: item.id,
                    qty: item.counter
                }));
            }
            else {
                vouchersCart = voucherAvailable.map(item => ({
                    voucherID: item.id,
                    qty: item.qty
                }));
            }
            const form = {
                orderID: data?.data.orderID,
                vouchers: vouchersCart
            }
            const response = await ChekcoutCampaign({roleAccess, body: form});
            if (response) {
                toggleLoadingModal();
                setTimeout(() => {
                    handleOpenModalResult(
                      "success",
                      "Your campaign has been successfully added."
                    );
                    setTimeout(() => {
                      handleNavigateToDetailCampaign();
                    }, 1500);
                }, 250);
            }
        } catch (error) {
            toggleLoadingModal();
            if (error && error.response && error.response.data.code == 400) {
                handleOpenModalResult(
                    "failed",
                    "Sorry, Start date of the order must be greater than current date."
                );
            }
            else if (error && error.response && error.response.data.code == 402) {
                handleOpenModalResult(
                    "failed",
                    "Sorry, you do not have enough deposit to complete this transaction. Please add more funds in your deposit and try again."
                );
            }
            else if (error && error.response && error.response.data.code == 422) {
                handleOpenModalResult(
                    "failed",
                    "Sorry, the available voucher stock does not meet the requested input. Please review and adjust the recipients or vouchers in the list."
                );
            }
            else {
                handleOpenModalResult(
                    "failed",
                    "Sorry, we are unable to add campaign at the moment. Please refresh the page and try again"
                );
            }
        }
    }

    function getTotalCounter(jsonArray) {
        return jsonArray.reduce((total, item) => total += item.counter, 0);
    }

    function getSubTotal(jsonArray) {
        return jsonArray.reduce((total, item) => total += item.counter * item.price, 0);
    }

    function getTotalTax(jsonArray) {
        return jsonArray.reduce((total, item) => total += item.counter * item.price * item.taxRef / 100, 0);
    }

    function getTotalAdminFee(jsonArray) {
        return jsonArray.reduce((total, item) => total += item.counter * item.price * data?.data.adminFeeRef / 100, 0);
    }

    useEffect(() => {
        if (id) {
            handleGetDataCart()
        }
    }, [id]);
    
  return (
    <>  
        {
            accessContent &&
            <div className='flex-1 h-full overflow-y-auto bg-neutral20'>
                <div className='py-6 px-8 mb-16'>
                    {
                        voucherAvailable.length > 0 &&
                        <div className="mb-4">
                            <CustomTableCheckout 
                                data={voucherAvailable}
                                setData={setVoucherAvailable}
                                typeCampaign={data?.data?.category}
                            />
                        </div>
                    }
                    {
                        voucherUnavailable.length > 0 &&
                        <div>
                            <CustomTableCheckout 
                                data={voucherUnavailable}
                                setData={setVoucherUnavailable}
                                typeCampaign={data?.data?.category}
                                disable
                            />
                        </div>
                    }
                    {
                        data?.data?.category === "API Distribution" ?
                        <div className="mt-4 w-full p-4 bg-white rounded-md shadow">
                            <div className="w-full bg-neutral10 rounded-lg p-4">
                                <Alert
                                    subtitle="This action will only checkout the voucher catalog. The deposit will be deducted each time a user generates a voucher through the API. Make sure you’ve entered the IP & Callback URL in the Integration section under Settings"
                                />
                            </div>
                        </div>
                        :
                        <div className="mt-4 w-full p-4 bg-white rounded-md shadow">
                            <div className="w-full bg-neutral10 rounded-lg p-4">
                                {
                                    data?.data.category === "Export Data" ?
                                    <div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Subtotal price voucher ({getTotalCounter(voucherAvailable)} voucher)</p>
                                            <p>Rp{getSubTotal(voucherAvailable).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Total Admin Fee ({getTotalCounter(voucherAvailable)} voucher)</p>
                                            <p>Rp{getTotalAdminFee(voucherAvailable).toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Total Tax ({getTotalCounter(voucherAvailable)} voucher)</p>
                                            <p>Rp{getTotalTax(voucherAvailable).toLocaleString('id-ID')}</p>
                                        </div>
                                        <hr className="border-dashed my-2 border-neutral40" />
                                        <div className="flex justify-between items-center text-neutral300">
                                            <p>Total Amount</p>
                                            <div className="flex font-bold">
                                                <p>Rp{(getSubTotal(voucherAvailable) + getTotalAdminFee(voucherAvailable) + getTotalTax(voucherAvailable)).toLocaleString('id-ID')}</p>
                                                <p className="text-danger500 ml-1">*</p>
                                            </div>
                                        </div>
                                        <p className="text-xs my-2">This total amount is the sum of all recipients you have entered.</p>
                                        <div className="border-primary500 border bg-primary50 rounded-md p-2 flex items-center">
                                            <PiInfoFill className="text-primary500 mr-2" size={20}/>
                                            <div className="flex items-center text-sm">
                                                <p>By clicking the Submit button, you agree to Prezent's</p>
                                                <a className="text-primary500 font-bold ml-1 cursor-pointer">Terms & Conditions.</a>
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Subtotal price voucher ({data?.data.totalVoucher} voucher)</p>
                                            <p>Rp{data?.data.subtotal.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Subtotal distribution ({data?.data.totalDelivery} delivery)</p>
                                            <p>Rp{data?.data.deliveryCost.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Total Admin Fee ({data?.data.totalVoucher} voucher)</p>
                                            <p>Rp{data?.data.adminFee.toLocaleString('id-ID')}</p>
                                        </div>
                                        <div className="flex justify-between items-center text-neutral300 text-sm">
                                            <p>Total Tax ({data?.data.totalVoucher} voucher)</p>
                                            <p>Rp{data?.data.tax.toLocaleString('id-ID')}</p>
                                        </div>
                                        <hr className="border-dashed my-2 border-neutral40" />
                                        <div className="flex justify-between items-center text-neutral300">
                                            <p>Total Amount</p>
                                            <div className="flex font-bold">
                                                <p>Rp{data?.data.totalAmount.toLocaleString('id-ID')}</p>
                                                <p className="text-danger500 ml-1">*</p>
                                            </div>
                                        </div>
                                        <p className="text-xs my-2">This total amount is the sum of all recipients you have entered.</p>
                                        <div className="border-primary500 border bg-primary50 rounded-md p-2 flex items-center">
                                            <PiInfoFill className="text-primary500 mr-2" size={20}/>
                                            <div className="flex items-center text-sm">
                                                <p>By clicking the Submit button, you agree to Prezent's</p>
                                                <a className="text-primary500 font-bold ml-1 cursor-pointer">Terms & Conditions.</a>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                    {
                        data?.data.existingVouchers &&
                        <div>
                            <p className="py-4 font-semibold">Checkout</p>
                            <CustomTableCheckoutExistingVoucher 
                                data={data?.data.existingVouchers}
                            />
                        </div>
                    }
                </div>
                <Footer 
                    titleLeftButton={"Back"}
                    titleRightButton={
                        data?.data.category === "One Time Channel Delivery" ? `Checkout(${data?.data.totalVoucher})`: 
                        data?.data.category === "Export Data" ? `Checkout(${getTotalCounter(voucherAvailable)})`:
                        "Submit"
                    }
                    modeLeftButton="outline"
                    modeRightButton="primary"
                    isActiveLeftButton={true}
                    isActiveRightButton
                    isActive={isValidCheckout}
                    onClickLeftButton={() => handleNavigateFooterCampaign()}
                    onClickRightButton={() => handleCheckoutCampaign()}
                />
                <ModalState 
                    title="Do you want to cancel?" 
                    subtitle="The information you filled in has not been saved and will be lost if you cancel this process." 
                    isOpen={cancelModalIsOpen} 
                    onClose={toggleCancelModal}
                    type='default'
                    titleButtonLeft='Back'
                    titleButtonRight='Cancel'
                    leftAction={toggleCancelModal}
                    rightAction={handleNavigateToDashboardCampaign}
                />
                <ModalLoading
                    title="Loading..."
                    subtitle="Please wait a moment"
                    isOpen={loadingModalIsOpen}
                />
                <ModalResult
                    subtitle={dataSubtitleModal}
                    type={flagResult}
                    isOpen={isModalOpenResult}
                    onClose={() => setIsModalOpenResult(false)}
                />
            </div>
        }
    </>
  );
};

export default CheckoutCampaign;