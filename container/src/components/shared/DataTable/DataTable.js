/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import styles from "./DataTable.module.css";
import { EmptyData } from "sprint-asia-custom-component";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useFetch } from "../../../hooks/useFetch";
import LoadingModal from "../LoadingModal/LoadingModal";
import { DotsThreeVertical, Square, CheckSquare } from "@phosphor-icons/react";
import ResultModal from "../ResultModal/ResultModal";

export default function DataTable(props) {
  const {
    staticData,
    columns,
    onClickRow,
    options,
    reRender,
    params = {},
    searchKeyword,
    service,
    queryName,
    dependencies = [],
    setTotalData,
    setCheckedParent,
    getResponse,
    loadingIndicator = false,
    maxHeight,
  } = props;

  const [currentPage, setCurrentPage] = useState(1);
  const { isOpen, open, close } = useDisclosure(false);
  const { isOpen: loadingIsOpen, open: openLoading, close: closeLoading } = useDisclosure(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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

  useEffect(() => {
    if (isLoading) {
      openLoading();
    } else {
      closeLoading();
    }
  }, [isLoading]);

  const showing = [10, 20, 50, 100];
  const totalData = queryName ? data?.totalCount : staticData?.length;
  const [totalDataFiltered, setTotalDataFiltered] = useState(queryName ? data?.totalCount : staticData?.length);
  const [tableBody, setTableBody] = useState([]);
  const [dataTableSearch, setDataTableSearch] = useState({});
  const [showEntries, setShowEntries] = useState(showing[0]);
  const [showingInfo, setShowingInfo] = useState();
  const [pagination, setPagination] = useState([]);
  const [sortBy, setSortBy] = useState({});
  const sortType = [undefined, "asc", "desc"];
  const defaultOptions = {
    sorting: options?.sorting,
    pagination: options?.pagination && false,
    searching: options?.searching && false,
    bulkAction: options?.bulkAction && false,
    kebab: options?.kebab,
    checkbox: options?.checkbox,
    isRounded: options?.isRounded,
  };
  const [tableSearchKeyword, setSearchKeyword] = useState("");
  const [tableIsTouched, setTableIsTouched] = useState(false);

  const updateShowingInfo = () => {
    let showInfo = "";
    if (options.pagination) {
      let fromEntries = totalDataFiltered > 0 ? showEntries * (currentPage - 1) + 1 : 0;
      let toEntries = showEntries * currentPage;
      toEntries = toEntries > totalDataFiltered ? totalDataFiltered : toEntries;
      showInfo = `From ${fromEntries} to ${toEntries} of total : ${totalDataFiltered || 0} ${
        totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
      }`;
    }
    // else {
    //   showInfo = `From ${totalDataFiltered || 0} entries ${
    //     totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
    //   }`;
    // }

    setShowingInfo(showInfo);
  };

  const updatePagination = () => {
    let totalPage = Math.ceil(totalDataFiltered / showEntries);

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

  const generateTableBody = () => {
    let filtered = queryName ? data?.data || [] : staticData;
    if (Object.keys(dataTableSearch).length) {
      Object.entries(dataTableSearch).forEach((item) => {
        if (item[0] === "global") {
          filtered = [...filtered].filter((data) =>
            columns
              .map(
                (column) =>
                  column?.assessor &&
                  data?.[column?.assessor] &&
                  data?.[column?.assessor].toString().toLowerCase().indexOf(item[1]) > -1,
              )
              .includes(true),
          );
        } else {
          filtered = [...filtered].filter((data) => data[item[0]] === item[1]);
        }
      });
    }

    if (Object.keys(sortBy).length) {
      Object.entries(sortBy).forEach((item) => {
        filtered = [...filtered].sort((a, b) => {
          let comparison = 0;

          if (a[item[0]] > b[item[0]]) {
            comparison = 1;
          } else if (a[item[0]] < b[item[0]]) {
            comparison = -1;
          }

          return item[1] === "desc" ? comparison * -1 : comparison;
        });
      });
    }

    let tbody = [];
    if (options.pagination && !queryName) {
      tbody = filtered.filter((row, index) => {
        let start = (currentPage - 1) * showEntries;
        let end = currentPage * showEntries;
        if (index >= start && index < end) {
          return true;
        } else {
          return false;
        }
      });
    } else {
      tbody = filtered;
    }

    setTableBody(tbody);
    setTotalDataFiltered(queryName ? data?.totalCount : filtered.length);
  };

  useEffect(() => {
    if (data && !isLoading) {
      setIsDataLoaded(true);
    }
  }, [data, isLoading]);

  useEffect(() => {
    if (queryName) {
      if (currentPage > 1 && tableBody.length === 0 && isDataLoaded) {
        setIsDataLoaded(false);
        setCurrentPage((prevPage) => prevPage - 1);
      }
    } else if (staticData) {
      if (currentPage > 1 && tableBody.length === 0) {
        setCurrentPage((prevPage) => prevPage - 1);
      }
    }
  }, [tableBody.length, isDataLoaded, queryName, staticData]);

  useEffect(() => {
    generateTableBody();
    updatePagination();
    updateShowingInfo();
  }, [data, showEntries, totalDataFiltered, staticData]);

  useEffect(() => {
    if (queryName) {
      if (data?.data?.length === 0) {
        setCurrentPage(data.last_page || 1);
        setIsDataLoaded(false);
      }
    }
  }, [data, showEntries]);

  useEffect(() => {
    updateShowingInfo();
    updatePagination();
    generateTableBody();
  }, [currentPage]);

  useEffect(() => {
    refetch();
  }, [reRender]);

  useEffect(() => {
    setCurrentPage(1);
    setIsDataLoaded(false);
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
            setIsDataLoaded(false);
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

  // SORTING
  const generateSort = (name, type) => {
    let typeValue = undefined;
    if (sortType.indexOf(type) === sortType.length) {
      typeValue = sortType[0];
    } else {
      typeValue = sortType[sortType.indexOf(type) + 1];
    }

    if (typeValue) {
      setSortBy({
        ...sortBy,
        [name]: typeValue,
      });
    } else {
      delete sortBy[name];
      setSortBy({ ...sortBy });
    }
  };

  useEffect(() => {
    if (Object.keys(columns).length) {
      Object.entries(columns).forEach((column) => {
        setSortBy({
          ...sortBy,
          [column.assessor]: undefined,
        });
      });
    }
  }, []);

  useEffect(() => {
    if (getResponse) {
      getResponse(data);
    }
  }, [data]);

  useEffect(() => {
    if (data && setTotalData) {
      setTotalData(data?.totalCount);
    }
  }, [data, staticData]);

  // Check all options configurations

  const { isOpen: menuIsOpen, toggle: toggleMenu } = useDisclosure(false);

  const [checkedData, setCheckedData] = useState([]);

  const checkAllData = () => {
    if (checkedData.length > 0) {
      setCheckedData([]);
    } else {
      setCheckedData(data ? data?.data : staticData);
    }

    toggleMenu();
  };

  const removeCheckedData = (dataId) => {
    const filteredData = checkedData.filter((item) => {
      return item.id !== dataId;
    });

    setCheckedData(filteredData);
  };

  const addCheckedData = (data) => {
    setCheckedData((prevState) => {
      if (!prevState.find((item) => item.id === data.id)) {
        return [...prevState, data];
      }
      return prevState;
    });
  };

  useEffect(() => {
    if (defaultOptions.kebab || defaultOptions.checkbox) {
      setCheckedParent(checkedData);
    }
  }, [checkedData]);

  return (
    <>
      <div className={styles.dataTable_Box}>
        <div
          className={`${styles.dataTable_Body} no-scrollbar`}
          style={{
            borderRadius:
              options?.isRounded && !options?.pagination
                ? "8px 8px 8px 8px"
                : options?.isRounded && options.pagination
                  ? "8px 8px 0px 0px"
                  : "",
            borderLeft: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
            borderBottom: !options?.pagination ? "1px solid #e0e0e0" : "0px",
            maxHeight: !options.pagination ? maxHeight || 500 : undefined,
            overflowY: !options.pagination ? "auto" : undefined,
          }}
        >
          <table className={styles.dataTable}>
            <thead className="bg-neutral20 text-neutral500 text-xs font-semibold">
              <tr className="border-t border-neutral40 uppercase">
                {columns &&
                  columns.map((column, index) => (
                    <th key={index} style={{ ...column?.tdStyle, textAlign: column?.tdStyle?.textAlign || "left" }}>
                      <span>{column?.header}</span>
                    </th>
                  ))}
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr key={1}>
                  <td colSpan={columns.length} className="text-center border-t border-neutral40">
                    <p className="m-0">Loading...</p>
                  </td>
                </tr>
              ) : tableBody && tableBody.length > 0 ? (
                tableBody.map((row, iRow) => (
                  <tr key={iRow} className="border-t border-neutral40">
                    {columns.map((column, iCell) => (
                      <td
                        key={iCell}
                        style={column?.tdStyle}
                        className="font-normal text-black text-sm align-top"
                        onClick={!column?.assessor ? undefined : () => onClickRow(row.id, row)}
                      >
                        <div className="flex items-center gap-4">
                          {(defaultOptions.kebab || defaultOptions.checkbox) &&
                            iCell === 0 &&
                            (checkedData.find((item) => item.id === row.id) ? (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCheckedData(row.id);
                                }}
                              >
                                <CheckSquare size={18} className="text-primary500" />
                              </a>
                            ) : (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addCheckedData(row);
                                }}
                              >
                                <Square size={18} className="text-neutral500" />
                              </a>
                            ))}
                          {column?.Cell ? column.Cell(row, iRow) : row?.[column?.assessor]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center">
                    <EmptyData />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {options.pagination && (
          <div
            className={`${styles.dataTable_Footer} ${
              options.isRounded && "border-b border-l border-r rounded-bl-md rounded-br-md"
            } border-t border-neutral40`}
          >
            <div className={styles.showingInfo}>
              <div className="font-normal text-black text-sm">{showingInfo}</div>
            </div>
            <div className={styles.pagination}>
              <button
                type="button"
                className={styles.btnQuick}
                onClick={() => {
                  setCurrentPage(currentPage - 1);
                  setIsDataLoaded(false);
                  if (!tableIsTouched) {
                    setTableIsTouched(true);
                  }
                }}
                disabled={currentPage === pagination[0] || !totalDataFiltered} // Disable if first page or no data
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
                  setIsDataLoaded(false);
                  if (!tableIsTouched) {
                    setTableIsTouched(true);
                  }
                }}
                disabled={currentPage === pagination[pagination.length - 1] || !totalDataFiltered} // Disable if last page or no data
              >
                <img
                  style={{ height: "18px", margin: "0 auto" }}
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAALlJREFUSEvt1LENwkAMBdBvYXo2gRFgA0ZAggFA0EMPEhmBDRiBjACb0OMoyB2i4L4tRaJI6st/53+6E3T8Scf56IFiw/9T0Wp3PJhpdak2z+K2PxZQE3g4gD2Au5nOIggFLNbn0VCtboFxFKEAnziL0EAWCQEZJAWo2g3ARIDHy3T669BDgJ9DJNwnpoFMOA1kw2lguT3NRdor0/n3LacrcqRpBnXkFtMTRN6e9ARZhK6oB7INFP97A04+axn4iq7hAAAAAElFTkSuQmCC"
                />
              </button>
            </div>
          </div>
        )}
      </div>

      <LoadingModal
        title="Loading..."
        subtitle="Please wait a moment"
        isOpen={loadingIsOpen || loadingIndicator}
        onClose={closeLoading}
      />

      <ResultModal
        subtitle={`Sorry, we are unable to get ${queryName} lists at the moment. Please refresh the page and try again.`}
        type="failed"
        isOpen={isOpen}
        onClose={close}
      />
    </>
  );
}
