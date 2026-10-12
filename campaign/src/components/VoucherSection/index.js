import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { PiTrash } from 'react-icons/pi';
import { ModalState, PrimaryButton, SearchDropdown } from 'sprint-asia-custom-component'
import DataTable from '../DataTable';
import { useDisclosure } from '../../hooks/useDisclosure';
import AddVoucher from '../AddVoucherSection';

const VoucherSection = ({
    roleAccess,
    formik,
    setSelectedVoucher
}) => {
    const { isOpen: deleteVoucherModalIsOpen, toggle: toggleDeleteVoucherModal } = useDisclosure(false);
    const { isOpen: deleteVoucherModalBulkIsOpen, toggle: toggleDeleteVoucherModalBulk } = useDisclosure(false);
    const { isOpen: deleteRecipientsModalIsOpen, toggle: toggleDeleteRecipientsModal } = useDisclosure(false);
    const { isOpen: deleteRecipientsModalBulkIsOpen, toggle: toggleDeleteRecipientsModalBulk } = useDisclosure(false);
    const { isOpen: addVoucherModalIsOpen, toggle: toggleAddVoucherModal } = useDisclosure(false);
    const [dataCurrent, setDataCurrent] = useState();
    const [dataSearch, setDataSearch] = useState("");
    const [dataFilterSearch, setDataFilterSearch] = useState({
        option: "Voucher Name",
        value: "name",
    });
    const [dataVoucher, setDataVoucher] = useState([])

    const dataOptions = [
        { option: "Voucher Name", value: "name" },
        { option: "Voucher ID", value: "id" },
        { option: "Price", value: "price" },
    ];

    const columns = [
        {
            header: "Voucher Data",
            assessor: "voucherdata",
            Cell: (row) => {
                return (
                <div className="flex">
                    <img src={`${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${row.voucherPhoto}`} className="mt-0.5 mr-2 w-16 h-10 rounded-md"/>
                    <div>
                        <p className="font-semibold text-black text-sm">{row.voucherName}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.voucherType} - {row.voucherCategory}</p>
                        <p className="font-normal text-neutral300 text-xs">{row.id}</p>
                        {
                            row.isOutOfStock &&
                            <p className="font-normal text-danger500 text-xs">Out of stock</p>
                        }
                        {
                            row.isInsufficientStock &&
                            <p className="font-normal text-danger500 text-xs">Insufficient Stock</p>
                        }
                    </div>
                </div>
                );
            },
        },
        {
            header: "Stock",
            assessor: "stock",
            Cell: (row) => {
                return (
                    <div>
                        <p className={`${row.voucherType === "PPOB Voucher" ? "text-success500" : row.stock < 50 ? "text-danger500" : "text-success500"} text-sm`}>{row.voucherType === "PPOB Voucher" ? "Unlimited" : row.stock}</p>
                    </div>
                )
            },
        },
        {
            header: "Price",
            assessor: "price",
            Cell: (row) => {
                return (
                    <div>
                        <p className="text-sm">Rp{row.price?.toLocaleString() || "-"}</p>
                    </div>
                )
            },
        },
        {
            header: "Validity Period",
            assessor: "validityPeriod",
            Cell: (row) => {
                return (
                    <div>
                        <p className="text-sm font-bold">{moment(row.createdAt).format("DD MMM YYYY")}</p>
                        <p className="text-sm">Until {moment(row.createdAt).format("DD MMM YYYY")}</p>
                    </div>
                )
            },
        },
        !(formik.values?.category === "One Time Channel Delivery" && (formik.values?.status === "Active" || formik.values?.status === "Scheduled"))  &&
        !(formik.values?.category === "Export Data" && (formik.values?.status === "Active" || formik.values?.status === "Scheduled")) &&
        {
            header: "Action",
            Cell: (row) => {
                return (
                    <div
                        className="flex justify-center"
                        onClick={() => {
                            if (!row.existingVoucher) {
                                handleDeleteDataTable(row);
                            }
                        }}
                    >
                        <PiTrash
                            size="24"
                            variant="Bold"
                            className={`${row.existingVoucher === true ? "text-neutral80" : "text-primary500"} cursor-pointer`}
                        />
                    </div>
                );
            },
        },
    ];

    function handleDeleteDataTable(value) {
        setDataCurrent(value)
        if (formik.values.recipients.length > 0) {
            toggleDeleteRecipientsModal()
        }
        else {
            toggleDeleteVoucherModal()
        }
    }

    function handleDeleteDataTableBulk() {
        if (formik.values.recipients.length > 0) {
            toggleDeleteRecipientsModalBulk()
        }
        else {
            toggleDeleteVoucherModalBulk()
        }
    }

    function handleDeleteVoucher() {
        const updatedData = formik.values.vouchers.filter(item => item !== dataCurrent);
        formik.setFieldValue('vouchers', updatedData);
        if (!deleteRecipientsModalIsOpen) {
            toggleDeleteVoucherModal();
        }
    }

    function handleDeleteVoucherBulk() {
        const uniqueData = formik.values.vouchers.filter((item1) => !checkedParent.some((item2) => item2 === item1));
        formik.setFieldValue("vouchers", uniqueData)
        if (!deleteRecipientsModalBulkIsOpen) {
            toggleDeleteVoucherModalBulk();
        }
    }

    const [checkedParent, setCheckedParent] = useState([])

    function handleFilterData() {
        const searchTerm = dataSearch.toLowerCase();
        
        const newVoucher = formik.values.vouchers.filter(voucher => {
            if (dataFilterSearch.value === "name") {
                return voucher.voucherName.toLowerCase().includes(searchTerm);
            }
            if (dataFilterSearch.value === "id") {
                return voucher.id.toLowerCase().includes(searchTerm);
            }
            if (dataFilterSearch.value === "price") {
                return voucher.price.toString().includes(searchTerm);
            }
            return false;
        });
    
        setDataVoucher(newVoucher);
    } 
    
    function handleDeleteRecipients() {
        formik.setFieldValue("recipients", [])
        handleDeleteVoucher()
        toggleDeleteRecipientsModal()
    }

    function handleDeleteRecipientsBulk() {
        formik.setFieldValue("recipients", [])
        handleDeleteVoucherBulk()
        toggleDeleteRecipientsModalBulk()
    }

    function handleCloseRecipientModal() {
        toggleDeleteRecipientsModal()
    }

    function handleCloseRecipientModalBulk() {
        toggleDeleteRecipientsModalBulk()
    }

    useEffect(() => {
        setDataVoucher(formik.values.vouchers)
        setDataSearch("")
    }, [formik.values.vouchers])

    useEffect(() => {
        if (dataSearch !== "") {
            handleFilterData();
        } else {
            setDataVoucher(formik.values.vouchers);
        }
    }, [dataSearch, dataFilterSearch]);

  return (
    <>
        <div className='mb-2 bg-white rounded-lg py-5 px-6 shadow-md'>
            <p className='font-semibold text-black text-lg'>Voucher</p>
            <hr className='text-neutral30 mb-4'/>
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
                        !(formik.values?.category === "One Time Channel Delivery" && (formik.values?.status === "Active" || formik.values?.status === "Scheduled"))  &&
                        !(formik.values?.category === "Export Data" && (formik.values?.status === "Active" || formik.values?.status === "Scheduled")) &&
                        <PrimaryButton 
                            title="+ Add Voucher" 
                            onClick={toggleAddVoucherModal} 
                            isActive={
                                formik.values?.status !== "Scheduled" &&
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
                                    formik.value?.apiType
                                ))
                            }
                        />
                    }
                </div>
                <div className="drop-shadow">
                    <DataTable
                        staticData={dataVoucher}
                        columns={columns}
                        options={{
                            pagination: false, 
                            checkable: (!(formik.values?.status === "Active" || formik.values?.status === "Scheduled" || formik.values?.status === "Inactive")), 
                            isRounded: true, 
                            scrollable: true
                        }}
                        setCheckedParent={setCheckedParent}
                        deleteBulkHandler={handleDeleteDataTableBulk}
                        onClickRow={(id, row) => {
                            setSelectedVoucher(row)
                        }}
                    />
                </div>
            </div>
        </div>
        <AddVoucher 
            roleAccess={roleAccess}
            isOpen={addVoucherModalIsOpen}
            onClose={toggleAddVoucherModal}
            formik={formik}
        />
        <ModalState
            title="Delete Voucher?"
            subtitle="Are you sure you want to delete this Voucher?"
            isOpen={deleteVoucherModalIsOpen}
            onClose={toggleDeleteVoucherModal}
            type="danger"
            titleButtonRight="Delete"
            leftAction={toggleDeleteVoucherModal}
            rightAction={handleDeleteVoucher}
        />
        <ModalState
            title="Delete Voucher?"
            subtitle="Are you sure you want to delete this Voucher?"
            isOpen={deleteVoucherModalBulkIsOpen}
            onClose={toggleDeleteVoucherModalBulk}
            type="danger"
            titleButtonRight="Delete"
            leftAction={toggleDeleteVoucherModalBulk}
            rightAction={handleDeleteVoucherBulk}
        />
        <ModalState
            title="Confirmation"
            subtitle="Are you sure you want to uncheck this distribution? However, your action would be to remove your data input."
            isOpen={deleteRecipientsModalIsOpen}
            onClose={handleCloseRecipientModal}
            type="primary"
            titleButtonRight="Yes, Sure"
            leftAction={handleCloseRecipientModal}
            rightAction={handleDeleteRecipients}
        />
        <ModalState
            title="Confirmation"
            subtitle="Are you sure you want to uncheck this distribution? However, your action would be to remove your data input."
            isOpen={deleteRecipientsModalBulkIsOpen}
            onClose={handleCloseRecipientModalBulk}
            type="primary"
            titleButtonRight="Yes, Sure"
            leftAction={handleCloseRecipientModalBulk}
            rightAction={handleDeleteRecipientsBulk}
        />
    </>
  )
}

export default VoucherSection