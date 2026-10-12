import React, { useState, useEffect } from "react";

import moment from "moment";
import _ from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import {
  Footer,
  ModalState,
  ModalLoading,
  ModalResult,
  CustomPhone,
  FilterDropdown,
  SearchDropdown,
  OutlineButton,
  Chip
} from "sprint-asia-custom-component";
import BasicInformationSection from "../../../components/DetailCampaign/BasicInformationSection"
import PercentageDistributionSection from "../../../components/DetailCampaign/PercentageDistributionSection"
import { useDisclosure } from "prezent/useDisclosure";
import DataTable from "../../../components/DataTable";
import { GetCampaignById, GetAllVoucherList, GetAllVoucherGenerated, DownloadVoucherGenerated } from "../../../service/campaignmanagement/endpoint";
import DatePicker from "prezent/DatePicker";
import { useFetch } from "prezent/useFetch";
import { PiCaretLeft, PiCaretRight, PiNotePencil } from "react-icons/pi";
import { GetAllVoucherCategory } from "../../../service/voucherManagement/endpoint";
import * as XLSX from 'xlsx'
import {formatPrefixPhoneNumber} from "../../../utils/index"

const DetailCampaign = ({ roleAccess, setTitleHeader }) => {
    const { id } = useParams();
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: cancelModalIsOpen, toggle: toggleCancelModal } = useDisclosure(false);
    const [flagResult, setFlagResult] = useState("success");
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const [isModalOpenResult, setIsModalOpenResult] = useState(false);
    const [dataFilterSearchVoucherList, setDataFilterSearchVoucherList] = useState({
        option: "Voucher Name",
        value: "voucherName",
    });
    const [dataFilterSearchVoucherGenerated, setDataFilterSearchVoucherGenerated] = useState({
        option: "Voucher Name",
        value: "voucherName",
    });
    const [dataSearchVoucherList, setDataSearchVoucherList] = useState("");
    const [dataSearchVoucherGenerated, setDataSearchVoucherGenerated] = useState("");
    const [dataFilterVoucherList, setDataFilterVoucherList] = useState({ type : [], category: []});
    const [dataFilterVoucherGenerated, setDataFilterVoucherGenerated] = useState({ distribution: [], type : [], category: []});
    const [selectedOptionsVoucherList, setSelectedOptionsVoucherList] = useState({ type : [], category: []});
    const [selectedOptionsVoucherGenerated, setSelectedOptionsVoucherGenerated] = useState({ distribution: [], type : [], category: []});
    const [currentVoucherPreview, setCurrentVoucherPreview] = useState(0)
    const { data } = useFetch(id && GetCampaignById, "campaign", [], { roleAccess, id });
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()

    const setSelectedFilterOptionsVoucherList = (options) => {
        setDataFilterVoucherList(options);
        setReRenderVoucherList(!reRenderVoucherList);
        setSelectedOptionsVoucherList(options);
    };
    
    const setSelectedFilterOptionsVoucherGenerated = (options) => {
        setDataFilterVoucherGenerated(options);
        setReRenderVoucherGenerated(!reRenderVoucherGenerated);
        setSelectedOptionsVoucherGenerated(options);
    };

    const dataOptionsVoucherList = [
        {
            option: "Voucher Name",
            value: "voucherName",
        },
        {
            option: "Voucher ID",
            value: "voucherID",
        },
    ]

    const dataOptionsVoucherGenerated = [
        {
            option: "Voucher Name",
            value: "voucherName",
        },
        {
            option: "Voucher ID",
            value: "voucherID",
        },
    ]

    const dataType = [
        { option: "Digital Voucher", value: "1" },
        { option: "PPOB Voucher", value: "2" },
    ];

    const dataDistribution = [
        { option: "Whatsapp", value: "Whatsapp" },
        { option: "Email", value: "Email" },
        { option: "SMS", value: "SMS" },
    ];

    const { data: dataCategoryVoucherList } = useFetch(dataFilterVoucherList?.type?.length > 0 && GetAllVoucherCategory, "categories", [], {
        roleAccess,
        voucherTypeCode: dataFilterVoucherList.type,
    });

    const { data: dataCategoryVoucherGenerated } = useFetch(dataFilterVoucherGenerated?.type?.length > 0 && GetAllVoucherCategory, "categories", [], {
        roleAccess,
        voucherTypeCode: dataFilterVoucherGenerated.type,
    });

    const [reRenderVoucherList, setReRenderVoucherList] = useState(false);
    const [reRenderVoucherGenerated, setReRenderVoucherGenerated] = useState(false);

    const navigateTo = useNavigate();

    const columnsVoucherList = [
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
            header: "Quantity",
            assessor: "quantity",
            Cell: (row) => {
                return (
                    <div>
                        <p className={`${row.voucherType === "PPOB Voucher" ? "text-success500" : row.qty < 50 ? "text-danger500" : "text-success500"} text-sm`}>{row.voucherType === "PPOB Voucher" ? "Unlimited" : row.qty}</p>
                    </div>
                )
            },
        },
        {
            header: "Redeemed",
            assessor: "redeemed",
            Cell: (row) => {
                return (
                    <div>
                        <p className={`${row.redeemedQty < 50 ? "text-danger500" : "text-success500"} text-sm`}>{row.redeemedQty}</p>
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
                        <p className="text-sm">Rp{row.price.toLocaleString('id-ID')}</p>
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
                        <p className="text-sm">{moment(row.startDate).format("DD MMM YYYY")} - {moment(row.endDate).format("DD MMM YYYY")}</p>
                    </div>
                )
            },
        },
    ];

    const columnsVoucherGenerated = [
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
                    </div>
                </div>
                );
            },
        },
        {
            header: "Recipient Data",
            assessor: "recipientdata",
            Cell: (row) => {
                return (
                    <div className="flex">
                        {
                            data?.data.category === "Export Data" ?
                            <p className="font-semibold text-black text-sm">-</p>
                            :
                            <div>
                                <p className="font-semibold text-black text-sm">{row.recipient?.name}</p>
                                <p className="font-normal text-neutral300 text-xs">{formatPrefixPhoneNumber(row.recipient?.phoneNumber)}</p>
                                <p className="font-normal text-neutral300 text-xs">{row.recipient?.email}</p>
                            </div>
                        }
                    </div>
                );
            },
        },
        (data?.data.apiType === "Channel" || data?.data.category === "One Time Channel Delivery") &&
        {
            header: "Distribution Method",
            assessor: "distributionMethod",
            Cell: (row) => {
                return (
                <div className="flex">
                    <div>
                        {
                            row.recipient?.channels?.includes("Whatsapp") &&
                            <p className="text-black text-sm">Whatsapp</p>
                        }
                        {
                            row.recipient?.channels?.includes("Email") &&
                            <p className="text-black text-sm">Email</p>
                        }
                        {
                            row.recipient?.channels?.includes("SMS") &&
                            <p className="text-black text-sm">SMS</p>
                        }
                    </div>
                </div>
                );
            },
        },
        {
            header: "Price",
            assessor: "price",
            Cell: (row) => {
                return (
                    <div>
                        <p className="text-sm">Rp{row.price.toLocaleString('id-ID')}</p>
                    </div>
                )
            },
        },
        {
            header: "Status",
            assessor: "status",
            Cell: (row) => {
                return <Chip title={row.status} type={row.status === "Redeemed" ? "success" : row.status == "Generated" ? "primary" : row.status == "Expired" ? "neutral" : "danger"} />;
            },
        },
    ];

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

    async function handleGetExportDataExcel() {
        try {
            toggleLoadingModal()
            const response = await DownloadVoucherGenerated(roleAccess, id);
            if (response.data !== null) {
                const rawData = response.data
                const transformedData = rawData.map((item) => ({
                    "Campaign id": id || "null",
                    "Voucher ref id": item.voucherID  || "null",
                    "Campaign name": data?.data.name  || "null",
                    "Voucher name": item.voucherName || "null",
                    "Denom": item.denom || "null",
                    "Voucher Price": item.price.toLocaleString('id-ID') || "null",
                    "Voucher URL": item.voucherUrl || "null",
                }));
                const worksheet = XLSX.utils.json_to_sheet(transformedData);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "campaign export data");
                const excelFile = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
                const blob = new Blob([excelFile], { type: "application/octet-stream" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${data?.data.name}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                toggleLoadingModal()
                handleOpenModalResult("success", "Campaign data has been successfully dowloaded");
            } else {
                toggleLoadingModal()
                handleOpenModalResult("failed", "The requested data is not available for download.");
            }
        } catch (error) {
            toggleLoadingModal()
            handleOpenModalResult("failed", "Oops! There was an error loading the data. Please try again.");
        }
    }

    function handleNavigateToDashboardClient() {
        navigateTo("/prezent/campaign/reward");
    }

    function handleNavigateFooterCampaign() {
        navigateTo(`/prezent/campaign/reward/edit/${id}`)
    } 

    function handlePrevVoucherList() {
        if (currentVoucherPreview > 0) {
            setCurrentVoucherPreview(currentVoucherPreview - 1)
        }
    }

    function handleNextVoucherList() {
        if (currentVoucherPreview < data?.data?.vouchers?.length - 1) {
            setCurrentVoucherPreview(currentVoucherPreview + 1)
        }
    }

    // Handles reset category filter if user makes changes in type filter
    useEffect(() => {
        const updatedOptions = {
            ...selectedOptionsVoucherList,
            category: [],
        };

        setSelectedFilterOptionsVoucherList(updatedOptions);
    }, [dataFilterVoucherList.type]);

    // Handles reset category filter if user makes changes in type filter
    useEffect(() => {
        const updatedOptions = {
            ...selectedOptionsVoucherGenerated,
            category: [],
        };

        setSelectedFilterOptionsVoucherGenerated(updatedOptions);
    }, [dataFilterVoucherGenerated.type]);

    useEffect(() => {
        setTitleHeader("Detail Campaign");
    }, []);
    
  return (
    <>
        <div className='flex-1 h-full overflow-y-auto bg-neutral20'>
            <div className='py-6 px-8 mb-16'>
                <div className="mb-6">
                    <div className="flex">
                        <BasicInformationSection
                            data={data?.data}
                        />
                        <div className="ml-4 bg-white rounded-lg py-5 px-6 shadow-md w-80 relative">
                            <div className="flex justify-between items-center">
                                <p className="text-lg font-semibold">Voucher Preview</p>
                                <p className="text-sm text-neutral300">{data?.data?.vouchers?.length ? `${currentVoucherPreview + 1}/${data?.data?.vouchers?.length}` : "0/0"}</p>
                            </div>
                            <hr className="text-neutral30 mt-2 mb-4" />
                            <div className="flex justify-center items-center relative">
                                <div className="absolute left-0 z-10 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full opacity-80 cursor-pointer" onClick={handlePrevVoucherList}>
                                    <div className="flex items-center justify-center h-full">
                                        <PiCaretLeft />
                                    </div>
                                </div>
                                <CustomPhone
                                    mode={data?.data?.vouchers?.length > 0 ? "Voucher" : "Empty"}
                                    data={{
                                        productName: data?.data?.vouchers?.[currentVoucherPreview]?.voucherName || "N/A",
                                        orderNumber: data?.data?.vouchers?.[currentVoucherPreview]?.orderNumber || "N/A",
                                        validDate: moment(data?.data?.vouchers?.[currentVoucherPreview]?.validDate).format("DD MMMM YYYY") || "N/A",
                                        voucherDescription: data?.data?.vouchers?.[currentVoucherPreview]?.description || "No description available",
                                        voucherBackgroundType:
                                            data?.data?.vouchers?.[currentVoucherPreview]?.template?.background === "upload_image" ? "image" : "color",
                                        voucherBackground:
                                            data?.data?.vouchers?.[currentVoucherPreview]?.template?.background === "upload_image"
                                                ? `${process.env.REACT_APP_API_VOUCHER_URL}/template_voucher/${data?.data?.vouchers?.[currentVoucherPreview]?.template?.templateVoucherPhoto}`
                                                : data?.data?.vouchers?.[currentVoucherPreview]?.template?.templateName || "Default Background",
                                        voucherPhoto: `${process.env.REACT_APP_API_VOUCHER_URL}/voucher/${data?.data?.vouchers?.[currentVoucherPreview]?.voucherPhoto || "default-photo.jpg"}`,
                                        voucherTitle: data?.data?.vouchers?.[currentVoucherPreview]?.template?.messageTitle || "Untitled",
                                        voucherMessage: data?.data?.vouchers?.[currentVoucherPreview]?.template?.messageDescription || "No message provided",
                                        howToRedeem: data?.data?.vouchers?.[currentVoucherPreview]?.howToRedeem || "Redemption instructions not available",
                                        terms: data?.data?.vouchers?.[currentVoucherPreview]?.terms || "Terms and conditions not specified",
                                        clientLogo : data?.data?.vouchers?.[currentVoucherPreview]?.clientLogo
                                    }}
                                />
                                <div className="absolute right-0 z-10 translate-x-1/2 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full opacity-80 cursor-pointer" onClick={handleNextVoucherList}>
                                    <div className="flex items-center justify-center h-full">
                                        <PiCaretRight />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    data?.data && data?.data.status !== "Draft" &&
                    <div className="mb-6">
                        <div className="flex">
                            <PercentageDistributionSection 
                                roleAccess={roleAccess}
                                mostGeneratedTitle={data?.data?.mostGeneratedTitle}
                                mostGeneratedDistribution={data?.data?.mostGeneratedDistribution}
                                mostRedeemedTitle = {data?.data?.mostRedeemedTitle}
                                mostRedeemedDistribution = {data?.data?.mostRedeemedDistribution}
                            />
                        </div>
                    </div>
                }
                <div className="mb-6 bg-white rounded-lg py-5 px-6 shadow-md w-full">
                    <p className='font-semibold text-black text-lg'>Voucher List</p>
                    <hr className='text-neutral30'/>
                    <div className="flex justify-between items-center w-full py-3">
                        <div className="flex items-center w-full">
                            <div>
                                <SearchDropdown
                                    options={dataOptionsVoucherList}
                                    placeholderSearch="Search Here"
                                    filterDropdown={dataFilterSearchVoucherList}
                                    setFilterDropdown={setDataFilterSearchVoucherList}
                                    filterSearch={dataSearchVoucherList}
                                    onEnterPress={setDataSearchVoucherList}
                                />
                            </div>
                            <div className="mx-3">
                                <FilterDropdown
                                    options={[
                                        {
                                          menu: "Type",
                                          parameter: "type",
                                          submenu: dataType,
                                          type: "checkbox",
                                        },
                                        {
                                          menu: "Category",
                                          parameter: "category",
                                          submenu:
                                            dataCategoryVoucherList?.data?.map((category) => ({
                                              option: category.voucher_category_name,
                                              value: category.voucher_category_code,
                                            })) || [],
                                          type: "checkbox",
                                        }
                                    ]}
                                    dataFilterResult={dataFilterVoucherList}
                                    setDataFilterResult={setSelectedFilterOptionsVoucherList}
                                />
                            </div>
                            <div>
                                <DatePicker
                                    placeholder="Select Validity Period"
                                    mode={"default"}
                                    value={[startDate, endDate]}
                                    onChangeRange={(start, end) => {
                                        setStartDate(start)
                                        setEndDate(end)
                                    }}
                                    onReset={() => {
                                        setStartDate("")
                                        setEndDate(null)
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <DataTable
                        columns={columnsVoucherList}
                        reRender={reRenderVoucherList}
                        service={GetAllVoucherList}
                        queryName="Voucher List"
                        dependencies={[roleAccess, id, dataFilterSearchVoucherList.value, dataSearchVoucherList, dataFilterVoucherList, endDate]}
                        params={{
                            roleAccess: roleAccess,
                            id: id,
                            dataFilter: dataFilterSearchVoucherList.value,
                            dataSearch: dataSearchVoucherList,
                            dates: endDate ? {
                                startDate: moment(startDate).format("YYYY-MM-DD"),
                                endDate: moment(endDate).format("YYYY-MM-DD")
                            } : null,
                            body: dataFilterVoucherList
                        }}
                        options={{ pagination: true, isRounded: true }}
                        searchKeyword={dataSearchVoucherList}
                        onClickRow={() => {}}
                    />
                </div>
                <div className="bg-white rounded-lg py-5 px-6 shadow-md w-full">
                    <p className='font-semibold text-black text-lg'>Voucher Generated</p>
                    <hr className='text-neutral30'/>
                    <div className="flex justify-between items-center w-full py-3">
                        <div className="flex">
                            <SearchDropdown
                                options={dataOptionsVoucherGenerated}
                                placeholderSearch="Search Here"
                                filterDropdown={dataFilterSearchVoucherGenerated}
                                setFilterDropdown={setDataFilterSearchVoucherGenerated}
                                filterSearch={dataSearchVoucherGenerated}
                                onEnterPress={setDataSearchVoucherGenerated}
                            />
                            <div className="pl-4">
                                <FilterDropdown
                                    options={[
                                        ...((data?.data?.apiType === "Channel" || data?.data?.category === "One Time Channel Delivery") ? [
                                            {
                                                menu: "Distribution",
                                                parameter: "distribution",
                                                submenu: dataDistribution,
                                                type: "checkbox",
                                            }
                                        ] : []),
                                        {
                                            menu: "Type",
                                            parameter: "type",
                                            submenu: dataType,
                                            type: "checkbox",
                                        },
                                        {
                                            menu: "Category",
                                            parameter: "category",
                                            submenu: dataCategoryVoucherGenerated?.data?.map((category) => ({
                                                option: category.voucher_category_name,
                                                value: category.voucher_category_code,
                                            })) || [],
                                            type: "checkbox",
                                        }
                                    ]}
                                    dataFilterResult={dataFilterVoucherGenerated}
                                    setDataFilterResult={setSelectedFilterOptionsVoucherGenerated}
                                />
                            </div>
                        </div>
                        {
                            (roleAccess === "System Administrator" || roleAccess === "Client Administrator" || roleAccess === "Client Support") && data?.data.category === "Export Data" &&
                            <OutlineButton title="Download Data" onClick={() => handleGetExportDataExcel()} />
                        }
                    </div>
                    <DataTable
                        columns={columnsVoucherGenerated}
                        reRender={reRenderVoucherGenerated}
                        service={GetAllVoucherGenerated}
                        queryName="Generated Voucher"
                        dependencies={[roleAccess, id, dataFilterSearchVoucherGenerated.value, dataSearchVoucherGenerated, dataFilterVoucherGenerated]}
                        params={{ roleAccess: roleAccess, id: id, dataFilter: dataFilterSearchVoucherGenerated.value, dataSearch: dataSearchVoucherGenerated, body: dataFilterVoucherGenerated }}
                        options={{ pagination: true, isRounded: true }}
                        searchKeyword={dataSearchVoucherGenerated}
                        onClickRow={() => {}}
                    />
                </div>
            </div>
            {
                ["System Administrator", "Business Administrator", "Business Support", "Client Administrator", "Client Support"].some(role => roleAccess.includes(role)) &&
                <Footer 
                    additionalButton={
                        <OutlineButton
                        onClick={() => handleNavigateFooterCampaign()}
                        title={
                            <div className="flex items-center gap-1">
                            <PiNotePencil />
                            <span>Edit</span>
                            </div>
                        }
                        />
                    }
                />
            }
            <ModalState 
                title="Do you want to cancel?" 
                subtitle="The information you filled in has not been saved and will be lost if you cancel this process." 
                isOpen={cancelModalIsOpen} 
                onClose={toggleCancelModal}
                type='default'
                titleButtonLeft='Back'
                titleButtonRight='Cancel'
                leftAction={toggleCancelModal}
                rightAction={handleNavigateToDashboardClient}
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
    </>
  );
};

export default DetailCampaign;