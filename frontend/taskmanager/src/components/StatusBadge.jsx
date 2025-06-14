const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "pending":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const displayText =
    status && typeof status === "string"
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : "Unknown"

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
        status
      )}`}
    >
      {displayText}
    </span>
  )
}
export default StatusBadge

