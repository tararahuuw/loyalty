import React, { useState, useEffect } from "react";

import _ from "lodash";

import { useNavigate, useParams } from "react-router-dom";
import { Description, SearchDropdown, TabBar, ChipBar, ModalLoading } from "sprint-asia-custom-component";
import DataTable from "prezent/DataTable";
import { useFetch } from "prezent/useFetch";
import ProgressBar from "../../../components/ProgressBar/ProgressBar";
import moment from "moment";
import CustomDatePicker from "../../../components/DatePicker/DatePicker";
import {
  GetAllDetailGenerated,
  GetAllDetailRedeemed,
  GetCustomerById,
} from "../../../service/CustomerManagement/endpoint";
import { formatPrefixPhoneNumber } from "../../../utils/index";

const DetailCustomer = ({ roleAccess, setTitleHeader }) => {
  const { id } = useParams();
  const [dataSearchGenerated, setDataSearchGenerated] = useState("");
  const [dataSearchRedeemed, setDataSearchRedeemed] = useState("");
  const [reRender, setReRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("Details");
  const [currentChip, setCurrentChip] = useState("Generate Point");
  const [startDateGenerated, setStartDateGenerated] = useState();
  const [endDateGenerated, setEndDateGenerated] = useState();
  const [startDateRedeemed, setStartDateRedeemed] = useState();
  const [endDateRedeemed, setEndDateRedeemed] = useState();
  const { data, isLoading } = useFetch(id && GetCustomerById, "customer", [], { roleAccess, id });

  const [dataFilterSearchGenerated, setDataFilterSearchGenerated] = useState({
    option: "Campaign Name",
    value: "pointRulesName",
  });

  const [dataFilterSearchRedeemed, setDataFilterSearchRedeemed] = useState({
    option: "Campaign Name",
    value: "pointRulesName",
  });

  const navigateTo = useNavigate();

  const dataOptionsGenerated = [
    {
      option: "Campaign Name",
      value: "pointRulesName",
    },
    {
      option: "Generated ID",
      value: "id",
    },
  ];

  const dataOptionsRedeemed = [
    {
      option: "Campaign Name",
      value: "pointRulesName",
    },
    {
      option: "Redeemed ID",
      value: "id",
    },
  ];

  const columnsGenerated = [
    {
      header: "DATE",
      assessor: "date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">
              {row?.createdAt ? moment(row?.createdAt).format("DD MMM YYYY, HH:mm") : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "GENERATE ID",
      assessor: "date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row?.id || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "CAMPAIGN NAME",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row?.pointRulesName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "GENERATE POINT",
      assessor: "generate point",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">
              {row?.generatedPoint ? row?.generatedPoint.toLocaleString() : "-"}
            </p>
          </div>
        );
      },
    },
  ];

  const columnsRedeemed = [
    {
      header: "DATE",
      assessor: "date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">
              {row?.createdAt ? moment(row?.createdAt).format("DD MMM YYYY, HH:mm") : "-"}
            </p>
          </div>
        );
      },
    },
    {
      header: "REDEEMED ID",
      assessor: "date",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row?.id || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "CAMPAIGN NAME",
      assessor: "name",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row?.pointRulesName || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "REDEEMED POINT",
      assessor: "redeemed point",
      Cell: (row) => {
        return (
          <div>
            <p className="font-normal text-black text-sm">{row?.redeemedPoint || "-"}</p>
          </div>
        );
      },
    },
    {
      header: "Reward Items",
      assessor: "rewards",
      Cell: (row) => {
        return (
          <div>
            <p className="font-semibold text-black text-sm">{row?.voucher?.name || "-"}</p>
            <p className="font-normal text-neutral300 text-xs">
              {row?.voucher?.type || "-"} - {row?.voucher?.category || "-"}
            </p>
            <p className="font-normal text-neutral300 text-xs">{row?.voucher?.id || "-"}</p>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    setTitleHeader("Customer Details");
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10">
        <TabBar
          dataBar={["Details", "Activity"]}
          dataValue={["Details", "Activity"]}
          currentTab={currentTab}
          onChangeTabBar={(tab) => setCurrentTab(tab)}
        />
        {currentTab === "Activity" && (
          <ChipBar
            dataBar={["Generate Point", "Redeem Point"]}
            dataValue={["Generate Point", "Redeem Point"]}
            currentTab={currentChip}
            onChangeChipBar={(chip) => setCurrentChip(chip)}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral20">
        {currentTab === "Details" ? (
          <div>
            <div className="pt-6 px-8">
              <div className="bg-white rounded-lg py-5 px-6 shadow-md">
                <div>
                  <p className="text-black text-lg font-semibold">Personal Detail</p>
                  <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                  <div class="grid grid-cols-3 gap-4">
                    <Description title="Name" value={data?.data?.name || "-"} />
                    <Description title="Total Point" value={data?.data?.totalPoint?.toLocaleString() || "-"} />
                  </div>
                  <div class="grid grid-cols-3 gap-4">
                    <Description title="Customer ID" value={formatPrefixPhoneNumber(data?.data?.customerId) || "-"} />
                    <Description title="Email" value={data?.data?.email || "-"} />
                    <Description title="Phone Number" value={formatPrefixPhoneNumber(data?.data?.phoneNumber) || "-"} />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 px-8">
              <div className="bg-white rounded-lg py-5 px-6 shadow-md">
                <div>
                  <p className="text-black text-lg font-semibold">Address Information</p>
                  <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                  <div class="grid grid-cols-3 gap-4">
                    <Description title="Province" value={data?.data?.provinceName || "-"} />
                    <Description title="City" value={data?.data?.cityName || "-"} />
                    <Description title="District" value={data?.data?.districtName || "-"} />
                  </div>
                  <div class="grid grid-cols-3 gap-4 mt-6">
                    <div className="col-span-2">
                      <Description title="Detail Address" value={data?.data?.detailAddress || "-"} />
                    </div>
                    <div className="col-span-1">
                      <Description title="Postal Code" value={data?.data?.postalCode || "-"} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {data?.data?.tierLevels && (
              <div className="pt-6 px-8 mb-8">
                <div className="bg-white rounded-lg py-5 px-6 shadow-md">
                  <div>
                    <p className="text-black text-lg font-semibold">Tier Level</p>
                    <div className="h-px bg-neutral30 mt-2 mb-4"></div>
                    <p className="text-black text-sm font-normal">
                      Customers will join the tier immediately once the target transaction is reached. The season
                      determination for each user ID will start from the beginning of the year when the user registers
                      for the loyalty program in the app. The season will only appear when tier downgrade activated.
                    </p>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                      {data &&
                        data?.data?.tierLevels?.map((value, index) => (
                          <div
                            className={`border-2 ${
                              data?.data?.currentTierLevelId === value?.id ? "border-info500" : "border-neutral30"
                            } rounded-lg p-4 w-fit h-36 flex items-center`}
                          >
                            <div>
                              {data?.data?.currentTierLevelId === value?.id && (
                                <div className="w-fit">
                                  <p className="inline-block px-2 py-0.5 bg-info500 rounded-full text-white text-sm">
                                    Current tier
                                  </p>
                                </div>
                              )}
                              <p className="text-2xl text-black py-2 font-semibold">{value?.name}</p>
                              <p className="text-neutral300 text-sm">Amount Transaction</p>
                              <p className="text-neutral300 text-sm">Rp{value?.targetAmount?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="border rounded-lg p-4 mt-4">
                      <p className="text-sm text-neutral300">
                        Rp{" "}
                        <span className="text-black font-semibold">{data?.data?.currentAmount?.toLocaleString()}</span>
                        {data?.data?.nextAmount >= 0 && (
                          <span>
                            {" "}
                            / Rp {data?.data?.nextAmount?.toLocaleString()}{" "}
                            {data?.data?.currentTierLevelId ===
                              data?.data?.tierLevels[data?.data?.tierLevels.length - 1].id ||
                            data?.data?.isResetPoint === true
                              ? "transaction to maintain current level"
                              : "transaction to the next level"}
                          </span>
                        )}
                      </p>
                      <ProgressBar progress={data?.data?.percentage || 0} />
                      {data?.data?.endOfPeriod && (
                        <div>
                          <p className="text-neutral300 text-sm">Purchase & Maintain Your Level Before</p>
                          <p className="text-neutral300 text-sm">
                            {moment(data?.data?.endOfPeriod).format("DD MMM YYYY")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="pt-6 px-8 mb-6">
              <div className="bg-white rounded-lg py-5 px-6 shadow-md">
                <div>
                  <div class="grid grid-cols-2 gap-4">
                    <Description
                      title={"Customer ID : " + formatPrefixPhoneNumber(data?.data?.customerId)}
                      value={data?.data?.name || "-"}
                    />
                    <Description
                      title="Current Point"
                      value={data?.data?.totalPoint?.toLocaleString("id", "ID") || 0}
                    />
                  </div>
                </div>
              </div>
            </div>
            {currentChip === "Generate Point" ? (
              <div className="bg-white rounded-lg shadow-md h-full my-3 mx-8">
                <div className="flex justify-between items-center w-full py-3 px-4">
                  <div className="flex gap-3 flex-1">
                    <div>
                      <SearchDropdown
                        options={dataOptionsGenerated}
                        placeholderSearch="Search Here"
                        filterDropdown={dataFilterSearchGenerated}
                        setFilterDropdown={setDataFilterSearchGenerated}
                        onEnterPress={setDataSearchGenerated}
                      />
                    </div>

                    <CustomDatePicker
                      placeholder="Select Range Date"
                      mode={"dashboard"}
                      value={[startDateGenerated, endDateGenerated]}
                      onChangeRange={(start, end) => {
                        setStartDateGenerated(start);
                        setEndDateGenerated(end);
                      }}
                      onReset={() => {
                        setStartDateGenerated("");
                        setEndDateGenerated("");
                      }}
                      className="max-w-xs"
                    />
                  </div>
                </div>
                <div className="drop-shadow">
                  <DataTable
                    columns={columnsGenerated}
                    reRender={reRender}
                    service={GetAllDetailGenerated}
                    queryName="customer-360"
                    dependencies={[
                      currentChip,
                      data?.data?.id,
                      dataFilterSearchGenerated.value,
                      dataSearchGenerated,
                      endDateGenerated,
                    ]}
                    params={{
                      id: data?.data?.id || null,
                      dataFilter: dataFilterSearchGenerated.value,
                      dataSearch: dataSearchGenerated,
                      dates: endDateGenerated
                        ? {
                            startDate: moment(startDateGenerated).format("YYYY-MM-DD"),
                            endDate: moment(endDateGenerated).format("YYYY-MM-DD"),
                          }
                        : null,
                    }}
                    options={{ pagination: true }}
                    searchKeyword={dataSearchGenerated}
                    onClickRow={() => {}}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md h-full my-3 mx-8">
                <div className="flex justify-between items-center w-full py-3 px-4">
                  <div className="flex gap-3 flex-1">
                    <div>
                      <SearchDropdown
                        options={dataOptionsRedeemed}
                        placeholderSearch="Search Here"
                        filterDropdown={dataFilterSearchRedeemed}
                        setFilterDropdown={setDataFilterSearchRedeemed}
                        onEnterPress={setDataSearchRedeemed}
                      />
                    </div>

                    <CustomDatePicker
                      placeholder="Select Range Date"
                      mode={"dashboard"}
                      value={[startDateRedeemed, endDateRedeemed]}
                      onChangeRange={(start, end) => {
                        setStartDateRedeemed(start);
                        setEndDateRedeemed(end);
                      }}
                      onReset={() => {
                        setStartDateRedeemed("");
                        setEndDateRedeemed("");
                      }}
                      className="max-w-xs"
                    />
                  </div>
                </div>
                <div className="drop-shadow">
                  <DataTable
                    columns={columnsRedeemed}
                    reRender={reRender}
                    service={GetAllDetailRedeemed}
                    queryName="customer-360"
                    dependencies={[
                      currentChip,
                      data?.data?.id,
                      dataFilterSearchRedeemed.value,
                      dataSearchRedeemed,
                      endDateRedeemed,
                    ]}
                    params={{
                      id: data?.data?.id || null,
                      dataFilter: dataFilterSearchRedeemed.value,
                      dataSearch: dataSearchRedeemed,
                      dates: endDateRedeemed
                        ? {
                            startDate: moment(startDateRedeemed).format("YYYY-MM-DD"),
                            endDate: moment(endDateRedeemed).format("YYYY-MM-DD"),
                          }
                        : null,
                    }}
                    options={{ pagination: true }}
                    searchKeyword={dataSearchRedeemed}
                    onClickRow={() => {}}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} />
    </>
  );
};

export default DetailCustomer;
