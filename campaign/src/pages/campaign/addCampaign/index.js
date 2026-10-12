import React, { useState, useEffect } from "react";

import moment from "moment";
import _ from "lodash";

import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Footer,
  ModalState,
  ModalLoading,
  ModalResult,
  CustomPhone
} from "sprint-asia-custom-component";
import { useDisclosure } from "prezent/useDisclosure";
import BasicInformationSection from "../../../components/BasicInformationSection";
import VoucherSection from "../../../components/VoucherSection";
import DistributionMethod from "../../../components/DistributionMethodSection";
import RecipientList from "../../../components/RecipientListSection";
import SearchInput from "../../../components/SearchInput";
import { GetAllVoucherTemplate } from "../../../service/voucherManagement/endpoint";
import { CreateNewCampaign, CreateDraftCampaign } from "../../../service/campaignmanagement/endpoint";

const AddCampaign = ({ roleAccess, clientId, setTitleHeader }) => {
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
    const { isOpen: voucherModalIsOpen, toggle: toggleVoucherModal } = useDisclosure(false);
    const { isOpen: deleteVoucherModalIsOpen, toggle: toggleDeleteVoucherModal } = useDisclosure(false);
    const { isOpen: deleteRecipientModalIsOpen, toggle: toggleDeleteRecipientModal } = useDisclosure(false);
    const { isOpen: addRecipientSingleModalIsOpen, toggle: toggleAddRecipientSingleModal } = useDisclosure(false);
    const { isOpen: addRecipientBulkModalIsOpen, toggle: toggleAddRecipientBulkModal } = useDisclosure(false);
    const [flagResult, setFlagResult] = useState("success");
    const [dataVoucherTemplate, setDataTemplateVoucher] = useState([]);
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [accessContent, setAccessContent] = useState(false)

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

    function handleNavigateToDashboard() {
        navigateTo("/prezent/campaign/reward");
    }

    function handleNavigateToCheckout(id) {
        navigateTo(`/prezent/campaign/reward/checkout/${id}`);
    }

    function isValidCampaignDraft() {
        if (
            !formik.errors.name && 
            !formik.errors.description && 
            !formik.errors.type && 
            !formik.errors.category && 
            !formik.errors.clientId &&
            !formik.errors.divisionId &&
            formik.values.name && 
            formik.values.description && 
            formik.values.type && 
            formik.values.category && 
            formik.values.clientId &&
            formik.values.divisionId &&
            (formik.values.type !== "Period" || (
                !formik.errors.startDate && 
                !formik.errors.endDate &&
                formik.values.startDate && 
                formik.values.endDate
            )) &&
            (formik.values.category !== "API Distribution" || (
                !formik.errors.apiType &&
                formik.values?.apiType
            ))
        ) {
            return true
        }
        else {
            return false
        }
    }

    const submitCreateCampaign = async (form) => {
        try {
            toggleLoadingModal();
            const response = await CreateNewCampaign({roleAccess, body: form});
            if (response) {
                toggleLoadingModal();
                handleNavigateToCheckout(response.data.id)
            }
        } catch (error) {
            toggleLoadingModal();
            handleOpenModalResult(
                "failed",
                "Sorry, we are unable to added campaign at the moment. Please refresh the page and try again"
            );
        }
    };

    const submitDraftCampaign = async (values) => {
        var voucherRecipientChannels = []
        if (values.channelWhatsapp) {
            voucherRecipientChannels.push({
                "channel": "Whatsapp",
                "method": values.methodWhatsapp,
                "templateId": values.templateIdWhatsapp,
                "content": values.messageWhatsapp
            })
        }
        if (values.channelSMS) {
            voucherRecipientChannels.push({
                "channel": "SMS",
                "method": values.methodSMS,
                "templateId": values.templateIdSMS,
                "content": values.messageSMS
            })
        }
        if (values.channelEmail) {
            voucherRecipientChannels.push({
                "channel": "Email",
                "method": values.methodEmail,
                "templateId": values.templateIdEmail,
                "content": values.messageEmail
            })
        }
        const form = 
        {
            "name": values?.name || "",
            "type": values?.type || "",
            "category": values?.category || "",
            "apiType": values?.apiType || "",
            "description": values?.description || "",
            "startDate": values?.startDate || "",
            "endDate": values?.endDate || "",
            "clientID": values?.clientId || "",
            "divisionID": values?.divisionId || "",
            "themeCampaign": values?.themeCampaign?.id || "",
            "voucherRecipientChannels": voucherRecipientChannels || [],
            "recipientType": values?.recipientType || "",
            "recipients": values?.recipients || [],
            "vouchers": values?.vouchers || []
        }
        try {
            toggleLoadingModal();
            const response = await CreateDraftCampaign({roleAccess, id:null, body: form});
            if (response) {
                toggleLoadingModal();
                handleNavigateToDashboard()
            }
        } catch (error) {
            toggleLoadingModal();
            handleOpenModalResult(
                "failed",
                "Sorry, we are unable to added campaign at the moment. Please refresh the page and try again"
            );
        }
    };

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: "",
            description: "",
            type: "",
            apiType: "",
            category: "",
            startDate: "",
            endDate: "",
            clientId: roleAccess === "Client Administrator" ? clientId : "",
            divisionId: "",
            recipientType: "Specific Voucher",
            recipients: [],
            vouchers: [],
            existingVouchers: [],
            voucherRecipientChannels: [],
            themeCampaign: null,
            currentDistributionMethods: null,
            status : null,
            
            channelWhatsapp: null,
            methodWhatsapp: "",
            templateIdWhatsapp: "",
            messageWhatsapp: "",

            channelSMS: null,
            methodSMS: "",
            templateIdSMS: "",
            messageSMS: "",

            channelEmail: null,
            methodEmail: "",
            templateIdEmail: "",
            messageEmail: ""
        },
        validationSchema: yup.object().shape({
            name: yup
                .string()
                .min(5, "Campaign name must be between 5 and 50 characters long")
                .max(50, "Campaign name must be between 5 and 50 characters long")
                .matches(/^[a-zA-Z0-9. ]+$/, "Campaign name must contain only alphanumeric characters")
                .required("Campaign name is required"),
            description: yup
                .string()
                .min(10, "Campaign description must be between 10 and 300 characters long")
                .max(300, "Campaign description must be between 10 and 300 characters long")
                .matches(/^[a-zA-Z0-9. ]+$/, "Campaign description must contain only alphanumeric characters")
                .required("Campaign description is required"),
            type: yup
                .string()
                .required("Type is required"),
            apiType: yup
                .string()
                .when("category", {
                    is: (value) => value === 'API Distribution',
                    then: () => yup.string().required("API Type is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
            category: yup
                .string()
                .required("Category is required"),
            startDate: yup
                .string()
                .when("type", {
                is: (value) => value === "Period",
                then: () =>
                    yup
                    .string()
                    .required("Start date period is required")
                    .test(
                        "is-today-or-later",
                        "Start date must be after today.",
                        function (value) {
                            const { status } = this.parent;
                            const today = moment().startOf("day");
                            const inputDate = moment(value).startOf("day");
                            return status === "Active" ? true : inputDate.isSameOrAfter(today);
                        }
                    ),
                otherwise: () => yup.string().notRequired(),
            }),
            endDate: yup
                .string()
                .when("type", {
                is: (value) => value === "Period",
                then: () =>
                    yup
                    .string()
                    .required("End date period is required")
                    .test("is-greater", "End date must be at least 2 days after the start date.", function (value) {
                        const { startDate } = this.parent;
                        return moment(value).diff(moment(startDate), "hours") > 48;
                    }),
                otherwise: () => yup.string().notRequired(),
            }),
            clientId: yup
                .string()
                .required("Client is required"),
            divisionId: yup
                .string()
                .required("Division is required"),
            recipientType: yup
                .string()
                .required("Recipient type is required"),
            recipients: yup
                .mixed()
                .required("Recipients is required"),
            // vouchers: yup
            //     .mixed()
            //     .required("Vouchers is required"),
            voucherRecipientChannels: yup
                .mixed()
                .required("Voucher Recipient Channels is required"),
            themeCampaign: yup
                .mixed()
                .required("Theme is required"),
            messageSMS: yup
                .string()
                .when("methodSMS", {
                    is: (value) => value === 'Input Manual',
                    then: () => 
                        yup.string()
                        .min(15, "Greetings too short. Min 15 characters")
                        .max(100, "Greetings too long. Max 100 characters")
                        .matches(/^[a-zA-Z0-9. ]+$/, "Greetings must contain only alphanumeric characters")
                        .required("Greetings is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
            messageEmail: yup
                .string()
                .when("methodEmail", {
                    is: (value) => value === 'Input Manual',
                    then: () => 
                        yup.string()
                        .min(15, "Greetings too short. Min 15 characters")
                        .max(100, "Greetings too long. Max 100 characters")
                        .matches(/^[a-zA-Z0-9. ]+$/, "Greetings must contain only alphanumeric characters")
                        .required("Greetings is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
            templateIdWhatsapp: yup
                .string()
                .when("methodWhatsapp", {
                    is: (value) => value === 'Template',
                    then: () => 
                        yup.string()
                        .required("Theme is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
            templateIdSMS: yup
                .string()
                .when("methodSMS", {
                    is: (value) => value === 'Template',
                    then: () => 
                        yup.string()
                        .required("Theme is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
            templateIdEmail: yup
                .string()
                .when("methodEmail", {
                    is: (value) => value === 'Template',
                    then: () => 
                        yup.string()
                        .required("Theme is required"),
                    otherwise: () => yup.string().notRequired(),
                }),
        }),
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => {
            var voucherRecipientChannels = []
            if (values.channelWhatsapp) {
                voucherRecipientChannels.push({
                    "channel": "Whatsapp",
                    "method": values.methodWhatsapp,
                    "templateId": values.templateIdWhatsapp,
                    "content": values.messageWhatsapp
                })
            }
            if (values.channelSMS) {
                voucherRecipientChannels.push({
                    "channel": "SMS",
                    "method": values.methodSMS,
                    "templateId": values.templateIdSMS,
                    "content": values.messageSMS
                })
            }
            if (values.channelEmail) {
                voucherRecipientChannels.push({
                    "channel": "Email",
                    "method": values.methodEmail,
                    "templateId": values.templateIdEmail,
                    "content": values.messageEmail
                })
            }
            const form = 
            {
                "name": values?.name || "",
                "type": values?.type || "",
                "category": values?.category || "",
                "apiType": values?.apiType || "",
                "description": values?.description || "",
                "startDate": values?.startDate || "",
                "endDate": values?.endDate || "",
                "clientID": values?.clientId || "",
                "divisionID": values?.divisionId || "",
                "themeCampaign": values?.themeCampaign?.id || "",
                "voucherRecipientChannels": voucherRecipientChannels || [],
                "recipientType": values?.recipientType || "",
                "recipients": values?.recipients || [],
                "vouchers": values?.vouchers || []
            }
            if (values.vouchers.length === 0) {
                handleOpenModalResult(
                    "failed",
                    "Voucher is required"
                );
            }
            else {
                if (values.category === "One Time Channel Delivery") {
                    if (values.recipients.length !== 0 && 
                        values.vouchers.length !== 0 &&
                        (voucherRecipientChannels.length !== 0 && (values.messageWhatsapp || values.messageSMS || values.messageEmail || values.templateIdWhatsapp || values.templateIdSMS || values.templateIdEmail))
                    ){
                        submitCreateCampaign(form);
                    }
                }
                else if (values.category === "API Distribution" && values.apiType === "Channel") {
                    if (values.vouchers.length !== 0 &&
                        (voucherRecipientChannels.length !== 0 && (values.messageWhatsapp || values.messageSMS || values.messageEmail || values.templateIdWhatsapp || values.templateIdSMS || values.templateIdEmail))
                    ) {
                        submitCreateCampaign(form);
                    }
                }
                else {
                    if (values.vouchers.length !== 0) {
                        submitCreateCampaign(form);
                    }
                }
            }
        },
    });

    async function getVoucherTemplate() {
        try {
            const response = await GetAllVoucherTemplate({ roleAccess, clientId : formik.values.clientId, divisionId : formik.values.divisionId })
            setDataTemplateVoucher(response.data)
        }
        catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (roleAccess) {
            if (!["System Administrator", "Business Administrator", "Business Support", "Client Administrator", "Client Support"].some(role => roleAccess.includes(role))) {
                handleNavigateToDashboard()
            }
            else {
                setTitleHeader("Add Campaign")
                setAccessContent(true)
            }
        }
        else {
            setTitleHeader("Campaign")
        }
    }, [roleAccess])

    useEffect(() => {
        if (selectedVoucher && formik.values.themeCampaign) {
            const updatedVoucher = {
                ...selectedVoucher,
                background: formik.values.themeCampaign.background,
                messageDescription: formik.values.themeCampaign.messageDescription,
                messageTitle: formik.values.themeCampaign.messageTitle,
                templateName: formik.values.themeCampaign.templateName,
                templateVoucherPhoto: formik.values.themeCampaign.templateVoucherPhoto,
                theme: formik.values.themeCampaign.theme,
            };

            if (JSON.stringify(selectedVoucher) !== JSON.stringify(updatedVoucher)) {
                setSelectedVoucher(updatedVoucher);
            }
        }
    }, [formik.values.themeCampaign, selectedVoucher]);

    useEffect(() => {
        if (formik.values.divisionId) {
            formik.setFieldValue("themeCampaign", null)
            getVoucherTemplate()
        }
    }, [formik.values.divisionId])
    
  return (
    <>
        {
            accessContent &&
            <div className='flex-1 h-full overflow-y-auto bg-neutral20'>
                <div className='py-6 px-8 mb-16'>
                    <div className="mb-6">
                        <div className="ml-auto w-max sticky top-6">
                            <div className="ml-4 bg-white rounded-lg py-5 px-6 shadow-md sticky w-80">
                                <p className="text-lg font-semibold">Voucher Preview</p>
                                <hr className="text-neutral30 mt-2 mb-4"/>
                                <div className="h-14">
                                    <SearchInput 
                                        title={"Theme"}
                                        isRequired
                                        data={dataVoucherTemplate || []}
                                        initialValueOption={formik.values.themeCampaign}
                                        setValueOption={(e) => {
                                            formik.setFieldValue("themeCampaign", e);
                                            formik.setFieldTouched("themeCampaign", true, false);
                                        }}
                                        footer={(formik.touched.themeCampaign || formik.submitCount > 0) && formik.errors.themeCampaign ? formik.errors.themeCampaign : null}
                                        mode={(formik.touched.themeCampaign || formik.submitCount > 0) && formik.errors.themeCampaign ? "danger" : "default"}
                                    />
                                </div>
                                <div className="flex justify-center mt-3 pt-5">
                                    <CustomPhone
                                        mode={selectedVoucher ? "Voucher" : "Empty"}
                                        data={{
                                            productName: selectedVoucher?.voucherName || "N/A",
                                            orderNumber: selectedVoucher?.orderNumber || "12345678",
                                            validDate: moment(selectedVoucher?.validityEndDate).format("DD MMMM YYYY") || "N/A",
                                            voucherDescription: selectedVoucher?.description || "No description available",
                                            voucherBackgroundType:
                                                selectedVoucher?.background === "upload_image" ? "image" : "color",
                                            voucherBackground:
                                                selectedVoucher?.background === "upload_image"
                                                    ? `${process.env.REACT_APP_API_VOUCHER_URL}/template_voucher/${selectedVoucher?.templateVoucherPhoto}`
                                                    : selectedVoucher?.templateName || "Default Background",
                                            voucherPhoto: `${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${selectedVoucher?.voucherPhoto || "default-photo.jpg"}`,
                                            voucherTitle: selectedVoucher?.messageTitle || "Untitled",
                                            voucherMessage: selectedVoucher?.messageDescription || "No message provided",
                                            howToRedeem: selectedVoucher?.howToRedeem || "Redemption instructions not available",
                                            terms: selectedVoucher?.terms || "Terms and conditions not specified",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div style={{width: 'calc(100% - 350px)', marginTop:"-680px"}}>
                            <BasicInformationSection 
                                roleAccess={roleAccess} 
                                formik={formik}
                            />
                            <VoucherSection 
                                roleAccess={roleAccess} 
                                formik={formik}
                                toggleVoucherModal={toggleVoucherModal} 
                                toggleDeleteVoucherModal={toggleDeleteVoucherModal}
                                setSelectedVoucher={setSelectedVoucher}
                            />
                        </div>
                    </div>
                    {
                        (formik.values.category === "One Time Channel Delivery" || formik.values.apiType === "Channel") &&
                        <div>
                            <div className="ml-auto w-max sticky top-6">
                                <div className="ml-4 bg-white rounded-lg py-5 px-6 shadow-md sticky w-80">
                                    <p className="text-lg font-semibold">{formik.values.currentDistributionMethods} Preview</p>
                                    <hr className="text-neutral30 mt-2 mb-4"/>
                                    <div className="flex justify-center">
                                        <CustomPhone 
                                            mode={formik.values.currentDistributionMethods ? formik.values.currentDistributionMethods : "Empty"}
                                            data={
                                                formik.values.currentDistributionMethods === "Whatsapp" ? formik.values.messageWhatsapp : 
                                                formik.values.currentDistributionMethods === "SMS" ? formik.values.messageSMS : 
                                                formik.values.currentDistributionMethods === "Email" ? formik.values.messageEmail :
                                                ""
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <div style={{width: 'calc(100% - 350px)', marginTop:"-590px"}}>
                                {
                                    formik.values.category === "One Time Channel Delivery" &&
                                    <RecipientList 
                                        roleAccess={roleAccess}
                                        formik={formik}
                                        toggleAddRecipientSingleModal={toggleAddRecipientSingleModal}
                                        toggleAddRecipientBulkModal={toggleAddRecipientBulkModal}
                                        toggleDeleteRecipientModal={toggleDeleteRecipientModal}
                                    />
                                }
                                <div>
                                    <DistributionMethod 
                                        roleAccess={roleAccess}
                                        formik={formik}
                                    />
                                </div>
                                {
                                    formik.values.apiType === "Channel" &&
                                    <div className="h-80 w-full mb-12"></div>
                                }
                            </div>
                        </div>
                    }
                </div>
                <Footer 
                    titleLeftButton='Cancel'
                    titleRightButton='Submit'
                    modeLeftButton="outline"
                    modeRightButton="primary"
                    isActiveLeftButton={true}
                    isActiveRightButton={true}
                    onClickLeftButton={toggleCancelModal}
                    onClickRightButton={formik.handleSubmit}
                />
                <ModalState 
                    title="Do you want to cancel?" 
                    subtitle={isValidCampaignDraft() ? "Are you sure you want to save data to draft?" : "The information you filled in has not been saved and will be lost if you cancel this process."}
                    isOpen={cancelModalIsOpen} 
                    onClose={toggleCancelModal}
                    type='default'
                    titleButtonLeft='Back'
                    titleButtonRight={isValidCampaignDraft() ? "Yes, sure" : 'Cancel'}
                    leftAction={toggleCancelModal}
                    rightAction={() => {
                        if (isValidCampaignDraft()) {
                            submitDraftCampaign(formik.values)
                            toggleCancelModal()
                        }
                        else {
                            handleNavigateToDashboard()
                        }
                    }}
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
                />
            </div>
        }
    </>
  );
};

export default AddCampaign;