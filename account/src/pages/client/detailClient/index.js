import React, { useState, useEffect } from "react";

import _ from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import {
  Footer,
  Alert,
  Description,
  ModalState,
  SearchDropdown,
  DescriptionFile,
  ModalLoading,
  ModalResult,
} from "sprint-asia-custom-component";
import {
  FetchClientFileURL,
  GetClientById,
  PatchApprovalClientByInternalRole,
  DeleteClient,
} from "../../../service/usermanagement/endpoint/client";
import { useDisclosure } from "prezent/useDisclosure";
import DataTable from "prezent/DataTable";
import { DeleteDivision, GetAllDivisionByClientID } from "../../../service/usermanagement/endpoint/division";
import { useFetch } from "prezent/useFetch";
import { PiNotePencil, PiTrash } from "react-icons/pi";
import {formatPrefixPhoneNumber} from "../../../utils/index"

const DetailClient = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: rejectClientModalIsOpen, toggle: toggleRejectClientModal } = useDisclosure(false);
  const { isOpen: deleteClientModalIsOpen, toggle: toggleDeleteClientModal } = useDisclosure(false);
  const { isOpen: deleteDivisionModalIsOpen, toggle: toggleDeleteDivisionModal } = useDisclosure(false);
  const [dataSearch, setDataSearch] = useState("");
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [reasonRejectClient, setReasonRejectClient] = useState("");
  const [isModalOpenResult, setIsModalOpenResult] = useState(false);
  const [reRender, setReRender] = useState(false);
  const [dataCurrentID, setDataCurrentID] = useState();
  const { data, isError, isLoading } = useFetch(id && GetClientById, "client", [], { roleAccess, id });
  const { data: cooperationAgreement, isError: cooperationAgreementIsError } = useFetch(
    data?.data?.cooperationAgreement && FetchClientFileURL,
    "cooperationAgreement",
    [],
    {
      file: data?.data?.cooperationAgreement,
    }
  );
  const { data: nomorIndukBerusaha, isError: nomorIndukBerusahaIsError } = useFetch(
    data?.data?.nomorIndukBerusaha && FetchClientFileURL,
    "nomorIndukBerusaha",
    [],
    {
      file: data?.data?.nomorIndukBerusaha,
    }
  );
  const { data: kartuTandaPendudukCEO, isError: kartuTandaPendudukCEOIsError } = useFetch(
    data?.data?.kartuTandaPendudukCEO && FetchClientFileURL,
    "kartuTandaPendudukCEO",
    [],
    {
      file: data?.data?.kartuTandaPendudukCEO,
    }
  );
  const { data: softCopyNPWP, isError: softCopyNPWPIsError } = useFetch(
    data?.data?.softCopyNPWP && FetchClientFileURL,
    "softCopyNPWP",
    [],
    {
      file: data?.data?.softCopyNPWP,
    }
  );
  const [dataFilterSearch, setDataFilterSearch] = useState({
    option: "Division",
    value: "name",
  });
  const navigateTo = useNavigate();

  const dataOptions = [
    {
      option: "Division",
      value: "name",
    },
    {
      option: "PIC",
      value: "picName",
    },
    {
      option: "Email",
      value: "picEmail",
    },
  ];

  const columns = [
    {
      header: "Division Data",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.name}</p>
            <p className="font-normal text-neutral300 text-sm">{row.id}</p>
          </div>
        );
      },
    },
    {
      header: "PIC",
      assessor: "picName",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picName}</p>
            <p className="font-normal text-neutral300 text-sm">{row.picPosition}</p>
          </div>
        );
      },
    },
    {
      header: "Contact",
      assessor: "contact",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row.picEmail}</p>
            <p className="font-normal text-neutral300 text-sm">{formatPrefixPhoneNumber(row.picPhoneNumber)}</p>
          </div>
        );
      },
    },
    {
      header: "Type",
      assessor: "billingType",
    },
    {
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

  function handleDeleteDataTable(index) {
    setDataCurrentID(index);
    toggleDeleteDivisionModal();
  }

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

  function handleNavigateEditClient() {
    navigateTo(`/prezent/account/client/edit/${id}`);
  }

  function handleNavigateToEditDivision(idDivision) {
    navigateTo(`/prezent/account/division/edit/${idDivision}`);
  }

  function handleNavigateDetailDivision(idDivision) {
    navigateTo(`/prezent/account/division/${idDivision}`);
  }

  function handleNavigateDashboardClient() {
    navigateTo(`/prezent/account/client`);
  }

  async function handleDeleteClient() {
    try {
      toggleLoadingModal();
      toggleDeleteClientModal();
      await DeleteClient(id);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Client has been successfully removed.");
        setTimeout(() => {
          handleNavigateDashboardClient();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Client has been failed deleted.");
    }
  }

  async function handleDeleteDivision() {
    try {
      toggleLoadingModal();
      toggleDeleteDivisionModal();
      await DeleteDivision(roleAccess, dataCurrentID);
      toggleLoadingModal();
      setReRender(!reRender);
      handleOpenModalResult("success", "Division has been successfully removed.");
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Division has been failed deleted.");
    }
  }

  async function handleApproveClient() {
    try {
      toggleLoadingModal();
      const request = {
        clientId: id,
        Approval: "Approve",
        Reason: reasonRejectClient,
      };
      await PatchApprovalClientByInternalRole(request);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult(
          "success",
          "Client have been successfully Approved. You can remind your clients to verify their email."
        );
        setTimeout(() => {
          handleNavigateDashboardClient();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to Approved client at the moment. Please refresh the page and try again"
      );
    }
  }

  async function handleRejectClient() {
    try {
      toggleLoadingModal();
      const request = {
        clientId: id,
        Approval: "Rejected",
        Reason: reasonRejectClient,
      };
      await PatchApprovalClientByInternalRole(request);
      toggleLoadingModal();
      toggleRejectClientModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Client have been successfully Rejected.");
        setTimeout(() => {
          handleNavigateDashboardClient();
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult(
        "failed",
        "Sorry, we are unable to Rejected client at the moment. Please refresh the page and try again."
      );
    }
  }

  useEffect(() => {
    if (
      isError ||
      cooperationAgreementIsError ||
      nomorIndukBerusahaIsError ||
      kartuTandaPendudukCEOIsError ||
      softCopyNPWPIsError
    ) {
      handleOpenModalResult("failed", "Oops! There was an error load the client data. Please try again.");
    }
  }, [
    isError,
    cooperationAgreementIsError,
    nomorIndukBerusahaIsError,
    kartuTandaPendudukCEOIsError,
    softCopyNPWPIsError,
  ]);

  useEffect(() => {
    setTitleHeader("Detail Client");
  }, []);

  return (
    <>
      <div className="flex-1 h-full overflow-y-auto bg-neutral20">
        <div className="py-6 px-8 mb-16">
          {roleAccess === "Client Administrator" || roleAccess === "Client Support" ? (
            <>
              {(data?.data.status == "Active" || data?.data.status == "Inactive") && (
                <div className="mb-6">
                  <Alert
                    title="Data Approved"
                    subtitle="Business administrator have been successfully Approved."
                    type="success"
                  />
                </div>
              )}
              {data?.data.status == "Waiting for Approval" && (
                <div className="mb-6">
                  <Alert
                    title="Data Approval"
                    subtitle="Waiting for approval from the business admin, if you want further information please contact the admin."
                  />
                </div>
              )}
              {data?.data.status == "Rejected" && (
                <div className="mb-6">
                  <Alert title="Client Rejected" subtitle={data?.data.reasonRejected} type="danger" />
                </div>
              )}
            </>
          ) : (
            <>
              {(data?.data.status == "Active" || data?.data.status == "Inactive") && (
                <div className="bg-white rounded-lg py-5 px-6 shadow-md mb-6">
                  <div>
                    <p className="text-black text-lg font-semibold">Status</p>
                    <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                    {data?.data.status == "Active" && (
                      <p className="text-success500 text-md font-semibold">Client is Active</p>
                    )}
                    {data?.data.status == "Inactive" && (
                      <p className="text-danger500 text-md font-semibold">Client is Inactive</p>
                    )}
                  </div>
                </div>
              )}
              {data?.data.status == "Waiting for Approval" && (
                <div className="mb-6">
                  <Alert
                    title="Data Approval"
                    subtitle="Approve data request?"
                    titleLeftButtonClient="Reject"
                    titleRightButtonClient="Approve"
                    onClickLeftButton={toggleRejectClientModal}
                    onClickRightButton={() => handleApproveClient()}
                  />
                </div>
              )}
              {data?.data.status == "Rejected" && (
                <div className="mb-6">
                  <Alert title="Client Rejected" subtitle={data?.data.reasonRejected} type="danger" />
                </div>
              )}
            </>
          )}
          <div className="bg-white rounded-lg py-5 px-6 shadow-md">
            <div className="mb-8">
              <p className="text-black text-lg font-semibold">Basic Information</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <Description title="Client Name" value={data?.data.name} />
                <Description title="Industry" value={data?.data.industry} />
              </div>
            </div>
            <div className="mb-8">
              <p className="text-black text-lg font-semibold">PIC Information</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <Description title="PIC Name" value={data?.data.picName} />
                <Description title="PIC Email" value={data?.data.picEmail} />
                <Description title="PIC Phone Number" value={formatPrefixPhoneNumber(data?.data.picPhoneNumber)} />
              </div>
            </div>
            <div className="mb-8">
              <p className="text-black text-lg font-semibold">Address Information</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <Description title="Province" value={data?.data.provinceName} />
                <Description title="City" value={data?.data.cityName} />
                <Description title="District" value={data?.data.districtName} />
              </div>
              <div class="grid grid-cols-3 gap-4 mt-6">
                <div className="col-span-2">
                  <Description title="Detail Address" value={data?.data.detailAddress} />
                </div>
                <div className="col-span-1">
                  <Description title="Postal Code" value={data?.data.postalCode} />
                </div>
              </div>
            </div>
            <div className="mb-8">
              <p className="text-black text-lg font-semibold">Billing Information</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <Description title="Bank Name" value={data?.data.bankName} />
                <Description title="Account Name" value={data?.data.accountName} />
                <Description title="Account Number" value={data?.data.accountNumber} />
                <Description title="Tax Registration Number" value={data ? data?.data.taxRegistrationNumber : ""} />
              </div>
            </div>
            <div className="mb-8">
              <p className="text-black text-lg font-semibold">Billing Information</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
              <div class="grid grid-cols-3 gap-4">
                <DescriptionFile
                  link={cooperationAgreement}
                  title="Corporate Agreement (PKS)"
                  fileName={data?.data.cooperationAgreement}
                />
                <DescriptionFile
                  link={nomorIndukBerusaha}
                  title="Nomor Induk Berusaha (NIB)"
                  fileName={data?.data.nomorIndukBerusaha}
                />
                <DescriptionFile
                  link={kartuTandaPendudukCEO}
                  title="CEO Identity Card (KTP)"
                  fileName={data?.data.kartuTandaPendudukCEO}
                />
                <DescriptionFile
                  link={softCopyNPWP}
                  title="Tax Registration Number"
                  fileName={data?.data.softCopyNPWP}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-6">
            <p className="text-black text-lg font-semibold">Client Logo</p>
            <div className="h-px bg-neutral30 mt-2 mb-4"></div>
            <div>
              <div className="flex">
                <p className="text-black text-sm">
                  Upload a photos with minimum resolution 300 x 300 px and maximum 5000 x 5000 px.
                </p>
                <p className="text-danger500 font-semibold text-sm">*</p>
              </div>
              <div className="w-52 h-52 flex justify-center items-center border-neutral50 border-dashed border-2 rounded-md my-1">
                <img src={data?.data.clientLogo} className="w-52 h-52 object-cover rounded-lg" />
              </div>
              <p className="text-neutral300 text-xs">Format File PNG, JPEG, or JPG, Maximal File 5 MB</p>
            </div>
          </div>
          {(data?.data.status == "Active" || data?.data.status == "Inactive") && (
            <div className="bg-white rounded-lg py-5 px-6 shadow-md mt-6">
              <p className="text-black text-lg font-semibold">Division</p>
              <div className="h-px bg-neutral30 mt-2 mb-4"></div>
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
                </div>
                <div className="drop-shadow">
                  <DataTable
                    columns={columns}
                    reRender={reRender}
                    service={GetAllDivisionByClientID}
                    queryName="divisions"
                    dependencies={[id, dataFilterSearch.value, dataSearch]}
                    params={{ id, dataFilter: dataFilterSearch.value, dataSearch }}
                    options={{ pagination: true }}
                    searchKeyword={dataSearch}
                    onClickRow={(id) => handleNavigateDetailDivision(id)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {roleAccess !== "Client Support" && (
          <Footer
            titleLeftButton="Delete"
            titleRightButton="Edit"
            isActiveLeftButton={roleAccess !== "Client Administrator"}
            isActiveRightButton={true}
            onClickLeftButton={toggleDeleteClientModal}
            onClickRightButton={() => handleNavigateEditClient()}
          />
        )}
        <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isLoading || loadingModalIsOpen} onClose={() => {}}/>
        <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={isModalOpenResult} />
        <ModalState
          title="Delete Client"
          subtitle="Are you sure you want to delete this Client? if you delete the client, it means the division is also deleted"
          isOpen={deleteClientModalIsOpen}
          onClose={toggleDeleteClientModal}
          type="danger"
          titleButtonRight="Delete"
          leftAction={toggleDeleteClientModal}
          rightAction={handleDeleteClient}
        />
        <ModalState
          title="Delete Division"
          subtitle="Are you sure you want to delete this Division?"
          isOpen={deleteDivisionModalIsOpen}
          onClose={toggleDeleteDivisionModal}
          type="danger"
          titleButtonRight="Delete"
          leftAction={toggleDeleteDivisionModal}
          rightAction={handleDeleteDivision}
        />
        <ModalState
          title="Reject Client"
          subtitle="What caused you to reject the verification for this Client?"
          isOpen={rejectClientModalIsOpen}
          onClose={toggleRejectClientModal}
          type="danger"
          addition="textarea"
          placeholderTextArea="Input reason"
          onChangeTextArea={(e) => setReasonRejectClient(e.target.value)}
          valueTextArea={reasonRejectClient}
          titleButtonRight="Decline"
          leftAction={toggleRejectClientModal}
          rightAction={handleRejectClient}
        />
      </div>
    </>
  );
};

export default DetailClient;
