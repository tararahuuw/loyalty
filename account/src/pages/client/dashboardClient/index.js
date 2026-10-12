import React, { useEffect, useState } from "react";

import moment from "moment";
import _ from "lodash";

import { useNavigate } from "react-router-dom";
import {
  PrimaryButton,
  ModalState,
  FilterDropdown,
  TabBar,
  ModalLoading,
  ModalResult,
  SearchDropdown,
  Chip,
} from "sprint-asia-custom-component";
import { DeleteClient, GetAllClient } from "../../../service/usermanagement/endpoint/client";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import DataTable from "prezent/DataTable";
import LogoEmptyTable from "../../../assets/images/logo_empty_table.png";
import { useFetch } from "prezent/useFetch";
import { formatPrefixPhoneNumber } from "../../../utils/index";

const DashboardClient = ({ roleAccess, setTitleHeader }) => {
  const [modalDelete, setModalDelete] = useState(false);
  const [isModalOpenLoading, setIsModalOpenLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [dataCurrentID, setDataCurrentID] = useState();
  const [currentTab, setCurrentTab] = useState("all");
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Client",
    value: "client",
  });
  const [reRender, setReRender] = useState(false);
  const { data: clients } = useFetch(
    (roleAccess === "Client Administrator" || roleAccess === "Client Support") && GetAllClient,
    "clients",
    [],
    {
      roleAccess,
      page: 1,
      body: { status: [] },
    }
  );
  const dataOptions = [
    {
      option: "Client",
      value: "client",
    },
    {
      option: "PIC",
      value: "pic",
    },
    {
      option: "Phone Number",
      value: "phone-number",
    },
  ];

  const dataStatusInternalRole = [
    {
      option: "Active",
      value: "Active",
    },
    {
      option: "Inactive",
      value: "Inactive",
    },
  ];
  const dataStatusEksternalRole = [
    {
      option: "Active",
      value: "Active",
    },
    {
      option: "Waiting",
      value: "Waiting",
    },
    {
      option: "Inactive",
      value: "Inactive",
    },
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

  function handleNavigateToAddClient() {
    navigateTo("/prezent/account/client/add");
  }

  function handleNavigateToEditClient(data) {
    navigateTo(`/prezent/account/client/edit/${data}`);
  }

  function handleNavigateToDetailClient(data) {
    navigateTo(`/prezent/account/client/${data}`);
  }

  function handleDeleteDataTable(index) {
    setDataCurrentID(index);
    setModalDelete(true);
  }

  function handleCloseModalDelete() {
    setModalDelete(false);
  }

  const handleChangeTab = (tab) => {
    setCurrentTab(tab);
    setReRender(!reRender);
  };

  async function handleDeleteClient() {
    try {
      setIsModalOpenLoading(true);
      handleCloseModalDelete();
      await DeleteClient(dataCurrentID);
      setReRender(!reRender);
      setIsModalOpenLoading(false);
      handleOpenModalResult("success", "Client has been successfully removed.");
    } catch (error) {
      setIsModalOpenLoading(false);
      handleOpenModalResult("failed", "Client has been failed deleted.");
    }
  }

  const columns = [
    {
      header: "Client Data",
      assessor: "name",
      Cell: (row) => {
        return (
          <div className="flex">
            <div>
              <img src={row.clientLogo} className="rounded-full w-8 h-8 object-cover mr-3" />
            </div>
            <div>
              <p className="font-semibold text-black text-sm">{row.name}</p>
              <p className="font-normal text-neutral300 text-xs">{row.industry}</p>
              <p className="font-normal text-neutral300 text-xs">{row.id}</p>
            </div>
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
      header: "Data Created",
      assessor: "createdAt",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0 text-sm">{moment(row.createdAt).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">By {row.createdBy}</p>
          </div>
        );
      },
    },
    currentTab === "all" && {
      header: "Last Update",
      assessor: "updatedAt",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0 text-sm">{moment(row.updatedAt).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">
              By {row.updatedBy !== "" ? row.updatedBy : row.createdBy}
            </p>
          </div>
        );
      },
    },
    currentTab === "inactive" && {
      header: "Reject Date",
      assessor: "updatedAt",
      Cell: (row) => {
        return (
          <div>
            <p className="m-0 text-sm">{moment(row.rejectedAt).format("DD MMM YYYY, HH.mm")}</p>
            <p className="font-normal text-neutral300 text-xs">By {row.rejectedBy}</p>
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
              row.status === "Active"
                ? "success"
                : row.status == "Waiting for Approval"
                ? "primary"
                : row.status == "Rejected"
                ? "danger"
                : "neutral"
            }
          />
        );
      },
    },
    roleAccess !== "Client Support" &&
      currentTab !== "waiting" && {
        header: "Action",
        Cell: (row) => {
          return (
            <div className="flex">
              {currentTab === "all" && (
                <div onClick={() => handleNavigateToEditClient(row.id)}>
                  <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
                </div>
              )}
              {roleAccess !== "Client Administrator" && (
                <div onClick={() => handleDeleteDataTable(row.id)}>
                  <PiTrash size="24" variant="Bold" className="text-primary500 cursor-pointer" />
                </div>
              )}
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
    setTitleHeader("Clients");
  }, []);

  return (
    <>
      {
        // External
        // Client Administrator and Client Support
        roleAccess === "Client Administrator" || roleAccess === "Client Support" ? (
          <>
            {clients?.totalCount === 0 && roleAccess === "Client Administrator" ? (
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
                <div className="bg-white rounded-lg shadow-md">
                  <div className="flex justify-between items-center w-full py-3 px-4">
                    <div className="flex">
                      <SearchDropdown
                        options={dataOptions}
                        placeholderSearch="Search Here"
                        filterDropdown={dataFilterSearch}
                        setFilterDropdown={setDataFilterSearch}
                        filterSearch={dataSearch}
                        onEnterPress={setDataSearch}
                      />
                      <div className="pl-4">
                        <FilterDropdown
                          options={[
                            {
                              menu: "Status",
                              parameter: "status",
                              submenu: dataStatusEksternalRole,
                              type: "radiobutton",
                            },
                          ]}
                          dataFilterResult={dataFilter}
                          setDataFilterResult={setSelectedFilterOptions}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="drop-shadow">
                    <DataTable
                      columns={columns}
                      reRender={reRender}
                      service={GetAllClient}
                      queryName="clients"
                      dependencies={[currentTab, dataFilterSearch.value, dataSearch, dataFilter]}
                      params={{
                        roleAccess,
                        tab: currentTab,
                        dataFilter: dataFilterSearch.value,
                        dataSearch,
                        body: dataFilter,
                      }}
                      options={{ pagination: true }}
                      searchKeyword={dataSearch}
                      onClickRow={(id) => handleNavigateToDetailClient(id)}
                      setTotalData={setTotalData}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          // Internal
          // System Administrator, Ops Administrator, Business Administrator, and Business Support
          <>
            <div className="sticky top-0 z-10">
              <TabBar
                dataBar={["All Client", "Waiting For Approval", "Rejected"]}
                dataValue={["all", "waiting", "inactive"]}
                currentTab={currentTab}
                onChangeTabBar={(tab) => handleChangeTab(tab)}
              />
            </div>
            <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
              <div className="bg-white rounded-lg shadow-md">
                <div className="flex justify-between items-center w-full py-3 px-4">
                  <div className="flex">
                    <SearchDropdown
                      options={dataOptions}
                      placeholderSearch="Search Here"
                      filterDropdown={dataFilterSearch}
                      setFilterDropdown={setDataFilterSearch}
                      filterSearch={dataSearch}
                      onEnterPress={setDataSearch}
                    />
                    {currentTab == "all" && (
                      <div className="pl-4">
                        <FilterDropdown
                          options={[
                            {
                              menu: "Status",
                              parameter: "status",
                              submenu: dataStatusInternalRole,
                              type: "radiobutton",
                            },
                          ]}
                          dataFilterResult={dataFilter}
                          setDataFilterResult={setSelectedFilterOptions}
                        />
                      </div>
                    )}
                  </div>
                  <PrimaryButton title="+ Add Client" onClick={handleNavigateToAddClient} />
                </div>
                <div className="drop-shadow">
                  <DataTable
                    columns={columns}
                    reRender={reRender}
                    service={GetAllClient}
                    queryName="clients"
                    dependencies={[currentTab, dataFilterSearch.value, dataSearch, dataFilter]}
                    params={{
                      roleAccess,
                      tab: currentTab,
                      dataFilter: dataFilterSearch.value,
                      dataSearch,
                      body: dataFilter,
                    }}
                    options={{ pagination: true }}
                    searchKeyword={dataSearch}
                    onClickRow={(id) => handleNavigateToDetailClient(id)}
                  />
                </div>
              </div>
            </div>
          </>
        )
      }
      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isModalOpenLoading} onClose={() => {}} />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <ModalState
        title="Delete Client?"
        subtitle="Are you sure you want to delete this Client?"
        isOpen={modalDelete}
        onClose={handleCloseModalDelete}
        type="danger"
        titleButtonRight="Delete"
        leftAction={handleCloseModalDelete}
        rightAction={handleDeleteClient}
      />
    </>
  );
};

export default DashboardClient;
