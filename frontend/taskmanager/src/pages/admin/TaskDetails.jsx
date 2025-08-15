"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import axios from "axios"
import { axiosInstance } from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPath"

const TaskDetail = () => {
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
     const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(id))
    const task = response.data
    setTask(task)
    setChecklist(task.checklist || [])
    console.log("Fetched and parsed:", task)

    
    
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

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    )
  }

  if (!task) {
    return (
      <Layout>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Task not found</h2>
          <button
            onClick={() => navigate("/admin/managetask")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Back to Tasks
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate("/admin/managetask")} className="text-blue-600 hover:text-blue-900">
            ← Back to Tasks
          </button>
          <button
            onClick={() => navigate(`/edit/task/${id}`)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Edit Task
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold text-blue-900">{task[0].title}</h1>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(task[0].Status)}`}>{task[0].Status}</span>
          </div>

          <p className="text-gray-600 mb-6">{task[0].description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Task Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Due Date:</span> {task[0].dueDate}
                </p>
                <p>
                  <span className="font-medium">Priority:</span> {task[0].priority}
                </p>
                <p>
                  <span className="font-medium">Assigned To:</span> {task[0].assignedTo}
                </p>
              </div>
            </div>
            

           
          </div> 

          
        </div>
      </div>
    </Layout>
  )
}

export default TaskDetail
