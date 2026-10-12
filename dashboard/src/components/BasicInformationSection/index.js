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

    const handleStartDateChange = (date) => {
        formik.setFieldValue("startDate", date)
        validateDateRange(date, formik.values.endDate);
    };
    
    const handleEndDateChange = (date) => {
        formik.setFieldValue("endDate", date, false)
        validateDateRange(formik.values.startDate, date);
    };
    
    const validateDateRange = (start, end) => {
        if (start && end) {
          const startMoment = moment(start);
          const endMoment = moment(end);

          const diffInDays = endMoment.diff(startMoment, "days", true);
          if (diffInDays < 2) {
            formik.setFieldError("startDate", "End date must be at least 2 days after the start date.");
            formik.setFieldError("endDate", "End date must be at least 2 days after the start date.");
          } else {
            formik.setFieldError("startDate", "");
            formik.setFieldError("endDate", "");
          }
        }
    };

    useEffect(() => {
        if (formik.values.type === "No Period") {
            formik.setFieldValue("startDate", "")
            formik.setFieldValue("endDate", "")
        }
    }, [formik.values.type])

    useEffect(() => {
        if (formik.values.status === null && formik.values.endDate !== "") {
            formik.setFieldValue("endDate", "")
        }
    }, [formik.values.startDate])

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
                    onChangeInput={(e) => formik.setFieldValue("name", e.target.value)}
                    footer={formik.errors.name}
                    isRequired
                    mode={formik.errors.name ? "danger" : "default"}
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
                    onSelect={(e) => formik.setFieldValue("type", e.value)}
                    currentOption={formik.values.type}
                    footer={formik.errors.type}
                    isEdited={
                        (
                            formik.values?.status === "Active" ||
                            formik.values?.status === "Inactive" ||
                            formik.values?.status === "Scheduled"
                        ) ? false : true
                    }
                    mode={formik.errors.type ? "danger" : "default"}
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
                    onSelect={(e) => formik.setFieldValue("category", e.value)}
                    currentOption={formik.values.category}
                    footer={formik.errors.category}
                    isEdited={formik.values?.status ? false : true}
                    mode={formik.errors.category ? "danger" : "default"}
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
                        onSelect={(e) => formik.setFieldValue("apiType", e.value)}
                        currentOption={formik.values.apiType}
                        footer={formik.errors.apiType}
                        isEdited={
                            (
                                formik.values?.status === "Active" ||
                                formik.values?.status === "Inactive" ||
                                formik.values?.status === "Scheduled"
                            ) ? false : true
                        }
                        mode={formik.errors.apiType ? "danger" : "default"}
                    />
                }
                {
                    formik.values.type === "Period" &&
                    <>
                        <DateTimePicker
                            title="Start Date Period"
                            placeholder="Select Start Date"
                            footer={formik.errors.startDate}
                            isRequired
                            onChange={handleStartDateChange}
                            mode={
                                formik.errors.startDate
                                ? "danger"
                                : "default"
                            }
                            value={formik.values.startDate}
                            className="max-w-sm"
                            disabled={
                                (
                                    formik.values?.status === "Active" ||
                                    formik.values?.status === "Inactive" ||
                                    formik.values?.status === "Scheduled"
                                ) ? true : false
                            }
                            defaultTime="00:00"
                            minDate={moment().toDate()}
                        />
                        <DateTimePicker
                            title="End Date Period"
                            placeholder="Select End Date"
                            footer={formik.errors.endDate}
                            isRequired
                            onChange={handleEndDateChange}
                            mode={
                                formik.errors.endDate
                                ? "danger"
                                : "default"
                            }
                            minDate={formik.values.startDate}
                            value={formik.values.endDate}
                            disabled={
                                (
                                    formik.values?.status === "Active" ||
                                    formik.values?.status === "Inactive" ||
                                    formik.values?.status === "Scheduled"
                                ) ? true : false
                            }
                            defaultTime="23:59"
                            className={`${formik.values.startDate ? "pointer-events-auto" : "pointer-events-none"} max-w-sm`}
                        />
                    </>
                }
                {
                    <DropdownText
                        title="Client"
                        placeholder="Select Client"
                        options={clients?.data?.map(({ name, id }) => ({
                            option: name,
                            value: id,
                        }))}
                        isRequired
                        onSelect={(e) => formik.setFieldValue("clientId", e.value)}
                        currentOption={formik.values.clientId}
                        footer={formik.errors.clientId}
                        isEdited={
                            (
                                formik.values?.status === "Active" ||
                                formik.values?.status === "Inactive" ||
                                formik.values?.status === "Scheduled"
                            ) ? false : true
                        }
                        mode={formik.errors.clientId ? "danger" : "default"}
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
                    onSelect={(e) => formik.setFieldValue("divisionId", e.value)}
                    currentOption={formik.values.divisionId}
                    footer={formik.errors.divisionId}
                    isEdited={
                        (
                            formik.values?.status === "Active" ||
                            formik.values?.status === "Inactive" ||
                            formik.values?.status === "Scheduled"
                        ) ? false : true
                    }
                    mode={formik.errors.divisionId ? "danger" : "default"}
                />
            </div>
        </div>
        <div className='flex justify-between'>
            <div class="grid grid-cols-1 gap-4 w-full">
                <TextArea 
                    title="Campaign Description"
                    placeholder="Input Campaign Description"
                    onChangeInput={(e) => formik.setFieldValue("description", e.target.value)}
                    footer={formik.errors.description}
                    isRequired
                    mode={formik.errors.description ? "danger" : "default"}
                    value={formik.values.description}
                />
            </div>
        </div>
    </div>
  )
}

export default BasicInformationSection