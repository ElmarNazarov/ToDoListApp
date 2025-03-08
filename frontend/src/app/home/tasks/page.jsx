"use client";

import AddTaskModal from "@/components/AddTaskModal";
import DataTable from "@/components/DataTable";
import { useUser } from "@/context/UserContext";
import { createTask, getTasks, getUserTasks } from "@/lib/apiFunctions/tasks";
import { useEffect, useState } from "react";

// Тестовые задачи
const initialTasks = [
  { title: "Task 1", description: "Fix login bug", status: "In Progress", time: "2024-03-06 10:30" },
  { title: "Task 2", description: "Update UI", status: "Completed", time: "2024-03-05 14:20" },
  { title: "Task 3", description: "Database optimization", status: "Pending", time: "2024-03-04 18:10" },
  { title: "Task 4", description: "Implement notifications", status: "In Progress", time: "2024-03-06 09:00" },
  { title: "Task 5", description: "Fix security vulnerability", status: "Completed", time: "2024-03-03 16:50" },
  { title: "Task 6", description: "Refactor API", status: "Pending", time: "2024-03-02 12:00" },
  { title: "Task 7", description: "Improve search function", status: "In Progress", time: "2024-03-01 08:45" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useUser().user;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (by_user = true) => {
    try {
      // Запрашивает либо все задачи, либо только задачи текущего пользователя
      const tasksData = by_user ? await getUserTasks(user.id) : await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error("Ошибка выборки задач:", error);
    }
  };
  

  const handleAddTask = async (taskData) => {
    if (!user) return;

    try {
      const newTask = {
        ...taskData,
        owner_id: user.id,
      };
      await createTask(newTask);
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error("Задачи выборки ошибок:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-2 sm:flex-nowrap justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Список задач</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 w-full sm:w-auto bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Новая задача
        </button>
      </div>

      {/* Таблица задач */}
      <DataTable data={tasks} />

      {/* Модал создания задачи */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
