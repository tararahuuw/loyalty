import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Alert, Footer, ModalLoading, ModalResult, ModalState } from "sprint-asia-custom-component";
import {
  DeleteDivision,
  FetchDivisionFileURL,
  GetDivisionById,
} from "../../../service/usermanagement/endpoint/division";
import { PiCoins } from "react-icons/pi";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import StatusSection from "../../../components/Division/DetailDivision/StatusSection/StatusSection";
import InformationSection from "../../../components/Division/DetailDivision/InformationSection/InformationSection";

const DetailDivision = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { data, isError, isLoading } = useFetch(id && GetDivisionById, "division", [], { roleAccess, id });
  const { data: projectBrief, isError: projectBriefIsError } = useFetch(
    data?.data?.projectBrief && FetchDivisionFileURL,
    "projectBrief",
    [],
    {
      file: data?.data?.projectBrief,
    }
  );
  const { data: optionalDocument1, isError: optionalDocument1IsError } = useFetch(
    data?.data?.optionalDocument1 && FetchDivisionFileURL,
    "optionalDocument1",
    [],
    {
      file: data?.data?.optionalDocument1,
    }
  );
  const { data: optionalDocument2, isError: optionalDocument2IsError } = useFetch(
    data?.data?.optionalDocument2 && FetchDivisionFileURL,
    "optionalDocument2",
    [],
    {
      file: data?.data?.optionalDocument2,
    }
  );

  function handleOpenModalResult(type, subtitle) {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 1000);
    }, 250);
  }

  async function handleDeleteDivision() {
    try {
      toggleLoadingModal();
      const response = await DeleteDivision(roleAccess, id);
      if (response.code == 200) {
        toggleDeleteModal();
        toggleLoadingModal();
        handleOpenModalResult("success", "Division has been successfully removed.");
        setTimeout(() => {
          handleNavigateToDivisionDashboard();
        }, 1000);
      } else {
        toggleDeleteModal();
        toggleLoadingModal();
        handleOpenModalResult("failed", "Division has been failed deleted.");
      }
    } catch (error) {
      toggleDeleteModal();
      toggleLoadingModal();
      handleOpenModalResult("failed", "Division has been failed deleted.");
    }
  }

  function handleNavigateToEditDivision() {
    navigateTo(`/prezent/account/division/edit/${id}`);
  }

  function handleNavigateToDivisionDashboard() {
    navigateTo("/prezent/account/division");
  }

  useEffect(() => {
    setTitleHeader("Detail Division");
  }, []);

  useEffect(() => {
    if (isError || projectBriefIsError || optionalDocument1IsError || optionalDocument2IsError) {
      handleOpenModalResult("failed", "Oops! There was an error load the division data. Please try again.");
    }
  }, [isError, projectBriefIsError, optionalDocument1IsError, optionalDocument2IsError]);

  return (
    <div>
      <div className="flex flex-col gap-6 bg-neutral20 p-8 mb-16">
        {roleAccess !== "Client Support" && <StatusSection status={data?.data?.status} />}

        <InformationSection
          roleAccess={roleAccess}
          division={data?.data}
          optionalDocument1={optionalDocument1}
          optionalDocument2={optionalDocument2}
          projectBrief={projectBrief}
          toggleDeleteModal={toggleDeleteModal}
          handleNavigateToEditDivision={handleNavigateToEditDivision}
        />

        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6">
          <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Modify the burning rule</div>
          <div className="flex flex-col gap-1">
            <div>
              <p className="text-black font-semibold text-base">Burning point configuration</p>
              <p className="text-neutral500 font-normal text-sm">
                Define how customers earn loyalty points when they make purchases. Set rules based on the amount spent, and decide whether points are given in a proportionally amount. Adjust these settings to match your loyalty program and ensure customers are rewarded as expected.
              </p>
            </div>
            <div className="text-sm text-neutral500 flex items-center my-8">
              <p className="mr-2 whitespace-nowrap">For every</p>
              <div className="flex items-center">
                <PiCoins />
                <p className="whitespace-nowrap font-semibold ml-1">{data?.data?.burningRolePoint ? data?.data?.burningRolePoint.toLocaleString() : 0}</p>
              </div>
              <p className="mx-2 whitespace-nowrap">Point earned, is equivalent to</p>
              <p className="whitespace-nowrap font-semibold ml-1">Rp {data?.data?.burningRoleRupiah ? data?.data?.burningRoleRupiah.toLocaleString() : 0}</p>
              <p className="ml-2 whitespace-nowrap">In product rewards</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 bg-white rounded-lg shadow-md border border-neutral40 p-6">
          <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">Reward Money</div>
          <div className="flex flex-col gap-1">
            <p className={`${data?.data?.deductFromTransaction ? "text-success500" : "text-danger500"} font-semibold text-base mb-2`}>Reward Money {data?.data?.deductFromTransaction ? "" : "is not"} Applied</p>
            <Alert subtitle="When enabled, the amount used for redemption will be directly deducted from the customer's total transaction. If disabled, customers can only redeem points for reward products without reducing their total transaction amount." />
          </div>
        </div>
      </div>

      {roleAccess !== "Client Support" && (
        <Footer
          modeLeftButton="danger"
          titleLeftButton="Delete"
          titleRightButton="Edit"
          isActiveLeftButton
          isActiveRightButton
          onClickLeftButton={toggleDeleteModal}
          onClickRightButton={handleNavigateToEditDivision}
        />
      )}

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isLoading || loadingModalIsOpen} onClose={() => {}}/>

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

      <ModalState
        title="Delete Division?"
        subtitle="Are you sure you want to delete this Division?"
        isOpen={deleteModalIsOpen}
        onClose={toggleDeleteModal}
        type="danger"
        titleButtonRight="Delete"
        leftAction={toggleDeleteModal}
        rightAction={handleDeleteDivision}
      />
    </div>
  );
};

export default DetailDivision;
