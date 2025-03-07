import axiosBase from "@/lib/axiosBase";

export const createTask = async (taskData) => {
  try {
    const response = await axiosBase.post("/tasks/", taskData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Не удалось создать задачу";
  }
};

export const getTasks = async () => {
  try {
    const response = await axiosBase.get("/tasks/");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Не удалось получить задания";
  }
};

export const getUserTasks = async (userId) => {
  try {
    const response = await axiosBase.get(`/tasks/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Не удалось получить доступ к пользовательским задачам";
  }
};

export const updateTaskStatus = async (taskId, status, currentTask) => {
  try {
    const response = await axiosBase.put(`/tasks/${taskId}`, {
      title: currentTask.title,
      description: currentTask.description,
      status: status,  // 👈 Updating only status
      deadline: currentTask.deadline,
      owner_id: currentTask.owner_id,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Не удалось обновить статус задачи" };
  }
};


// ✅ Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosBase.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Не удалось удалить задачу";
  }
};
