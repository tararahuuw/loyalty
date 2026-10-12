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
import { PiArrowRight, PiNotePencil, PiTrash } from "react-icons/pi";
import DataTable from "../../../components/DataTable";
import { useDisclosure } from "prezent/useDisclosure";
import { DeleteCampaign, GetAllCampaign } from "../../../service/campaignmanagement/endpoint";

const DashboardCampaign = ({ roleAccess, setTitleHeader }) => {
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [dataFilter, setDataFilter] = useState({ status: [], type: [], category: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [dataCurrentID, setDataCurrentID] = useState();
  const [currentTab, setCurrentTab] = useState("all");

  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Campaign Name",
    value: "campaignName",
  });

  const [reRender, setReRender] = useState(false);

  const getDataOptions = (roleAccess) => {
    const dataOptions = [
      {
        option: "Campaign Name",
        value: "campaignName",
      },
      {
        option: "Campaign ID",
        value: "campaignID",
      },
    ];

    if (
      roleAccess === "System Administrator" ||
      roleAccess === "Ops Administrator" ||
      roleAccess === "Business Administrator" ||
      roleAccess === "Business Support" ||
      roleAccess === "Client Administrator"
    ) {
      dataOptions.push({
        option: "Division",
        value: "division",
      });
    }

    if (
      roleAccess === "System Administrator" ||
      roleAccess === "Ops Administrator" ||
      roleAccess === "Business Administrator" ||
      roleAccess === "Business Support"
    ) {
      dataOptions.push({
        option: "Client",
        value: "client",
      });
    }

    return dataOptions;
  };

  const dataStatus = [
    { option: "Active", value: "Active" },
    { option: "Inactive", value: "Inactive" },
    { option: "Scheduled", value: "Scheduled" },
  ];

  const dataCategory = [
    { option: "One Time Channel Delivery", value: "One Time Channel Delivery" },
    { option: "API Distribution", value: "API Distribution" },
    { option: "Export Data", value: "Export Data" },
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

  function handleNavigateToAddCampaign() {
    navigateTo("/prezent/campaign/reward/add");
  }

  function handleNavigateToEditClient(data) {
    navigateTo(`/prezent/campaign/reward/edit/${data}`);
  }

  function handleNavigateToDetailClient(data) {
    navigateTo(`/prezent/campaign/reward/${data}`);
  }

  function handleDeleteDataTable(index) {
    toggleDeleteModal();
    setDataCurrentID(index);
  }

  const handleChangeTab = (tab) => {
    setCurrentTab(tab);
    setReRender(!reRender);
  };

  async function handleDeleteCampaign() {
    try {
      toggleLoadingModal();
      await DeleteCampaign(dataCurrentID, roleAccess);
      setReRender(!reRender);
      toggleLoadingModal();
      toggleDeleteModal();
      handleOpenModalResult("success", "Campaign has been successfully removed.");
    } catch (error) {
      setIsModalOpenLoading(false);
      handleOpenModalResult("failed", "Campaign has been failed deleted.");
    }
  }

  const columns = [
    {
      header: "Campaign Data",
      assessor: "campaignName",
      Cell: (row) => {
        return (
          <div className="flex">
            <div>
              <p className="font-semibold text-black text-sm">{row.name}</p>
              <p className="font-normal text-neutral300 text-xs">
                {row.type} - {row.category}
              </p>
              <p className="font-normal text-neutral300 text-xs">{row.id}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Client",
      assessor: "client",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.clientName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.divisionName}</p>
          </div>
        );
      },
    },
    {
      header: "Generated",
      assessor: "generated",
      Cell: (row) => {
        return (
          <div>
            <p className={`${row.generatedVouchers ? "text-success500" : "text-black"} text-sm`}>
              {row.generatedVouchers || "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "Redeemed",
      assessor: "redeemed",
      Cell: (row) => {
        return (
          <div>
            <p className="text-sm">{row.redeemedVouchers || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Validity Period",
      assessor: "validityPeriod",
      Cell: (row) => {
        return (
          <div>
            {row.startDate && row.endDate ? (
              <>
                <div className="flex items-center">
                  <p className="text-sm mr-1">{moment(row.startDate).format("DD MMM YYYY HH:mm")}</p>
                  <PiArrowRight />
                </div>
                <p className="text-sm">{moment(row.endDate).format("DD MMM YYYY HH:mm")}</p>
              </>
            ) : (
              <p className="text-sm">No Period</p>
            )}
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
                : row.status == "Waiting"
                ? "primary"
                : row.status == "Rejected"
                ? "danger"
                : row.status == "Draft"
                ? "warning"
                : row.status == "Inactive"
                ? "neutral"
                : row.status == "Scheduled"
                ? "white"
                : "neutral"
            }
          />
        );
      },
    },
    [
      "System Administrator",
      "Business Administrator",
      "Business Support",
      "Client Administrator",
      "Client Support",
    ].some((role) => roleAccess.includes(role)) && {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div onClick={() => handleNavigateToEditClient(row.id)}>
              <PiNotePencil size="24" variant="Bold" className="text-primary500 cursor-pointer mr-2" />
            </div>
            {row.status === "Draft" && (
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
    setTitleHeader("Campaign");
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10">
        <TabBar
          dataBar={["All Campaign", "Draft"]}
          dataValue={["all", "draft"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => handleChangeTab(tab)}
        />
      </div>
      <div className="flex-1 overflow-y-auto bg-neutral20 py-6 px-8">
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center w-full py-3 px-4">
            <div className="flex">
              <SearchDropdown
                options={getDataOptions(roleAccess)}
                placeholderSearch="Search Here"
                filterDropdown={dataFilterSearch}
                setFilterDropdown={setDataFilterSearch}
                filterSearch={dataSearch}
                onEnterPress={setDataSearch}
              />
              {currentTab === "all" && (
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
                        menu: "Category",
                        parameter: "category",
                        submenu: dataCategory,
                        type: "checkbox",
                      },
                    ]}
                    dataFilterResult={dataFilter}
                    setDataFilterResult={setSelectedFilterOptions}
                  />
                </div>
              )}
            </div>
            {[
              "System Administrator",
              "Business Administrator",
              "Business Support",
              "Client Administrator",
              "Client Support",
            ].some((role) => roleAccess.includes(role)) && (
              <PrimaryButton title="+ Add Campaign" onClick={handleNavigateToAddCampaign} />
            )}
          </div>
          <div className="drop-shadow h-full">
            <DataTable
              columns={columns}
              reRender={reRender}
              service={GetAllCampaign}
              queryName="campaign"
              dependencies={[roleAccess, currentTab, dataFilterSearch.value, dataSearch, dataFilter]}
              params={{
                roleAccess: roleAccess,
                tab: currentTab,
                dataFilter: dataFilterSearch.value,
                dataSearch: dataSearch,
                body: dataFilter,
              }}
              options={{ pagination: true }}
              searchKeyword={dataSearch}
              onClickRow={(id) => handleNavigateToDetailClient(id)}
            />
          </div>
        </div>
      </div>
      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

      <ModalState
        title="Delete Campaign?"
        subtitle="Are you sure you want to delete this Campaign?"
        isOpen={deleteModalIsOpen}
        onClose={toggleDeleteModal}
        type="danger"
        titleButtonRight="Delete"
        leftAction={toggleDeleteModal}
        rightAction={handleDeleteCampaign}
      />
    </>
  );
};

export default DashboardCampaign;
