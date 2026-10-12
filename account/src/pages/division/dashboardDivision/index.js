import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import _ from "lodash";

import {
  PrimaryButton,
  ModalState,
  FilterDropdown,
  SearchDropdown,
  ModalLoading,
  ModalResult,
  Chip,
} from "sprint-asia-custom-component";
import { DeleteDivision, GetAllDivision } from "../../../service/usermanagement/endpoint/division";
import DataTable from "prezent/DataTable";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import { GetAllClient } from "../../../service/usermanagement/endpoint/client";
import LogoEmptyTable from "../../../assets/images/logo_empty_table.png";
import {formatPrefixPhoneNumber} from "../../../utils/index"

const DashboardDivision = ({ roleAccess, setTitleHeader }) => {
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [], type: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [dataCurrentID, setDataCurrentID] = useState();
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Division",
    value: "division",
  });
  const [reRender, setReRender] = useState(false);
  const { data: clients } = useFetch(roleAccess === "Client Administrator" && GetAllClient, "clients", [], {
    roleAccess,
    page: 1,
    body: { status: [] },
  });

  const dataOptions = [
    ...(roleAccess === "System Administrator"
    ? [{ option: "Client", value: "client" }]
    : []),
    { option: "Division", value: "division" },
    { option: "PIC", value: "pic" },
    { option: "Phone Number", value: "phone-number" },
  ];
  const dataType = [
    { option: "Prepaid", value: "prepaid" },
    { option: "Postpaid", value: "postpaid" },
  ];
  const dataStatus = [
    { option: "Active", value: "Active" },
    { option: "Inactive", value: "Inactive" },
  ];

  const navigateTo = useNavigate();

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      setIsModalOpenResult(true);
      setTimeout(() => {
        setIsModalOpenResult(false);
      }, 1000);
    }, 250);
  }

  function handleNavigateToAddDivision() {
    navigateTo("/prezent/account/division/add");
  }

  function handleNavigateToEditDivision(data) {
    navigateTo(`/prezent/account/division/edit/${data}`);
  }

  function handleNavigateToDetailDivision(data) {
    navigateTo(`/prezent/account/division/${data}`);
  }

  function handleNavigateToAddClient() {
    navigateTo("/prezent/account/client/add");
  }

  function handleDeleteDataTable(id) {
    setDataCurrentID(id);
    toggleDeleteModal();
  }

  function handleCloseModalDelete() {
    toggleDeleteModal();
  }

  async function handleDeleteDivision() {
    try {
      toggleLoadingModal();
      handleCloseModalDelete();
      await DeleteDivision(roleAccess, dataCurrentID);
      setReRender(!reRender);
      toggleLoadingModal();
      handleOpenModalResult("success", "Division has been successfully deleted.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to delete division at the moment. Please try again");
    }
  }

  const columns = [
    {
      header: "Division Data",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-xs">{row.clientName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.id}</p>
          </div>
        );
      },
    },
    {
      header: "PIC Data",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.picEmail}</p>
            <p className="font-normal text-neutral300 text-xs">{formatPrefixPhoneNumber(row.picPhoneNumber)}</p>
          </div>
        );
      },
    },
    {
      header: "Type",
      assessor: "billingType",
    },
    {
      header: "Data Created",
      assessor: "createdAt",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0">{moment(row.createdAt).format("DD MMM YYYY, HH.mm")}</p>
            {row.createdBy && <p className="font-normal text-neutral300 text-xs">Created by {row.createdBy}</p>}
          </div>
        );
      },
    },
    {
      header: "Last Update",
      assessor: "updatedAt",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0">{moment(row.updatedAt).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">Updated by {row.updatedBy !== "" ? row.updatedBy : row.createdBy}</p>
          </div>
        );
      },
    },
    {
      header: "Status",
      assessor: "status",
      Cell: (row) => {
        return <Chip title={row.status} type={row.status === "Active" ? "success" : "neutral"} />;
      },
    },
    roleAccess !== "Client Support" && {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div onClick={() => handleNavigateToEditDivision(row.id)}>
              <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            <div onClick={() => handleDeleteDataTable(row.id)}>
              <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
            </div>
          </div>
        );
      },
    },
  ];

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
  };

  useEffect(() => {
    setTitleHeader("Division");
  }, []);

  return (
    <>
      {clients?.totalCount === 0 ? (
        <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8 h-full">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="h-full flex flex-col justify-center">
              <div className="flex justify-center">
                <img src={LogoEmptyTable} />
              </div>
              <p className="text-black font-semibold text-xl text-center">Welcome to Prezent!</p>
              <p className="text-neutral300 font-normal text-sm text-center">
                Please complete your company information to unlock our services.
              </p>
              <p className="text-neutral300 font-normal text-sm text-center">
                Let's get started on this exciting journey together!
              </p>
              <div className="flex justify-center mt-4">
                <PrimaryButton title="Complete Data" onClick={handleNavigateToAddClient} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
          <div className="bg-white rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center w-full py-3 px-4">
              <div className="flex">
                <SearchDropdown
                  options={dataOptions}
                  placeholderSearch="Search Here"
                  filterDropdown={dataFilterSearch}
                  setFilterDropdown={setDataFilterSearch}
                  onEnterPress={setDataSearch}
                />
                <div className="pl-4">
                  <FilterDropdown
                    options={[
                      {
                        menu: "Status",
                        parameter: "status",
                        submenu: dataStatus,
                        type: "radiobutton",
                      },
                      {
                        menu: "Type",
                        parameter: "type",
                        submenu: dataType,
                        type: "radiobutton",
                      },
                    ]}
                    dataFilterResult={dataFilter}
                    setDataFilterResult={setSelectedFilterOptions}
                  />
                </div>
              </div>
              {roleAccess !== "Client Support" && (
                <PrimaryButton title="+ Add Division" onClick={handleNavigateToAddDivision} />
              )}
            </div>
            <div className="drop-shadow">
              <DataTable
                columns={columns}
                reRender={reRender}
                service={GetAllDivision}
                queryName="divisions"
                dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
                params={{ roleAccess, dataFilter: dataFilterSearch.value, dataSearch, body: dataFilter }}
                options={{ pagination: true }}
                searchKeyword={dataSearch}
                onClickRow={(id) => handleNavigateToDetailDivision(id)}
              />
            </div>
          </div>
        </div>
      )}
      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}} />
      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
      <ModalState
        title="Delete Division?"
        subtitle="Are you sure you want to delete this Division?"
        isOpen={deleteModalIsOpen}
        onClose={handleCloseModalDelete}
        type="danger"
        titleButtonRight="Delete"
        leftAction={handleCloseModalDelete}
        rightAction={handleDeleteDivision}
      />
    </>
  );
};

export default DashboardDivision;
