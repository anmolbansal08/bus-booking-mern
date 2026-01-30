import { Navigate, Outlet } from "react-router-dom";

export default function AdminLayout() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}