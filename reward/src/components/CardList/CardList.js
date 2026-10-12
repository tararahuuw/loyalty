/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import styles from "./CardList.module.css";
import { EmptyData, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { useFetch } from "prezent/useFetch";
import { useDisclosure } from "prezent/useDisclosure";
import moment from "moment";

export default function CardList(props) {
  const navigateTo = useNavigate();
  const { options, reRender, params = {}, searchKeyword, service, queryName, dependencies = [], setTotalData } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, open, close } = useDisclosure(false);

  // Fetch data using react query
  const { data, refetch, isLoading, isError } = useFetch(service, queryName, [...dependencies, currentPage], {
    ...params,
    page: currentPage,
  });

  // Open modal when fetch data is error
  useEffect(() => {
    if (isError) {
      open();
    }
  }, [isError]);

  const showing = [9, 20, 50, 100];
  const totalData = queryName ? data?.totalCount : data?.length;
  const [totalDataFiltered, setTotalDataFiltered] = useState(queryName ? data?.totalCount : data?.length);
  const [showingInfo, setShowingInfo] = useState();
  const [pagination, setPagination] = useState([]);

  const [tableIsTouched, setTableIsTouched] = useState(false);

  const updateShowingInfo = () => {
    let showInfo = "";
    if (options.pagination) {
      let fromEntries = totalDataFiltered > 0 ? showing[0] * (currentPage - 1) + 1 : 0;
      let toEntries = showing[0] * currentPage;
      toEntries = toEntries > totalDataFiltered ? totalDataFiltered : toEntries;
      showInfo = `From ${fromEntries} to ${toEntries} of total : ${totalDataFiltered || 0} ${
        totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
      }`;
    } else {
      showInfo = `From ${totalDataFiltered || 0} entries ${
        totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
      }`;
    }

    setShowingInfo(showInfo);
  };

  const updatePagination = () => {
    let totalPage = Math.ceil(totalDataFiltered / showing[0]);

    let arrayPage = [];

    if (totalPage > 5) {
      if (currentPage > 1) {
        arrayPage.push(1);
        arrayPage.push("...");
      }

      arrayPage.push(currentPage);

      if (currentPage < totalPage) {
        arrayPage.push("...");
        arrayPage.push(totalPage);
      }
    } else {
      for (let index = 1; index <= totalPage; index++) {
        arrayPage.push(index);
      }
    }

    setPagination(arrayPage);
  };

  useEffect(() => {
    updatePagination();
    updateShowingInfo();
  }, [data, totalDataFiltered]);

  useEffect(() => {
    if (queryName) {
      if (data?.data?.length === 0) {
        setCurrentPage(data.last_page);
      }
    }
  }, [data]);

  useEffect(() => {
    setTotalDataFiltered(queryName ? data?.totalCount : 0);
  }, [data, totalDataFiltered]);

  useEffect(() => {
    updateShowingInfo();
    updatePagination();
  }, [currentPage]);

  useEffect(() => {
    refetch();
  }, [reRender]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword]);

  // PAGINATION
  const ButttonPagination = (props) => {
    const { value } = props;
    if (value === "...") {
      return (
        <button type="button" className="btn-dots">
          {value}
        </button>
      );
    } else {
      return (
        <button
          type="button"
          className={`${styles.btnPage} ${currentPage === value && styles.btnPage_Active}`}
          onClick={() => {
            setCurrentPage(value);
            if (!tableIsTouched) {
              setTableIsTouched(true);
            }
          }}
        >
          {value}
        </button>
      );
    }
  };

  useEffect(() => {
    if (data && setTotalData) {
      setTotalData(data?.totalCount);
    }
  }, [data]);

  return (
    <>
      <div className={styles.dataTable_Box}>
        {data?.data?.length ? (
          <div className={`${styles.dataTable_Body} grid grid-cols-3 gap-4`}>
            {data.data.map((item) => {
              return (
                <a
                  key={item.id}
                  className={styles.card}
                  onClick={() => navigateTo(`/prezent/reward/template/${item.id}`)}
                >
                  {item.background === "upload_image" ? (
                    <img
                      alt={item.templateVoucherPhoto}
                      src={`${process.env.REACT_APP_API_URL}/template_voucher/${item.templateVoucherPhoto}`}
                      className={styles["card-image"]}
                    />
                  ) : (
                    <div style={{ background: item.templateName }} className={styles["card-image"]} />
                  )}

                  <div className={styles.description}>
                    <p className="font-bold text-xl">{item.templateName}</p>

                    <div>
                      <p className="font-semibold text-black text-sm">{item.client.name}</p>
                      <p className="font-normal text-neutral300 text-xs">{item.divisionName}</p>
                      <p className="font-normal text-neutral300 text-xs">Updated {moment(item.updatedAt).fromNow()}</p>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyData />
        )}

        <div className={`${styles.dataTable_Footer} border-t border-neutral40`}>
          <div className={styles.showingInfo}>
            <div className="font-normal text-black text-sm">{showingInfo}</div>
          </div>
          {options.pagination && (
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.btnQuick}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  if (!tableIsTouched) {
                    setTableIsTouched(true);
                  }
                }}
                disabled={currentPage === pagination[0] ?? false}
              >
                <img
                  style={{ height: "18px", margin: "0 auto" }}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAL9JREFUSEtjZKAxYKSx+QyjFhAM4cEXRAkF/QIsLH/y5/SUNhJ0PgMDaZEMNXw/AwODAQMDQ+OcntIGQpYQHUTIhjMyMFz8/YfFYcGEwg9UsYBcw0GWE/QBJYYTtIBSw4mygJXlz4H/DAz6DAwMF/78YXEkJtyR44WoIKLEEoIWgFwDCipyLSHKAkosIdoCdEv+/2cMnNtbsoEq+QDZEFBwMTP/dSDGcIKpiJDriJEnKYiIMRBdzagFBEON5kEEACMtZRmcDwI5AAAAAElFTkSuQmCC"
                />
              </button>
              {pagination.map((value, index) => (
                <ButttonPagination key={index} value={value} />
              ))}
              <button
                type="button"
                className={styles.btnQuick}
                onClick={() => {
                  setCurrentPage(currentPage + 1);
                  if (!tableIsTouched) {
                    setTableIsTouched(true);
                  }
                }}
                disabled={currentPage === pagination[pagination.length - 1] ?? false}
              >
                <img
                  style={{ height: "18px", margin: "0 auto" }}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAALlJREFUSEvt1LENwkAMBdBvYXo2gRFgA0ZAggFA0EMPEhmBDRiBjACb0OMoyB2i4L4tRaJI6st/53+6E3T8Scf56IFiw/9T0Wp3PJhpdak2z+K2PxZQE3g4gD2Au5nOIggFLNbn0VCtboFxFKEAnziL0EAWCQEZJAWo2g3ARIDHy3T669BDgJ9DJNwnpoFMOA1kw2lguT3NRdor0/n3LacrcqRpBnXkFtMTRN6e9ARZhK6oB7INFP97A04+axn4iq7hAAAAAElFTkSuQmCC"
                />
              </button>
            </div>
          )}
        </div>
      </div>

      <ModalLoading title="Loading..." subtitle="Please wait a moment" isOpen={isLoading} />

      <ModalResult
        subtitle={`Sorry, we are unable to get ${queryName} lists at the moment. Please refresh the page and try again.`}
        type="failed"
        isOpen={isOpen}
        onClose={close}
      />
    </>
  );
}
