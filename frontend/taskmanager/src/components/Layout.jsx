"use client"

import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  let user = {}
      try {
        const userData = localStorage.getItem("user")
        if (userData) {
          user = JSON.parse(userData)
        }
      } catch (e) {
        console.log("Invalid JSON in localStorage:", e)
        console.error("Invalid JSON in localStorage:", e)
        localStorage.removeItem("user")
      }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const tasklink = ()=>{
    if(user.role==="admin"){ 
      return `/${user.role}/managetask`
    }
    return `/${user.role}/mytask`
  }
  
  const dashboardlink = () =>{
    if(user.role==="admin"){
      return `/${user.role}/dashboard`
    }
    return `/${user.role}/dashboard`
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    localStorage.removeItem("role")
    navigate("/login")
  }

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-800 text-white"
      : "text-gray-300 hover:bg-indigo-700 hover:text-white"
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-indigo-900">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <h1 className="text-xl font-bold text-white">Task Manager</h1>
            </div>
            <nav className="mt-5 flex-1 space-y-1 px-2">
              <Link
                to={dashboardlink()}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive("/dashboard")}`}
              >
                <svg
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Dashboard
              </Link>

              <Link
                to={tasklink()}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive("/tasks")}`}
              >
                <svg
                  className="mr-3 h-6 w-6 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                  />
                </svg>
                Tasks
              </Link>

              {user.role === "admin" && (
                <Link
                  to="/admin/managauser"
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive("/users")}`}
                >
                  <svg
                    className="mr-3 h-6 w-6 flex-shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Users
                </Link>
              )}
            </nav>
          </div>
          <div className="flex flex-shrink-0 border-t border-indigo-800 p-4">
            <div className="group block w-full flex-shrink-0">
              <div className="flex items-center">
                <div className="inline-block h-9 w-9 rounded-full bg-indigo-700 text-center">
                  <span className="inline-flex h-full w-full items-center justify-center font-medium text-white">
                    {user.Name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <button onClick={handleLogout} className="text-xs font-medium text-indigo-200 hover:text-white">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open sidebar</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="relative flex w-full max-w-xs flex-1 flex-col bg-indigo-900 pt-5 pb-4">
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <svg
                    className="h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-white">Task Manager</h1>
              </div>
              <div className="mt-5 h-0 flex-1 overflow-y-auto">
                <nav className="space-y-1 px-2">
                  <Link
                    to="/dashboard"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive(
                      "/dashboard",
                    )}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="mr-4 h-6 w-6 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>

                  <Link
                    to="/tasks"
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive("/tasks")}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg
                      className="mr-4 h-6 w-6 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                    Tasks
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      to="/users"
                      className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${isActive(
                        "/users",
                      )}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg
                        className="mr-4 h-6 w-6 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                      Users
                    </Link>
                  )}
                </nav>
              </div>
              <div className="flex flex-shrink-0 border-t border-indigo-800 p-4">
                <div className="group block w-full flex-shrink-0">
                  <div className="flex items-center">
                    <div className="inline-block h-9 w-9 rounded-full bg-indigo-700 text-center">
                      <span className="inline-flex h-full w-full items-center justify-center font-medium text-white">
                        {user.Name?.charAt(0).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user.name}</p>
                      <button onClick={handleLogout} className="text-xs font-medium text-indigo-200 hover:text-white">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
