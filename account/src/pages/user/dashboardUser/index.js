import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import moment from "moment";
import { PiNotePencil, PiTrash } from "react-icons/pi";

import {
  PrimaryButton,
  ModalState,
  FilterDropdown,
  SearchDropdown,
  ModalLoading,
  ModalResult,
  Chip,
} from "sprint-asia-custom-component";
import { GetAllRoleBySystemAdministration } from "../../../service/usermanagement/endpoint";
import DataTable from "prezent/DataTable";
import { DeleteUser, GetAllUser, SendEmailVerification } from "../../../service/usermanagement/endpoint/user";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import DetailUserModal from "../../../components/User/DetailUserModal/DetailUserModal";
import LogoEmptyTable from "../../../assets/images/logo_empty_table.png";
import { GetAllClient } from "../../../service/usermanagement/endpoint/client";
import {formatPrefixPhoneNumber} from "../../../utils/index"

const DashboardUser = ({ roleAccess, setTitleHeader, userClient }) => {
  const { isOpen: detailUserIsOpen, toggle: toggleDetailUser } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState();
  const [dataFilter, setDataFilter] = useState({ role: [], status: [] });
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [dataCurrentID, setDataCurrentID] = useState(null);
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: roleAccess === "Client Administrator" || roleAccess === "Client Support" ? "Division" : "Client",
    value: roleAccess === "Client Administrator" || roleAccess === "Client Support" ? "division" : "client",
  });
  const [reRender, setReRender] = useState(false);

  const { data: clients } = useFetch(roleAccess === "Client Administrator" && GetAllClient, "clients", [], {
    roleAccess,
    page: 1,
    body: { status: [] },
  });

  function handleNavigateToAddClient() {
    navigateTo("/prezent/account/client/add");
  }

  const dataOptions = [
    { option: "Client", value: "client" },
    { option: "Division", value: "division" },
    { option: "Email", value: "email" },
    { option: "Phone Number", value: "phone-number" },
  ];
  const dataOptions2 = [
    { option: "Division", value: "division" },
    { option: "Email", value: "email" },
    { option: "Phone Number", value: "phone-number" },
  ];
  const dataStatus = [
    { option: "Active", value: "Active" },
    { option: "Inactive", value: "Inactive" },
    { option: "Waiting", value: "Waiting" },
  ];

  const { data: userRoles } = useFetch(GetAllRoleBySystemAdministration, "roles", [], { roleAccess });

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

  function handleNavigateToAddUser() {
    navigateTo("/prezent/account/user/add");
  }

  function handleNavigateToEditUser(data) {
    navigateTo(`/prezent/account/user/edit/${data}`);
  }

  function handleDeleteDataTable(user) {
    setDataCurrentID(user);
    toggleDeleteModal();
  }

  function handleOpenModalDetail(user) {
    setDataCurrentID(user);
    toggleDetailUser();
  }

  function handleDeleteFromDetailModal() {
    toggleDeleteModal();
    toggleDetailUser();
  }

  function handleCloseModalDetail() {
    toggleDetailUser();
    setDataCurrentID(null);
  }

  function handleCloseModalDelete() {
    toggleDeleteModal();
    setDataCurrentID(null);
  }

  async function handleDeleteUser() {
    try {
      toggleLoadingModal();
      handleCloseModalDelete();
      await DeleteUser(roleAccess, dataCurrentID.id);
      setReRender(!reRender);
      toggleLoadingModal();
      handleOpenModalResult("success", "User has been successfully deleted.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, we are unable to delete user at the moment. Please try again");
    }
  }

  async function handleSendEmailVerification() {
    try {
      toggleLoadingModal();
      await SendEmailVerification(dataCurrentID.id);
      toggleLoadingModal();
      handleOpenModalResult("success", "Email verification sent!");
    } catch (error) {
      if (error.response.status === 400) {
        toggleLoadingModal();
        handleOpenModalResult("failed", "Send verification email need at least 5 minute");
      } else {
        toggleLoadingModal();
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to send verification email at the moment. Please try again"
        );
      }
    }
  }

  const columns = [
    {
      header: "User Data",
      assessor: "fullName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.fullName}</p>
            <p className="font-normal text-neutral300 text-xs">{row.email}</p>
            <p className="font-normal text-neutral300 text-xs">{formatPrefixPhoneNumber(row.phoneNumber)}</p>
            <p className="font-normal text-neutral300 text-xs">{row.id}</p>
          </div>
        );
      },
    },
    (roleAccess === "Client Administrator" || roleAccess === "Client Support") && {
      header: "Division",
      assessor: "divisionName",
    },

    roleAccess !== "Client Administrator" &&
      roleAccess !== "Client Support" && {
        header: "Client",
        assessor: "clientName",
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
      header: "Type",
      assessor: "roleName",
    },
    {
      header: "Last Activity",
      assessor: "lastActive",
      Cell: (row) => {
        return <p className="m-0"> {row.lastActive ? moment(row.lastActive).format("DD MMM YYYY, HH.mm") : "-"}</p>;
      },
    },
    {
      header: "State",
      assessor: "status",
      Cell: (row) => {
        return (
          <Chip
            title={row.status}
            type={row.status === "Active" ? "success" : row.status === "Waiting" ? "primary" : "neutral"}
          />
        );
      },
    },
    roleAccess !== "Client Support" && {
      header: "Action",
      Cell: (row) => {
        return (
          <div className="flex">
            <div onClick={() => handleNavigateToEditUser(row.id)}>
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

  const setSelectedFilterOptions = (options) => {
    setDataFilter(options);
    setReRender(!reRender);
  };

  useEffect(() => {
    setTitleHeader("User");
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
          <div className="bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center w-full py-3 px-4">
              <div className="flex">
                <SearchDropdown
                  options={
                    roleAccess === "Client Administrator" || roleAccess === "Client Support"
                      ? dataOptions2
                      : dataOptions
                  }
                  placeholderSearch="Search Here"
                  filterDropdown={dataFilterSearch}
                  setFilterDropdown={setDataFilterSearch}
                  onEnterPress={setDataSearch}
                />
                <div className="pl-4">
                  <FilterDropdown
                    options={[
                      {
                        menu: "Role",
                        parameter: "role",
                        submenu: userRoles?.data?.map(({ name, id }) => ({ option: name, value: id })),
                        type: "checkbox",
                      },
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
              </div>
              {roleAccess !== "Client Support" && (
                <PrimaryButton title="+ Add User" onClick={handleNavigateToAddUser} />
              )}
            </div>
            <div className="drop-shadow">
              <DataTable
                columns={columns}
                reRender={reRender}
                service={GetAllUser}
                queryName="users"
                dependencies={[dataFilterSearch.value, dataSearch, dataFilter]}
                params={{ roleAccess, dataFilter: dataFilterSearch.value, dataSearch, body: dataFilter }}
                options={{ pagination: true }}
                searchKeyword={dataSearch}
                onClickRow={(id, row) => handleOpenModalDetail(row)}
              />
            </div>
          </div>

          <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} onClose={() => {}}/>

          <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />

          <DetailUserModal
            title="Detail User"
            status={"User is " + dataCurrentID?.status}
            username={dataCurrentID?.fullName}
            email={dataCurrentID?.email}
            phoneNumber={formatPrefixPhoneNumber(dataCurrentID?.phoneNumber)}
            clientName={dataCurrentID?.clientName}
            division={dataCurrentID?.divisionName}
            role={dataCurrentID?.roleName}
            isVerify={dataCurrentID?.isVerify}
            onClickSendEmail={handleSendEmailVerification}
            isOpen={detailUserIsOpen}
            onClose={handleCloseModalDetail}
            type="danger"
            titleButtonLeft="Delete"
            titleButtonRight="Edit"
            leftAction={handleDeleteFromDetailModal}
            rightAction={() => handleNavigateToEditUser(dataCurrentID?.id)}
            roleAccess={roleAccess}
          />

          <ModalState
            title="Do you want to delete this User?"
            subtitle="Are you sure you want to delete this User Account?"
            isOpen={deleteModalIsOpen}
            onClose={handleCloseModalDelete}
            type="danger"
            titleButtonRight="Delete"
            leftAction={handleCloseModalDelete}
            rightAction={handleDeleteUser}
          />
        </div>
      )}
    </>
  );
};

export default DashboardUser;
