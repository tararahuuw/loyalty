import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
    Chip,
    FilterDropdown,
    PrimaryButton,
    SearchDropdown,
    ModalLoading,
    ModalResult,
    OutlineButton,
    ModalState,
} from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import {
    DownloadVoucherList,
    GetAllVoucher,
    GetAllVoucherCategory,
} from "../../../service/voucherManagement/endpoint/voucherManagement";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import GoodsModal from "../../../components/goods/GoodsModal";
import DetailGoodsModal from "../../../components/goods/DetailGoodsModal";
import { PiNotePencil, PiEye, PiArrowRight, PiTrash } from "react-icons/pi";
import { CreateNewGoods, DeleteGoods, EditGoods, GetAllGoods, GetGoodsById } from "../../../service/voucherManagement/endpoint/goodsManagement";

const DashboardGoods = ({ roleAccess, setTitleHeader, loyaltyId, formik }) => {
    const navigateTo = useNavigate();
    const [reRender, setReRender] = useState(false);
    const [dataSearch, setDataSearch] = useState("");
    const [dataFilter, setDataFilter] = useState({ status: [] });
    const [dataFilterSearch, setDataFilterSearch] = useState({
        option: "Goods Name",
        value: "name",
    });
    const [flagResult, setFlagResult] = useState("success");
    const [dataSubtitleModal, setDataSubtitleModal] = useState("");
    const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
    const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
    const { isOpen: modalGoodsIsOpen, toggle: toggleModalGoods } = useDisclosure(false);
    const { isOpen: detailModalGoodsIsOpen, toggle: toggleDetailModalGoods } = useDisclosure(false);
    const { isOpen: deleteModalIsOpen, open: openDeleteModal, close: closeDeleteModal } = useDisclosure(false);
    const { isOpen: addModalParameterInformationIsOpen, toggle: toggleAddModalParameterInformation } = useDisclosure(false);
    const [selectedOptions, setSelectedOptions] = useState({ type: [], category: [], priceType: [], status: [] });
    const [selectedGoods, setSelectedGoods] = useState(null);
    const [selectedGoodsDetail, setSelectedGoodsDetail] = useState(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);

    const dataOptions = [
        { option: "Goods Name", value: "name" },
    ];
    const dataStatus = [
        { option: "Active", value: "Active" },
        { option: "Inactive", value: "Inactive" },
    ];

    const handleOpenEditGoods = (row) => {
        toggleModalGoods();
        setSelectedGoods(row);
    };

    const handleOpenDeleteConfirmation = (row) => {
        setSelectedGoods(row);
        openDeleteModal();
    };

    const handleCloseDeleteConfirmation = () => {
        setSelectedGoods(null);
        closeDeleteModal();
    };

    const urlToFile = async (url, fileName, mimeType = "image/jpeg") => {
        const res = await fetch(url);
        const buffer = await res.arrayBuffer();
        return new File([buffer], fileName, { type: mimeType });
    };

    const handleSubmitGoods = async (formValues) => {
        try {
            toggleModalGoods();
            toggleLoadingModal();

            const formData = new FormData();
            formData.append("loyaltyID", loyaltyId);
            formData.append("categoryID", formValues.categoryID);
            formData.append("name", formValues.name);
            formData.append("pointRequired", formValues.pointRequired);
            formData.append("stock", formValues.stock);
            formData.append("startDate", moment(formValues.startDate).format("YYYY-MM-DD"));
            formData.append("endDate", moment(formValues.endDate).format("YYYY-MM-DD"));
            formData.append("description", formValues.description);
            formData.append("status", formValues.status);
            // if (formValues.images) {
            //     formData.append("images", formValues.images);
            // }

            if (formValues.images) {
                if (typeof formValues.images === "string") {
                    const url = formValues.images;
                    const fileName = url.split("filename=")[1]?.split("&")[0] || "image.jpg";
                    const file = await urlToFile(url, fileName);
                    formData.append("images", file);
                } else {
                    formData.append("images", formValues.images);
                }
            }

            if (selectedGoods) {
                await EditGoods(roleAccess, selectedGoods.id, formData);
            } else {
                await CreateNewGoods(roleAccess, formData);
            }

            toggleLoadingModal();
            setFlagResult("success");
            setDataSubtitleModal(
                selectedGoods
                    ? "Goods updated successfully! The goods data has been successfully saved."
                    : "Goods add successful! The goods has been successfully added to your rewards."
            );
            toggleResultModal();

            setTimeout(() => {
                toggleResultModal();
                setSelectedGoods(null);
                setReRender(prev => !prev);
            }, 1500);
        } catch (err) {
            toggleLoadingModal();
            setFlagResult("failed");
            setDataSubtitleModal(
                selectedGoods
                    ? "Sorry, unable to edited goods at the moment. Please try again"
                    : "Sorry, unable to adding goods at the moment. Please try again"
            );
            toggleResultModal();

            setTimeout(() => {
                toggleResultModal();
            }, 1500);
        }
    };

    const handleDeleteGoods = async () => {
        try {
            closeDeleteModal();
            await DeleteGoods(selectedGoods.id);
            setReRender(!reRender);
            setSelectedGoods(null);
            handleOpenModalResult("success", "Goods has been successfully deleted.");
        } catch (error) {
            handleOpenModalResult("failed", "Sorry, we are unable to delete goods at the moment. Please try again");
            setSelectedGoods(null);
        }
    };

    const fetchGoodsDetail = async (id) => {
        try {
            setIsLoadingDetail(true);
            const res = await GetGoodsById(id);
            const detail = res?.data;
            setSelectedGoodsDetail(detail);
            toggleDetailModalGoods();
        } catch (error) {
            console.error("Failed to fetch goods detail:", error);
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleOpenModalResult = (type, subtitle) => {
        setTimeout(() => {
            setFlagResult(type);
            setDataSubtitleModal(subtitle);
            toggleResultModal();
            setTimeout(() => {
                toggleResultModal();
            }, 1000);
        }, 250);
    };

    const columns = [
        {
            header: "Name",
            assessor: "name",
            Cell: (row) => {
                return (
                    <div className="flex gap-2">
                        <img alt={row.name} src={row.images?.[0]?.url || ""} className="h-7 w-12 object-contain" />
                        <div>
                            <p className="font-semibold text-black text-sm">{row.name}</p>
                            <p className="font-normal text-neutral300 text-xs">{row.categoryName}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            header: "Point Required",
            assessor: "pointRequired",
            Cell: (row) => {
                return (
                    <div>
                        {row.pointRequired}
                    </div>
                );
            },
        },
        {
            header: "Stock",
            accessor: "stock",
            Cell: (row) => {
                const stock = row?.stock ?? 0;
                let textColor = "";

                if (stock > 50) {
                    textColor = "text-success500";
                } else if (stock >= 30) {
                    textColor = "text-warning500";
                } else {
                    textColor = "text-danger500";
                }

                return (
                    <div className={`${textColor} font-medium`}>
                        {stock}
                    </div>
                );
            },
        },
        {
            header: "Redeemed",
            assessor: "redeemedQty",
            Cell: (row) => {
                return (
                    <div>
                        {row.redeemedQty}
                    </div>
                );
            },
        },
        {
            header: "Validity Period",
            accessor: "validityPeriod",
            Cell: (row) => {
                const start = row?.startDate ? moment(row.startDate) : null;
                const end = row?.endDate ? moment(row.endDate) : null;
                const daysLeft = end ? end.diff(moment(), "days") : null;

                const dangerText = daysLeft !== null && daysLeft <= 7;

                return (
                    <div>
                        {
                            start && end ? (
                                <>
                                    <div className="flex items-center">
                                        <p className={`text-sm mr-1 ${dangerText ? "text-danger500" : ""}`}>
                                            {start.format("DD MMM YYYY HH:ss")}
                                        </p>
                                        <PiArrowRight className={`${dangerText ? "text-danger500" : ""}`} />
                                    </div>
                                    <p className={`text-sm ${dangerText ? "text-danger500" : ""}`}>
                                        {end.format("DD MMM YYYY HH:ss")}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm">No Period</p>
                            )
                        }
                    </div>
                );
            },
        },
        {
            header: "Status",
            assessor: "status",
            Cell: (row) => {
                return (
                    <Chip
                        title={row.status}
                        type={
                            row.status === "Active" || row.status === "active"
                                ? "success"
                                : "neutral"
                        }
                    />
                );
            },
        },
        {
            header: "Action",
            Cell: (row) => {
                return (
                    <div className="flex">
                        <div onClick={() => {
                            fetchGoodsDetail(row.id);
                        }}>
                            <PiEye size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
                        </div>
                        <div onClick={() => handleOpenEditGoods(row)}>
                            <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
                        </div>
                        {/* <div onClick={() => handleOpenDeleteConfirmation(row)}>
                            <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
                        </div> */}
                    </div>
                );
            },
        },
    ];

    const setSelectedFilterOptions = (options) => {
        setDataFilter(options);
        setReRender(!reRender);
        setSelectedOptions(options);
    };

    useEffect(() => {
        setTitleHeader("Goods");
    }, []);

    return (
        <>
            <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
                <div className="bg-white rounded-lg shadow-md h-full">
                    <div className="flex justify-between items-center w-full py-3 px-4">
                        <div className="flex gap-3">
                            <SearchDropdown
                                options={dataOptions}
                                placeholderSearch="Search Here"
                                filterDropdown={dataFilterSearch}
                                setFilterDropdown={setDataFilterSearch}
                                onEnterPress={setDataSearch}
                            />
                            <FilterDropdown
                                options={[
                                    {
                                        menu: "Status",
                                        parameter: "status",
                                        submenu: dataStatus,
                                        type: "radiobutton",
                                    },
                                ]}
                                dataFilterResult={dataFilter}
                                setDataFilterResult={setSelectedFilterOptions}
                            />
                        </div>

                        <PrimaryButton
                            title="+ Add Goods"
                            onClick={toggleModalGoods}
                        />
                    </div>

                    <div className="drop-shadow">
                        <DataTable
                            columns={columns}
                            reRender={reRender}
                            service={GetAllGoods}
                            queryName="goods"
                            dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
                            params={{
                                roleAccess,
                                dataFilter: dataFilterSearch.value,
                                dataSearch,
                                body: dataFilter,
                            }}
                            options={{ pagination: true }}
                            searchKeyword={dataSearch}
                            // onClickRow={(row) => {
                            //     fetchGoodsDetail(row);
                            // }}
                            onClickRow={() => { }}
                        />
                    </div>
                </div>
            </div>

            <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

            <ModalResult
                subtitle={dataSubtitleModal}
                type={flagResult}
                isOpen={resultModalIsOpen}
                onClose={toggleResultModal}
            />

            <GoodsModal
                title={selectedGoods ? "Edit Goods" : "Create New Goods"}
                subtitle={selectedGoods ? "Edit your existing goods information." : "Create a new physical goods reward that customers can redeem with their points."}
                isOpen={modalGoodsIsOpen}
                onClose={() => {
                    toggleModalGoods();
                    setSelectedGoods(null);
                }}
                initialValues={selectedGoods || {}}
                mode={selectedGoods ? "edit" : "add"}
                rightAction={handleSubmitGoods}
                titleButtonRight={selectedGoods ? "Update" : "Submit"}
            />

            <DetailGoodsModal
                title="Goods Details"
                isOpen={detailModalGoodsIsOpen}
                onClose={() => {
                    toggleDetailModalGoods();
                    setSelectedGoodsDetail(null);
                }}
                data={selectedGoodsDetail}
            />

            <ModalState
                title="Confirm Deletion"
                subtitle={`Are you sure you want to delete the goods ${selectedGoods?.name}? This action cannot be undone.`}
                isOpen={deleteModalIsOpen}
                onClose={handleCloseDeleteConfirmation}
                type="danger"
                titleButtonRight={
                    <div className="flex items-center gap-1">
                        <PiTrash />
                        <p>Delete Goods</p>
                    </div>
                }
                leftAction={handleCloseDeleteConfirmation}
                rightAction={handleDeleteGoods}
            />

        </>
    );
};

export default DashboardGoods;
