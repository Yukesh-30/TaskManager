"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import LoadingSpinner from "../../components/LoadingSpinner"
import StatusBadge from "../../components/StatusBadge"

const ViewTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checklist, setChecklist] = useState([])

  useEffect(() => {
    fetchTask()
  }, [id])

  const fetchTask = async () => {
    try {
      const response = await taskApi.getTaskById(id)
      setTask(response.data)
      setChecklist(response.data.checklist || [])
    } catch (error) {
      console.error("Error fetching task:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      await taskApi.updateTaskStatus(id, newStatus)
      setTask({ ...task, status: newStatus })
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleChecklistUpdate = async (index, checked) => {
    const updatedChecklist = [...checklist]
    updatedChecklist[index].completed = checked
    setChecklist(updatedChecklist)

    try {
      await taskApi.updateTodoChecklist(id, updatedChecklist)
    } catch (error) {
      console.error("Error updating checklist:", error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    )
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Task not found</h3>
          <p className="mt-1 text-gray-500">The task you're looking for doesn't exist or has been deleted.</p>
          <div className="mt-6">
            <button
              onClick={() => navigate("/User/MyTask")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to My Tasks
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate("/User/MyTask")}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <svg
              className="h-5 w-5 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to My Tasks
          </button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">{task.title}</h1>
            <StatusBadge status={task.status} />
          </div>

          <div className="p-6">
            <div className="prose max-w-none mb-8">
              <p className="text-gray-700">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Task Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium text-gray-900">{formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Priority:</span>
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getPriorityBadge(
                        task.priority,
                      )}`}
                    >
                      {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1) || "Medium"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned To:</span>
                    <span className="font-medium text-gray-900">{task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleStatusUpdate("pending")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        task.status === "pending"
                          ? "bg-red-100 text-red-800 border-2 border-red-300"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("in-progress")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        task.status === "in-progress"
                          ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleStatusUpdate("completed")}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800 border-2 border-green-300"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {checklist.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Checklist</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <ul className="space-y-3">
                    {checklist.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`checklist-${index}`}
                            type="checkbox"
                            checked={item.completed}
                            onChange={(e) => handleChecklistUpdate(index, e.target.checked)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <label
                          htmlFor={`checklist-${index}`}
                          className={`ml-3 text-sm ${item.completed ? "line-through text-gray-500" : "text-gray-700"}`}
                        >
                          {item.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ViewTask
