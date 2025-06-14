import React from "react"
import { BrowserRouter as Router,
  Routes,
  Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import SignUp from "./pages/auth/SignUp"
import PrivateRoute from './routes/PrivateRoute'
import Dashboard from "./pages/admin/Dashboard"
import CreateTask from "./pages/admin/CreateTask"
import ManageTask from "./pages/admin/ManageTask"
import ManageUsers from "./pages/admin/ManageUsers"
import MyTask from "./pages/User/MyTask"
import ViewTask from "./pages/User/ViewTask"
import MemberDashboard from "./pages/User/MemberDashboard"
import HomePage from "./pages/HomePage"
import TaskDetail from "./pages/admin/TaskDetails"
import TaskEdit from "./pages/admin/TaskEdit"




function App() {

  return (
    <>

      <Router>
        
            <Routes>
              
          <Route path="/" element={<HomePage />}/>

          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>

          <Route element={<PrivateRoute allowedRole="admin"/>}>
            <Route path="/admin/dashboard" element={<Dashboard/>}/>
            <Route path="/admin/createtask" element={<CreateTask/>}/>
            <Route path="/admin/managetask" element={<ManageTask/>}/>
            <Route path="/admin/managauser" element={<ManageUsers/>}/>
            <Route path="/tasks/:id" element={<TaskDetail/>}/>
            <Route path="/edit/task/:id" element={<TaskEdit/>}/>
            
          </Route>

          <Route element={<PrivateRoute allowedRole="member"/>}>
            <Route path="/member/mytask" element={<MyTask/>}/>
            <Route path="/member/viewtask" element={<ViewTask/>}/>
            <Route path="/member/dashboard" element={<MemberDashboard/>}/>

            

          </Route>
          
        </Routes>
        
        
      </Router>
    </>
  )
}

export default App
