import React, { useState } from 'react'
import { DropdownText, TextInput, TextArea } from 'sprint-asia-custom-component'
import { useFetch } from '../../hooks/useFetch';
import { GetAllClient, GetAllDivisionByClientId } from '../../service/usermanagement/endpoint';
import DateTimePicker from '../DateTimePicker';
import { useEffect } from 'react';
import moment from 'moment';

const BasicInformationSection = ({
    roleAccess,
    formik,
}) => {
    const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
    const { data: divisions } = useFetch(
        formik.values.clientId && GetAllDivisionByClientId,
        "divisions",
        [],
        {
          clientId: formik.values.clientId,
        }
    );

    useEffect(() => {
        if (formik.values.type === "No Period") {
            formik.setFieldValue("startDate", "")
            formik.setFieldValue("endDate", "")
        }
    }, [formik.values.type])

    useEffect(() => {
        if (formik.values.category === "One Time Channel Delivery" || formik.values.category === "Export Data") {
            formik.setFieldValue("apiType", "")
        }
    }, [formik.values.category])

  return (
    <div className='mb-4 bg-white rounded-lg py-5 px-6 shadow-md'>
        <p className='font-semibold text-black text-lg'>Basic Information</p>
        <hr className='text-neutral30'/>
        <div className='flex justify-between py-4'>
            <div class="grid grid-cols-1 gap-4 w-full">
                <TextInput
                    title="Campaign Name"
                    placeholder="Input Campaign Name"
                    onChangeInput={(e) => {
                        formik.setFieldValue("name", e.target.value);
                        formik.setFieldTouched("name", true, false);
                    }}
                    footer={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? formik.errors.name : null}
                    mode={(formik.touched.name || formik.submitCount > 0) && formik.errors.name ? "danger" : "default"}
                    isRequired
                    value={formik.values.name}
                />
            </div>
        </div>
        <div className='flex justify-between pb-4'>
            <div class="grid grid-cols-2 gap-4 w-full">
                <DropdownText
                    title="Type"
                    placeholder="Select Type"
                    options={[
                        { option: "Period", value: "Period" },
                        { option: "No Period", value: "No Period" },
                    ]}
                    isRequired
                    onSelect={(e) => {
                        formik.setFieldValue("type", e.value);
                        formik.setFieldTouched("type", true, false);
                    }}
                    footer={(formik.touched.type || formik.submitCount > 0) && formik.errors.type ? formik.errors.type : null}
                    mode={(formik.touched.type || formik.submitCount > 0) && formik.errors.type ? "danger" : "default"}
                    currentOption={formik.values.type}
                    isEdited={
                        (
                            formik.values?.status === "Active" ||
                            formik.values?.status === "Inactive" ||
                            formik.values?.status === "Scheduled"
                        ) ? false : true
                    }
                />
                <DropdownText
                    title="Category"
                    placeholder="Select Category"
                    options={[
                        { option: "One Time Channel Delivery", value: "One Time Channel Delivery" },
                        { option: "API Distribution", value: "API Distribution" },
                        { option: "Export Data", value: "Export Data" },
                    ]}
                    isRequired
                    onSelect={(e) => {
                        formik.setFieldValue("category", e.value);
                        formik.setFieldTouched("category", true, false);
                    }}
                    footer={(formik.touched.category || formik.submitCount > 0) && formik.errors.category ? formik.errors.category : null}
                    mode={(formik.touched.category || formik.submitCount > 0) && formik.errors.category ? "danger" : "default"}
                    currentOption={formik.values.category}
                    isEdited={formik.values?.status ? false : true}
                />
                {
                    formik.values.category === "API Distribution" &&
                    <DropdownText
                        title="API Type"
                        placeholder="Select API Type"
                        options={[
                            { option: "Channel", value: "Channel" },
                            { option: "No Channel", value: "No Channel" },
                        ]}
                        isRequired
                        onSelect={(e) => {
                            formik.setFieldValue("apiType", e.value);
                            formik.setFieldTouched("apiType", true, false);
                        }}
                        footer={(formik.touched.apiType || formik.submitCount > 0) && formik.errors.apiType ? formik.errors.apiType : null}
                        mode={(formik.touched.apiType || formik.submitCount > 0) && formik.errors.apiType ? "danger" : "default"}
                        currentOption={formik.values.apiType}
                        isEdited={
                            (
                                formik.values?.status === "Active" ||
                                formik.values?.status === "Inactive" ||
                                formik.values?.status === "Scheduled"
                            ) ? false : true
                        }
                    />
                }
                {
                    formik.values.type === "Period" &&
                    <>
                        <DateTimePicker
                            title="Start Date Period"
                            placeholder="Select Start Date"
                            isRequired
                            onChange={(e) => {
                                formik.setFieldValue("startDate", e)
                                formik.setFieldTouched("startDate", true, false);
                            }}
                            footer={(formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate ? formik.errors.startDate : null}
                            mode={(formik.touched.startDate || formik.submitCount > 0) && formik.errors.startDate ? "danger" : "default"}
                            value={formik.values.startDate}
                            className="w-full"
                            disabled={
                                (
                                    formik.values?.status === "Active" ||
                                    formik.values?.status === "Inactive" ||
                                    formik.values?.status === "Scheduled"
                                ) ? true : false
                            }
                            defaultTime="00:00"
                        />
                        <DateTimePicker
                            title="End Date Period"
                            placeholder="Select End Date"
                            isRequired
                            onChange={(e) => {
                                formik.setFieldValue("endDate", e)
                                formik.setFieldTouched("endDate", true, false);
                            }}
                            footer={(formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate ? formik.errors.endDate : null}
                            mode={(formik.touched.endDate || formik.submitCount > 0) && formik.errors.endDate ? "danger" : "default"}
                            value={formik.values.endDate}
                            disabled={
                                (
                                    formik.values?.status === "Active" ||
                                    formik.values?.status === "Inactive" ||
                                    formik.values?.status === "Scheduled"
                                ) ? true : false
                            }
                            defaultTime="23:59"
                            className={`${formik.values.startDate ? "pointer-events-auto" : "pointer-events-none"} w-full`}
                        />
                    </>
                }
                {
                    ["System Administrator", "Business Administrator", "Business Support"].some(role => roleAccess.includes(role)) &&
                    <DropdownText
                        title="Client"
                        placeholder="Select Client"
                        options={clients?.data?.map(({ name, id }) => ({
                            option: name,
                            value: id,
                        }))}
                        isRequired
                        onSelect={(e) => {
                            formik.setFieldValue("clientId", e.value);
                            formik.setFieldTouched("clientId", true, false);
                        }}
                        footer={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? formik.errors.clientId : null}
                        mode={(formik.touched.clientId || formik.submitCount > 0) && formik.errors.clientId ? "danger" : "default"}
                        currentOption={formik.values.clientId}
                        isEdited={
                            (
                                formik.values?.status === "Active" ||
                                formik.values?.status === "Inactive" ||
                                formik.values?.status === "Scheduled"
                            ) ? false : true
                        }
                    />
                }
                <DropdownText
                    title="Division"
                    placeholder="Select Division"
                    options={divisions?.data?.map(({ name, id }) => ({
                        option: name,
                        value: id,
                    }))}
                    isRequired
                    onSelect={(e) => {
                        formik.setFieldValue("divisionId", e.value);
                        formik.setFieldTouched("divisionId", true, false);
                    }}
                    footer={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? formik.errors.divisionId : null}
                    mode={(formik.touched.divisionId || formik.submitCount > 0) && formik.errors.divisionId ? "danger" : "default"}
                    currentOption={formik.values.divisionId}
                    isEdited={
                        (
                            formik.values?.status === "Active" ||
                            formik.values?.status === "Inactive" ||
                            formik.values?.status === "Scheduled"
                        ) ? false : true
                    }
                />
            </div>
        </div>
        <div className='flex justify-between'>
            <div class="grid grid-cols-1 gap-4 w-full">
                <TextArea 
                    title="Campaign Description"
                    placeholder="Input Campaign Description"
                    onChangeInput={(e) => {
                        formik.setFieldValue("description", e.target.value);
                        formik.setFieldTouched("description", true, false);
                    }}
                    footer={(formik.touched.description || formik.submitCount > 0) && formik.errors.description ? formik.errors.description : null}
                    mode={(formik.touched.description || formik.submitCount > 0) && formik.errors.description ? "danger" : "default"}
                    isRequired
                    value={formik.values.description}
                />
            </div>
        </div>
    </div>
  )
}

export default BasicInformationSection