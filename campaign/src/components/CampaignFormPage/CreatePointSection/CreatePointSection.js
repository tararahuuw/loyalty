import React, { useState, useRef, useEffect } from "react";
import { Switch } from "sprint-asia-custom-component";
import { CaretDownIcon } from "@phosphor-icons/react";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";
import ParameterSection from "./ParameterSection/ParameterSection";
import EarningPointSection from "./EarningPointSection/EarningPointSection";
import PointMultiplierAndExpirationSection from "./PointMultiplierAndExpirationSection/PointMultiplierAndExpirationSection";
import PointProcessingSection from "./PointProcessingSection/PointProcessingSection";
import PointEarnedNotificationSection from "./PointEarnedNotificationSection/PointEarnedNotificationSection";
import { GetAllParameter } from "../../../service/parametermanagement/endpoint";
import {
  GetAllProvinceStore,
  GetAllStores,
  PostAllCityStore,
  PostAllDistrictStores,
} from "../../../service/storemanagement/endpoint";
import moment from "moment";

const CreatePointSection = ({
  companyId,
  formik,
  existingParameters = [],
  existingChannels = [],
  tierLevels,
  templates,
  senderIds,
}) => {
  const contentRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState(0);
  const [channels, setChannels] = useState([]);
  const [selectedParameters, setSelectedParameters] = useState([]);
  const [dataFilterValue, setDataFilterValue] = useState({ province: [], city: [], district: [], store: [] });
  const [dataFilterException, setDataFilterException] = useState({ province: [], city: [], district: [], store: [] });
  const { isOpen: createPointIsOpen, toggle: toggleCreatePoint, open: openCreatePoint } = useDisclosure();
  const { data: parameters, refetch: refetchParameters } = useFetch(GetAllParameter, "parameter-list", [], companyId);

  const { data: provincesValue } = useFetch(GetAllProvinceStore, "provincesValue", [], null);
  const { data: provincesException } = useFetch(GetAllProvinceStore, "provincesException", [], null);

  const { data: citiesValue } = useFetch(
    dataFilterValue?.province?.length > 0 && dataFilterValue?.province?.length && PostAllCityStore,
    "citiesValue",
    [dataFilterValue?.province?.length],
    { province: dataFilterValue?.province },
  );
  const { data: citiesException } = useFetch(
    dataFilterException?.province?.length > 0 && dataFilterException?.province?.length && PostAllCityStore,
    "citiesException",
    [dataFilterException?.province?.length],
    { province: dataFilterException?.province },
  );

  const { data: districtsValue } = useFetch(
    dataFilterValue?.city?.length > 0 && dataFilterValue?.city?.length && PostAllDistrictStores,
    "districtsValue",
    [dataFilterValue?.city?.length],
    { city: dataFilterValue?.city },
  );
  const { data: districtsException } = useFetch(
    dataFilterException?.city?.length > 0 && dataFilterException?.city?.length && PostAllDistrictStores,
    "districtsException",
    [dataFilterException?.city?.length],
    { city: dataFilterException?.city },
  );

  const { data: storesValue } = useFetch(dataFilterValue.province.length && GetAllStores, "all-stores-value", [], {
    province: dataFilterValue.province,
    city: dataFilterValue.city,
    district: dataFilterValue.district,
  });

  const { data: storesException } = useFetch(
    dataFilterException.province.length && GetAllStores,
    "all-stores-exception",
    [],
    {
      province: dataFilterException.province,
      city: dataFilterException.city,
      district: dataFilterException.district,
    },
  );

  const setSelectedFilterOptionsValue = (options) => {
    setDataFilterValue(options);
  };

  const setSelectedFilterOptionsException = (options) => {
    setDataFilterException(options);
  };

  useEffect(() => {
    formik.setFieldValue(
      "pointParameters",
      selectedParameters.map((parameter, idx) => {
        const exception = parameter.exception ?? {}; // fallback if null

        const hasException =
          (exception.text && exception.text.trim() !== "") ||
          (typeof exception.number === "number" && exception.number !== 0) ||
          (exception.startDate && exception.startDate.trim() !== "") ||
          (Array.isArray(exception.options) && exception.options.length > 0);

        return {
          exception,
          id: parameter.id,
          sequence: idx + 1,
          value: parameter.value,
          name: parameter.parameterName,
          withException: hasException,
          type: parameter.type,
          option: parameter.option,
        };
      }),
    );
  }, [selectedParameters]);

  useEffect(() => {
    if (!existingParameters?.length) return;

    const storeParam = existingParameters.find((p) => p.settingParameterName === "Store");
    if (!storeParam) return;

    // normalize helper
    const normalizeData = (data) => {
      const allStores = data?.options || [];

      const provinces = new Set();
      const cities = new Set();
      const districts = new Set();

      allStores.forEach((store) => {
        if (store.provinceCode !== undefined && store.provinceCode !== null) {
          provinces.add(Number(store.provinceCode));
        }
        if (store.cityCode !== undefined && store.cityCode !== null) {
          cities.add(Number(store.cityCode));
        }
        if (store.districtCode !== undefined && store.districtCode !== null) {
          districts.add(store.districtCode); // keep as string
        }
      });

      return {
        province: [...provinces],
        city: [...cities],
        district: [...districts],
        store: allStores,
      };
    };

    // value
    const normalizedValue = normalizeData(storeParam.value);
    setDataFilterValue(normalizedValue);

    // exception
    const normalizedException = normalizeData(storeParam.exception);
    setDataFilterException(normalizedException);
  }, [existingParameters]);

  useEffect(() => {
    if (contentRef.current) {
      if (createPointIsOpen && formik.values.isPointActive) {
        setMaxHeight(contentRef.current.scrollHeight);
      } else {
        setMaxHeight(0);
      }
    }
  }, [createPointIsOpen, formik.values.isPointActive, formik.values.segmentedCustomer.length]);

  useEffect(() => {
    if (existingParameters.length) {
      setSelectedParameters(() =>
        existingParameters.map((parameter) => ({
          id: parameter.settingParameterId,
          isMaster: parameter.isMaster,
          option: parameter.options?.map((option) => ({ value: option.label, id: option.value })) || [],
          parameterName: parameter.settingParameterName,
          type: parameter.settingParameterType,
          value: {
            endDate: moment(parameter.value?.datetime?.endDate).format("YYYY-MM-DD HH:mm") || null,
            isEndDate: parameter.value?.datetime?.isEndDate || false,
            isIncludeTime: parameter.value?.datetime?.isIncludeTime || false,
            startDate: moment(parameter.value?.datetime?.startDate).format("YYYY-MM-DD HH:mm") || null,
            number: parameter.value?.number || null,
            text: parameter.value?.text || null,
            options: parameter.value?.options ? parameter.value.options.map((option) => option.value) : [],
          },
          exception: {
            endDate: parameter.exception?.datetime?.endDate
              ? moment(parameter.exception.datetime.endDate).format(
                  parameter.exception?.datetime?.isIncludeTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD",
                )
              : null,
            isEndDate: parameter.exception?.datetime?.isEndDate || false,
            isIncludeTime: parameter.exception?.datetime?.isIncludeTime || false,
            startDate: parameter.exception?.datetime?.startDate
              ? moment(parameter.exception.datetime.startDate).format(
                  parameter.exception?.datetime?.isIncludeTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD",
                )
              : null,
            number: parameter.exception?.number ?? null,
            text: parameter.exception?.text ?? null,
            options: parameter.exception?.options ? parameter.exception.options.map((option) => option.value) : [],
          },
          sequence: parameter.sequence,
          withException: parameter.withException,
        })),
      );
    } else {
      if (formik.values.pointProcessingMethod === "upload point" && selectedParameters.length > 0) {
        setSelectedParameters([]);
      }
    }
  }, [existingParameters, parameters, formik.values.pointProcessingMethod]);

  useEffect(() => {
    formik.setFieldValue(
      "channels",
      channels.filter((channel) => channel !== "All"),
    );
  }, [channels]);

  useEffect(() => {
    if (existingChannels.length) {
      setChannels(existingChannels);
    }
  }, [existingChannels]);

  return (
    <div className="flex flex-col gap-3 bg-white rounded-lg border border-neutral40 shadow-md p-6">
      <div className="flex flex-col gap-2 text-lg font-semibold leading-6 text-left pb-2 border-b border-neutral40">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <p>Create Point</p>
            <Switch
              checked={formik.values.isPointActive}
              onChange={() => {
                formik.setFieldValue("isPointActive", !formik.values.isPointActive);
                if (!formik.values.isPointActive) {
                  openCreatePoint();
                }
              }}
              isEdit
            />
          </div>

          {formik.values.isPointActive && (
            <a className="cursor-pointer" onClick={toggleCreatePoint}>
              <CaretDownIcon
                className={`transform ${
                  createPointIsOpen ? "rotate-180" : "rotate-0"
                } transition-transform duration-300 ease-in-out`}
              />
            </a>
          )}
        </div>

        <div className="flex justify-between relative">
          <p className="text-neutral300 text-sm font-normal">
            Enable this to allow Customers to earn points while the campaign is active.
          </p>
        </div>
      </div>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="flex flex-col gap-4 overflow-hidden transition-[max-height] duration-300"
      >
        <PointProcessingSection formik={formik} />
        <ParameterSection
          formik={formik}
          selectedParameters={selectedParameters}
          setSelectedParameters={setSelectedParameters}
          parameters={parameters?.data}
          companyId={companyId}
          refetch={refetchParameters}
          provincesValue={provincesValue}
          citiesValue={citiesValue}
          districtsValue={districtsValue}
          dataFilterValue={dataFilterValue}
          setSelectedFilterOptionsValue={setSelectedFilterOptionsValue}
          dataFilterException={dataFilterException}
          setSelectedFilterOptionsException={setSelectedFilterOptionsException}
          provincesException={provincesException}
          citiesException={citiesException}
          districtsException={districtsException}
          storesValue={storesValue}
          storesException={storesException}
        />
        <EarningPointSection formik={formik} tierLevels={tierLevels} />
        <PointMultiplierAndExpirationSection formik={formik} />
        <PointEarnedNotificationSection
          formik={formik}
          channels={channels}
          templates={templates}
          setChannels={setChannels}
          senderIds={senderIds}
        />
      </div>
    </div>
  );
};

export default CreatePointSection;
