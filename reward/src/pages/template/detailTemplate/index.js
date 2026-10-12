import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import PhoneLayout from "prezent/PhoneLayout";
import { Footer, ModalLoading, ModalState, ModalResult } from "sprint-asia-custom-component";
import InformationSection from "../../../components/DetailTemplate/InformationSection/InformationSection";
import VoucherMessageSection from "../../../components/DetailTemplate/VoucherMessageSection/VoucherMessageSection";
import DetailActivitySection from "../../../components/DetailTemplate/DetailActivitySection/DetailActivitySection";
import { useFetch } from "prezent/useFetch";
import { DeleteTemplate, GetTemplateById } from "../../../service/voucherManagement/endpoint/voucherTemplate";
import moment from "moment";
import { useDisclosure } from "prezent/useDisclosure";
import { NotePencil, Trash } from "@phosphor-icons/react";

const DetailTemplate = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const navigateTo = useNavigate();
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const { isOpen: deleteModalIsOpen, toggle: toggleDeleteModal } = useDisclosure(false);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);

  const { data: template } = useFetch(GetTemplateById, "template", [], { roleAccess, templateId: id });

  const handleNavigateToEditTemplate = () => {
    navigateTo(`/prezent/reward/template/edit/${id}`);
  };

  const handleNavigateToTemplateDashboard = () => {
    navigateTo(`/prezent/reward/template`);
  };

  const handleOpenModalResult = (type, subtitle) => {
    setTimeout(() => {
      setFlagResult(type);
      setDataSubtitleModal(subtitle);
      toggleResultModal();
      setTimeout(() => {
        toggleResultModal();
      }, 3500);
    }, 250);
  };

  const handleDeleteTemplate = async () => {
    try {
      toggleDeleteModal();
      toggleLoadingModal();
      await DeleteTemplate(id);
      toggleLoadingModal();
      handleOpenModalResult("success", "Template Voucher has been successfully deleted.");
      setTimeout(() => {
        handleNavigateToTemplateDashboard();
      }, 3500);
    } catch (error) {
      toggleLoadingModal();
      if (error?.response?.data?.code === 409) {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to delete template at the moment. The template is currently being used for an active voucher."
        );
      } else {
        handleOpenModalResult(
          "failed",
          "Sorry, we are unable to delete template voucher at the moment. Please try again"
        );
      }
    }
  };

  useEffect(() => {
    setTitleHeader("Detail Template Voucher");
  }, []);
  return (
    <>
      <div>
        <div className="flex flex-col gap-6 bg-neutral20 mt-8 px-8 mb-16">
          <div className="flex flex-row flex-wrap gap-6">
            <div className="w-2/3 flex flex-col gap-7">
              <InformationSection
                client={template?.data?.clientName}
                division={template?.data?.divisionName}
                image={template?.data?.templateVoucherPhoto}
                templateName={template?.data?.templateName}
              />

              <VoucherMessageSection
                messageDescription={template?.data?.messageDescription}
                messageTitle={template?.data?.messageTitle}
              />

              <DetailActivitySection
                creadtedBy={template?.data?.createdByName}
                createdDate={template?.data?.createdAt}
                updatedBy={template?.data?.updatedByName}
                updatedDate={template?.data?.updatedAt}
              />
            </div>

            <div className="flex flex-col gap-7 bg-white rounded-lg border border-neutral40 shadow-md p-6 flex-1">
              <div className="text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
                Voucher Preview
              </div>

              <div className="flex justify-center">
                <PhoneLayout
                  mode="Voucher"
                  data={{
                    productName: "Voucher MAP 100.000",
                    orderNumber: "1234567890",
                    validDate: moment().format("DD MMMM YYYY"),
                    voucherDescription:
                      "MAP Gift Voucher is the official gift voucher of PT Mitra Adiperkasa Tbk. Accepted in 2,900 retail stores managed under MAP Group Indonesia, with a wide range of product brands. It is a perfect gift for Birthdays, Annivesaries, Valentines, Holidays, Festivals",
                    voucherBackgroundType: template?.data?.background === "upload_image" ? "image" : "color",
                    voucherBackground:
                      template?.data?.background === "upload_image"
                        ? `${process.env.REACT_APP_API_URL}/template_voucher/${template?.data?.templateVoucherPhoto}`
                        : template?.data?.templateName,
                    messageTitle: template?.data?.messageTitle,
                    message: template?.data?.messageDescription,
                    howToRedeem: "This is how to redeem",
                    terms: "This is terms and conditions",
                    clientLogo: "",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <Footer
          modeLeftButton="danger"
          titleLeftButton={
            <div className="flex items-center gap-1">
              <Trash />
              <p>Delete</p>
            </div>
          }
          titleRightButton={
            <div className="flex items-center gap-2">
              <NotePencil />
              <p>Edit</p>
            </div>
          }
          isActiveLeftButton
          isActiveRightButton
          onClickLeftButton={toggleDeleteModal}
          onClickRightButton={handleNavigateToEditTemplate}
        />
      </div>

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={loadingModalIsOpen} />

      <ModalResult subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} />

      <ModalState
        title="Delete Template Voucher?"
        subtitle="Are you sure you want to delete this template voucher?"
        isOpen={deleteModalIsOpen}
        onClose={toggleDeleteModal}
        type="danger"
        titleButtonRight={
          <div className="flex items-center gap-1">
            <Trash />
            <p>Delete Template</p>
          </div>
        }
        leftAction={toggleDeleteModal}
        rightAction={handleDeleteTemplate}
      />
    </>
  );
};

export default DetailTemplate;
