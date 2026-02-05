import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./components/Home";
import BusListPage from "./pages/BusListPage";
import SeatSelect from "./pages/SeatSelect";
import PassengerInfo from "./pages/PassengerInfo";
import Payment from "./pages/Payment";
import BookingSuccess from "./pages/BookingSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";

import AdminLayout from "./components/admin/AdminLayout";
import AdminHome from "./components/admin/AdminHome";
import AdminRoutes from "./components/admin/AdminRoutes";
import CreateRoute from "./components/admin/CreateRoute";
import AdminBusList from "./components/admin/AdminBusList";
import AdminCreateBus from "./components/admin/AdminCreateBus";
import AdminBookings from "./components/admin/AdminBooking";

export default function App() {
  console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL);
  return (
    <div className="min-h-screen bg-gray-50">
      <BrowserRouter>
        <Navbar />

        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/buses" element={<BusListPage />} />
          <Route path="/seats/:busId" element={<SeatSelect />} />
          <Route path="/passenger-info" element={<PassengerInfo />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/payment-failed/:bookingId" element={<PaymentFailed />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={<MyBookings />} />

          {/* Admin (CLEAN) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="routes" element={<AdminRoutes />} />
            <Route path="create-route" element={<CreateRoute />} />
            <Route path="buses" element={<AdminBusList />} />
            <Route path="buses/create" element={<AdminCreateBus />} />
            <Route path="bookings" element={<AdminBookings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}