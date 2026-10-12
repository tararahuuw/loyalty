import React, { useEffect, useState } from "react";
import HeaderSection from "../../../components/Simulation/HeaderSection";
import CampaignDetailSection from "../../../components/Simulation/CampaignDetailSection";
import { useFetch } from "prezent/useFetch";
import LoadingModal from "prezent/LoadingModal";
import ResultModal from "prezent/ResultModal";
import {
  CalculatePoints,
  CreateSimulation,
  GetAllCampaignList,
  GetAllPrograms,
  GetDetailCampaign,
} from "../../../service/pointrulesmanagement/endpoint";
import { GetTierLevels } from "../../../service/tierlevelmanagement/endpoint";
import SampleTransaction from "../../../components/Simulation/SampleTransactionSection/SampleTransaction";
import { Footer } from "sprint-asia-custom-component";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDisclosure } from "prezent/useDisclosure";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const AddSimulation = ({ setTitleHeader, companyId, userInfo, handleSetCampaignId }) => {
  const navigate = useNavigate();
  const [calendarIsOpen, setCalendarIsOpen] = useState(false);
  const [calculatedPoints, setCalculatedPoints] = useState(null);
  const [flagResult, setFlagResult] = useState("success");
  const [dataSubtitleModal, setDataSubtitleModal] = useState("");
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const { isOpen: loadingModalIsOpen, toggle: toggleLoadingModal } = useDisclosure(false);
  const { isOpen: resultModalIsOpen, toggle: toggleResultModal } = useDisclosure(false);
  const { data: detailCampaign, isLoading } = useFetch(
    selectedCampaignId && GetDetailCampaign,
    "detail-campaign",
    [],
    selectedCampaignId,
  );
  const { data: campaignList, isLoading: listIsLoading } = useFetch(GetAllCampaignList, "campaign-list", [], companyId);
  const { data: tierLevels } = useFetch(GetTierLevels, "tier-levels", [], {});
  const { data: programs } = useFetch(GetAllPrograms, "programs", [], {});

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

  const formik = useFormik({
    initialValues: {
      campaignId: selectedCampaignId || "",
      customerName: userInfo?.userName || "",
      phoneNumber: `+${userInfo?.phoneNumber}` || "",
      email: userInfo?.email || "",
      transactionDate: moment().format("YYYY-MM-DD HH:mm:ss") || "",
      tierLevelId: "",
      parameters: [],
    },
    validationSchema: yup.object().shape({
      campaignId: yup.string().required("Please complete this required field to continue."),
      customerName: yup.string().required("Please complete this required field to continue."),
      email: yup.string().required("Please complete this required field to continue."),
      transactionDate: yup.string().required("Please complete this required field to continue."),
      tierLevelId:
        detailCampaign?.data?.campaignPointActive?.earningPointMethod === "segmented"
          ? yup.string().required("Please complete this required field to continue.")
          : yup.string().notRequired(),
      parameters: yup.array().of(
        yup.object().shape({
          id: yup.string().required("Parameter id is required"),
          type: yup.string().required("Parameter type is required"),
          value: yup
            .object()
            .when("type", {
              is: "text",
              then: () =>
                yup.object().shape({
                  text: yup.string().required("Please complete this required field to continue."),
                }),
            })
            .when("type", {
              is: "number",
              then: () =>
                yup.object().shape({
                  number: yup
                    .number()
                    .min(1, "Please complete this required field to continue.")
                    .required("Please complete this required field to continue."),
                }),
            })
            .when("type", {
              is: "option",
              then: () =>
                yup.object().shape({
                  option: yup.array().min(1, "Please complete this required field to continue."),
                }),
            })
            .when("type", {
              is: "datetime",
              then: () =>
                yup.object().shape({
                  datetime: yup.string().required("Please complete this required field to continue."),
                }),
            }),
        }),
      ),
    }),
    onSubmit: (values) => {
      handleSubmitSimulation(values);
    },
  });

  const handleSubmitSimulation = async (form) => {
    try {
      toggleLoadingModal();
      const formattedDateTime = moment(form.transactionDate).format("DD-MM-YYYY HH:mm");

      const payload = {
        ...form,
        transactionDate: formattedDateTime,
        parameters: form.parameters.map((param) => {
          if (param.type === "datetime") {
            return {
              ...param,
              value: {
                ...param.value,
                datetime: formattedDateTime,
              },
            };
          }
          return param;
        }),
      };

      await CreateSimulation(payload);
      handleSetCampaignId(selectedCampaignId);
      toggleLoadingModal();
      setTimeout(() => {
        handleOpenModalResult("success", "Simulation has been successfully saved.");
        setTimeout(() => {
          navigate("/prezent/campaign/simulation");
        }, 1500);
      }, 250);
    } catch (error) {
      toggleLoadingModal();
      handleOpenModalResult("failed", "Sorry, unable to create simulation at the moment. Please try again");
    }
  };

  const handleCalculatePoints = async () => {
    try {
      toggleLoadingModal();
      var form = formik.values;
      const formattedDateTime = moment(form.transactionDate).format("DD-MM-YYYY HH:mm");

      const payload = {
        ...form,
        transactionDate: formattedDateTime,
        parameters: form.parameters.map((param) => {
          if (param.type === "datetime") {
            return {
              ...param,
              value: {
                ...param.value,
                datetime: formattedDateTime,
              },
            };
          }
          return param;
        }),
      };

      var response = await CalculatePoints(payload);
      setCalculatedPoints(response.data);
      toggleLoadingModal();
    } catch (error) {
      toggleLoadingModal();
      setCalculatedPoints(0);
      handleOpenModalResult("failed", "Points has been failed calculated");
    }
  };

  // Insert parameters initially
  useEffect(() => {
    if (detailCampaign?.data?.campaignPointActive?.pointParameters?.length) {
      formik.setFieldValue(
        "parameters",
        detailCampaign.data.campaignPointActive.pointParameters.map((parameter) => ({
          id: parameter.id,
          name: parameter.settingParameterName,
          type: parameter.settingParameterType,
          options: parameter.options || [],
          value: {
            number: null,
            text: null,
            datetime:
              parameter.settingParameterType === "datetime"
                ? moment(formik.values.transactionDate).format("DD-MM-YYYY HH:mm")
                : null,
            option: [],
          },
        })),
        false,
      );
    }
  }, [detailCampaign?.data?.campaignPointActive?.pointParameters]);

  useEffect(() => {
    setCalculatedPoints(null);
  }, [selectedCampaignId]);

  useEffect(() => {
    setTitleHeader("Create Sample Data");
  }, []);
  return (
    <div className={`flex flex-col gap-4 py-6 px-8 ${calendarIsOpen ? "mb-48" : "mb-16"}`}>
      <HeaderSection
        formik={formik}
        setSelectedCampaignId={setSelectedCampaignId}
        selectedCampaignId={selectedCampaignId}
        campaignList={campaignList?.data}
      />

      {detailCampaign && (
        <>
          <CampaignDetailSection
            name={detailCampaign?.data?.name}
            description={detailCampaign?.data?.description}
            startDate={detailCampaign?.data?.startDate}
            endDate={detailCampaign?.data?.endDate}
            isPointActive={detailCampaign?.data?.isPointActive}
            pointProcessingMethod={detailCampaign?.data?.campaignPointActive?.pointProcessing}
            method={detailCampaign?.data?.campaignPointActive?.earningPointMethod}
            parameters={detailCampaign?.data?.campaignPointActive?.pointParameters}
            pointEarned={detailCampaign?.data?.campaignPointActive?.earningPointAll?.pointEarned}
            pointEarnedException={detailCampaign?.data?.campaignPointActive?.earningPointAll?.pointEarnedException}
            segmentedCustomers={detailCampaign?.data?.campaignPointActive?.earningPointSegmented}
            channels={detailCampaign?.data?.campaignPointActive?.pointEarnedNotification?.channels}
            isPointEarnedNotification={detailCampaign?.data?.campaignPointActive?.isPointEarnedNotification}
            isPointMultiplier={detailCampaign?.data?.campaignPointActive?.isPointMultiplied}
            pointExpiration={detailCampaign?.data?.campaignPointActive?.pointExpiration}
            senderName={detailCampaign?.data?.campaignPointActive?.pointEarnedNotification?.senderName}
            subject={detailCampaign?.data?.campaignPointActive?.pointEarnedNotification?.subject}
          />

          <SampleTransaction
            channels={detailCampaign?.data?.campaignPointActive?.pointEarnedNotification?.channels}
            method={detailCampaign?.data?.campaignPointActive?.earningPointMethod}
            tiers={tierLevels?.data}
            programs={programs?.data}
            customerEmail={userInfo.email}
            customerName={userInfo.userName}
            customerPhoneNumber={userInfo.phoneNumber}
            parameters={detailCampaign?.data?.campaignPointActive?.pointParameters}
            formik={formik}
            handleCalculatePoints={handleCalculatePoints}
            calculatedPoints={calculatedPoints?.point}
            isException={calculatedPoints?.isException}
            setCalendarIsOpen={setCalendarIsOpen}
            minDate={detailCampaign?.data?.startDate}
            maxDate={detailCampaign?.data?.endDate}
          />
        </>
      )}

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={isLoading || listIsLoading || loadingModalIsOpen}
        onClose={() => {}}
      />

      <ResultModal subtitle={dataSubtitleModal} type={flagResult} isOpen={resultModalIsOpen} onClose={() => {}} />

      <Footer
        modeLeftButton="outline"
        modeRightButton="primary"
        titleLeftButton="Cancel"
        titleRightButton="Submit"
        isActiveLeftButton
        isActiveRightButton
        onClickLeftButton={() => navigate("/prezent/campaign/simulation")}
        onClickRightButton={formik.handleSubmit}
      />
    </div>
  );
};

export default AddSimulation;
