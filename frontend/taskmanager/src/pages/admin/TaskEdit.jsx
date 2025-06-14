"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import { axiosInstance } from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPath"
import axios from "axios"

const TaskEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
  assignedTo: [],
  Status: "pending",
  checklist: [], 
})

  useEffect(() => {
    if (id !== "new") {
      fetchTask()
    } else {
      setLoading(false)
    }
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await axiosInstance(API_PATHS.TASKS.GET_TASK_BY_ID(id))
      setFormData(response.data)
      console.log(formData)
    } catch (error) {
      console.error("Error fetching task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Construct only allowed keys
    const updatePayload = {};

    if (formData.title) updatePayload.title = formData.title;
    if (formData.description) updatePayload.description = formData.description;
    if (formData.dueDate) updatePayload.dueDate = formData.dueDate;
    if (formData.priority) updatePayload.priority = formData.priority;
    if (formData.Status) updatePayload.Status = formData.Status;

    // Convert assignedTo to array (split if string)
    if (formData.assignedTo) {
      updatePayload.assignedTo = Array.isArray(formData.assignedTo)
        ? formData.assignedTo
        : formData.assignedTo.split(",").map(item => item.trim());
    }

    // Only send if checklist is intentionally set
    if (formData.checklist && Array.isArray(formData.checklist)) {
      updatePayload.todoCheckList = formData.checklist;
    }

    // Optional: send attachments if needed
    if (formData.attachments && Array.isArray(formData.attachments)) {
      updatePayload.attachments = formData.attachments;
    }

    console.log("Cleaned payload to send:", updatePayload);

    await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(id), updatePayload);
    navigate("/admin/managetask");
  } catch (error) {
    console.error("Error saving task:", error);
  }
};

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">{id === "new" ? "Create Task" : "Edit Task"}</h1>
          <button onClick={() => navigate("/admin/managetask")} className="text-gray-600 hover:text-gray-900">
            Cancel
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                rows="4"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                <input
                  type="text"
                  value={formData.assignedTo}
                  onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>

              {id !== "new" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.Status}
                    onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">pending</option>
                    <option value="completed">completed</option>
                  </select>
                </div>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate("/admin/managetask")}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                {id === "new" ? "Create Task" : "Update Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}

export default TaskEdit
