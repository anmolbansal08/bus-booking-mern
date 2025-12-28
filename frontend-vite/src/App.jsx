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
export default function App() {
  return (
        <div className="min-h-screen bg-gray-50">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/buses" element={<BusListPage />} />
        <Route path="/seats/:busId" element={<SeatSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/passenger-info" element={<PassengerInfo />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}