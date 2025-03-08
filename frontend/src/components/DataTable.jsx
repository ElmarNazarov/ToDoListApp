"use client";

import { deleteTask, updateTaskStatus } from "@/lib/apiFunctions/tasks";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DataTable = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tasks, setTasks] = useState(data);
  const [editingIndex, setEditingIndex] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (data) {
      setTasks([...data]);
    }
  }, [data]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const handleSort = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: "asc" });
    } else if (sortConfig.direction === "asc") {
      setSortConfig({ key, direction: "desc" });
    } else {
      setSortConfig(null);
    }
  };

  let sortedData = [...tasks];
  if (sortConfig) {
    sortedData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  const filteredData = sortedData.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleEditStatus = (index, currentStatus) => {
    setEditingIndex(index);
    setNewStatus(currentStatus);
  };

  const handleSaveStatus = async (taskId, task) => {
    try {
      
      await updateTaskStatus(taskId, newStatus, task);
      
      setTasks((prevTasks) =>  prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: newStatus } : t
        ));
      
      setEditingIndex(null);
      toast.success("Статус задачи успешно обновлен!");
    } catch (error) {
      console.error("Ошибка при обновлении статуса задачи:", error);
      toast.error("Не удалось обновить статус задачи. Пожалуйста, попробуйте снова.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

      toast.success("Задача успешно удалена!");
    } catch (error) {
      console.error("Ошибка при удалении задачи:", error);
      toast.error("Не удалось удалить задачу. Пожалуйста, попробуйте снова.");
    }
  };

  const statusClass = (status) => {
    return status === "completed"
      ? "bg-green-500 text-white px-2 py-1 rounded"
      : status === "in_progress"
      ? "bg-yellow-500 text-white px-2 py-1 rounded"
      : "bg-red-500 text-white px-2 py-1 rounded";
  };

  const formatStatus = (status) => {
    switch (status) {
      case "new":
        return "ОЖИДАНИЕ";
      case "in_progress":
        return "В ПРОЦЕССЕ";
      case "completed":
        return "ЗАВЕРШЕНО";
      default:
        return status;
    }
  };

  const upArrow = String.fromCharCode(10514);
  const downArrow = String.fromCharCode(10515);

  return (
    <div className="p-4 bg-white rounded shadow-md border border-gray-200">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
        <div className="flex items-center">
          <label className="text-gray-600 mr-2 text-sm md:text-base">Показать по</label>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="p-2 border border-gray-300 rounded text-sm md:text-base"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span className="ml-2 text-gray-600 text-sm">записей</span>
        </div>
  
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full md:w-auto text-sm"
        />
      </div>
  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 text-center text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border border-gray-300"></th>
              <th className="p-3 border border-gray-300 cursor-pointer" onClick={() => handleSort("title")}>
                Заглавие {sortConfig?.key === "title" ? (sortConfig.direction === "asc" ? upArrow : downArrow) : ""}
              </th>
              <th className="p-3 border border-gray-300 cursor-pointer hidden sm:table-cell" onClick={() => handleSort("description")}>
                Описание {sortConfig?.key === "description" ? (sortConfig.direction === "asc" ? upArrow : downArrow) : ""}
              </th>
              <th className="p-3 border border-gray-300 cursor-pointer " onClick={() => handleSort("status")}>
                Статус {sortConfig?.key === "status" ? (sortConfig.direction === "asc" ? upArrow : downArrow) : ""}
              </th>
              <th className="p-3 border border-gray-300 cursor-pointer " onClick={() => handleSort("created_at")}>
                Создан {sortConfig?.key === "created_at" ? (sortConfig.direction === "asc" ? upArrow : downArrow) : ""}
              </th>
              <th className="p-3 border border-gray-300 cursor-pointer hidden lg:table-cell" onClick={() => handleSort("deadline")}>
                Крайний срок {sortConfig?.key === "deadline" ? (sortConfig.direction === "asc" ? upArrow : downArrow) : ""}
              </th>
              <th className="p-3 border border-gray-300">Действия</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className="hover:bg-gray-100">
                    <td className="p-3 border border-gray-300 text-center">
                      <button onClick={() => toggleRow(index)} className="text-lg">
                        {expandedRow === index ? "▼" : "▶"}
                      </button>
                    </td>
                    <td className="p-3 border border-gray-300">{row.title}</td>
                    <td className="p-3 border border-gray-300 truncate overflow-hidden whitespace-nowrap hidden sm:table-cell">{row.description}</td>
                    <td className="p-3 border border-gray-300">
                      {editingIndex === index ? (
                        <div className="flex items-center justify-between">
                          <div />
                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md bg-white w-28 text-sm"
                          >
                            <option value="new">Ожидание</option>
                            <option value="in_progress">В процессе</option>
                            <option value="completed">Завершено</option>
                          </select>
                          <button onClick={() => handleSaveStatus(row.id, row)} className="px-2 py-1 text-white bg-blue-500 rounded-md hover:bg-blue-600 text-xs">
                            Сохранить
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div />
                          <span className={statusClass(row.status)}>{formatStatus(row.status)}</span>
                          <button onClick={() => handleEditStatus(index, row.status)} className="px-2 py-1 text-blue-600 font-semibold bg-blue-100 rounded-md hover:bg-blue-200 text-xs">
                            Изменить
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-3 border border-gray-300 ">{formatDate(row.created_at)}</td>
                    <td className="p-3 border border-gray-300 hidden lg:table-cell">{formatDate(row.deadline)}</td>
                    <td className="p-3 border border-gray-300">
                      <button onClick={() => handleDeleteTask(row.id)} className="px-2 py-1 text-white bg-red-500 rounded-md hover:bg-red-600 text-xs">
                        Удалить
                      </button>
                    </td>
                  </tr>
                  {expandedRow === index && (
                    <tr className="bg-gray-100">
                      <td colSpan="7" className="p-3 border border-gray-300">
                        {row.description}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-3 border border-gray-300 text-center text-gray-500">
                  Никаких результатов найдено не было
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Пагинация */}

      {/* Для больших экранов */}
      <div className="mt-4 hidden lg:flex justify-between items-center text-gray-700 ">
        <span className="text-sm">
          Показано {(currentPage - 1) * rowsPerPage + 1} -{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} из {filteredData.length} записей
        </span>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            «
          </button>

          <button
            className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {/* По 7 */}
          {(() => {
            const visiblePages = [];
            let startPage = Math.max(1, currentPage - 3);
            let endPage = Math.min(totalPages, startPage + 6);
            
            if (endPage === totalPages) {
              startPage = Math.max(1, totalPages - 6);
            }

            for (let i = startPage; i <= endPage; i++) {
              visiblePages.push(i);
            }

            return visiblePages.map((page) => (
              <button
                key={page}
                className={`px-3 py-1 border rounded ${
                  currentPage === page ? "bg-gray-300 font-bold" : "hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ));
          })()}

          <button
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            ›
          </button>

          <button
            className={`px-3 py-1 border rounded ${
              currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
            }`}
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
        </div>
      </div>

      {/* Для маленьких экранов */}
      <div className="mt-4 lg:hidden flex flex-col md:flex-row justify-between items-center text-gray-700 text-sm">
        <span>
          Показано {(currentPage - 1) * rowsPerPage + 1} -{" "}
          {Math.min(currentPage * rowsPerPage, filteredData.length)} из {filteredData.length} записей
        </span>
  
        <div className="flex space-x-2 mt-2 md:mt-0">
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
            «
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            ‹
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            ›
          </button>
          <button className="px-2 py-1 border rounded text-xs md:text-sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
            »
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default DataTable;
