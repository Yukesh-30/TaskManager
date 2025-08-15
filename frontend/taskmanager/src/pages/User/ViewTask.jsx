"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout"
import axios from "axios"
import { axiosInstance } from "../../utils/axiosInstance"
import { API_PATHS } from "../../utils/apiPath"

const ViewTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checklist, setChecklist] = useState([])
  const [status,setStatus] = useState("")

  useEffect(() => {
    fetchTask()
  }, [id])

  const handleStatusUpdate = async () =>{
    try {
      const response = await axiosInstance.put(`http://localhost:8080/api/task/edit/status/${id}`,{
        "userUpdateStatus" : status
      }) 
      
    } catch (error) {
      console.log("Error in handle in status update" + error)
    }
  }

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
            onClick={() => navigate("/member/dashboard")}
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
          <button onClick={() => navigate("/member/dashboard")} className="text-blue-600 hover:text-blue-900">
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
            <div className="flex justify-center items-center gap-x-3 p-4">
                <form action="" className="">
                    <label htmlFor="" className="mr-4">Update Status</label>
                    <input type="text" className="border border-gray-300 px-2 rounded-2xl h-[30px]" onChange={(e) => setStatus(e.target.value)}/>
                    <button onClick={handleStatusUpdate} className="mt-3 ml-32 bg-green-500 w-[100px] h-[30px] rounded-3xl text-white">update</button>
                </form>
              </div>
            

           
          </div> 

          
        </div>
      </div>
    </Layout>
  )
}

export default ViewTask
