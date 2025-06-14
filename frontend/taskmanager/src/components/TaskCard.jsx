"use client"

import { Link } from "react-router-dom"
import StatusBadge from "./StatusBadge"

const TaskCard = ({ task, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }
  

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{task.title}</h3>
          <StatusBadge status={task.Status} />
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center">
            <svg
              className="h-4 w-4 text-gray-500 mr-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-gray-500">{formatDate(task.dueDate)}</span>
          </div>
          <span className={`font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Medium"}
          </span>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex justify-between">
        <Link to={`/tasks/${task._id}`} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
          View Details
        </Link>
        <div className="flex space-x-4">
          <Link to={`/edit/task/${task._id}`} className="text-green-600 hover:text-green-900 text-sm font-medium">
            Edit
          </Link>
          <button onClick={() => onDelete(task._id)} className="text-red-600 hover:text-red-900 text-sm font-medium">
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
