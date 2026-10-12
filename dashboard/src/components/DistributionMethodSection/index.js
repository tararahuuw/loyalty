import React, { useEffect, useState } from 'react'
import { Chip, DropdownText, TextArea } from 'sprint-asia-custom-component'
import RadioButton from '../radiobutton';
import LogoEmptyData from "../../assets/images/logo_empty_box.png"
import { GetTemplateMessageSandeza } from '../../service/campaignmanagement/endpoint';

const DistributionMethodSection = ({
    formik,
}) => {
    const [dataTemplateWhatsapp, setDataTemplateWhatsapp] = useState([])
    const [dataTemplateSMS, setDataTemplateSMS] = useState([])
    const [dataTemplateEmail, setDataTemplateEmail] = useState([])

    async function handleGetTemplateDistribution(distribution) {
        try {
            const response = await GetTemplateMessageSandeza(distribution)
            if (distribution === "Whatsapp") {
                setDataTemplateWhatsapp(response.data)
            }
            else if (distribution === "SMS") {
                setDataTemplateSMS(response.data)
            }
            else if (distribution === "Email") {
                setDataTemplateEmail(response.data)
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        if (formik.values.apiType === "Channel") {
            formik.setFieldValue("channelWhatsapp", true)
            formik.setFieldValue("channelSMS", true)
            formik.setFieldValue("channelEmail", true)
            formik.setFieldValue("methodWhatsapp", "Template")
            formik.setFieldValue("methodSMS", "Template")
            formik.setFieldValue("methodEmail", "Template")
            formik.setFieldValue("currentDistributionMethods", "Whatsapp")
        }
        if (formik.values.apiType === "No Channel") {
            formik.setFieldValue("channelWhatsapp", false)
            formik.setFieldValue("channelSMS", false)
            formik.setFieldValue("channelEmail", false)
            formik.setFieldValue("methodWhatsapp", "")
            formik.setFieldValue("methodSMS", "")
            formik.setFieldValue("methodEmail", "")
            formik.setFieldValue("currentDistributionMethods", "")
        }
    },[formik.values.apiType])

    useEffect(() => {
        if (formik.values.channelWhatsapp === true) {
            handleGetTemplateDistribution("Whatsapp")
        }
        else {
            setDataTemplateWhatsapp([])
        }
    }, [formik.values.channelWhatsapp])

    useEffect(() => {
        if (formik.values.channelSMS === true) {
            handleGetTemplateDistribution("SMS")
        }
        else {
            setDataTemplateSMS([])
        }
    }, [formik.values.channelSMS])

    useEffect(() => {
        if (formik.values.channelEmail === true) {
            handleGetTemplateDistribution("Email")
        }
        else {
            setDataTemplateEmail([])
        }
    }, [formik.values.channelEmail])

    useEffect(() => {
        if (dataTemplateWhatsapp.length > 0 && formik.values.templateIdWhatsapp) {
            formik.setFieldValue("messageWhatsapp", dataTemplateWhatsapp.find(item => item.id === formik.values.templateIdWhatsapp).content)
        }
    }, [formik.values.templateIdWhatsapp])
    useEffect(() => {
        if (dataTemplateSMS.length > 0 && formik.values.templateIdSMS) {
            formik.setFieldValue("messageSMS", dataTemplateSMS.find(item => item.id === formik.values.templateIdSMS).content)
        }
    }, [formik.values.templateIdSMS])
    useEffect(() => {
        if (dataTemplateEmail.length > 0 && formik.values.templateIdEmail) {
            formik.setFieldValue("messageEmail", dataTemplateEmail.find(item => item.id === formik.values.templateIdEmail).content)
        }
    }, [formik.values.templateIdEmail])

  return (
    <div className='mb-2 bg-white rounded-lg py-5 px-6 shadow-md'>
        <p className='font-semibold text-black text-lg'>Distribution Method</p>
        <hr className='text-neutral30'/>
        {
            !formik.values.currentDistributionMethods && !(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ?
            <div className='w-full h-80 bg-white flex justify-center items-center'>
                <div>
                    <div className='flex justify-center mb-1'>
                        <img src={LogoEmptyData} className='w-32 h-32'/>
                    </div>
                    <p className='text-xl font-semibold text-black text-center'>Recipients Not Set</p>
                    <p className='text-sm font-semibold text-neutral300 text-center w-64'>Please add recipients and configure the distribution settings to proceed.</p>
                </div>
            </div>
            :
            <div>
                <div>
                    <div className='flex items-center my-2'>
                        {
                            formik.values.channelWhatsapp &&
                            <div className='mr-2'>
                                <Chip title='Whatsapp' type={formik.values.currentDistributionMethods === "Whatsapp" ? "primary" : "neutral"} onClick={() => formik.setFieldValue("currentDistributionMethods", "Whatsapp")}/>
                            </div>
                        }
                        {
                            formik.values.channelSMS &&
                            <div className="mr-2">
                                <Chip title='SMS' type={formik.values.currentDistributionMethods === "SMS" ? "primary" : "neutral"} onClick={() => formik.setFieldValue("currentDistributionMethods", "SMS")}/>
                            </div>
                        }
                        {
                            formik.values.channelEmail &&
                            <div className='mr-2'>
                                <Chip title='Email' type={formik.values.currentDistributionMethods === "Email" ? "primary" : "neutral"} onClick={() => formik.setFieldValue("currentDistributionMethods", "Email")}/>
                            </div>
                        }
                    </div>
                    <hr className='text-neutral30'/>
                </div>
                {
                    formik.values.currentDistributionMethods === "Whatsapp" &&
                    <div className={`${(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? "pointer-events-none" : "pointer-events-auto"}`}>
                        <div className="my-4">
                            <DropdownText
                                title="Theme"
                                placeholder="Select Theme"
                                options={dataTemplateWhatsapp.map(({ theme, id, language }) => ({
                                    option: `${theme} [${language === "en" ? "English" : "Indonesia"}]`,
                                    value: id,
                                }))}
                                isRequired
                                isEdited={(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? false : true}
                                onSelect={(e) => formik.setFieldValue("templateIdWhatsapp", e.value)}
                                currentOption={formik.values.templateIdWhatsapp}
                                footer={formik.errors.templateIdWhatsapp}
                                mode={formik.errors.templateIdWhatsapp ? "danger" : "default"}
                            />
                        </div>
                    </div>
                }
                {
                    formik.values.currentDistributionMethods === "SMS" &&
                    <div className={`${(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? "pointer-events-none" : "pointer-events-auto"}`}>
                        <div className="grid grid-cols-2 mt-4">
                            <RadioButton
                                title="Template"
                                subtitle="Select a pre-made template to quickly set up your voucher."
                                theme="methodSMS"
                                value="Template"
                                checked={formik.values.methodSMS === 'Template'}
                                onChange={(e) => {
                                    formik.setFieldValue("methodSMS", e.target.value)
                                    formik.setFieldValue("templateIdSMS", "")
                                    formik.setFieldValue("messageSMS", "")
                                }}
                            />
                            <RadioButton
                                title="Input Manual"
                                subtitle="Choose to manually input the details to customize your voucher."
                                theme="methodSMS"
                                value="Input Manual"
                                checked={formik.values.methodSMS === 'Input Manual'}
                                onChange={(e) => {
                                    formik.setFieldValue("methodSMS", e.target.value)
                                    formik.setFieldValue("templateIdSMS", "")
                                    formik.setFieldValue("messageSMS", "")
                                }}
                            />
                        </div>
                        {
                            formik.values.methodSMS === "Template" &&
                            <>
                                <div className="my-4">
                                    <DropdownText
                                        title="Theme"
                                        placeholder="Select Theme"
                                        options={dataTemplateSMS.map(({ theme, id, language }) => ({
                                            option: `${theme} [${language === "en" ? "English" : "Indonesia"}]`,
                                            value: id,
                                        }))}
                                        isRequired
                                        isEdited={(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? false : true}
                                        onSelect={(e) => formik.setFieldValue("templateIdSMS", e.value)}
                                        currentOption={formik.values.templateIdSMS}
                                        footer={formik.errors.templateIdSMS}
                                        mode={formik.errors.templateIdSMS ? "danger" : "default"}
                                    />
                                </div>
                            </>
                        }
                        {
                            formik.values.methodSMS === "Input Manual" &&
                            <div className="w-full mt-4">
                                <TextArea
                                    title="Greetings"
                                    isEdited={(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? false : true}
                                    placeholder="Input Greetings"
                                    onChangeInput={(e) => formik.setFieldValue("messageSMS", e.target.value)}
                                    footer={formik.errors.messageSMS}
                                    isRequired
                                    mode={formik.errors.messageSMS ? "danger" : "default"}
                                    value={formik.values.messageSMS}
                                />
                            </div>
                        }
                    </div>
                }
                {
                    formik.values.currentDistributionMethods === "Email" &&
                    <div className={`${(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? "pointer-events-none" : "pointer-events-auto"}`}>
                        <div className="grid grid-cols-2 mt-4">
                            <RadioButton
                                title="Template"
                                subtitle="Select a pre-made template to quickly set up your voucher."
                                theme="methodEmail"
                                value="Template"
                                checked={formik.values.methodEmail === 'Template'}
                                onChange={(e) => {
                                    formik.setFieldValue("methodEmail", e.target.value)
                                    formik.setFieldValue("templateIdEmail", "")
                                    formik.setFieldValue("messageEmail", "")
                                }}
                            />
                            <RadioButton
                                title="Input Manual"
                                subtitle="Choose to manually input the details to customize your voucher."
                                theme="methodEmail"
                                value="Input Manual"
                                checked={formik.values.methodEmail === 'Input Manual'}
                                onChange={(e) => {
                                    formik.setFieldValue("methodEmail", e.target.value)
                                    formik.setFieldValue("templateIdEmail", "")
                                    formik.setFieldValue("messageEmail", "")
                                }}
                            />
                        </div>
                        {
                            formik.values.methodEmail === "Template" &&
                            <>
                                <div className="my-4">
                                    <DropdownText
                                        title="Theme"
                                        placeholder="Select Theme"
                                        options={dataTemplateEmail.map(({ theme, id, language }) => ({
                                            option: `${theme} [${language === "en" ? "English" : "Indonesia"}]`,
                                            value: id,
                                        }))}
                                        isRequired
                                        isEdited={(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? false : true}
                                        onSelect={(e) => formik.setFieldValue("templateIdEmail", e.value)}
                                        currentOption={formik.values.templateIdEmail}
                                        footer={formik.errors.templateIdEmail}
                                        mode={formik.errors.templateIdEmail ? "danger" : "default"}
                                    />
                                </div>
                            </>
                        }
                        {
                            formik.values.methodEmail === "Input Manual" &&
                            <div className="w-full mt-4">
                                <TextArea 
                                    title="Greetings"
                                    isEdited={(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? false : true}
                                    placeholder="Input Greetings"
                                    onChangeInput={(e) => formik.setFieldValue("messageEmail", e.target.value)}
                                    footer={formik.errors.messageEmail}
                                    isRequired
                                    mode={formik.errors.messageEmail ? "danger" : "default"}
                                    value={formik.values.messageEmail}
                                />
                            </div>
                        }
                    </div>
                }
            </div>
        }
    </div>
  )
}

export default DistributionMethodSection