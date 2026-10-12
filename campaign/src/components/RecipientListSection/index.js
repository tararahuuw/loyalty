import React, { useEffect, useRef, useState } from 'react'
import ModalButton from '../modalbutton'
import { ModalResult, ModalState, SearchDropdown } from 'sprint-asia-custom-component'
import RadioButton from '../radiobutton'
import { PiNotePencil, PiTrash } from 'react-icons/pi'
import DataTable from '../DataTable'
import { useDisclosure } from '../../hooks/useDisclosure'
import SingleRecipientModal from '../SingleRecipientModal'
import BulkRecipientModal from '../BulkRecipientModal'
import {formatPrefixPhoneNumber} from "../../utils/index"

const RecipientListSection = ({
    roleAccess,
    formik,
}) => {
    const { isOpen: editRecipientModalIsOpen, toggle: toggleEditRecipientModal } = useDisclosure(false);
    const { isOpen: deleteRecipientModalIsOpen, toggle: toggleDeleteRecipientModal } = useDisclosure(false);
    const { isOpen: sigleRecipientModalIsOpen, toggle: toggleSingleRecipientModal } = useDisclosure(false);
    const { isOpen: bulkRecipientModalIsOpen, toggle: toggleBulkRecipientModal } = useDisclosure(false);
    const [flagResult, setFlagResult] = useState("success");
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [dataCurrent, setDataCurrent] = useState();
    const [dataFilterSearch, setDataFilterSearch] = useState({
        option: "Voucher Name",
        value: "name",
    });
    const [dataSearch, setDataSearch] = useState("");
    const [dataRecipients, setDataRecipients] = useState([]);
    const dataOptions = [
        {
          option: "Voucher Name",
          value: "name",
        },
        {
          option: "Voucher ID",
          value: "id",
        },
        {
          option: "Phone Number",
          value: "phoneNumber",
        },
        {
          option: "Email",
          value: "email",
        },
    ];
    const columns = [
        {
            header: "Recipient Data",
            assessor: "recipientdata",
            Cell: (row) => {
                return (
                    <div>
                        <p className="font-semibold text-black text-sm">{row.name}</p>
                        {
                            row.phoneNumber &&
                            <p className="font-normal text-neutral300 text-xs">{formatPrefixPhoneNumber(row.phoneNumber)}</p>
                        }
                        {
                            row.email &&
                            <p className="font-normal text-neutral300 text-xs">{row.email}</p>
                        }
                    </div>
                );
            },
        },
        {
            header: "Distribution",
            assessor: "distribution",
            Cell: (row) => {
                return (
                    <div>
                        <p className="font-normal text-neutral300 text-xs">
                            {
                                row.channels.map((value, index) => {
                                    return (
                                        <span id={index} key={index}>
                                            {value}
                                            {index !== row.channels.length - 1 && ', '}
                                        </span>
                                    );
                                })
                            }
                        </p>
                    </div>
                )
            },
        },
        {
            header: "Voucher Data",
            assessor: "voucherdata",
            Cell: (row) => {
                return (
                    <div>
                        <p className="font-semibold text-black text-sm">{row.voucherName || "-" }</p>
                        <p className="font-normal text-neutral300 text-xs">{row.id || "-"}</p>
                    </div>
                )
            },
        },
        !(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") && 
        {
            header: "Action",
            Cell: (row) => {
                return (
                    <div className="flex">
                        <div onClick={() => handleEditRecipientModal(row)}>
                            <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
                        </div>
                        <div onClick={() => handleDeleteDataTable(row)}>
                            <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
                        </div>
                    </div>
                );
            },
        },
    ];

    function handleEditRecipientModal(value) {
        toggleEditRecipientModal()
        setDataCurrent(value)
    }

    const previousRecipientsRef = useRef([]);
    
    function fisherYatesShuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function assignVouchersToRecipients(vouchers, recipients) {
        // Buat salinan mendalam dari vouchers agar tidak memengaruhi array asli
        let shuffledVouchers = fisherYatesShuffle(vouchers.map(voucher => ({ ...voucher })));
        let updatedRecipients = recipients.map(recipient => ({ ...recipient }));
    
        const numberOfRecipients = updatedRecipients.length;
    
        for (let i = 0; i < numberOfRecipients; i++) {
            let assignedVoucher = null;
    
            // Cari voucher yang dapat diberikan
            for (let j = 0; j < shuffledVouchers.length; j++) {
                const voucher = shuffledVouchers[j];
    
                // Jika type adalah "PPOB Voucher", langsung gunakan tanpa memeriksa stok
                if (voucher.voucherType === "PPOB Voucher" || voucher.stock > 0) {
                    assignedVoucher = voucher;
    
                    // Hanya kurangi stok jika bukan "PPOB Voucher"
                    if (voucher.voucherType !== "PPOB Voucher") {
                        assignedVoucher.stock--;
                    }
                    break;
                }
            }
    
            // Jika ada voucher yang bisa diberikan, tambahkan ke recipient
            if (assignedVoucher) {
                updatedRecipients[i].id = assignedVoucher.id;
                updatedRecipients[i].voucherName = assignedVoucher.voucherName;
            } else {
                // Jika tidak ada voucher yang tersedia, kosongkan
                updatedRecipients[i].id = null;
                updatedRecipients[i].voucherName = null;
            }
        }
    
        return updatedRecipients;
    }

    function handleDeleteDataTable(value) {
        toggleDeleteRecipientModal()
        setDataCurrent(value)
    }

    function handleDeleteRecipient() {
        const updatedData = formik.values.recipients.filter(item => item !== dataCurrent);
        formik.setFieldValue('recipients', updatedData);
        toggleDeleteRecipientModal();
    }

    function handleFilterData() {
        const searchTerm = dataSearch.toLowerCase();
        
        const newRecipients = formik.values.recipients.filter(voucher => {
            if (dataFilterSearch.value === "name") {
                return voucher.voucherName.toLowerCase().includes(searchTerm);
            }
            if (dataFilterSearch.value === "id") {
                return voucher.id.toLowerCase().includes(searchTerm);
            }
            if (dataFilterSearch.value === "phoneNumber") {
                return voucher.phoneNumber.toString().includes(searchTerm);
            }
            if (dataFilterSearch.value === "email") {
                return voucher.email.toString().includes(searchTerm);
            }
            return false;
        });
    
        setDataRecipients(newRecipients);
    }

    function handleMappingDistributionMethod() {
        const hasWhatsapp = formik.values.recipients.some(recipient => recipient.channels.includes("Whatsapp"));
        const hasSMS = formik.values.recipients.some(recipient => recipient.channels.includes("SMS"));
        const hasEmail = formik.values.recipients.some(recipient => recipient.channels.includes("Email"));

        formik.setFieldValue("channelWhatsapp", hasWhatsapp)
        formik.setFieldValue("channelSMS", hasSMS)
        formik.setFieldValue("channelEmail", hasEmail)
        formik.setFieldValue("methodWhatsapp", hasWhatsapp ? "Template" : null)
        formik.setFieldValue("methodSMS", hasSMS ? "Template" : null)
        formik.setFieldValue("methodEmail", hasEmail ? "Template" : null)

        if (hasWhatsapp) {
            formik.setFieldValue("currentDistributionMethods", "Whatsapp")
        }
        else if (hasSMS) {
            formik.setFieldValue("currentDistributionMethods", "SMS")
        }
        else if (hasEmail) {
            formik.setFieldValue("currentDistributionMethods", "Email")
        }
        else {
            formik.setFieldValue("currentDistributionMethods", null)
        }
    }

    function handlePopUpErrorFile(error) {
        toggleBulkRecipientModal()
        if (error === "Protected File") {
            handleOpenModalResult("failed", "Sorry, unable to adding recipient list at the moment due to the data uploaded is contains protected data.")
        }
        else {
            handleOpenModalResult("failed", "Please check the format of the file to be uploaded and ensure it complies with the requirements.")
        }
    }

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

    useEffect(() => {
        if (
            formik.values.recipientType === "Random Voucher" &&
            formik.values.recipients.length > 0 &&
            JSON.stringify(previousRecipientsRef.current) !== JSON.stringify(formik.values.recipients)
        ) {
            const newRecipients = assignVouchersToRecipients(formik.values.vouchers, formik.values.recipients);
            formik.setFieldValue("recipients", newRecipients, false);
            previousRecipientsRef.current = formik.values.recipients;
        }
    }, [formik.values.vouchers, formik.values.recipients]); 

    useEffect(() => {
        if (formik.values.recipientType === "Random Voucher") {
            const newRecipients = assignVouchersToRecipients(formik.values.vouchers, formik.values.recipients);
            formik.setFieldValue("recipients", newRecipients, false);
        }
    }, [formik.values.recipientType])

    useEffect(() => {
        setDataRecipients(formik.values.recipients)
        setDataSearch("")
        handleMappingDistributionMethod()
    }, [formik.values.recipients])

    useEffect(() => {
        if (dataSearch !== "") {
            handleFilterData();
        } else {
            setDataRecipients(formik.values.recipients);
        }
    }, [dataSearch, dataFilterSearch]);

  return (
    <>
        <div className='mb-2 bg-white rounded-lg py-5 px-6 shadow-md mb-4'>
            <p className='font-semibold text-black text-lg'>Recipient List</p>
            <hr className='text-neutral30'/>
            <div className={`${(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") ? "pointer-events-none" : "pointer-events-auto"} grid grid-cols-2 my-4`}>
                <div>
                    <RadioButton
                        title="Specific Voucher"
                        subtitle="Choose specific recipients from your list to distribute the voucher."
                        name="RecipientType"
                        value="Specific Voucher"
                        checked={formik.values.recipientType === "Specific Voucher"}
                        onChange={(e) => formik.setFieldValue("recipientType", e.target.value)}
                    />
                </div>
                <div>
                    <RadioButton
                        title="Random Voucher"
                        subtitle="Select recipients randomly from your list to distribute the voucher."
                        name="RecipientType"
                        value="Random Voucher"
                        checked={formik.values.recipientType === "Random Voucher"}
                        onChange={(e) => formik.setFieldValue("recipientType", e.target.value)}
                    />
                </div>
            </div>
            <div>
                <div className="flex justify-between items-center w-full pb-3">
                    <div>
                        <SearchDropdown
                            options={dataOptions}
                            placeholderSearch="Search Here"
                            filterDropdown={dataFilterSearch}
                            setFilterDropdown={setDataFilterSearch}
                            filterSearch={dataSearch}
                            onEnterPress={setDataSearch}
                        />
                    </div>
                    {
                        !(formik.values.status === "Active" || formik.values.status === "Scheduled" || formik.values.status === "Inactive") &&
                        <ModalButton 
                            title="+ Add Recipient" 
                            data={
                                [
                                    {
                                        title: "Add Single",
                                        action: toggleSingleRecipientModal
                                    },
                                    {
                                        title: "Add Bulk",
                                        action: toggleBulkRecipientModal
                                    },
                                ]
                            }
                            disabled={formik.values.vouchers.length === 0}
                        />
                    }
                </div>
                <div className="drop-shadow">
                    <DataTable
                        staticData={dataRecipients}
                        columns={columns}
                        options={{pagination: true, isRounded: true}}
                        onClickRow={() => {}}
                    />
                </div>
            </div>
        </div>
        <ModalState
            title="Delete Recipient?"
            subtitle="Are you sure you want to delete this Recipient?"
            isOpen={deleteRecipientModalIsOpen}
            onClose={toggleDeleteRecipientModal}
            type="danger"
            titleButtonRight="Delete"
            leftAction={toggleDeleteRecipientModal}
            rightAction={handleDeleteRecipient}
        />
        <SingleRecipientModal 
            isOpen={sigleRecipientModalIsOpen}
            title="Add Recipient"
            roleAccess={roleAccess}
            formik={formik}
            onClose={toggleSingleRecipientModal}
        />
        <SingleRecipientModal 
            isOpen={editRecipientModalIsOpen}
            title="Edit Recipient"
            roleAccess={roleAccess}
            formik={formik}
            onClose={toggleEditRecipientModal}
            currentData={dataCurrent}
            isEdited
        />
        <BulkRecipientModal 
            isOpen={bulkRecipientModalIsOpen}
            title="Import to upload recipient"
            roleAccess={roleAccess}
            formik={formik}
            onClose={toggleBulkRecipientModal}
            handlePopUpErrorFile={e => handlePopUpErrorFile(e)}
        />
        <ModalResult
            subtitle={dataSubtitleModal}
            type={flagResult}
            isOpen={isModalOpenResult}
        />
    </>
  )
}

export default RecipientListSection