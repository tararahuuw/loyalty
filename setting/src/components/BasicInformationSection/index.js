import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import { Description, DropdownText } from 'sprint-asia-custom-component'
import { useFetch } from '../../hooks/useFetch';
import { GetAllClient } from '../../service/usermanagement/endpoint';
import { useEffect } from 'react';
import { GetDetailParameter } from '../../service/settingparametermanagement/endpoint';

const BasicInformationSection = ({ roleAccess, formik, isDetail = false, isEdit = false, isAdd = false, dropdownEdit = false, onClientIdChange }) => {
    const { id } = useParams();
    const { data: clients } = useFetch(GetAllClient, "clients", [], { roleAccess });
    const [clientName, setClientName] = useState("");
    const [clientId, setClientId] = useState("");

    useEffect(() => {
        const fetchDetailParameter = async () => {
            try {
                const response = await GetDetailParameter({ id });
                if (response?.clientName) {
                    setClientName(response.clientName);
                    setClientId(response.clientId);
                    if (!isAdd) {
                        onClientIdChange(response.clientId);
                    }
                }
            } catch (error) {
                console.error("Error fetching detail parameter:", error);
            }
        };

        if (id) {
            fetchDetailParameter();
        }
    }, [id]);

    return (
        <div className='mb-4 bg-white rounded-lg py-5 px-6 shadow-md'>
            <p className='font-semibold text-black text-lg'>Basic Information</p>
            <hr className='text-neutral30' />

            <div className='flex justify-between pb-4 mt-2'>
                <div className="grid grid-cols-3 gap-4 w-full">

                    {!isDetail ? (
                        <DropdownText
                            title="Client"
                            placeholder="Choose Client"
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
                            currentOption={
                                isAdd
                                    ? formik.values.clientId
                                    : isEdit
                                        ? clientId
                                        : formik.values.clientId
                            }
                            isEdited={isAdd}
                            isDisabled={isEdit}
                        />
                    ) : (
                        <Description
                            title={"Client"}
                            value={clientName || "-"}
                        />
                    )}

                </div>
            </div>
        </div>
    );
};

export default BasicInformationSection