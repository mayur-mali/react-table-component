/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prefer-const */
import React, { useEffect, useRef, useState } from "react";

import { MdOutlineContentCopy as PasteBtn } from "react-icons/md";
import { toast } from "react-toastify";
import Tooltip from "../Tooltip/Tooltip";
function Pagination({ currentPage, totalPages, onPageChange }: any) {
  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage, endPage;
    if (totalPages <= 5) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`px-4 py-1 ${
            i === currentPage
              ? "bg-[#1B163B] text-white text-sm"
              : " text-[#1B163B] text-sm font-normal"
          }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (totalPages > 5) {
      if (currentPage > 3) {
        buttons.unshift(
          <button
            key="prev"
            className="px-3 py-1 mx-1 text-[#1B163B] text-sm font-normal"
            onClick={() => onPageChange(currentPage - 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        );
        buttons.unshift(
          <button
            key="start"
            className="px-3 py-1 mx-1  text-[#1B163B] text-sm font-normal"
            onClick={() => onPageChange(1)}
          >
            1
          </button>
        );
        if (currentPage > 4) {
          buttons.splice(1, 0, <span key="ellipsis1">...</span>);
        }
      }

      if (currentPage + 2 < totalPages) {
        if (currentPage + 3 < totalPages) {
          buttons.splice(
            buttons.length - 1,
            0,
            <span key="ellipsis2">...</span>
          );
        }
        buttons.push(
          <button
            key="end"
            className="px-3 py-1 mx-1 text-[#1B163B] text-sm font-normal"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </button>
        );
        buttons.push(
          <button
            key="next"
            className="px-3 py-1 mx-1 text-[#1B163B] text-sm font-normal"
            onClick={() => onPageChange(currentPage + 1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        );
      }
    }

    return buttons;
  };

  return (
    <div className="flex justify-center ">{renderPaginationButtons()}</div>
  );
}

const Table = ({
  data,
  heading,
  footer,
  description,
  searchBox,
  csv_name,
  srNo,
  copyContent,
  pagination,
  rowsPerPage,
}: any) => {
  const [csv_link, set_csv_link] = React.useState("");
  const refs: any = useRef<any>([]);
  const column = srNo ? ["S. No", ...data[0]] : data[0];
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(5);
  //   const itemsPerRow = rowsPerPage ? rowsPerPage : 10;
  const items = data?.slice(1);
  const totalPages = Math.ceil(items.length / itemsPerRow);

  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const indexOfLastItem = currentPage * itemsPerRow;
  const indexOfFirstItem = indexOfLastItem - itemsPerRow;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const currentItemsArray = pagination ? currentItems : data?.slice(1);
  useEffect(() => {
    let csvContent =
      "data:text/csv;charset=utf-8," +
      (column.join(",") +
        "\n" +
        refs?.current
          .map((r?: any) =>
            r
              ? [].slice.call(r?.children).map((c: any, i: number) => {
                  if (c.children[0]?.nodeName === "BUTTON") {
                    return "-";
                  }

                  return JSON.stringify(c?.innerText).replace("\u20b9", "");
                })
              : ""
          )
          .map((e: any) => (e ? e.join(",") : ""))
          .join("\n"));
    let encodedUri = encodeURI(csvContent);
    set_csv_link(encodedUri);
  }, [data, currentPage]);
  const renderTableHeader = () => {
    return (
      <tr
        className="w-full bg-[#EEF1F6] font-semibold mx-5 rounded-lg text-sm text-[#1B163B]"
        ref={(e) => (refs.current[0] = e)}
      >
        {column.map((item: any, i: any) => (
          <th className="py-3 px-4 max-w-40 text-left" key={i}>
            {item}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableData = () => {
    return currentItemsArray?.map((row: any, key: any) => {
      return (
        <tr
          ref={(e) => {
            refs.current[key] = e;
          }}
          className=" bg-[#FFFFFF] rounded-lg  w-full"
          key={key}
        >
          {(srNo === true ? [key + 1, ...row] : row).map(
            (item: any, i: any) => {
              return (
                <td
                  className="py-3 pl-4 pr-8 text-left transition-all duration-200 shrink-0  max-w-40 "
                  key={i}
                >
                  <div className="flex gap-x-1 items-center">
                    <span className="truncate hover:text-wrap">{item}</span>
                    <span>
                      {copyContent?.length &&
                        copyContent.map((c: any) => {
                          if (c === i + 1) {
                            return (
                              <PasteBtn
                                onClick={() => {
                                  handleCopyContent(item);
                                }}
                                className="cursor-pointer text-[#717171] shrink-0 text-xl"
                              />
                            );
                          }
                        })}
                    </span>
                  </div>
                </td>
              );
            }
          )}
        </tr>
      );
    });
  };

  const handleCopyContent = (content: any) => {
    navigator.clipboard
      .writeText(content?.props?.children)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        toast.error("Error while copying");
      });
  };
  return (
    <div className="flex w-full font-DmSans p-5 pb-0 bg-[#F6F8FA] rounded-[20px]">
      <div className="w-full min-h-[40rem] mr-2 my-2 text-[#1e1b59] ">
        <div className=" flex justify-between items-start w-full pr-5">
          <div className="w-full">
            <div className="text-[20px] text-[#1B163B] font-semibold mx-5 mb-2">
              {heading}
            </div>
            <div className="text-sm text-gray-500 mx-5 mb-3">{description}</div>
          </div>

          <a
            download={typeof heading !== "string" ? csv_name : heading}
            href={csv_link}
            className="focus:outline-none outline-none"
          >
            <button className="bg-[#6687FF] text-white text-sm px-6 py-1.5 rounded-lg">
              Export
            </button>
          </a>
        </div>
        <div className="w-full flex justify-between items-center px-5 py-2 mb-2">
          {searchBox && searchBox}
        </div>
        <div className="overflow-x-auto pt-4">
          <table className="table-auto shadow-md rounded-lg w-full border-separate first:border-spacing-y-1">
            <thead>{renderTableHeader()}</thead>
            <tbody>{renderTableData()}</tbody>
          </table>
        </div>
        {/* <div
          ref={(e) => (refs.current[0] = e)}
          className={`grid grid-cols-${column.length} w-full bg-[#EEF1F6] grid-header py-3  font-semibold mx-5 rounded-lg text-sm text-[#1B163B]`}
        >
          {column.map((item: any, i: any) => {
            return (
              <div className=" col-span-1 text-sm text-center" key={i}>
                {item}
              </div>
            );
          })}
        </div>
        <div className=" w-full space-y-1 mt-3">
          {currentItemsArray?.map((row: any, key: any) => {
            
            return (
              <tr
                ref={(e) => {
                  refs.current[key] = e;
                }}
                className="grid-body items-center bg-[#FFFFFF] w-full rounded-lg border border-gray-200 py-2 mx-5"}
              >
                {(srNo === true ? [key + 1, ...row] : row).map(
                  (item: any, i: any) => {
                    return (
                      <td
                        className="col-span-1 shrink-0 flex items-center justify-center gap-x-2 text-[#1B163B] text-xs font-bold capitalize truncate"
                        key={i}
                      >
                        {item}
                        {copyContent?.length &&
                          copyContent.map((c: any) => {
                            if (c === i + 1) {
                              return (
                                <PasteBtn
                                  onClick={() => {
                                    handleCopyContent(item);
                                  }}
                                  className="cursor-pointer text-[#717171] shrink-0 text-xl"
                                />
                              );
                            }
                          })}
                      </td>
                    );
                  }
                )}
              </tr>
            );
          })}
        </div> */}
        {footer}
        <div className="flex gap-x-4 items-center justify-end my-2">
          <div className="min-w-[20rem]">
            {pagination && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
          <div className="flex gap-x-2 items-center p-2">
            <p>Rows per page:</p>
            <select
              onChange={(e) => {
                setItemsPerRow(Number(e?.target?.value));
              }}
              name="row-per-page"
              className=" focus:outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
