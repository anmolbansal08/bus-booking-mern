import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import BusList from "./pages/BusList";
import SeatSelect from "./pages/SeatSelect";
import MyBookings from "./pages/MyBookings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/buses" element={<BusList />} />
        <Route path="/seats/:busId" element={<SeatSelect />} />
        <Route path="/my-bookings" element={<MyBookings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;