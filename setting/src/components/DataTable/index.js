/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import styles from "./DataTable.module.css";
import { EmptyData, ModalLoading, ModalResult } from "sprint-asia-custom-component";
import { FaEllipsisVertical } from "react-icons/fa6";
import { MdCheckBoxOutlineBlank, MdCheckBox } from "react-icons/md";
import { useDisclosure } from "prezent/useDisclosure";
import { useFetch } from "prezent/useFetch";

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
    deleteBulkHandler,
    getResponse,
    popupModal = false
  } = props;

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
    checkable: options?.checkable,
    isRounded: options?.isRounded,
    scrollable: options?.scrollable,
  };
  const [tableSearchKeyword, setSearchKeyword] = useState("");
  const [tableIsTouched, setTableIsTouched] = useState(false);

  const updateShowingInfo = () => {
    let showInfo = "";
    if (options.pagination) {
      let fromEntries = totalDataFiltered > 0 ? showEntries * (currentPage - 1) + 1 : 0;
      let toEntries = showEntries * currentPage;
      toEntries = toEntries > totalDataFiltered ? totalDataFiltered : toEntries;
      showInfo = `From ${fromEntries} to ${toEntries} of total : ${totalDataFiltered || 0} ${totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
        }`;
    } else {
      showInfo = `From ${totalDataFiltered || 0} entries ${totalDataFiltered < totalData ? "(filtered from " + totalData + " total entries)" : ""
        }`;
    }

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

    if (currentPage > totalPage && totalPage > 0) {
      setCurrentPage(currentPage - 1)
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
                  data?.[column?.assessor].toString().toLowerCase().indexOf(item[1]) > -1
              )
              .includes(true)
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
        let start = (currentPage - 1) * 10;
        let end = currentPage * 10;
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
    generateTableBody();
    updatePagination();
    updateShowingInfo();
  }, [data, showEntries, totalDataFiltered, staticData]);

  useEffect(() => {
    if (queryName) {
      if (data?.data?.length === 0) {
        setCurrentPage(data.last_page);
      }
    }
  }, [data, showEntries]);

  useEffect(() => {
  }, [tableBody])

  useEffect(() => {
    generateTableBody();
    updatePagination();
    updateShowingInfo();
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
    if (!staticData) {
      setTableBody(data && data?.data);
    }
  }, [data]);

  useEffect(() => {
    if (data && setTotalData) {
      setTotalData(data?.totalCount);
    }
    if (data && getResponse) {
      getResponse(data);
    }
  }, [data, staticData]);

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
    if (defaultOptions.checkable) {
      setCheckedParent(checkedData);
    }
  }, [checkedData]);

  return (
    <>
      <div className={styles.dataTable_Box}>
        <div
          className={`${styles.dataTable_Body} no-scrollbar`}
          style={{
            borderRadius: options?.isRounded && "8px 8px 0px 0px",
            borderLeft: "1px solid #e0e0e0",
            borderRight: "1px solid #e0e0e0",
            maxHeight: options?.scrollable && "600px",
            overflowY: options?.scrollable && "auto",
          }}
        >
          <table className={styles.dataTable}>
            <thead className={`${options?.scrollable && "sticky top-0 m-0"} bg-neutral20 text-neutral500 text-xs font-semibold text-left`} >
              <tr className="border-neutral40 uppercase">
                {columns &&
                  columns.map((column, index) => (
                    <th key={index}>
                      <div>
                        <div className="flex items-center gap-4 relative">
                          {defaultOptions.checkable && index === 0 && (
                            <>
                              <a className="cursor-pointer" onClick={toggleMenu}>
                                <FaEllipsisVertical size={14} />
                              </a>

                              {menuIsOpen && (
                                <>
                                  <a
                                    className="fixed opacity-25 top-0 left-0 right-0 bottom-0"
                                    onClick={toggleMenu}
                                  />
                                  <div className="flex flex-col top-10 absolute w-44 rounded-md gap-1 border border-neutral50 bg-white normal-case p-2">
                                    <a
                                      className="p-2 font-normal cursor-pointer hover:bg-neutral20 rounded-md"
                                      onClick={checkAllData}
                                    >
                                      {checkedData.length ? "Unselect all" : "Select all"}
                                    </a>
                                    <a
                                      className="p-2 font-normal cursor-pointer hover:bg-neutral20 rounded-md"
                                      onClick={deleteBulkHandler}
                                    >
                                      Delete checked
                                    </a>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          <span>{column.header}</span>
                        </div>
                        {defaultOptions.sorting && column.assessor && (
                          <span
                            className={`${styles.sort} ${styles[sortBy[column.assessor]]}`}
                            onClick={() => generateSort(column.assessor, sortBy[column.assessor])}
                          ></span>
                        )}
                      </div>
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
                  <tr key={iRow} className={`border-t border-neutral40 ${row?.isNew ? "bg-primary500 hover:bg-primary500" : "bg-white hover:bg-white"}`}>
                    {columns.map((column, iCell) => (
                      <td
                        key={iCell}
                        style={column.tdStyle}
                        className="font-normal text-black text-sm align-top"
                        onClick={!column.assessor ? undefined : () => onClickRow(row.id, row)}
                      >
                        <div className="flex items-center gap-4">
                          {defaultOptions.checkable &&
                            iCell === 0 &&
                            (checkedData.find((item) => item.id === row.id) ? (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCheckedData(row.id);
                                }}
                              >
                                <MdCheckBox size={18} className="text-neutral500" />
                              </a>
                            ) : (
                              <a
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addCheckedData(row);
                                }}
                              >
                                <MdCheckBoxOutlineBlank size={18} className="text-neutral500" />
                              </a>
                            ))}
                          {column.Cell ? column.Cell(row, iRow) : row?.[column.assessor]}
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
        <div
          className={`${styles.dataTable_Footer} ${options.isRounded && "border-b border-l border-r rounded-bl-md rounded-br-md"
            } border-t border-neutral40`}
        >
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

      {popupModal && (
        <LoadingModal
          title="Loading..."
          subtitle="Please wait a moment"
          isOpen={loadingIsOpen || loadingIndicator}
          onClose={closeLoading}
        />
      )}

      <ModalResult
        subtitle={`Sorry, we are unable to get ${queryName} lists at the moment. Please refresh the page and try again.`}
        type="failed"
        isOpen={isOpen}
        onClose={close}
      />
    </>
  );
}
