import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import SeatSelect from "./pages/SeatSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";
import BusListPage from "./pages/BusListPage";
import PassengerInfo from "./pages/PassengerInfo";
import BookingSuccess from "./pages/BookingSuccess";
import Payment from "./pages/Payment";
import Home from "./components/Home";
import AdminHome from "./components/admin/AdminHome";
import CreateRoute from "./components/admin/CreateRoute";
import AdminRoutes from "./components/admin/AdminRoutes";
import AdminCreateBus from "./components/admin/AdminCreateBus";
import AdminBusList from "./components/admin/AdminBusList";
import AdminBookings from "./components/admin/AdminBooking";
import PaymentFailed from "./pages/PaymentFailed";

export default function App() {
  return (
        <div className="min-h-screen bg-gray-50">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buses" element={<BusListPage />} />
        <Route path="/seats/:busId" element={<SeatSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/passenger-info" element={<PassengerInfo />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<AdminHome />} />
<Route path="/admin/create-route" element={<CreateRoute />} />
<Route path="/admin/routes" element={<AdminRoutes />} />
<Route path="/admin/buses/create" element={<AdminCreateBus />} />
<Route path="/admin/buses" element={<AdminBusList />} />
<Route path="/admin/bookings" element={<AdminBookings />} />
<Route
  path="/payment-failed/:bookingId"
  element={<PaymentFailed />}
/>
      </Routes>
    </BrowserRouter>
    </div>
  );
}