"use client";

import { useState, useEffect } from "react";

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("new");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !deadline) return;

    const newTask = {
      title,
      description,
      status,
      deadline,
      owner_id: "",
    };

    onAddTask(newTask);
    setTitle("");
    setDescription("");
    setStatus("new");
    setDeadline("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 backdrop-blur-md p-4">
      <div
        className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg w-[95%] sm:w-[450px] lg:w-[500px] border border-gray-200 
        transform transition-all scale-95 animate-fade-in max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>
  
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 text-center">
          Добавить новую задачу
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Заглавие</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-600">Описание</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-600">Статус</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="new">Новая</option>
              <option value="in_progress">В процессе</option>
              <option value="completed">Завершенная</option>
            </select>
          </div>
  
          <div>
            <label className="block text-sm font-medium text-gray-700">Крайний срок</label>
            <input
              type="datetime-local"
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>
  
          <div className="flex flex-wrap gap-2 justify-between mt-6">
            <button
              type="button"
              className="px-5 py-2 w-full sm:w-auto rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
              onClick={onClose}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 w-full sm:w-auto rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
            >
              Добавить задачу
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
