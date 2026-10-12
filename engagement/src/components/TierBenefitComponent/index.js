import { Trash } from '@phosphor-icons/react';
import React, { useState } from 'react'
import { PiCaretDown, PiCaretUp, PiCoins, PiDotsSixVertical, PiPercent, PiTrash, PiX } from "react-icons/pi";
import { DangerButton, DropdownText, PrimaryButton, TextArea, TextInput } from 'sprint-asia-custom-component';

const TierBenefitComponent = ({
    onDeleteData,
    formik,
    currentIndex,
}) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div>
            {
                isOpen ?
                    <div className='bg-primary50 p-4 rounded-lg my-2'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <PiDotsSixVertical size={24} />
                                <p className='ml-2 font-semibold'>Benefit {currentIndex + 1}</p>
                            </div>
                            <PiCaretUp className='cursor-pointer' onClick={() => setIsOpen(false)} />
                        </div>
                        <div className='bg-white p-4 mt-4 rounded-lg'>
                            <div className='mt-2'>
                                <TextInput
                                    title="Benefit Title"
                                    placeholder="e.g, Platinum, Diamond"
                                    onChangeInput={(e) => {
                                        formik.setFieldValue(`benefit[${currentIndex}].benefitTitle`, e.target.value);
                                        formik.setFieldTouched(`benefit[${currentIndex}].benefitTitle`, true, false);
                                    }}
                                    footer={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitTitle || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitTitle
                                        )
                                            ? formik.errors.benefit[currentIndex]?.benefitTitle
                                            : null
                                    }
                                    mode={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitTitle || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitTitle
                                        )
                                            ? "danger"
                                            : "white"
                                    }
                                    value={formik.values.benefit[currentIndex]?.benefitTitle}
                                />
                            </div>
                            <div className='mt-2'>
                                <TextArea
                                    title="Benefit Description"
                                    placeholder="e.g, Platinum, Diamond"
                                    onChangeInput={(e) => {
                                        formik.setFieldValue(`benefit[${currentIndex}].benefitDescription`, e.target.value);
                                        formik.setFieldTouched(`benefit[${currentIndex}].benefitDescription`, true, false);
                                    }}
                                    footer={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitDescription || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitDescription
                                        )
                                            ? formik.errors.benefit[currentIndex]?.benefitDescription
                                            : null
                                    }
                                    mode={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitDescription || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitDescription
                                        )
                                            ? "danger"
                                            : "white"
                                    }
                                    value={formik.values.benefit[currentIndex]?.benefitDescription}
                                />
                            </div>
                            <div className='flex items-center justify-center mt-4'>
                                <DropdownText
                                    title="Benefit Type"
                                    placeholder="Choose Benefit Type"
                                    options={
                                        formik.values.benefit.length === 0
                                            ? [
                                                { option: "Cashback Rewards", value: "Cashback Rewards" },
                                                { option: "Percentage Discount", value: "Percentage Discount" },
                                                { option: "Points Multiplier", value: "Points Multiplier" }
                                            ]
                                            : [
                                                { option: "Cashback Rewards", value: "Cashback Rewards" },
                                                { option: "Percentage Discount", value: "Percentage Discount" },
                                                { option: "Points Multiplier", value: "Points Multiplier" }
                                            ].filter(opt =>
                                                !formik.values.benefit
                                                    .filter((_, i) => i !== currentIndex)
                                                    .map(b => b.benefitType)
                                                    .includes(opt.value)
                                            )
                                    }
                                    onSelect={(e) => {
                                        formik.setFieldValue(`benefit[${currentIndex}].benefitType`, e.value);
                                    }}
                                    footer={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitType || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitType
                                        )
                                            ? formik.errors.benefit[currentIndex]?.benefitType
                                            : null
                                    }
                                    mode={
                                        (
                                            (formik.touched.benefit?.[currentIndex]?.benefitType || formik.submitCount > 0) &&
                                            formik.errors.benefit?.[currentIndex]?.benefitType
                                        )
                                            ? "danger"
                                            : "white"
                                    }
                                    currentOption={formik.values.benefit[currentIndex]?.benefitType}
                                />
                                <div className='ml-4 w-full'>
                                    <TextInput
                                        title="Benefit Value"
                                        placeholder={"Input Benefit Value"}
                                        onChangeInput={(e) => {
                                            formik.setFieldValue(`benefit[${currentIndex}].benefitValue`, parseInt(e.target.value, 10));
                                            formik.setFieldTouched(`benefit[${currentIndex}].benefitValue`, true, false);
                                        }}
                                        type='number'
                                        minimum={0}
                                        footer={
                                            (
                                                (formik.touched.benefit?.[currentIndex]?.benefitValue || formik.submitCount > 0) &&
                                                formik.errors.benefit?.[currentIndex]?.benefitValue
                                            )
                                                ? formik.errors.benefit[currentIndex]?.benefitValue
                                                : null
                                        }
                                        mode={
                                            (
                                                (formik.touched.benefit?.[currentIndex]?.benefitValue || formik.submitCount > 0) &&
                                                formik.errors.benefit?.[currentIndex]?.benefitValue
                                            )
                                                ? "danger"
                                                : "white"
                                        }
                                        value={formik.values.benefit[currentIndex]?.benefitValue}
                                        rightAdornment={
                                            formik.values.benefit[currentIndex]?.benefitType === "Percentage Discount" ? <PiPercent /> :
                                                formik.values.benefit[currentIndex]?.benefitType === "Points Multiplier" ? <PiX /> :
                                                    formik.values.benefit[currentIndex]?.benefitType === "Cashback Rewards" ? <PiPercent /> : null
                                        }
                                    />
                                </div>
                            </div>
                            <div className='flex justify-end cursor-pointer my-4'>
                                <DangerButton
                                    title={
                                        <div className='text-white flex items-center'>
                                            <PiTrash />
                                            <p className='ml-2'>Delete</p>
                                        </div>
                                    }
                                    onClick={onDeleteData}
                                />
                            </div>
                        </div>
                    </div>
                    :
                    <div className='bg-white p-4 rounded-lg my-2 border-2 border-neutral40'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <PiDotsSixVertical size={24} className='cursor-pointer' />
                                <p className='ml-2'>Benefit {currentIndex + 1}</p>
                            </div>
                            <PiCaretDown className='cursor-pointer' onClick={() => setIsOpen(true)} />
                        </div>
                    </div>
            }
        </div>
    )
}

export default TierBenefitComponent