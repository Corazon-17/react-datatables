import { useMemo, useState, useEffect } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import { BsCaretUp } from "./icons/BsCaretUp";

export default function DataTables({ data }) {
  if (!data) {
    return;
  }

  const tableData = useMemo(() => data, []);
  const tableColumns = useMemo(
    () => Object.keys(data[0]).map((key) => ({ Header: key, accessor: key })),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    pageCount,
    gotoPage,
    setPageSize,
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns: tableColumns,
      data: tableData,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [currentSize, setCurrentSize] = useState(pageSize);
  const [filterText, setFilterText] = useState("");

  const handlePageSize = (e) => {
    const value = Number(e.target.value);

    if (value < 0) {
      setCurrentSize(0);
    } else if (value > rows.length) {
      setCurrentSize(rows.length);
    } else {
      setCurrentSize(value);
    }
  };

  const handlePageChange = (e, type) => {
    const value = e
      ? Number(e.target.value)
      : type === "prev"
      ? currentPage - 1
      : type === "next"
      ? currentPage + 1
      : 1;

    if (type === "prev" && value === 0) {
      setCurrentPage(1);
      return;
    }

    if (value < 0) {
      setCurrentPage(0);
    } else if (value > pageCount) {
      setCurrentPage(pageCount);
    } else {
      setCurrentPage(value);
    }
  };

  const handleTitleFilter = (e) => {
    const value = e.target.value;
    setFilter("title", value);
    setFilterText(value);
  };

  useEffect(() => {
    if (currentSize > 0) {
      setPageSize(currentSize);
    }
  }, [currentSize]);

  useEffect(() => {
    gotoPage(currentPage - 1);
  }, [currentPage]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-2 items-center justify-between">
        <div className="flex justify-center items-center">
          Show{" "}
          <input
            type="number"
            className="flex w-12 mx-1 px-1 text-black border border-black outline-none"
            value={currentSize.toFixed()}
            onChange={(e) => handlePageSize(e)}
          />{" "}
          entries per page
        </div>
        <div>
          <label>Search title: </label>
          <input
            type="text"
            className="px-1 border border-black"
            value={filterText}
            onChange={(e) => handleTitleFilter(e)}
          />
        </div>
      </div>
      <div className={`flex overflow-auto`}>
        <table {...getTableProps()} className="table table-auto w-full">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className={`relative px-2 py-2 font-bold border-b-4 border-black
               bg-white ${column.isSorted && "pr-4"}`}
                  >
                    {column.render("Header")}
                    <span className="absolute right-0 top-[0.8rem] text-sm">
                      {column.isSorted && (
                        <BsCaretUp
                          className={`duration-300 ${
                            column.isSortedDesc && "rotate-180"
                          }`}
                        />
                      )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className="px-2 py-1 whitespace-nowrap border-b bg-white dark:bg-black"
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center p-2 border-t-2 bg-white dark:bg-black">
        <span>
          Showing {(pageIndex + 1) * pageSize - pageSize + 1} to{" "}
          {(pageIndex + 1) * pageSize} of {rows.length} entries
        </span>

        <div className="flex gap-2">
          <button
            className={"flex justify-center items-center text-xl"}
            onClick={() => handlePageChange(undefined, "prev")}
          >
            <BsCaretUp className="-rotate-90" />
          </button>
          <div className="flex justify-center items-center">
            Page{" "}
            <input
              type="number"
              className="flex w-12 mx-1 px-1 text-black border border-black outline-none"
              value={currentPage.toFixed()}
              onChange={(e) => handlePageChange(e)}
            />{" "}
            of {pageCount}
          </div>
          <button
            className={"flex justify-center items-center text-xl"}
            onClick={() => handlePageChange(undefined, "next")}
          >
            <BsCaretUp className="rotate-90" />
          </button>
        </div>
      </div>
    </>
  );
}
