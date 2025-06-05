// PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("userId")

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to={`/${role}/dashboard`} />;

  return <Outlet />;
};

export default PrivateRoute;
