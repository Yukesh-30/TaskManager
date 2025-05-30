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
import UserDashboard from "./pages/User/UserDashboard"



function App() {

  return (
    <>

      <Router>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<SignUp/>}/>

          <Route element={<PrivateRoute allowedRole={["admin"]}/>}>
            <Route path="/admin/dashboard" element={<Dashboard/>}/>
            <Route path="/admin/createtask" element={<CreateTask/>}/>
            <Route path="/admin/managatask" element={<ManageTask/>}/>
            <Route path="/admin/managauser" element={<ManageUsers/>}/>
            
          </Route>

          <Route element={<PrivateRoute allowedRole={["user"]}/>}>
            <Route path="/user/mytask" element={<MyTask/>}/>
            <Route path="/user/viewtask" element={<ViewTask/>}/>
            <Route path="/user/userdashboard" element={<UserDashboard/>}/>

            

          </Route>
          
        </Routes>
      </Router>
    </>
  )
}

export default App
