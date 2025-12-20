import { BrowserRouter, Routes, Route } from "react-router-dom";
import Search from "./pages/Search";
import BusList from "./pages/BusList";
import SeatSelect from "./pages/SeatSelect";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyBookings from "./pages/MyBookings";
import Navbar from "./components/Navbar";

export default function App() {
  return (
        <div className="min-h-screen bg-gray-50">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/buses" element={<BusList />} />
        <Route path="/seats/:busId" element={<SeatSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}